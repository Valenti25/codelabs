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
import content from "@/locales/en/home.json";

// Helper component for text with a gradient border
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

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target as Node) &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.parentElement?.contains(e.target as Node)
      )
        setActiveDropdown(null);
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

  const dropdownData = content.dropdown;

  const renderDropdownContent = () => (
    <div className="pointer-events-none absolute top-[140px] left-0 right-0 z-40 flex justify-center">
      <div className="border-2 border-black pointer-events-auto relative rounded-lg p-[2px] backdrop-blur-md">
        <div
          ref={dropdownMenuRef}
          onMouseEnter={() => handleMouseEnter("products")}
          onMouseLeave={handleMouseLeave}
          className="relative w-[70vw] max-w-6xl max-h-[80vh] h-full rounded-[inherit] bg-black/20"
        >
          <div className="px-6 py-8 grid grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {Object.entries(dropdownData.products).map(([category, data]) => (
              <div key={category} className="space-y-4">
                <div className="border-b border-[#676767]/30 pb-3">
                  <h3 className="text-lg font-bold text-white mb-2">{category}</h3>
                  <GradientBorderText>
                    <h4 className="text-sm font-semibold gradient-text-animated">{data.description}</h4>
                  </GradientBorderText>
                </div>
                <div className="grid grid-cols-1 gap-y-2">
                  {data.subItems.map(({ name, description }, idx) => (
                    <Link
                      key={idx}
                      href="#"
                      className="group block rounded-md p-2 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white transition-colors group-hover:text-cyan-400">
                          {name}
                        </span>
                        <span className="mt-0.5 line-clamp font-bold-2 text-xs text-gray-400">{description}</span>
                      </div>
                    </Link>
                  ))}
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
      <Navbar className="relative z-50 mt-3 px-6 py-4 lg:px-12 lg:py-7" maxWidth="full">
        <NavbarContent className="mx-auto flex max-w-[1400px] w-full items-center justify-between text-white">
          <NavbarBrand>
            <Image
              src="/images/codelabs-logo.png"
              alt="codelabs-logo"
              width={isMobile ? 160 : 170}
              height={isMobile ? 45 : 57}
            />
          </NavbarBrand>

          {isMobile ? (
            <div className="relative" ref={menuRef}>
              <Button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-transparent text-white">
                ☰
              </Button>
              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-54 space-y-4 rounded-lg bg-black/85 p-2 shadow-lg backdrop-blur-md">
                  {content.navbar.menuItems.map((label) => (
                    <Link key={label} href="#" className="block text-white hover:text-cyan-400">
                      {label}
                    </Link>
                  ))}
                  <Button className="w-full rounded-lg bg-white font-bold text-black">{content.navbar.buttonText}</Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavbarContent className="hidden font-semibold gap-10 text-base lg:flex">
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

                {content.navbar.menuItems.filter((item) => item !== "Product").map((label) => (
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

              <NavbarContent className="flex text-sm">
                <NavbarItem className="relative rounded-lg">
                  <Button className="relative rounded-lg bg-white px-8 py-2 font-semibold text-black">
                    {content.navbar.buttonText}
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
