import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { type Move } from "@shared/schema";

interface VisualizationAreaProps {
  towers: {
    A: number[];
    B: number[];
    C: number[];
  };
  currentMove: Move | null;
  currentMoveIndex: number;
  totalMoves: number;
}

export default function VisualizationArea({
  towers,
  currentMove,
  currentMoveIndex,
  totalMoves
}: VisualizationAreaProps) {
  // Array of rod labels
  const rods = [
    { id: "A", label: "Source" },
    { id: "B", label: "Auxiliary" },
    { id: "C", label: "Destination" }
  ];

  // Array of colors for the disks
  const diskColors = [
    "bg-emerald-500",
    "bg-indigo-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-purple-500",
    "bg-cyan-500",
  ];

  // Function to generate step description
  const getStepDescription = () => {
    if (currentMoveIndex === 0) {
      return (
        <>
          <p>The Tower of Hanoi puzzle starts with all disks on the leftmost rod. The goal is to move all disks to the rightmost rod following these rules:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li>Only one disk can be moved at a time.</li>
            <li>Each move consists of taking the top disk from one rod and placing it on top of another rod.</li>
            <li>No disk may be placed on top of a smaller disk.</li>
          </ul>
          <p className="mt-2 text-sm"><span className="font-medium">Press "Solve"</span> to see the recursive algorithm in action.</p>
        </>
      );
    }

    if (currentMove) {
      return (
        <>
          <p className="font-medium">Move {currentMoveIndex} of {totalMoves}</p>
          <p>Moving disk {currentMove.disk} from rod {currentMove.from} to rod {currentMove.to}</p>
          <p className="mt-2 text-sm">Current recursion depth: {currentMove.depth}</p>
        </>
      );
    }

    return <p>Ready to solve the Tower of Hanoi puzzle.</p>;
  };

  return (
    <div className="lg:col-span-2">
      <Card>
        <CardContent className="p-6 h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Visualization</h2>
          
          {/* Tower of Hanoi Visualization */}
          <div className="flex-1 bg-slate-50 rounded-lg p-4 flex flex-col items-center justify-center relative min-h-[400px]">
            {/* Tower Labels */}
            <div className="absolute top-4 left-0 w-full flex justify-around">
              {rods.map(rod => (
                <div key={rod.id} className="text-center">
                  <span className="text-sm font-medium text-slate-700">{rod.label}</span>
                </div>
              ))}
            </div>
            
            {/* Towers and Disks Container */}
            <div className="w-full flex items-end justify-around h-[300px] py-8">
              {rods.map(rod => (
                <div key={rod.id} className="tower-container relative flex flex-col items-center justify-end h-full w-1/3 max-w-[180px]">
                  <motion.div 
                    className={`rod w-2 bg-slate-700 h-[220px] rounded-t-lg absolute z-0`}
                    initial={{ opacity: 1 }}
                    animate={{ 
                      backgroundColor: currentMove && currentMove.to === rod.id ? [null, "#6366f1", "#334155"] : "#334155" 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="base w-48 h-4 bg-slate-800 rounded-md z-10"></div>
                  
                  {/* Disks for Tower */}
                  <div className="disks-container absolute bottom-4 flex flex-col-reverse items-center">
                    <AnimatePresence>
                      {towers[rod.id as keyof typeof towers].map((diskNumber, index) => (
                        <motion.div
                          key={`${rod.id}-${diskNumber}`}
                          className={`disk ${diskColors[diskNumber - 1]} rounded-md h-6 shadow-md mb-1 flex items-center justify-center text-white font-bold`}
                          style={{ 
                            width: `${80 + (diskNumber * 20)}px`,
                            zIndex: diskNumber
                          }}
                          initial={{ y: -50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -50, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {diskNumber}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Current Step Description */}
          <div className="mt-4 p-4 border border-slate-200 rounded-md shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)] bg-slate-50">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Current Step</h3>
            <div className="text-slate-600">
              {getStepDescription()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
