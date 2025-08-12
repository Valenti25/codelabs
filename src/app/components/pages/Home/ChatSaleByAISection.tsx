"use client";
import ModelBrain from "../../ModelsObject/ModelBrain";
import content from "@/locales/en/home.json";

export default function ChatSaleByAISection() {
  const text = content.chatSaleByAI;

  return (
    <section className="flex w-full items-center justify-center px-4 py-16 text-white lg:py-36">
      <div className="flex w-full max-w-7xl flex-col items-center justify-center text-center">
        <p className="mb-2 text-base text-[#7E7E7E] lg:text-xl">
          {text.smallTitle}
        </p>
        <h1 className="text-3xl lg:text-[40px]">{text.mainTitle}</h1>

        <div className="mt-8 flex w-full items-center justify-center">
          <div className="aspect-[1/1] w-full max-w-2xl">
            <ModelBrain />
          </div>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-[#7E7E7E]">
          {text.description}
        </p>
      </div>
    </section>
  );
}
