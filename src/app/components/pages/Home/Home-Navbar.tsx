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
import { motion, AnimatePresence } from "framer-motion";
import { Variants } from "framer-motion";

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

  // 🔥 STEP 1: สร้าง Variants สำหรับ Container และ Item
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        // หน่วงเวลาให้ item เริ่มทำงานหลังจาก animation ของ container เสร็จ
        delayChildren: 0.5,
        // ให้ item แต่ละชิ้นมี animation ห่างกัน 0.1 วินาที
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ease: "easeOut", // ✅ Framer Motion รองรับ preset easing
        duration: 0.4,
      },
    },
  };

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
                  <h3 className="mb-2 text-lg leading-tight font-bold text-white">
                    {category}
                  </h3>
                  <GradientBorderText logo={data.logo}>
                    <div className="ml-2 flex flex-col">
                      <h4 className="gradient-text-animated flex-col text-sm leading-tight font-semibold">
                        {data.description}
                      </h4>
                      <div className="text-sm leading-tight text-[#676767]">
                        {category === "Build AI"
                          ? "Custom AI development services"
                          : "Ready-to-deploy AI solutions"}
                      </div>
                    </div>
                  </GradientBorderText>
                </div>
                <div className="grid grid-cols-2 gap-y-2">
                  {data.subItems.map(({ name, description, logo }, idx) => (
                    <Link
                      key={idx}
                      href="#"
                      className="group block rounded-md p-2 transition-colors"
                    >
                      <div className="flex flex-col items-start">
                        <div className="mb-2 flex items-center gap-1.5">
                          {logo && (
                            <Image
                              src={logo}
                              alt={`${name} logo`}
                              width={25}
                              height={25}
                              className="flex-shrink-0 object-contain"
                            />
                          )}
                          <span className="text-xs leading-tight font-semibold text-white transition-colors">
                            {name}
                          </span>
                        </div>
                        <span className="mt-1 ml-0 self-start text-xs leading-tight text-gray-400">
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
                      <span className="text-xs leading-tight font-semibold text-white transition-colors">
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

              {/* ===== Mobile Menu with Clip-Path Animation ===== */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    className="fixed inset-0 z-50 bg-black"
                    initial={{
                      clipPath: "circle(0% at calc(100% - 50px) 50px)",
                    }}
                    animate={{
                      clipPath: "circle(150% at calc(100% - 50px) 50px)",
                    }}
                    exit={{ clipPath: "circle(0% at calc(100% - 50px) 50px)" }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  >
                    <div className="relative flex h-full w-full flex-col p-6">
                      {/* ปุ่มปิด */}
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setActiveDropdown(null);
                        }}
                        className="self-end p-1 text-white"
                      >
                        <Image
                          width={20}
                          height={20}
                          src="./svg/x-symbol.svg"
                          alt="close icon"
                          className="object-contain"
                        />
                      </button>

                      <motion.div
                        className="no-scrollbar mt-10 flex flex-col gap-6 overflow-y-auto text-white"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {/* 🔥 ИСПРАВЛЕНО: Добавлен уникальный ключ */}
                        <motion.div key="product-menu" variants={itemVariants}>
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === "products"
                                  ? null
                                  : "products",
                              )
                            }
                            className="flex w-full items-center justify-between text-left text-lg font-bold"
                          >
                            <span>Product</span>
                            <span
                              className={`transform transition-transform duration-200 ${
                                activeDropdown === "products"
                                  ? "rotate-180"
                                  : ""
                              }`}
                            >
                              <Image
                                width={20}
                                height={20}
                                src="./svg/dropdown-arrow.svg"
                                alt="dropdown-arrow"
                                className="object-contain"
                              />
                            </span>
                          </button>

                          {activeDropdown === "products" && (
                            <div className="mt-4 grid grid-cols-2 gap-x-3 pl-2">
                              {Object.entries(content.dropdown.products).map(
                                ([category, data]) => (
                                  <div key={category} className="space-y-3">
                                    <GradientBorderText logo={data.logo}>
                                      <div className="ml-1 flex flex-col">
                                        <h4 className="gradient-text-animated text-xs leading-tight font-semibold">
                                          {data.description}
                                        </h4>
                                        <div className="text-xs leading-tight text-[#676767]">
                                          {category}
                                        </div>
                                      </div>
                                    </GradientBorderText>

                                    <div className="flex flex-col gap-7 pl-1">
                                      {data.subItems.map(
                                        ({ name, logo }, idx) => (
                                          <Link
                                            key={idx}
                                            href="#"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="group block rounded-md p-1"
                                          >
                                            <div className="flex items-center gap-2">
                                              {logo && (
                                                <Image
                                                  src={logo}
                                                  alt={`${name} logo`}
                                                  width={20}
                                                  height={20}
                                                  className="flex-shrink-0 object-contain"
                                                />
                                              )}
                                              <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-white">
                                                  {name}
                                                </span>
                                              </div>
                                            </div>
                                          </Link>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        </motion.div>

                        {/* Другие пункты меню (эта часть уже была правильной) */}
                        {content.navbar.menuItems
                          .filter(
                            (item) =>
                              item !== "Product" && item !== "Resources",
                          )
                          .map((label) => (
                            <motion.div key={label} variants={itemVariants}>
                              <Link
                                href="#"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-lg font-bold"
                              >
                                {label}
                              </Link>
                            </motion.div>
                          ))}

                        {/* 🔥 ИСПРАВЛЕНО: Добавлен уникальный ключ */}
                        <motion.div
                          key="resources-menu"
                          variants={itemVariants}
                        >
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === "resources"
                                  ? null
                                  : "resources",
                              )
                            }
                            className="flex w-full items-center justify-between text-left text-lg font-bold"
                          >
                            <span>Resources</span>
                            <span
                              className={`transform transition-transform duration-200 ${
                                activeDropdown === "resources"
                                  ? "rotate-180"
                                  : ""
                              }`}
                            >
                              <Image
                                width={20}
                                height={20}
                                src="./svg/dropdown-arrow.svg"
                                alt="dropdown-arrow"
                                className="object-contain"
                              />
                            </span>
                          </button>

                          {activeDropdown === "resources" && (
                            <div className="mt-3 ml-3 flex flex-col gap-2">
                              {content.dropdown.resources.map(
                                ({ name, logo }, idx) => (
                                  <Link
                                    key={idx}
                                    href="#"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 text-sm text-white"
                                  >
                                    {logo && (
                                      <Image
                                        src={logo}
                                        alt={`${name} logo`}
                                        width={22}
                                        height={22}
                                        className="flex-shrink-0 object-contain"
                                      />
                                    )}
                                    {name}
                                  </Link>
                                ),
                              )}
                            </div>
                          )}
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                    <div className="relative z-10 flex cursor-pointer items-center gap-1 leading-tight text-white transition-colors">
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
                        className="leading-tight text-white transition-colors"
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
                    <div className="flex cursor-pointer items-center gap-1 leading-tight text-white transition-colors">
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
        !isMenuOpen &&
        renderProductsDropdownContent()}
      {activeDropdown === "resources" &&
        !isMobile &&
        !isMenuOpen &&
        renderResourcesDropdownContent()}
    </div>
  );
}
