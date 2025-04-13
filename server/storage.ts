import { users, userPreferences, solutionHistory, 
  type User, type InsertUser, 
  type UserPreferences, type InsertUserPreferences,
  type SolutionHistory, type InsertSolutionHistory, 
  type Move } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Expanded storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User preferences methods
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(id: number, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined>;
  
  // Solution history methods
  getSolutionHistory(id: number): Promise<SolutionHistory | undefined>;
  getUserSolutionHistory(userId: number): Promise<SolutionHistory[]>;
  createSolutionHistory(history: InsertSolutionHistory): Promise<SolutionHistory>;
  getLastSolutionForDiskCount(diskCount: number): Promise<SolutionHistory | undefined>;
}

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // User preferences methods
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    const [preferences] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return preferences;
  }
  
  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [newPreferences] = await db.insert(userPreferences).values(preferences).returning();
    return newPreferences;
  }
  
  async updateUserPreferences(id: number, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined> {
    const [updatedPreferences] = await db
      .update(userPreferences)
      .set({ ...preferences, updatedAt: new Date() })
      .where(eq(userPreferences.id, id))
      .returning();
    return updatedPreferences;
  }
  
  // Solution history methods
  async getSolutionHistory(id: number): Promise<SolutionHistory | undefined> {
    const [history] = await db.select().from(solutionHistory).where(eq(solutionHistory.id, id));
    return history;
  }
  
  async getUserSolutionHistory(userId: number): Promise<SolutionHistory[]> {
    return db.select()
      .from(solutionHistory)
      .where(eq(solutionHistory.userId, userId))
      .orderBy(desc(solutionHistory.createdAt));
  }
  
  async createSolutionHistory(history: InsertSolutionHistory): Promise<SolutionHistory> {
    const [newHistory] = await db.insert(solutionHistory).values(history).returning();
    return newHistory;
  }
  
  async getLastSolutionForDiskCount(diskCount: number): Promise<SolutionHistory | undefined> {
    const [history] = await db.select()
      .from(solutionHistory)
      .where(eq(solutionHistory.diskCount, diskCount))
      .orderBy(desc(solutionHistory.createdAt))
      .limit(1);
    return history;
  }
}

// Export the database storage interface
export const storage = new DatabaseStorage();
