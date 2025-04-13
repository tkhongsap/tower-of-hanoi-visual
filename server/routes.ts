import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateHanoiMoves } from "../client/src/utils/towerOfHanoi";
import { 
  insertSolutionHistorySchema, 
  insertUserPreferencesSchema,
  insertUserSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get the Hanoi solution moves
  app.get("/api/hanoi/:diskCount", async (req, res) => {
    try {
      const diskCount = parseInt(req.params.diskCount);
      
      // Validate disk count
      if (isNaN(diskCount) || diskCount < 1 || diskCount > 10) {
        return res.status(400).json({ 
          message: "Invalid disk count. Please provide a number between 1 and 10." 
        });
      }
      
      // Try to get cached solution from database
      const cachedSolution = await storage.getLastSolutionForDiskCount(diskCount);
      
      if (cachedSolution) {
        // The moves are stored as JSON string, so parse if needed
        let moves = cachedSolution.moves;
        
        // If moves is stored as a string, parse it
        if (typeof moves === 'string') {
          try {
            moves = JSON.parse(moves);
          } catch (err) {
            console.error("Error parsing cached moves JSON:", err);
            // If parsing fails, generate new moves
            moves = null;
          }
        }
        
        // If we have valid moves, return them
        if (moves) {
          return res.json(moves);
        }
      }
      
      // Generate the solution moves using the Tower of Hanoi algorithm
      const moves = generateHanoiMoves(diskCount);
      
      // Store solution in database (without user ID since no authentication yet)
      try {
        await storage.createSolutionHistory({
          diskCount,
          moves,
          timeToSolve: null,
          userId: null
        });
      } catch (dbError) {
        console.error("Error storing solution history:", dbError);
        // Continue even if storage fails
      }
      
      // Return the moves
      res.json(moves);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });
  
  // Add new endpoint to save solution history with completion time
  app.post("/api/hanoi/history", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertSolutionHistorySchema
        .omit({ userId: true })
        .safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid solution history data", 
          errors: validationResult.error.format() 
        });
      }
      
      // Create solution history
      const history = await storage.createSolutionHistory({
        ...validationResult.data,
        userId: null // No authentication yet, so no user ID
      });
      
      res.status(201).json(history);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });
  
  // User Preferences routes
  app.get("/api/preferences/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const preferences = await storage.getUserPreferences(userId);
      
      if (!preferences) {
        return res.status(404).json({ message: "User preferences not found" });
      }
      
      res.json(preferences);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });
  
  app.post("/api/preferences", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertUserPreferencesSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid user preferences data", 
          errors: validationResult.error.format() 
        });
      }
      
      // Create user preferences
      const preferences = await storage.createUserPreferences(validationResult.data);
      
      res.status(201).json(preferences);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });
  
  app.put("/api/preferences/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid preferences ID" });
      }
      
      // Validate request body
      const validationResult = insertUserPreferencesSchema
        .partial()
        .safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid user preferences data", 
          errors: validationResult.error.format() 
        });
      }
      
      // Update user preferences
      const updatedPreferences = await storage.updateUserPreferences(
        id, 
        validationResult.data
      );
      
      if (!updatedPreferences) {
        return res.status(404).json({ message: "User preferences not found" });
      }
      
      res.json(updatedPreferences);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertUserSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: validationResult.error.format() 
        });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validationResult.data.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      // Create user
      const user = await storage.createUser(validationResult.data);
      
      // Create default preferences for new user
      await storage.createUserPreferences({
        userId: user.id,
        defaultDiskCount: 3,
        defaultSpeed: 1
      });
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
