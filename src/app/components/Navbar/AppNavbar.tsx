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
import ProductsDropdown from "./ProductsDropdown";
import ResourcesDropdown from "./ResourcesDropdown";
import MobileMenu from "./MobileMenu";

export default function AppNavbar() {
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
              width={isMobile ? 160 : 210}
              height={isMobile ? 45 : 67}
            />
          </NavbarBrand>

          {isMobile ? (
            <div className="relative" ref={menuRef}>
              <Button
                onClick={() => setIsMenuOpen(true)}
                className="bg-transparent p-2 text-white"
              >
                <Image
                  width={35}
                  height={35}
                  src="./svg/hamberger.svg"
                  alt="hamberger"
                  className="object-contain"
                />
              </Button>

              <MobileMenu
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                content={content}
              />
            </div>
          ) : (
            <>
              <NavbarContent className="hidden gap-10 text-base font-bold lg:flex">
                {/* Products dropdown trigger */}
                <div
                  ref={dropdownContainerRef}
                  className="relative rounded-lg"
                  onMouseEnter={() => handleMouseEnter("products")}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavbarItem className="relative">
                    <div className="relative z-10 flex cursor-pointer items-center gap-1 text-white/90 transition-colors">
                      Product
                    </div>
                  </NavbarItem>
                </div>

                {content.navbar.menuItems
                  .filter((item) => item !== "Product" && item !== "Resources")
                  .map((label) => (
                    <NavbarItem key={label}>
                      <Link href="#" className="text-white/90">
                        {label}
                      </Link>
                    </NavbarItem>
                  ))}

                {/* Resources dropdown trigger */}
                <div
                  ref={resourcesDropdownRef}
                  className="relative rounded-lg"
                  onMouseEnter={() => handleMouseEnter("resources")}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavbarItem className="relative">
                    <div className="flex cursor-pointer items-center gap-1 leading-tight text-white/90 transition-colors">
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

      {/* Dropdown overlays */}
      {/* Dropdown overlays */}
      {activeDropdown === "products" && (
        <ProductsDropdown
          dropdownData={content.dropdown.products}
          dropdownMenuRef={dropdownMenuRef}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      )}
      {activeDropdown === "resources" && (
        <ResourcesDropdown
          dropdownData={content.dropdown.resources}
          resourcesMenuRef={resourcesMenuRef}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  );
}
