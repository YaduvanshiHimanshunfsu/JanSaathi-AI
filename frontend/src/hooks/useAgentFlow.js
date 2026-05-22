import { useEffect, useState } from "react";

const AGENT_STEPS = [
  "Intake Agent",
  "Keyword Routing Agent",
  "AI Classification Agent",
  "Routing Agent",
  "Communication Agent"
];

export default function useAgentFlow(
  active
) {
  const [currentStep, setCurrentStep] =
    useState(0);

  useEffect(() => {

    if (!active) return;

    if (currentStep >= AGENT_STEPS.length)
      return;

    const timer = setTimeout(() => {

      setCurrentStep((prev) => prev + 1);

    }, 1200);

    return () => clearTimeout(timer);

  }, [active, currentStep]);

  return {
    currentStep,
    steps: AGENT_STEPS
  };
}