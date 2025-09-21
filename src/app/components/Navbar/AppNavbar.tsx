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

/* ================= Framed CTA (เหมือนกรอบการ์ด) ================= */
function FramedCTA({
  children,
  className = "",
  size = "md",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
  onClick?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const sizing =
    size === "sm"
      ? "px-5 py-2 text-xs"
      : "px-8 py-2 text-sm md:text-base";

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      className="group relative inline-flex overflow-hidden rounded-[14px] p-[1px] card-outer-bg card-outer-shadow"
    >
      {/* แสงวิ่งตามเมาส์ */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.18), transparent 45%)`,
        }}
      />
      <Button
        onClick={onClick}
        radius="lg"
        className={`relative z-10 rounded-[13px] card-inner-bg card-inner-blur font-semibold text-white ${sizing} ${className}`}
      >
        {children}
      </Button>
    </div>
  );
}
/* ============================================================== */

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
          base: "relative z-50 backdrop-blur-none py-4 px-1 md:mb-0 mb-5 md:px-12 lg:py-10",
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

        {/* ขวา: CTA */}
        <NavbarContent justify="end" className="text-sm">
          {isMobile ? (
            <div className="relative mx-1 flex items-center gap-2" ref={menuRef}>
              {/* CTA แบบมีกรอบ (ขนาดเล็ก) */}
              <FramedCTA className="h-8 w-10 px-16 py-2 text-xs">
                {content.navbar.buttonText}
              </FramedCTA>

              {/* เมนูมือถือ */}
              <Button
                onClick={() => {
                  setActiveDropdown(null);
                  setIsMenuOpen(true);
                }}
                isIconOnly
                className="bg-transparent p-2 mr-1 text-white"
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
            <NavbarItem className="relative">
              {/* CTA แบบมีกรอบ (เดสก์ท็อป) */}
              <FramedCTA>{content.navbar.buttonText}</FramedCTA>
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
