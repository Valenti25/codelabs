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
const GradientBorderText = ({
  children,
  logo,
}: {
  children: React.ReactNode;
  logo?: string;
}) => (
  <div className="gradient relative inline-block rounded-lg backdrop-blur-md">
    <div className="flex items-center gap-1.5 p-2">
      {logo && (
        <Image
          src={logo}
          alt="Category logo"
          width={35}
          height={35}
          className="flex-shrink-0 object-contain"
        />
      )}
      {children}
    </div>
  </div>
);

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const resourcesMenuRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setIsMenuOpen(false);
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target as Node) &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.parentElement?.contains(e.target as Node) &&
        resourcesDropdownRef.current &&
        !resourcesDropdownRef.current.contains(e.target as Node) &&
        resourcesMenuRef.current &&
        !resourcesMenuRef.current.parentElement?.contains(e.target as Node)
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

  const renderProductsDropdownContent = () => (
    <div className="pointer-events-none absolute top-0 right-0 left-0 z-40 flex justify-center pt-20">
      <div className="pointer-events-auto relative mt-1 rounded-lg border-2 border-black p-[2px] backdrop-blur-md">
        <div
          ref={dropdownMenuRef}
          onMouseEnter={() => handleMouseEnter("products")}
          onMouseLeave={handleMouseLeave}
          className="relative h-full max-h-[80vh] w-[70vw] max-w-5xl rounded-[inherit] bg-black/20"
        >
          <div className="grid grid-cols-2 items-start gap-8 px-6 py-8 lg:gap-12">
            {Object.entries(dropdownData.products).map(([category, data]) => (
              <div key={category} className="space-y-4">
                <div className="border-b border-[#676767]/30 pb-3">
                  <h3 className="mb-2 text-lg font-bold text-white leading-tight">
                    {category}
                  </h3>
                  <GradientBorderText logo={data.logo}>
                    <h4 className="gradient-text-animated text-sm font-semibold leading-tight">
                      {data.description}
                    </h4>
                  </GradientBorderText>
                  <div className="text-[#676767] text-sm mt-1 leading-tight">
                    {category === "Build AI" ? "Custom AI development services" : "Ready-to-deploy AI solutions"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-2">
                  {data.subItems.map(({ name, description, logo }, idx) => (
                    <Link
                      key={idx}
                      href="#"
                      className="group block rounded-md p-2 transition-colors"
                    >
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1.5 mb-2">
                          {logo && (
                            <Image
                              src={logo}
                              alt={`${name} logo`}
                              width={25}
                              height={25}
                              className="flex-shrink-0 object-contain"
                            />
                          )}
                          <span className="text-xs font-semibold text-white transition-colors leading-tight">
                            {name}
                          </span>
                        </div>
                        <span className="mt-1 text-xs text-gray-400 leading-tight self-start ml-0">
                          {description}
                        </span>
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

  const renderResourcesDropdownContent = () => {
    return (
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-40 flex justify-center pt-20">
        <div className="pointer-events-auto relative">
          <div className="absolute mt-1 ml-20 flex items-center justify-center rounded-lg border border-black p-[2px] backdrop-blur-md">
            <div
              ref={resourcesMenuRef}
              onMouseEnter={() => handleMouseEnter("resources")}
              onMouseLeave={handleMouseLeave}
              className="relative w-48 rounded-[inherit] bg-black/20"
            >
              <div className="space-y-3 px-6 py-8">
                {dropdownData.resources.map(({ name, logo }, idx) => (
                  <Link
                    key={idx}
                    href="#"
                    className="block rounded-md p-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {logo && (
                        <Image
                          src={logo}
                          alt={`${name} logo`}
                          width={25}
                          height={25}
                          className="flex-shrink-0 object-contain"
                        />
                      )}
                      <span className="text-xs font-semibold text-white transition-colors leading-tight">
                        {name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <Navbar
        className="relative z-50 px-6 py-4 lg:px-12 lg:py-10"
        maxWidth="full"
      >
        <NavbarContent className="mx-auto flex w-full max-w-[1400px] items-center justify-between text-white">
          <NavbarBrand>
            <Image
              src="/images/codelabs-logo.png"
              alt="codelabs-logo"
              width={isMobile ? 160 : 180}
              height={isMobile ? 45 : 67}
            />
          </NavbarBrand>

          {isMobile ? (
            <div className="relative" ref={menuRef}>
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-transparent text-white"
              >
                ☰
              </Button>
              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-54 space-y-4 rounded-lg bg-black/85 p-2 shadow-lg backdrop-blur-md">
                  {content.navbar.menuItems.map((label) => (
                    <Link
                      key={label}
                      href="#"
                      className="block text-white leading-tight"
                    >
                      {label}
                    </Link>
                  ))}
                  <Button className="w-full rounded-lg bg-white font-bold text-black">
                    {content.navbar.buttonText}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavbarContent className="hidden gap-10 text-base font-semibold lg:flex">
                <div
                  ref={dropdownContainerRef}
                  className="relative rounded-lg"
                  onMouseEnter={() => handleMouseEnter("products")}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavbarItem className="relative">
                    <div className="relative z-10 flex cursor-pointer items-center gap-1 text-white transition-colors leading-tight">
                      Product
                    </div>
                  </NavbarItem>
                </div>

                {content.navbar.menuItems
                  .filter((item) => item !== "Product" && item !== "Resources")
                  .map((label) => (
                    <NavbarItem key={label}>
                      <Link
                        href="#"
                        className="text-white transition-colors leading-tight"
                      >
                        {label}
                      </Link>
                    </NavbarItem>
                  ))}

                <div
                  ref={resourcesDropdownRef}
                  className="relative rounded-lg"
                  onMouseEnter={() => handleMouseEnter("resources")}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavbarItem className="relative">
                    <div className="flex cursor-pointer items-center gap-1 text-white transition-colors leading-tight">
                      Resources
                    </div>
                  </NavbarItem>
                </div>
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

      {activeDropdown === "products" &&
        !isMobile &&
        renderProductsDropdownContent()}
      {activeDropdown === "resources" &&
        !isMobile &&
        renderResourcesDropdownContent()}
    </div>
  );
}