import { useState } from "react";
import ControlPanel from "./ControlPanel";
import VisualizationArea from "./VisualizationArea";
import RecursionExplanation from "./RecursionExplanation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Move } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function TowerOfHanoi() {
  const [diskCount, setDiskCount] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(3);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timer, setTimer] = useState<number | null>(null);
  const { toast } = useToast();

  // Initial tower state
  const initialTowers = {
    A: Array.from({ length: diskCount }, (_, i) => diskCount - i),
    B: [],
    C: []
  };
  
  type TowerState = { A: number[], B: number[], C: number[] };
  const [towers, setTowers] = useState<TowerState>(initialTowers);

  // Fetch the solution moves
  const { data: moves = [], isLoading: isLoadingMoves } = useQuery<Move[]>({
    queryKey: [`/api/hanoi/${diskCount}`],
    enabled: true
  });

  // Reset the visualization
  const resetVisualization = () => {
    setCurrentMoveIndex(0);
    setElapsedTime(0);
    setIsPlaying(false);
    setTowers(initialTowers);
    
    // Clear any existing timer
    if (timer) {
      window.clearInterval(timer);
      setTimer(null);
    }
  };

  // Handle disk count change
  const handleDiskCountChange = (count: number) => {
    if (count >= 3 && count <= 10) {
      setDiskCount(count);
      resetVisualization();
      
      // Invalidate the current query to fetch new moves
      queryClient.invalidateQueries({ queryKey: [`/api/hanoi/${diskCount}`] });
    }
  };

  // Execute a move
  const executeMove = React.useCallback((moveIndex: number) => {
    if (moveIndex >= moves.length) {
      setIsPlaying(false);
      if (timer) {
        window.clearInterval(timer);
        setTimer(null);
      }
      toast({
        title: "Solution complete!",
        description: `Successfully moved all ${diskCount} disks in ${moves.length} moves.`,
      });
      return;
    }

    const move = moves[moveIndex];
    setTowers(prev => {
      const newTowers = { ...prev };
      const fromRod = move.from as keyof typeof newTowers;
      const toRod = move.to as keyof typeof newTowers;
      const disk = newTowers[fromRod].pop();
      if (disk !== undefined) {
        newTowers[toRod].push(disk);
      }
      return newTowers;
    });
    
    setCurrentMoveIndex(moveIndex + 1);
  }, [moves, timer, diskCount, toast]);

  // Start solving animation
  const startSolving = () => {
    resetVisualization();
    setIsPlaying(true);
    
    // Start timer
    const startTime = Date.now();
    const newTimer = window.setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    setTimer(newTimer);
    
    // Execute first move
    executeMove(0);
  };

  // Play/pause the animation
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  // Step through one move
  const stepForward = () => {
    if (currentMoveIndex < moves.length) {
      executeMove(currentMoveIndex);
    }
  };

  // Effect to handle auto-playing
  React.useEffect(() => {
    if (isPlaying && currentMoveIndex < moves.length) {
      const timeout = setTimeout(() => {
        executeMove(currentMoveIndex);
      }, 2000 / speed);
      
      return () => clearTimeout(timeout);
    }
  }, [isPlaying, currentMoveIndex, moves, speed, executeMove]);

  // Cleanup timers on unmount
  React.useEffect(() => {
    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [timer]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Total number of moves for the current disk count
  const totalMoves = moves.length;
  
  // Current recursion depth
  const currentMove = moves[currentMoveIndex - 1] || null;
  const recursionDepth = currentMove ? currentMove.depth : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Tower of Hanoi</h1>
        <p className="text-lg text-slate-600">Recursive Algorithm Visualization</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ControlPanel 
          diskCount={diskCount}
          onDiskCountChange={handleDiskCountChange}
          speed={speed}
          onSpeedChange={setSpeed}
          isPlaying={isPlaying}
          onReset={resetVisualization}
          onSolve={startSolving}
          onPlayPause={togglePlayPause}
          onStepForward={stepForward}
          currentMove={currentMoveIndex}
          totalMoves={totalMoves}
          recursionDepth={recursionDepth}
          timeElapsed={formatTime(elapsedTime)}
          isLoading={isLoadingMoves}
        />
        
        <VisualizationArea 
          towers={towers}
          currentMove={currentMove}
          currentMoveIndex={currentMoveIndex}
          totalMoves={totalMoves}
        />
      </div>
      
      <RecursionExplanation diskCount={diskCount} />
      
      <footer className="mt-8 text-center text-sm text-slate-500 pb-8">
        <p>Tower of Hanoi Recursion Visualization - Built with React, Tailwind CSS, and ShadCN/UI</p>
      </footer>
    </div>
  );
}

// Importing React at the end to avoid missing React in scope error
import React from "react";
