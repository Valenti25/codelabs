"use client";
import ModelAi_Orb from "./ThreeJs/ModelAi_Orb";

export default function PoweringSearchengineSelection() {
  return (
    <section className="mt-16 flex w-full items-center justify-center px-6 text-white">
      <div className="flex w-full max-w-7xl flex-col items-center justify-center text-center">
        <p className="mb-2 text-xl text-[#7E7E7E] lg:text-lg">
          AI for the Enterprise
        </p>
        
        <h1 className="text-3xl lg:text-[40px]">
          Powering Search engine
        </h1>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-12 md:mr-96 lg:flex-row">
          <div className="flex h-full w-full max-w-xl justify-center">
            <ModelAi_Orb />
          </div>

          <div className="flex max-w-md flex-col items-center justify-center text-center lg:items-start lg:text-left">
            <h2 className="mb-3 text-2xl">Search engine AI</h2>
            <p className="text-sm leading-relaxed text-[#7E7E7E]">
              An AI-powered sales assistant that chats, qualifies, recommends,
              and helps close deals — 24/7.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
