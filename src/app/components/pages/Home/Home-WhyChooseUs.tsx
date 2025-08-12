// "use client"
// import { Card, CardBody, Avatar } from "@nextui-org/react";

// export default function WhyChooseUs() {
//   return (
//     <section className="bg-black text-white py-16 px-4">
//       <div className="max-w-7xl mx-auto text-center mb-12">
//         <p className="text-gray-500 text-sm mb-2">Customers</p>
//         <h2 className="text-4xl font-bold">Why Choose Us?</h2>
//       </div>

//       <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
//         <Card className="border border-gray-800 rounded-2xl w-40">
//           <CardBody className="text-center p-4">
//             <Avatar 
//               src="https://i.pravatar.cc/150?u=floyd" 
//               size="md" 
//               className="mx-auto mb-3"
//             />
//             <div className="flex justify-center mb-2 gap-0.5">
//               {[...Array(5)].map((_, i) => (
//                 <span key={i} className="text-yellow-400 text-sm">★</span>
//               ))}
//             </div>
//             <p className="text-xs text-gray-300 mb-2 leading-relaxed">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e
//             </p>
//             <h3 className="font-medium text-sm text-white">Floyd Miles</h3>
//           </CardBody>
//         </Card>

//         <Card className="border border-gray-800 rounded-2xl w-40">
//           <CardBody className="text-center p-4">
//             <Avatar 
//               src="https://i.pravatar.cc/150?u=kristin" 
//               size="md" 
//               className="mx-auto mb-3"
//             />
//             <div className="flex justify-center mb-2 gap-0.5">
//               {[...Array(5)].map((_, i) => (
//                 <span key={i} className="text-yellow-400 text-sm">★</span>
//               ))}
//             </div>
//             <p className="text-xs text-gray-300 mb-2 leading-relaxed">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e
//             </p>
//             <h3 className="font-medium text-sm text-white">Kristin Watson</h3>
//           </CardBody>
//         </Card>

//         <Card className="border border-gray-800 rounded-2xl w-40">
//           <CardBody className="text-center p-4">
//             <Avatar 
//               src="https://i.pravatar.cc/150?u=guy" 
//               size="md" 
//               className="mx-auto mb-3"
//             />
//             <div className="flex justify-center mb-2 gap-0.5">
//               {[...Array(5)].map((_, i) => (
//                 <span key={i} className="text-yellow-400 text-sm">★</span>
//               ))}
//             </div>
//             <p className="text-xs text-gray-300 mb-2 leading-relaxed">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e
//             </p>
//             <h3 className="font-medium text-sm text-white">Guy Hawkins</h3>
//           </CardBody>
//         </Card>

//         <Card className="border border-gray-800 rounded-2xl w-40">
//           <CardBody className="text-center p-4">
//             <Avatar 
//               src="https://i.pravatar.cc/150?u=darrell" 
//               size="md" 
//               className="mx-auto mb-3"
//             />
//             <div className="flex justify-center mb-2 gap-0.5">
//               {[...Array(5)].map((_, i) => (
//                 <span key={i} className="text-yellow-400 text-sm">★</span>
//               ))}
//             </div>
//             <p className="text-xs text-gray-300 mb-2 leading-relaxed">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e
//             </p>
//             <h3 className="font-medium text-sm text-white">Darrell Steward</h3>
//           </CardBody>
//         </Card>

//         <Card className="border border-gray-800 rounded-2xl w-40">
//           <CardBody className="text-center p-4">
//             <Avatar 
//               src="https://i.pravatar.cc/150?u=arlene" 
//               size="md" 
//               className="mx-auto mb-3"
//             />
//             <div className="flex justify-center mb-2 gap-0.5">
//               {[...Array(5)].map((_, i) => (
//                 <span key={i} className="text-yellow-400 text-sm">★</span>
//               ))}
//             </div>
//             <p className="text-xs text-gray-300 mb-2 leading-relaxed">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e
//             </p>
//             <h3 className="font-medium text-sm text-white">Arlene McCoy</h3>
//           </CardBody>
//         </Card>

//         <Card className="border border-gray-800 rounded-2xl w-40">
//           <CardBody className="text-center p-4">
//             <Avatar 
//               src="https://i.pravatar.cc/150?u=dianne" 
//               size="md" 
//               className="mx-auto mb-3"
//             />
//             <div className="flex justify-center mb-2 gap-0.5">
//               {[...Array(5)].map((_, i) => (
//                 <span key={i} className="text-yellow-400 text-sm">★</span>
//               ))}
//             </div>
//             <p className="text-xs text-gray-300 mb-2 leading-relaxed">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e
//             </p>
//             <h3 className="font-medium text-sm text-white">Dianne Russell</h3>
//           </CardBody>
//         </Card>
//       </div>
//     </section>
//   );
// }