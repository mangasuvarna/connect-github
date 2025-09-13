import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Palette, Eraser, Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DoodlePadProps {
  className?: string;
}

const colors = [
  "#000000", // Black
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#64748b", // Gray
];

export default function DoodlePad({ className }: DoodlePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = currentColor;
        context.lineWidth = lineWidth;
        setCtx(context);
        
        // Set white background
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;
    }
  }, [ctx, currentColor, lineWidth]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (ctx) {
      ctx.beginPath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "soulscript-doodle.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)} data-testid="doodle-pad">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-foreground">Digital Doodle Pad</h3>
        <p className="text-muted-foreground">
          Express yourself through creative drawing
        </p>
      </div>

      {/* Canvas */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border-2 border-border rounded-lg shadow-lg cursor-crosshair bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          data-testid="doodle-canvas"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        {/* Color Palette */}
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                  currentColor === color ? "border-foreground scale-110" : "border-gray-300"
                )}
                style={{ backgroundColor: color }}
                data-testid={`color-${color}`}
              />
            ))}
          </div>
        </div>

        {/* Line Width */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-20"
            data-testid="line-width-slider"
          />
          <span className="text-sm text-muted-foreground w-6">{lineWidth}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentColor("white")}
            variant="outline"
            size="sm"
            className="gap-2"
            data-testid="eraser-button"
          >
            <Eraser className="w-4 h-4" />
            Eraser
          </Button>
          
          <Button
            onClick={clearCanvas}
            variant="outline"
            size="sm"
            className="gap-2"
            data-testid="clear-canvas"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
          
          <Button
            onClick={downloadDrawing}
            variant="default"
            size="sm"
            className="gap-2"
            data-testid="download-doodle"
          >
            <Download className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Tips */}
      <div className="text-center max-w-md mx-auto">
        <p className="text-sm text-muted-foreground">
          Drawing can be therapeutic and help express emotions that are hard to put into words. 
          Let your creativity flow freely!
        </p>
      </div>
    </div>
  );
}
