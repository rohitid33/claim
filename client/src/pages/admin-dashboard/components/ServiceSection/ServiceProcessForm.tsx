import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceProcessFormProps {
  processes: {title: string, steps: string[]}[];
  processTitle: string;
  setProcessTitle: (value: string) => void;
  processSteps: string;
  setProcessSteps: (value: string) => void;
  onAddProcess: () => void;
  onRemoveProcess: (index: number) => void;
}

export function ServiceProcessForm({
  processes,
  processTitle,
  setProcessTitle,
  processSteps,
  setProcessSteps,
  onAddProcess,
  onRemoveProcess
}: ServiceProcessFormProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="processTitle">Process Phase Title</Label>
          <Input 
            id="processTitle"
            value={processTitle}
            onChange={(e) => setProcessTitle(e.target.value)}
            placeholder="e.g., Initial Assessment"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="processSteps">Process Steps (comma-separated)</Label>
        <Textarea 
          id="processSteps"
          value={processSteps}
          onChange={(e) => setProcessSteps(e.target.value)}
          placeholder="Step 1, Step 2, Step 3..."
          rows={3}
        />
      </div>
      
      <Button onClick={onAddProcess} variant="outline">
        Add Process Phase
      </Button>
      
      {processes.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Process Phases</h3>
          <div className="space-y-4">
            {processes.map((process, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{process.title}</h4>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => onRemoveProcess(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  <ul className="list-disc list-inside">
                    {process.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}