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

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <Navbar className="relative z-50 px-6 py-4 lg:px-12 lg:py-6" maxWidth="full">
      <NavbarContent className="flex w-full items-center justify-between text-white max-w-[1400px] mx-auto">
        <NavbarBrand>
          <Image
            src="/IconLogo/codelabs-logo.png"
            alt="codelabs-logo"
            width={isMobile ? 160 : 200}
            height={isMobile ? 45 : 57}
          />
        </NavbarBrand>

        {isMobile ? (
          <div>
            {/* Toggle Button */}
            <Button
              isIconOnly
              aria-label="Open menu"
              className="relative z-50 bg-transparent text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </Button>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="fixed inset-0 z-40 flex h-screen w-screen flex-col items-center justify-center bg-black"
              >
                <div
                  className="flex flex-col items-center gap-y-8 text-center"
                  role="menu"
                >
                  <NavbarItem>
                    <Link
                      href="#"
                      className="block w-full px-4 py-3 text-3xl text-white hover:text-gray-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Product
                    </Link>
                  </NavbarItem>
                  <NavbarItem>
                    <Link
                      href="#"
                      className="block w-full px-4 py-3 text-3xl text-white hover:text-gray-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Case Studies
                    </Link>
                  </NavbarItem>
                  <NavbarItem>
                    <Link
                      href="#"
                      className="block w-full px-4 py-3 text-3xl text-white hover:text-gray-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                  </NavbarItem>
                  <NavbarItem>
                    <Link
                      href="#"
                      className="flex items-center justify-center gap-2 px-4 py-3 text-3xl text-white hover:text-gray-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Resources
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Link>
                  </NavbarItem>

                  <div className="my-4 w-48 border-t border-gray-700"></div>

                  <NavbarItem className="w-full px-8">
                    <Button
                      className="w-full rounded-lg bg-white py-6 text-xl font-bold text-black transition-colors hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Book a Demo
                    </Button>
                  </NavbarItem>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Menu */}
            <NavbarContent className="hidden gap-10 text-xl lg:flex">
              <NavbarItem>
                <Link
                  href="#"
                  className="text-white"
                >
                  Product
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  href="#"
                  className="text-white"
                >
                  Case Studies
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  href="#"
                  className="text-white"
                >
                  Pricing
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  href="#"
                  className="flex items-center gap-1 text-white"
                >
                  Resources
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Link>
              </NavbarItem>
            </NavbarContent>
            <NavbarContent className="hidden lg:flex">
              <NavbarItem>
                <Button className="rounded-lg bg-white px-6 py-2 text-black">
                  Book a Demo
                </Button>
              </NavbarItem>
            </NavbarContent>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}