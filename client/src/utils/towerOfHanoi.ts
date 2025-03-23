import { Move } from "@shared/schema";

/**
 * Generates the moves to solve the Tower of Hanoi puzzle.
 * @param n - The number of disks
 * @param source - The source rod (A, B, or C)
 * @param auxiliary - The auxiliary rod (A, B, or C)
 * @param destination - The destination rod (A, B, or C)
 * @param depth - The current recursion depth (default: 0)
 * @returns An array of moves to solve the Tower of Hanoi puzzle
 */
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
