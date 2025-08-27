"use client";

import Image from "next/image";
import Link from "next/link";
import { Divider } from "@nextui-org/react";
import SplashCursor from "@/app/components/ui/SplashCursor";

type FooterLink = { label: string; href: string; external?: boolean };

const products: FooterLink[] = [
  { label: "Codelabs Data Platform", href: "/products/data-platform" },
  { label: "Codelabs Platform-AI", href: "/products/platform-ai" },
];

const caseStudies: FooterLink[] = [
  { label: "Partner", href: "/partners" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
];

const pricing: FooterLink[] = [
  { label: "Monthly", href: "/pricing#monthly" },
  { label: "Yearly", href: "/pricing#yearly" },
];

const resources: FooterLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const legal: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookies Settings", href: "/cookies" },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden text-white/90">
      <SplashCursor />

      <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="block">
              <Image
                src="/images/codelabs-logo1.png"
                alt="codelabs ai"
                width={150}
                height={30}
                className="h-auto w-[160px]"
              />
            </Link>

            <p className="mt-2 text-xs leading-relaxed font-semibold text-[#676767]">
              Codelabs AI empowers businesses to turn raw data into intelligent
              insights — making decisions faster, smarter, and easier to act on.
            </p>

            {/* Social images */}
          </div>

          {/* Link columns */}
          <div className="lg:-mr-14 ml-auto grid lg:max-w-xl grid-cols-4 text-sm lg:text-xs font-semibold lg:col-span-8">
            <div className="lg:-ml-12 lg:w-[200px] ml-3">
              <FooterColumn title="Products" links={products} />
            </div>
            <FooterColumn title="Case Studies" links={caseStudies} />
            <FooterColumn title="Pricing" links={pricing} />
            <FooterColumn title="Resources" links={resources} />
          </div>
        </div>

      <Divider className="my-10 opacity-20"/>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-4 text-sm font-semibold text-[#676767] md:flex-row">
          <p>© 2025 codelabs ai. All rights reserved.</p>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legal.map((l) => (
              <FooterLegalLink key={l.label} {...l} />
            ))}
          </nav>
        </div>
        
        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#676767] font-semibold">Powered by</span>
            <Link
              href="/"
              aria-label="Your Company"
              className="inline-flex items-center"
            >
              <Image
                src="/svg/logo-codelab-text-row7.svg"
                alt="Icon Company"
                width={88}
                height={20}
                className="h-5 w-auto hover:opacity-100"
              />
            </Link>
          </div>
          
          <div className="flex gap-5">
            <SocialIcon
              href="/"
              label="Discord"
              src="/images/discord.png"
              hoverSrc="/images/discord-hover.png"
            />
            <SocialIcon
              href="/"
              label="Facebook"
              src="/images/facebook.png"
              hoverSrc="/images/facebook-hover.png"
            />
            <SocialIcon
              href="/"
              label="Instagram"
              src="/images/instagram.png"
              hoverSrc="/images/instagram-hover.png"
            />
            <SocialIcon
              href="/"
              label="LINE"
              src="/images/line.png"
              hoverSrc="/images/line-hover.png"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-white/80">{title}</h4>
      <ul>
        {links.map((item) => (
          <li key={item.label}>
            <FooterNavLink {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterNavLink({ label, href, external }: FooterLink) {
  const base = "text-[13px] text-[#676767]";
  if (external) {
    return (
      <a href={href} className={base}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={base}>
      {label}
    </Link>
  );
}

function FooterLegalLink({ label, href, external }: FooterLink) {
  const base = "text-[#676767]";
  if (external) {
    return (
      <a href={href} className={base}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={base}>
      {label}
    </Link>
  );
}

function SocialIcon({
  href,
  label,
  src,
  hoverSrc,
}: {
  href: string;
  label: string;
  src: string;
  hoverSrc: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group relative flex h-5 w-5 items-center justify-center transition"
    >
      <Image
        src={src}
        alt={label}
        width={20}
        height={20}
        className="h-5 w-5 object-contain block group-hover:hidden"
      />
      <Image
        src={hoverSrc}
        alt={`${label} hover`}
        width={20}
        height={20}
        className="h-5 w-5 object-contain hidden group-hover:block"
      />
    </Link>
  );
}