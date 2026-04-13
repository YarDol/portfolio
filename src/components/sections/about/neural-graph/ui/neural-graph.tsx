"use client";

import { useRef } from "react";
import { useNeuralGraph } from "../model/use-neural-graph";

export function NeuralGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useNeuralGraph(canvasRef);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
