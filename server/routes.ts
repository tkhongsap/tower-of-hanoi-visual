import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateHanoiMoves } from "../client/src/utils/towerOfHanoi";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get the Hanoi solution moves
  app.get("/api/hanoi/:diskCount", (req, res) => {
    try {
      const diskCount = parseInt(req.params.diskCount);
      
      // Validate disk count
      if (isNaN(diskCount) || diskCount < 1 || diskCount > 10) {
        return res.status(400).json({ 
          message: "Invalid disk count. Please provide a number between 1 and 10." 
        });
      }
      
      // Generate the solution moves using the Tower of Hanoi algorithm
      const moves = generateHanoiMoves(diskCount);
      
      // Return the moves
      res.json(moves);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
