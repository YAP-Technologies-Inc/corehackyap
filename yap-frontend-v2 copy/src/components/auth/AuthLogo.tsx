"use client";
import yapLogo from "@/assets/YAP.webp";
import Image from "next/image";
export default function AuthLogo() {
  return (
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">Y</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">YAP</h1>
    </div>
  );
}
