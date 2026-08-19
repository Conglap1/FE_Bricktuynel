import { useState, useRef, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, KeyRound, ShieldAlert, CheckCircle2, X } from "lucide-react";
import { API_BASE_URL } from "../lib/store";

export const ADMIN_AUTH_KEY = "tsb_admin_auth";

export function AdminLogin() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 5-second long press state (stealth / silent)
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggeredRef = useRef<boolean>(false);

  // Change password modal state
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [changePassUsername, setChangePassUsername] = useState("admin");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassLoading, setChangePassLoading] = useState(false);
  const [changePassError, setChangePassError] = useState("");
  const [changePassSuccess, setChangePassSuccess] = useState("");

  const startHold = () => {
    isLongPressTriggeredRef.current = false;

    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);

    holdTimeoutRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true;

      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(200);
      }

      // Open Change Password Modal
      setChangePassError("");
      setChangePassSuccess("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassModal(true);
    }, 5000);
  };

  const cancelHold = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // If long press was triggered, don't execute normal submit
    if (isLongPressTriggeredRef.current) {
      isLongPressTriggeredRef.current = false;
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!username || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          sessionStorage.setItem(ADMIN_AUTH_KEY, data.token || "1");
          navigate("/admin", { replace: true });
          return;
        } else {
          setErrorMsg(data.message || "Đăng nhập thất bại");
        }
      } else {
        const data = await res.json().catch(() => null);
        setErrorMsg(data?.message || "Tài khoản hoặc mật khẩu không chính xác");
      }
    } catch (err) {
      console.error("Backend login error:", err);
      setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng kiểm tra dịch vụ Backend!");
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setChangePassError("");
    setChangePassSuccess("");

    if (!changePassUsername || !oldPassword || !newPassword) {
      setChangePassError("Vui lòng điền đầy đủ các thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePassError("Mật khẩu mới và xác nhận mật khẩu không khớp nhau");
      return;
    }

    if (newPassword.length < 6) {
      setChangePassError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setChangePassLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: changePassUsername,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setChangePassSuccess(data.message || "Đổi mật khẩu thành công!");
        setTimeout(() => {
          setShowChangePassModal(false);
          setSuccessMsg("Đổi mật khẩu thành công! Vui lòng nhập mật khẩu mới để đăng nhập.");
        }, 1500);
      } else {
        setChangePassError(data?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin!");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setChangePassError("Không thể kết nối tới Server để đổi mật khẩu!");
    } finally {
      setChangePassLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#560213] px-4 py-8">
      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 p-2 shadow-inner">
            <img
              src="/images/logo/icon.png"
              alt="Thuận Lợi Logo"
              className="h-11 w-11 object-contain"
            />
          </div>
          <div className="text-center">
            <div className="text-[20px] font-black text-white">
              Thuận Lợi Admin
            </div>
            <div className="mt-1 text-[13px] text-white/70">Hệ thống quản trị nội dung</div>
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/15 bg-white/10 p-8 backdrop-blur-sm shadow-2xl"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-white/70">
                Tài khoản
              </label>
              <input
                type="text"
                name="username"
                defaultValue={changePassUsername}
                placeholder="Nhập tài khoản admin"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-[15px] text-white outline-none placeholder:text-white/40 transition-colors focus:border-white/50 focus:bg-white/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-white/70">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-11 text-[15px] text-white outline-none placeholder:text-white/40 transition-colors focus:border-white/50 focus:bg-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-xl bg-red-500/20 border border-red-500/30 px-2 py-2.5 text-[12.5px] text-red-200 text-center flex items-center gap-1.5 justify-center whitespace-nowrap">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-2 py-2.5 text-[12.5px] text-emerald-200 text-center flex items-center gap-1.5 justify-center whitespace-nowrap">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit button with silent 5s hold */}
          <div className="relative mt-6">
            <button
              type="submit"
              disabled={loading}
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={startHold}
              onTouchEnd={cancelHold}
              onTouchCancel={cancelHold}
              className="w-full rounded-xl bg-[#810C00] py-3.5 text-[15px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 select-none cursor-pointer"
            >
              {loading ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <a href="#/" className="text-[13px] text-white/60 hover:text-white transition-colors">
            ← Quay lại website
          </a>
        </div>
      </div>

      {/* Modal Đổi mật khẩu */}
      {showChangePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-[#560213] p-6 shadow-2xl text-white">
            <button
              onClick={() => setShowChangePassModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Đổi Mật Khẩu Admin</h3>
                <p className="text-xs text-white/70">
                  Cập nhật mật khẩu mới cho hệ thống quản trị
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-white/80">
                  Tài khoản
                </label>
                <input
                  type="text"
                  value={changePassUsername}
                  onChange={(e) => setChangePassUsername(e.target.value)}
                  placeholder="Nhập tên tài khoản"
                  required
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-white/80">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-white/80">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  required
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-white/80">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-white/50"
                />
              </div>

              {changePassError && (
                <div className="rounded-xl bg-red-500/20 border border-red-500/30 p-3 text-xs text-red-200 text-center">
                  {changePassError}
                </div>
              )}

              {changePassSuccess && (
                <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-3 text-xs text-emerald-200 text-center">
                  {changePassSuccess}
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowChangePassModal(false)}
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/20 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={changePassLoading}
                  className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-500 transition-colors disabled:opacity-50"
                >
                  {changePassLoading ? "Đang xử lý…" : "Cập nhật mật khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
