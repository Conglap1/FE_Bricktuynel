import { motion, Stagger, staggerItem } from "../../lib/motion";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { IMAGES } from "../../lib/data";

export interface MachineryItem {
  id: string;
  name: string;
  desc: string;
  image: string;
}

/* 6 hình ảnh MÁY MÓC / THIẾT BỊ thực tế - 100% không trùng lặp */
export const MACHINERY_LIST: MachineryItem[] = [
  {
    id: "machinery-01",
    name: "Máy Nhào Trộn 2 Trục",
    desc: "Cối nhào trộn công nghiệp công suất lớn nhào dẻo phối trộn phụ gia.",
    image: IMAGES.procStep03,
  },
  {
    id: "machinery-02",
    name: "Máy Cắt Gạch Tự Động PLC",
    desc: "Hệ thống máy cắt gạch lập trình PLC cắt chính xác từng viên gạch.",
    image: IMAGES.procStep05,
  },
  {
    id: "machinery-03",
    name: "Hệ Thống Lò Nung Tuynel (1.050°C)",
    desc: "Lò nung Tuynel liên tục nhiệt độ cao giúp gạch chín đều đanh chắc.",
    image: IMAGES.procStep07,
  },
  {
    id: "machinery-04",
    name: "Cánh Tay Robot Bốc Xếp",
    desc: "Cánh tay robot công nghiệp tự động bốc xếp gạch đóng Pallet.",
    image: "/images/cach_tay_robot.jpg",
  },
  {
    id: "machinery-05",
    name: "Máy Ép Đùn & Dây Chuyền Sản Xuất",
    desc: "Máy ép đùn công nghệ cao hút chân không và dây chuyền tự động hóa đồng bộ.",
    image: "/images/day_chuyen_san_xuat.png",
  },
  {
    id: "machinery-06",
    name: "Hệ Thống Điện Mặt Trời Áp Mái",
    desc: "Hệ thống năng lượng mặt trời áp mái cung cấp nguồn điện sạch vận hành nhà máy.",
    image: "/images/nang_luong_mat_troi_1.jpg",
  },
];

export function MachineryShowcase() {
  return (
    <section id="machinery-showcase" className="relative overflow-hidden bg-[#FAF5EF] py-16 sm:py-24 border-t border-[#810C00]/10">
      {/* Background Decor */}
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[#810C00]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-[#C76B86]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6">
        {/* Section Heading - Title Only */}
        <div className="text-center">
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#810C00]">
            Trang bị & Thiết bị
          </span>
          <h2
            className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B020D]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Hệ Thống Máy Móc Thiết Bị Hiện Đại
          </h2>
        </div>

        {/* Clean Grid of 6 Unique Machinery Cards */}
        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MACHINERY_LIST.map((item) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#810C00]/15 bg-white shadow-lg shadow-[#810C00]/5 transition-all duration-300 hover:border-[#810C00]/40 hover:shadow-2xl hover:shadow-[#810C00]/15"
            >
              {/* Image Container */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Card Body - Minimalist & Clean */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3
                    className="text-lg font-bold text-[#3B020D] leading-snug group-hover:text-[#810C00] transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#560213]/80 font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
