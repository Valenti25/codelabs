// "use client";
// import { Image } from "@nextui-org/react";
// import { Button, Input } from "@nextui-org/react";
// import ModelWorldPlanet from "../../ModelsObject/ModelWorldPlanet";

// export default function AIHeroSection() {
//   return (
//     <section className="relative flex flex-col items-center justify-center text-white">
//       {/* Main Content */}
//       <div className="absolute inset-0 z-0 m-auto max-w-5xl">
//         <ModelWorldPlanet />
//       </div>

//       {/* Responsive Padding and Content Wrapper */}
//       <div className="z-10 mx-auto w-full max-w-4xl px-4 py-24 text-center md:py-36 lg:py-52">
//         <div className="flex items-center justify-center">
//           <Image
//             src="/IconLogo/build-your-future-with-ai.png"
//             alt="build-your-future-with-ai-logo"
//             // Use max-width for responsiveness and h-auto to maintain aspect ratio
//             className="h-auto w-full max-w-[300px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[931px]"
//           />
//         </div>

//         {/* Responsive Font Size and Margin */}
//         <p className="mb-6 text-2xl text-gray-300 md:mb-8 md:text-3xl lg:mb-12 lg:text-[40px]">
//           Starting Now
//         </p>
        
//         <div className="m-auto flex w-full max-w-2xl items-center justify-center gap-2 sm:gap-4">
//           <Input
//             type="email"
//             placeholder="Enter your email"
//             // flex-1 allows the input to grow and shrink
//             className="h-auto flex-1"
//             classNames={{
//               input: "bg-transparent text-white placeholder:text-gray-400",
//               inputWrapper: "bg-black/50 border border-gray-600 rounded-xl h-12 px-4"
//             }}
//           />
//           <Button className="h-12 rounded-xl bg-white px-4 sm:px-8 py-3 font-medium text-black transition-colors hover:bg-gray-100">
//             Book a Demo
//           </Button>
//         </div>
//       </div>
      
//       {/* Footer */}
//       <div className="bottom-8 z-10 flex flex-col items-center justify-center text-center">
//         <div className="mb-4 flex items-center justify-center">
//           <div className="flex items-center">
//             <Image
//               src="/IconLogo/codelabs-logo.png"
//               alt="codelabs-logo"
//               // Responsive logo size
//               className="h-auto w-[180px] md:w-[240px] lg:w-[300px]"
//             />
//           </div>
//         </div>
        
//         {/* Responsive Margin */}
//         <div className="mb-10 flex justify-center gap-4 md:mb-16 lg:mb-20">
//           <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600">
//             <span className="text-xs">📧</span>
//           </div>
//           <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600">
//             <span className="text-xs">📱</span>
//           </div>
//           <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600">
//             <span className="text-xs">📷</span>
//           </div>
//           <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600">
//             <span className="text-xs">🔗</span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }