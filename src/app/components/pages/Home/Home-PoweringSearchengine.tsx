"use client";
import ModelAi_Orb from "../../ModelsObject/ModelAi_Orb";
import content from "@/locales/en/home.json";

export default function PoweringSearchengineSelection() {
  const text = content.poweringSearchEngine;

  return (
    <section className="mt-16 flex w-full items-center justify-center px-6 text-white">
      <div className="flex w-full max-w-7xl flex-col items-center justify-center text-center">
        <p className="mb-2 text-lg text-[#7E7E7E] lg:text-lg">{text.smallTitle}</p>
        <h1 className="text-xl lg:text-3xl lg:text-[40px]">{text.mainTitle}</h1>
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-12 lg:mr-96 lg:flex-row">
          <div className="flex h-full select-none w-full max-w-xl pointer-events-none justify-center">
            <ModelAi_Orb />
          </div>
          <div className="flex max-w-md flex-col m-auto items-center justify-center text-center lg:items-start lg:text-left">
            <h2 className="mb-3 text-xl lg:text-2xl">{text.sectionTitle}</h2>
            <p className="text-xs lg:text-lg leading-relaxed text-[#7E7E7E]">{text.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
