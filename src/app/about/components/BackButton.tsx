"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackButton() {
  return (
    <Link
      href="/about"
      className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors mb-8"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Назад к обзору</span>
    </Link>
  );
}
