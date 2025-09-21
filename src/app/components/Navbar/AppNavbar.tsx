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
      ) {
        setActiveDropdown(null);
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMobile) setActiveDropdown(null);
    if (!isMobile) setIsMenuOpen(false);
  }, [isMobile]);

  const handleMouseEnter = (dropdown: string) => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    if (!isMobile) setActiveDropdown(dropdown);
  };
  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  return (
    <div className="relative no-focus-ring">
      <Navbar
        maxWidth="full"
        classNames={{
          base: "relative z-50 backdrop-blur-none py-4 md:mb-0 mb-5 md:px-12 lg:py-10",
          wrapper: "!px-0 sm:!px-2 md:!px-4 lg:!px-6",
        }}
      >
        {/* ซ้าย: โลโก้ */}
        <NavbarContent justify="start" className="text-white">
          <NavbarBrand>
            <Image
              src="/images/codelabs-logo.png"
              alt="codelabs-logo"
              width={isMobile ? 160 : 210}
              height={isMobile ? 45 : 67}
            />
          </NavbarBrand>
        </NavbarContent>

        {/* กลาง: เมนูเดสก์ท็อป */}
        {!isMobile && (
          <NavbarContent
            justify="start"
            className="hidden lg:flex gap-10 text-base font-bold text-white"
          >
            {/* Products trigger */}
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

            {/* Resources trigger */}
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
        )}

        {/* ขวา: CTA (เดสก์ท็อป) หรือ เมนูมือถือ + CTA (มือถือ) */}
        <NavbarContent justify="end" className="text-sm">
          {isMobile ? (
            // ⬇️ ใส่ CTA ขนาดเล็กไว้ใน navbar มือถือ + ไอคอนแฮมเบอร์เกอร์
            <div className="relative flex items-center gap-2 mx-1" ref={menuRef}>
              <Button
                size="sm"
                radius="lg"
                className="h-5 min-w-0 rounded-sm bg-white px-5 py-3 text-xs font-semibold mr-1 text-black shadow"
              >
                {content.navbar.buttonText}
              </Button>

              <Button
                onClick={() => {
                  setActiveDropdown(null);
                  setIsMenuOpen(true);
                }}
                isIconOnly
                className="bg-transparent p-2 text-white"
              >
                <Image
                  width={28}
                  height={28}
                  src="./svg/hamberger.svg"
                  alt="Open menu"
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
            <NavbarItem className="relative rounded-lg">
              <Button className="relative rounded-lg bg-white px-8 py-2 font-semibold text-black">
                {content.navbar.buttonText}
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>

      {/* dropdown overlays เฉพาะเดสก์ท็อป */}
      {!isMobile && !isMenuOpen && activeDropdown === "products" && (
        <ProductsDropdown
          dropdownData={content.dropdown.products}
          dropdownMenuRef={dropdownMenuRef}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      )}

      {!isMobile && !isMenuOpen && activeDropdown === "resources" && (
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
