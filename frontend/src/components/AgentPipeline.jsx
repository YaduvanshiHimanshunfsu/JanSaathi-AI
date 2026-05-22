import AgentStepCard from "./AgentStepCard";

export default function AgentPipeline({
  currentStep,
  steps
}) {

  return (
    <div className="card mt-8 fade-in">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-dark">
          AI Agent Execution Pipeline
        </h2>

        <p className="text-gray-500 mt-1">
          Autonomous grievance orchestration in progress
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-4">

        {steps.map((step, index) => (

          <AgentStepCard
            key={index}
            title={step}

            active={
              currentStep === index + 1
            }

            completed={
              currentStep > index + 1
            }
          />

        ))}

      </div>

    </div>
  );
}