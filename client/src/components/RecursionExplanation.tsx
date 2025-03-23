import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface RecursionExplanationProps {
  diskCount: number;
}

export default function RecursionExplanation({ diskCount }: RecursionExplanationProps) {
  // Generate a recursion tree SVG for display
  const generateRecursionTree = () => {
    if (diskCount <= 3) {
      return (
        <svg 
          viewBox="0 0 600 300" 
          className="max-w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Level 1 */}
          <g>
            <rect x="250" y="10" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="300" y="35" textAnchor="middle" fill="#334155" fontSize="14">hanoi(3,A,B,C)</text>
          </g>
          
          {/* Connecting lines */}
          <line x1="300" y1="50" x2="200" y2="80" stroke="#64748b" strokeWidth="1.5" />
          <line x1="300" y1="50" x2="300" y2="80" stroke="#64748b" strokeWidth="1.5" />
          <line x1="300" y1="50" x2="400" y2="80" stroke="#64748b" strokeWidth="1.5" />
          
          {/* Level 2 */}
          <g>
            <rect x="150" y="80" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="200" y="105" textAnchor="middle" fill="#334155" fontSize="14">hanoi(2,A,C,B)</text>
          </g>
          <g>
            <rect x="250" y="80" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="300" y="105" textAnchor="middle" fill="#334155" fontSize="14">Move 3 A→C</text>
          </g>
          <g>
            <rect x="350" y="80" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="400" y="105" textAnchor="middle" fill="#334155" fontSize="14">hanoi(2,B,A,C)</text>
          </g>
          
          {/* Connecting lines */}
          <line x1="200" y1="120" x2="150" y2="150" stroke="#64748b" strokeWidth="1.5" />
          <line x1="200" y1="120" x2="250" y2="150" stroke="#64748b" strokeWidth="1.5" />
          <line x1="400" y1="120" x2="350" y2="150" stroke="#64748b" strokeWidth="1.5" />
          <line x1="400" y1="120" x2="450" y2="150" stroke="#64748b" strokeWidth="1.5" />
          
          {/* Level 3 */}
          <g>
            <rect x="100" y="150" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="150" y="175" textAnchor="middle" fill="#334155" fontSize="14">hanoi(1,A,B,C)</text>
          </g>
          <g>
            <rect x="200" y="150" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="250" y="175" textAnchor="middle" fill="#334155" fontSize="14">Move 2 A→B</text>
          </g>
          <g>
            <rect x="300" y="150" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="350" y="175" textAnchor="middle" fill="#334155" fontSize="14">hanoi(1,C,A,B)</text>
          </g>
          <g>
            <rect x="400" y="150" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="450" y="175" textAnchor="middle" fill="#334155" fontSize="14">Move 2 B→C</text>
          </g>
          
          {/* Level 4 - Base Cases */}
          <line x1="150" y1="190" x2="150" y2="220" stroke="#64748b" strokeWidth="1.5" />
          <line x1="350" y1="190" x2="350" y2="220" stroke="#64748b" strokeWidth="1.5" />
          
          <g>
            <rect x="100" y="220" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="150" y="245" textAnchor="middle" fill="#334155" fontSize="14">Move 1 A→C</text>
          </g>
          <g>
            <rect x="300" y="220" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="350" y="245" textAnchor="middle" fill="#334155" fontSize="14">Move 1 C→B</text>
          </g>
        </svg>
      );
    } else {
      // For higher disk counts, show a simplified tree that indicates complexity
      return (
        <svg 
          viewBox="0 0 600 300" 
          className="max-w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Level 1 */}
          <g>
            <rect x="250" y="10" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="300" y="35" textAnchor="middle" fill="#334155" fontSize="14">hanoi({diskCount},A,B,C)</text>
          </g>
          
          {/* Connecting lines */}
          <line x1="300" y1="50" x2="200" y2="80" stroke="#64748b" strokeWidth="1.5" />
          <line x1="300" y1="50" x2="300" y2="80" stroke="#64748b" strokeWidth="1.5" />
          <line x1="300" y1="50" x2="400" y2="80" stroke="#64748b" strokeWidth="1.5" />
          
          {/* Level 2 */}
          <g>
            <rect x="150" y="80" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="200" y="105" textAnchor="middle" fill="#334155" fontSize="14">hanoi({diskCount-1},A,C,B)</text>
          </g>
          <g>
            <rect x="250" y="80" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="300" y="105" textAnchor="middle" fill="#334155" fontSize="14">Move {diskCount} A→C</text>
          </g>
          <g>
            <rect x="350" y="80" width="100" height="40" rx="5" fill="#e2e8f0" stroke="#64748b" />
            <text x="400" y="105" textAnchor="middle" fill="#334155" fontSize="14">hanoi({diskCount-1},B,A,C)</text>
          </g>
          
          {/* Connector to complexity indicators */}
          <line x1="200" y1="120" x2="150" y2="160" stroke="#64748b" strokeWidth="1.5" />
          <line x1="400" y1="120" x2="450" y2="160" stroke="#64748b" strokeWidth="1.5" />
          
          {/* Complexity indicators */}
          <g>
            <ellipse cx="150" cy="180" rx="40" ry="20" fill="#e2e8f0" stroke="#64748b" />
            <text x="150" y="185" textAnchor="middle" fill="#334155" fontSize="14">2^{diskCount-1}-1</text>
          </g>
          <text x="150" y="215" textAnchor="middle" fill="#64748b" fontSize="12">moves</text>
          
          <g>
            <ellipse cx="450" cy="180" rx="40" ry="20" fill="#e2e8f0" stroke="#64748b" />
            <text x="450" y="185" textAnchor="middle" fill="#334155" fontSize="14">2^{diskCount-1}-1</text>
          </g>
          <text x="450" y="215" textAnchor="middle" fill="#64748b" fontSize="12">moves</text>
          
          {/* Total moves indicator */}
          <g>
            <rect x="250" y="230" width="100" height="40" rx="5" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <text x="300" y="255" textAnchor="middle" fill="#334155" fontSize="14">Total: 2^{diskCount}-1</text>
          </g>
          
          <line x1="250" y1="250" x2="200" y2="180" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,2" />
          <line x1="350" y1="250" x2="400" y2="180" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,2" />
        </svg>
      );
    }
  };

  return (
    <div className="mt-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Understanding the Recursion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-slate-700 mb-3">Recursive Algorithm</h3>
              <div className="bg-slate-50 p-4 rounded-md font-mono text-sm">
                <pre className="whitespace-pre-wrap text-slate-800">
{`function hanoi(n, source, auxiliary, destination) {
  if (n === 1) {
    // Base case: Move disk 1 from source to destination
    console.log(\`Move disk 1 from \${source} to \${destination}\`);
    return;
  }
  
  // Move n-1 disks from source to auxiliary using destination as helper
  hanoi(n-1, source, destination, auxiliary);
  
  // Move the nth disk from source to destination
  console.log(\`Move disk \${n} from \${source} to \${destination}\`);
  
  // Move n-1 disks from auxiliary to destination using source as helper
  hanoi(n-1, auxiliary, source, destination);
}`}
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-slate-700 mb-3">Recursive Call Tree</h3>
              <div className="bg-slate-50 p-4 rounded-md flex items-center justify-center min-h-[200px]">
                {generateRecursionTree()}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-slate-700 mb-3">How It Works</h3>
            <div className="text-slate-600 space-y-2">
              <p>The Tower of Hanoi is a classic example of a recursive algorithm. The problem of moving n disks can be broken down into three steps:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Move n-1 disks from the source rod to the auxiliary rod using the destination rod as a helper.</li>
                <li>Move the largest disk (nth disk) from the source rod to the destination rod.</li>
                <li>Move the n-1 disks from the auxiliary rod to the destination rod using the source rod as a helper.</li>
              </ol>
              <p className="mt-2">This recursive approach continues until we reach the base case: moving just 1 disk. The total number of moves required is 2<sup>n</sup> - 1, where n is the number of disks.</p>
              <p className="mt-2">For {diskCount} disks, the solution requires {Math.pow(2, diskCount) - 1} moves.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
