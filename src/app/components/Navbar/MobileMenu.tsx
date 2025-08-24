"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Link } from "@nextui-org/react";
import GradientBorderText from "./GradientBorderText";
import { containerVariants, itemVariants } from "./animations";
import React from "react";

// Type สำหรับ Product SubItem
type ProductSubItem = {
  name: string;
  description: string;
  logo?: string;
};

// Type สำหรับ Product Category
type ProductCategory = {
  description: string;
  logo?: string;
  subItems: ProductSubItem[];
};

// Type สำหรับ Dropdown Data
type DropdownData = {
  products: Record<string, ProductCategory>;
  resources: { name: string; logo?: string }[];
};

// Type สำหรับ Navbar Content
type NavbarContentData = {
  menuItems: string[];
};

// Props ของ MobileMenu
type MobileMenuProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  activeDropdown: string | null;
  setActiveDropdown: (dropdown: string | null) => void;
  content: {
    navbar: NavbarContentData;
    dropdown: DropdownData;
  };
};

export default function MobileMenu({
  isMenuOpen,
  setIsMenuOpen,
  activeDropdown,
  setActiveDropdown,
  content,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 z-50 border-black backdrop-blur-md"
          initial={{ clipPath: "circle(0% at calc(100% - 50px) 50px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 50px) 50px)" }}
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
              {/* Product Dropdown */}
              <motion.div key="product-menu" variants={itemVariants}>
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "products" ? null : "products"
                    )
                  }
                  className="flex w-full items-center justify-between text-left text-lg font-bold"
                >
                  <span>Product</span>
                  <span
                    className={`transform transition-transform duration-200 ${
                      activeDropdown === "products" ? "rotate-180" : ""
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
                              <h4 className="gradient-text-animated text-xs font-bold">
                                {data.description}
                              </h4>
                              <div className="text-xs mt-1 leading-tight text-[#676767]">
                                {category}
                              </div>
                            </div>
                          </GradientBorderText>

                          <div className="flex flex-col gap-7 pl-1">
                            {data.subItems.map((subItem, idx) => (
                              <Link
                                key={idx}
                                href="#"
                                onClick={() => setIsMenuOpen(false)}
                                className="group block rounded-md p-1"
                              >
                                <div className="flex items-center gap-2">
                                  {subItem.logo && (
                                    <Image
                                      src={subItem.logo}
                                      alt={`${subItem.name} logo`}
                                      width={20}
                                      height={20}
                                      className="flex-shrink-0 object-contain"
                                    />
                                  )}
                                  <div className="flex flex-col">
                                    <span className="text-[12px] font-semibold text-white">
                                      {subItem.name}
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </motion.div>

              {/* Menu Items */}
              {content.navbar.menuItems
                .filter((item) => item !== "Product" && item !== "Resources")
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

              {/* Resources */}
              <motion.div key="resources-menu" variants={itemVariants}>
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "resources" ? null : "resources"
                    )
                  }
                  className="flex w-full items-center justify-between text-left text-lg font-bold"
                >
                  <span>Resources</span>
                  <span
                    className={`transform transition-transform duration-200 ${
                      activeDropdown === "resources" ? "rotate-180" : ""
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
                    {content.dropdown.resources.map((item, idx) => (
                      <Link
                        key={idx}
                        href="#"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 text-sm text-white"
                      >
                        {item.logo && (
                          <Image
                            src={item.logo}
                            alt={`${item.name} logo`}
                            width={22}
                            height={22}
                            className="flex-shrink-0 object-contain"
                          />
                        )}
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
