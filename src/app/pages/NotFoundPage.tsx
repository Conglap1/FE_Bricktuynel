import { Link } from "react-router";
import { Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-white px-6 pt-24">
      <div className="text-center">
        <div className="text-primary" style={{ fontFamily: "var(--font-display)", fontSize: "6rem", fontWeight: 900, lineHeight: 1 }}>
          404
        </div>
        <h1 className="mt-4 text-foreground" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
          Không tìm thấy trang
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] text-muted-foreground">
          Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
        >
          <Home className="h-4 w-4" /> Về trang chủ
        </Link>
      </div>
    </section>
  );
}
