import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// The existing users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  defaultDiskCount: integer("default_disk_count").default(3).notNull(),
  defaultSpeed: integer("default_speed").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Solution history table
export const solutionHistory = pgTable("solution_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  diskCount: integer("disk_count").notNull(),
  moves: json("moves").notNull(),
  timeToSolve: integer("time_to_solve"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  preferences: many(userPreferences),
  history: many(solutionHistory),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const solutionHistoryRelations = relations(solutionHistory, ({ one }) => ({
  user: one(users, {
    fields: [solutionHistory.userId],
    references: [users.id],
  }),
}));

// Schemas for Zod validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  userId: true,
  defaultDiskCount: true,
  defaultSpeed: true,
});

export const insertSolutionHistorySchema = createInsertSchema(solutionHistory).pick({
  userId: true,
  diskCount: true,
  moves: true,
  timeToSolve: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type SolutionHistory = typeof solutionHistory.$inferSelect;
export type InsertSolutionHistory = z.infer<typeof insertSolutionHistorySchema>;

// Tower of Hanoi Move Schema
export const moveSchema = z.object({
  disk: z.number().int().positive(),
  from: z.string().length(1),
  to: z.string().length(1),
  depth: z.number().int().nonnegative(),
});

export type Move = z.infer<typeof moveSchema>;

// Helper function for Tower of Hanoi algorithm (server-side implementation)
export function generateHanoiMoves(
  n: number,
  source: string = "A", 
  auxiliary: string = "B", 
  destination: string = "C",
  depth: number = 0
): Move[] {
  const moves: Move[] = [];
  
  if (n === 1) {
    // Base case: Move disk 1 from source to destination
    moves.push({
      disk: 1,
      from: source,
      to: destination,
      depth: depth
    });
    return moves;
  }
  
  // Move n-1 disks from source to auxiliary using destination as helper
  moves.push(...generateHanoiMoves(n - 1, source, destination, auxiliary, depth + 1));
  
  // Move the nth disk from source to destination
  moves.push({
    disk: n,
    from: source,
    to: destination,
    depth: depth
  });
  
  // Move n-1 disks from auxiliary to destination using source as helper
  moves.push(...generateHanoiMoves(n - 1, auxiliary, source, destination, depth + 1));
  
  return moves;
}
