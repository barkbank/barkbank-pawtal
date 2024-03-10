import { cn } from "@/lib/utils";
import React from "react";

function Stepper(props: { steps: string[]; currentStep: number }) {
  const { steps, currentStep } = props;

  const activeColor = (index: number) =>
    currentStep >= index ? "bg-brand" : "bg-gray-300";
  const activeLineColor = (index: number) =>
    currentStep > index ? "bg-brand" : "bg-gray-300";

  const isFinalStep = (index: number) => index === steps.length - 1;

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center">
        {steps.map((_, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div className={`h-6 w-6 rounded-full ${activeColor(i)}`}></div>
            </div>
            {isFinalStep(i) ? null : (
              <div className={`h-1 w-full ${activeLineColor(i)}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex w-full items-start">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div className="w-20">
              <p
                className={cn(
                  "text-sm",
                  i === 0
                    ? "text-left"
                    : i === steps.length - 1
                      ? "text-right"
                      : "text-center",
                )}
              >
                {step}
              </p>
            </div>
            {isFinalStep(i) ? null : (
              <div className={`h-0 w-full ${activeColor(i)}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

Stepper.displayName = "Stepper";

export { Stepper };
