"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

const GradientBorderText = ({ children }: { children: React.ReactNode }) => (
  <div className="gradient relative inline-block rounded-lg backdrop-blur-md">
    <div className="rounded-[6px] bg-black/80">{children}</div>
  </div>
);

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dropdownData = {
    products: {
      "Build AI": {
        description: "Data for training models",
        subItems: [
          { name: "For Enterprise", description: "Smart data platform", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "For SME, Startup", description: "Lightweight and efficient ", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "For E-commerce", description: "Boost sales with AI", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "For Sale", description: "Sell smarter, faster, and better", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "For Human Resource (HR)", description: "Simplify HR tasks ", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "For Government", description: "Smart solutions for digital", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "For Financial", description: "Manage your finances with", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "For Medical, Healthcare", description: "Manage patient data", icon: "/IconLogo/chatgpt-logo.png" }
        ],
      },
      "Apply AI": {
        description: "Data for training models",
        subItems: [
          { name: "Chat Platform", description: "Smart data platform", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "AI-powered E-commerce Sales", description: "Boost online", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "Smart Data Platform", description: "Boost sales with", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "Stock Management", description: "Optimize inventory", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "Dashboard", description: "Real-time insights powered", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "AI Consultant", description: "Expert who helps business", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "Promotion CRM", description: "Boost engagement with ", icon: "/IconLogo/chatgpt-logo.png" },
          { name: "CRM System", description: "Smart system to ", icon: "/IconLogo/chatgpt-logo.png" }
        ],
      }
    }
  };

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target as Node) &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.parentElement?.contains(e.target as Node)
      ) setActiveDropdown(null);
    };

    onResize();
    window.addEventListener("resize", onResize);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  const handleMouseEnter = (dropdown: string) => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    if (!isMobile) setActiveDropdown(dropdown);
  };
  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  const renderDropdownContent = () => (
    <div className="pointer-events-none absolute top-[140px] left-0 right-0 z-40 flex justify-center">
      <div className="gradient-border pointer-events-auto relative rounded-lg p-[2px] backdrop-blur-md">
        <div
          ref={dropdownMenuRef}
          onMouseEnter={() => handleMouseEnter("products")}
          onMouseLeave={handleMouseLeave}
          className="relative w-[70vw] max-w-5xl max-h-[80vh] h-full rounded-[inherit] bg-black/20"
        >
          <div className="px-6 py-8 grid grid-cols-2 gap-8 lg:gap-12">
            {Object.entries(dropdownData.products).map(([category, data]) => (
              <div key={category} className="space-y-4">
                <h3 className="mb-4 text-lg font-bold text-white">{category}</h3>
                <div className="space-y-3">
                  <div className="border-b border-[#676767] pb-3">
                    <GradientBorderText>
                      <h4 className="text-sm font-semibold text-cyan-400">{data.description}</h4>
                    </GradientBorderText>
                    <div className="text-[#676767]">svscwcwcvsvs</div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {data.subItems.map(({ name, description, icon }, idx) => (
                      <Link
                        key={idx}
                        href="#"
                        className="group block rounded-md p-2 transition-colors hover:bg-gray-800/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 h-5 w-5 flex-shrink-0">
                            <Image src={icon} alt={name} width={20} height={20} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-white transition-colors group-hover:text-cyan-400">
                              {name}
                            </span>
                            <span className="mt-0.5 line-clamp-2 text-xs text-gray-400">{description}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <Navbar className="relative z-50 px-6 py-4 lg:px-12 lg:py-10" maxWidth="full">
        <NavbarContent className="mx-auto flex max-w-[1400px] w-full items-center justify-between text-white">
          <NavbarBrand>
            <Image
              src="/IconLogo/codelabs-logo.png"
              alt="codelabs-logo"
              width={isMobile ? 160 : 200}
              height={isMobile ? 45 : 57}
            />
          </NavbarBrand>

          {isMobile ? (
            <div className="relative" ref={menuRef}>
              <Button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-transparent text-white">
                ☰
              </Button>
              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 space-y-4 rounded-lg bg-black/85 p-4 shadow-lg backdrop-blur-md">
                  {["Product", "Case Studies", "Pricing", "Resources"].map((label) => (
                    <Link key={label} href="#" className="block text-white hover:text-cyan-400">
                      {label}
                    </Link>
                  ))}
                  <Button className="w-full rounded-lg bg-white font-bold text-black">Book a Demo</Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavbarContent className="hidden gap-10 text-lg lg:flex">
                <div
                  ref={dropdownContainerRef}
                  className="relative rounded-lg"
                  onMouseEnter={() => handleMouseEnter("products")}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavbarItem className="relative">
                    <Link href="#" className="relative z-10 flex items-center gap-1 text-white transition-colors">
                      Product
                      <svg
                        className={`h-4 w-4 transition-transform ${activeDropdown === "products" ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                  </NavbarItem>
                </div>

                {["Case Studies", "Pricing"].map((label) => (
                  <NavbarItem key={label}>
                    <Link href="#" className="text-white transition-colors hover:text-cyan-400">
                      {label}
                    </Link>
                  </NavbarItem>
                ))}

                <NavbarItem>
                  <Link
                    href="#"
                    className="flex items-center gap-1 text-white transition-colors hover:text-cyan-400"
                  >
                    Resources
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                </NavbarItem>
              </NavbarContent>

              <NavbarContent className="hidden lg:flex">
                <NavbarItem className="relative rounded-lg">
                  <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-[#4568DC] to-[#B06AB3] backdrop-blur-md"></div>
                  <Button className="relative rounded-lg bg-white px-6 py-2 font-bold text-black transition-colors hover:bg-gray-100">
                    Book a Demo
                  </Button>
                </NavbarItem>
              </NavbarContent>
            </>
          )}
        </NavbarContent>
      </Navbar>

      {activeDropdown === "products" && !isMobile && renderDropdownContent()}
    </div>
  );
}
