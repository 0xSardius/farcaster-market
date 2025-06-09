"use client";

import { useState } from "react";
import Image from "next/image";

interface FallbackAvatarProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
}

export default function FallbackAvatar({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackText,
}: FallbackAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Generate fallback text from alt if not provided
  const getFallbackText = () => {
    if (fallbackText) return fallbackText;
    return alt.charAt(0).toUpperCase();
  };

  if (!src || imageError) {
    return (
      <div
        className={`bg-primary border-2 border-black flex items-center justify-center text-white font-black ${className}`}
        style={{ width, height }}
      >
        {getFallbackText()}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
