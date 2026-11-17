"use client";

import React from "react";
import Image from "next/image";

interface GtLogoProps {
  className?: string;
  variant?: "light" | "dark" | "full" | "iconOnly";
  showSlogan?: boolean;
}

export function GtLogo({ className = "" }: GtLogoProps) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* Official 3D Gold & Azure GT Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/images/gt_logo.webp"
          alt="GT Logistics Logo"
          width={240}
          height={144}
          className="h-11 sm:h-12 w-auto object-contain drop-shadow-sm transition-opacity hover:opacity-90"
          priority
        />
      </div>
    </div>
  );
}
