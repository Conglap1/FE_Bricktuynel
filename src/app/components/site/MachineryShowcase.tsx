import { useState } from "react";
import { Cpu, CheckCircle2 } from "lucide-react";
import { motion, Stagger, staggerItem } from "../../lib/motion";
import { SectionHeading } from "./SectionHeading";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { IMAGES } from "../../lib/data";

export interface MachineryItem {
  id: string;
  category: "all" | "forming" | "firing" | "automation";
  name: string;
  tag: string;
  desc: string;
  image: string;
  specs: string[];
}

export const MACHINERY_LIST: MachineryItem[] = [
  {
    id: "machinery-01",
    category: "forming",
    name: "Máy Xúc & Hệ Thống Tuyển Chọn Đất Sét",
    tag: "Xử lý nguyên liệu",
    desc: "Thiết bị xúc đào và băng tải phân loại tự động loại bỏ tạp chất, lọc đất sét mịn đồng đều trước khi đưa vào kho ủ.",
    image: IMAGES.procStep01,
    specs: ["Lọc tạp chất 100%", "Băng tải tự động", "Độ mịn tiêu chuẩn"],
  },
  {
    id: "machinery-02",
    category: "forming",
    name: "Hệ Thống Kho Sấy Ủ Đất Sét Tự Động",
    tag: "Kho ủ vi khí hậu",
    desc: "Kho ủ nguyên liệu sức chứa lớn với hệ thống kiểm soát ẩm vi khí hậu giúp ổn định độ dẻo và tính liên kết của đất.",
    image: IMAGES.procStep02,
    specs: ["Ổn định độ ẩm", "Tăng độ liên kết", "Sức chứa lớn"],
  },
  {
    id: "machinery-03",
    category: "forming",
    name: "Máy Nhào Trộn Công Nghiệp 2 Trảo",
    tag: "Máy nhào trộn",
    desc: "Cối nhào trộn công suất lớn đảo đều đất sét cùng phụ gia gia cường cơ học, tối ưu hóa độ dẻo và độ bền khối mộc.",
    image: IMAGES.procStep03,
    specs: ["Công suất 50t/h", "Nhào dẻo đồng đều", "Đảo 2 trục song song"],
  },
  {
    id: "machinery-04",
    category: "forming",
    name: "Máy Ép Đùn Chân Không Công Nghệ Cao",
    tag: "Ép đùn chân không",
    desc: "Máy ép đùn chân không áp suất lớn hút sạch bọt khí, nén khối gạch mộc đanh chắc với khả năng chịu nén vượt trội.",
    image: IMAGES.procStep04,
    specs: ["Hút chân không 99%", "Nén lực mật độ cao", "Định hình chuẩn xác"],
  },
  {
    id: "machinery-05",
    category: "forming",
    name: "Máy Cắt Gạch Tự Động Lập Trình PLC",
    tag: "Máy cắt gạch",
    desc: "Hệ thống cắt gạch dây thép tự động điều khiển PLC cắt nhanh chuẩn xác từng viên gạch theo đúng thông số kỹ thuật.",
    image: IMAGES.procStep05,
    specs: ["Cắt tự động tốc độ cao", "Chính xác ±0.5mm", "Không vỡ mép gạch"],
  },
  {
    id: "machinery-06",
    category: "firing",
    name: "Hệ Thống Hầm Sấy Tự Động Tuần Hoàn Nhiệt",
    tag: "Hầm sấy công nghệ",
    desc: "Hầm sấy tận thu nhiệt dư từ lò nung giúp rút độ ẩm gạch mộc an toàn, phòng ngừa hiện tượng nứt nẻ hay cong vênh.",
    image: IMAGES.procStep06,
    specs: ["Rút ẩm an toàn", "Tận dụng nhiệt dư", "Tự động hóa 100%"],
  },
  {
    id: "machinery-07",
    category: "firing",
    name: "Hệ Thống Lò Nung Tuynel Nhiệt Độ Cao (1.050°C)",
    tag: "Lò nung Tuynel",
    desc: "Dây chuyền lò nung Tuynel liên tục tự động hóa kiểm soát nhiệt độ nghiêm ngặt, giúp gạch chín đều và màu đỏ tự nhiên.",
    image: IMAGES.procStep07,
    specs: ["Nhiệt độ 1.000–1.050°C", "Nung chín đanh chắc", "Vận hành liên tục 24/7"],
  },
  {
    id: "machinery-08",
    category: "firing",
    name: "Hệ Thống Hạ Nhiệt & Làm Nguội Tiêu Chuẩn",
    tag: "Làm nguội kiểm soát",
    desc: "Chu trình hạ nhiệt tự động làm mát gạch gốm sau nung, giữ màu tươi sáng và tối ưu hóa độ bền cơ lý lâu dài.",
    image: IMAGES.procStep08,
    specs: ["Chống sốc nhiệt", "Giữ màu tự nhiên", "Ổn định cấu trúc gạch"],
  },
  {
    id: "machinery-09",
    category: "automation",
    name: "Cánh Tay Robot Bốc Xếp & Đóng Đai Pallet",
    tag: "Robot bốc xếp",
    desc: "Cánh tay Robot công nghiệp lập trình xếp gạch tự động lên Pallet và quấn màng co bảo vệ cẩn thận.",
    image: IMAGES.procStep09,
    specs: ["Robot ABB tự động", "Bốc xếp chính xác", "Đóng Pallet quấn màng co"],
  },
  {
    id: "machinery-10",
    category: "automation",
    name: "Dây Chuyền Sản Xuất Tự Động Hóa Đồng Bộ",
    tag: "Dây chuyền toàn cảnh",
    desc: "Hệ thống dây chuyền tự động hóa toàn diện từ nguyên liệu đến thành phẩm, nâng cao chất lượng và năng suất sản xuất.",
    image: "/images/day_chuyen_san_xuat.png",
    specs: ["Tự động hóa toàn diện", "Công suất lớn", "Đạt chuẩn QCVN 16:2023"],
  },
  {
    id: "machinery-11",
    category: "automation",
    name: "Cánh Tay Robot Công Nghiệp Tự Động Xếp Gạch",
    tag: "Cánh tay Robot",
    desc: "Cánh tay robot hiện đại thực hiện khâu bốc dỡ và sắp xếp gạch tự động với độ chính xác tuyệt đối.",
    image: "/images/cach_tay_robot.jpg",
    specs: ["Tự động hóa cao", "Loại bỏ lỗi thủ công", "Tăng năng suất 300%"],
  },
  {
    id: "machinery-12",
    category: "automation",
    name: "Hệ Thống Điện Năng Lượng Mặt Trời Áp Mái",
    tag: "Năng lượng xanh",
    desc: "Hệ thống điện mặt trời áp mái công suất lớn cung cấp nguồn năng lượng sạch vận hành các thiết bị máy móc nhà máy.",
    image: "/images/nang_luong_mat_troi_1.jpg",
    specs: ["Năng lượng tái tạo", "Giảm phát thải Carbon", "Vận hành xanh bền vững"],
  },
];

