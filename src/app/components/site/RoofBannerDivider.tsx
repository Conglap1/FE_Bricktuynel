import React from "react";

interface RoofBannerDividerProps {
  className?: string;
  imageSrc?: string;
}

export function RoofBannerDivider({
  className = "",
  imageSrc = "/images/logo/icon.png",
}: RoofBannerDividerProps) {
  return (
    <div className={`relative w-full overflow-hidden flex items-center justify-center py-2 z-20 ${className}`}>
      <div className="w-full max-w-[1240px] px-6 flex justify-center items-center">
        <img
          src={imageSrc}
          alt="Đường phân cách chóp mái nhà thương hiệu"
          className="w-full max-w-[900px] h-auto max-h-12 md:max-h-16 object-contain drop-shadow-md transition-transform duration-300 hover:scale-[1.01]"
        />
      </div>
    </div>
  );
}
