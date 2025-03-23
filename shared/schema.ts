import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// The existing users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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