export function MachineryShowcase() {
  const [filter, setFilter] = useState<"all" | "forming" | "firing" | "automation">("all");

  const filtered = filter === "all"
    ? MACHINERY_LIST
    : MACHINERY_LIST.filter((m) => m.category === filter);

  return (
    <section id="machinery-showcase" className="relative overflow-hidden bg-[#FAF5EF] py-16 sm:py-24 border-t border-[#810C00]/10">
      {/* Background Decor */}
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[#810C00]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-[#C76B86]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6">
        <SectionHeading
          eyebrow="Hình ảnh máy móc & Trang thiết bị"
          title={
            <>
              Hệ Thống Máy Móc Thiết Bị
              <br />
              <span className="text-[#810C00]">Hiện Đại Tại Nhà Máy Thuận Lợi</span>
            </>
          }
          desc="Danh mục hình ảnh thực tế các trang thiết bị, máy móc công nghệ cao vận hành đồng bộ trong dây chuyền sản xuất gạch Tuynel chất lượng cao."
          align="center"
        />

        {/* Filter Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { id: "all", label: "Tất cả máy móc" },
            { id: "forming", label: "Máy móc Tạo hình" },
            { id: "firing", label: "Hệ thống Sấy & Nung" },
            { id: "automation", label: "Robot & Công nghệ xanh" },
          ].map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "bg-[#810C00] text-white shadow-md shadow-[#810C00]/20 scale-105"
                    : "bg-white text-[#560213]/80 border border-[#810C00]/15 hover:border-[#810C00]/40 hover:bg-[#FAF5EF]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Grid of Machinery Items */}
        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />

                {/* Top Badge Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#810C00] px-3 py-1 text-xs font-bold text-white shadow-md">
                    <Cpu className="h-3.5 w-3.5" />
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3
                    className="text-lg font-bold text-[#3B020D] leading-snug group-hover:text-[#810C00] transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.name}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-[#560213]/80 font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Technical Highlights / Specs */}
                <div className="mt-4 pt-4 border-t border-[#810C00]/10">
                  <div className="flex flex-wrap gap-2">
                    {item.specs.map((spec, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#810C00] bg-[#810C00]/5 px-2.5 py-1 rounded-md border border-[#810C00]/10"
                      >
                        <CheckCircle2 className="h-3 w-3 text-[#810C00]" />
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
