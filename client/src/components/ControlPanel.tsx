import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Plus, Minus, RotateCcw, Play, Pause, FastForward } from "lucide-react";

interface ControlPanelProps {
  diskCount: number;
  onDiskCountChange: (count: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  onReset: () => void;
  onSolve: () => void;
  onPlayPause: () => void;
  onStepForward: () => void;
  currentMove: number;
  totalMoves: number;
  recursionDepth: number;
  timeElapsed: string;
  isLoading: boolean;
}

export default function ControlPanel({
  diskCount,
  onDiskCountChange,
  speed,
  onSpeedChange,
  isPlaying,
  onReset,
  onSolve,
  onPlayPause,
  onStepForward,
  currentMove,
  totalMoves,
  recursionDepth,
  timeElapsed,
  isLoading
}: ControlPanelProps) {
  return (
    <div className="lg:col-span-1">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Controls</h2>
          
          {/* Disk Count Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Number of Disks</label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDiskCountChange(diskCount - 1)}
                disabled={diskCount <= 3 || isPlaying}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="text-lg font-medium text-center w-12 h-10 flex items-center justify-center bg-slate-100 rounded-md">
                {diskCount}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDiskCountChange(diskCount + 1)}
                disabled={diskCount >= 6 || isPlaying}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-1 text-xs text-slate-500">Select between 3-6 disks</div>
          </div>
          
          {/* Speed Control */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Animation Speed</label>
            <div className="relative">
              <Slider 
                value={[speed]} 
                min={1} 
                max={5} 
                step={1}
                onValueChange={(vals) => onSpeedChange(vals[0])}
                disabled={isPlaying && currentMove >= totalMoves}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>
          </div>
          
          {/* Playback Controls */}
          <div className="mb-6 space-y-3">
            <h3 className="text-sm font-medium text-slate-700">Playback</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={onReset}
                disabled={isLoading || (currentMove === 0 && !isPlaying)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700" 
                onClick={onSolve}
                disabled={isLoading || isPlaying || currentMove > 0}
              >
                <Play className="h-4 w-4 mr-2" />
                Solve
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={onPlayPause}
                disabled={isLoading || currentMove >= totalMoves || totalMoves === 0}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={onStepForward}
                disabled={isLoading || isPlaying || currentMove >= totalMoves || totalMoves === 0}
              >
                <FastForward className="h-4 w-4 mr-2" />
                Step
              </Button>
            </div>
          </div>
          
          {/* Stats Display */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-100 p-3 rounded-md">
                <div className="text-xs text-slate-500">Current Move</div>
                <div className="text-lg font-semibold text-slate-900">{currentMove}</div>
              </div>
              <div className="bg-slate-100 p-3 rounded-md">
                <div className="text-xs text-slate-500">Total Moves</div>
                <div className="text-lg font-semibold text-slate-900">{totalMoves}</div>
              </div>
              <div className="bg-slate-100 p-3 rounded-md">
                <div className="text-xs text-slate-500">Recursion Depth</div>
                <div className="text-lg font-semibold text-slate-900">{recursionDepth}</div>
              </div>
              <div className="bg-slate-100 p-3 rounded-md">
                <div className="text-xs text-slate-500">Time Elapsed</div>
                <div className="text-lg font-semibold text-slate-900">{timeElapsed}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
