import React, { useState, useRef } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  Link as LinkIcon, 
  Heading3, 
  Eye, 
  Edit3, 
  Highlighter,
  Sparkles
} from "lucide-react";

interface RichTextareaProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  minHeight?: string;
}

function cleanWordHtml(html: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    function processNode(node: Node): string {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || "";
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return "";

      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      // Skip Word internal tags
      if (["style", "script", "meta", "link", "xml", "title", "o:p"].includes(tagName)) {
        return "";
      }

      const style = el.getAttribute("style") || "";
      const isBold =
        tagName === "b" ||
        tagName === "strong" ||
        /font-weight\s*:\s*(700|800|900|bold)/i.test(style);

      const isItalic =
        tagName === "i" ||
        tagName === "em" ||
        /font-style\s*:\s*italic/i.test(style);

      const isUnderline =
        tagName === "u" ||
        /text-decoration\s*:\s*underline/i.test(style);

      let childrenContent = Array.from(el.childNodes).map(processNode).join("");

      if (!childrenContent.trim() && tagName !== "br") return "";

      if (tagName === "br") return "\n";

      if (isBold && !childrenContent.startsWith("<b>")) {
        childrenContent = `<b>${childrenContent}</b>`;
      }
      if (isItalic && !childrenContent.startsWith("<i>")) {
        childrenContent = `<i>${childrenContent}</i>`;
      }
      if (isUnderline && !childrenContent.startsWith("<u>")) {
        childrenContent = `<u>${childrenContent}</u>`;
      }

      if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
        return `\n<h3 class="text-lg font-bold text-[#560213] mt-3 mb-1">${childrenContent}</h3>\n`;
      }

      if (tagName === "a") {
        const href = el.getAttribute("href");
        if (href) {
          return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-[#810C00] font-semibold underline">${childrenContent}</a>`;
        }
      }

      if (tagName === "ul" || tagName === "ol") {
        return `\n<ul class="list-disc pl-5 space-y-1 my-2">\n${childrenContent}\n</ul>\n`;
      }

      if (tagName === "li") {
        return `  <li>${childrenContent}</li>\n`;
      }

      if (tagName === "p" || tagName === "div") {
        return `${childrenContent}\n\n`;
      }

      return childrenContent;
    }

    const result = Array.from(doc.body.childNodes).map(processNode).join("");
    return result.replace(/\n{3,}/g, "\n\n").trim();
  } catch {
    return html;
  }
}

function autoLinkify(text: string): string {
  if (!text) return "";
  const parts = text.split(/(<a\s+[^>]*>[\s\S]*?<\/a>|<[^>]+>)/gi);
  return parts
    .map((part) => {
      if (part.startsWith("<")) return part;
      const urlRegex = /(https?:\/\/[^\s<)]+)/gi;
      return part.replace(urlRegex, (url) => {
        let cleanUrl = url;
        let trailing = "";
        if (/[.,!?)]$/.test(cleanUrl)) {
          trailing = cleanUrl.slice(-1);
          cleanUrl = cleanUrl.slice(0, -1);
        }

        let label = "Liên kết";
        let iconSvg = `<svg class="w-3.5 h-3.5 inline-block shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`;

        try {
          const parsed = new URL(cleanUrl);
          const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
          if (host.includes("youtube.com") || host.includes("youtu.be")) {
            label = "YouTube";
            iconSvg = `<svg class="w-4 h-4 inline-block text-red-600 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
          } else if (host.includes("facebook.com") || host.includes("fb.watch")) {
            label = "Facebook";
            iconSvg = `<svg class="w-4 h-4 inline-block text-blue-600 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
          } else if (host.includes("tiktok.com")) {
            label = "TikTok";
            iconSvg = `<svg class="w-4 h-4 inline-block text-slate-900 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M12.525 0h3.08c.012.633.064 1.258.283 1.868.228.636.598 1.228 1.08 1.71.49.49 1.08.85 1.714 1.08.61.22 1.235.27 1.868.28v3.13a7.84 7.84 0 0 1-5.01-1.78v7.66a6.83 6.83 0 0 1-1.32 4.14 6.87 6.87 0 0 1-3.69 2.51 6.82 6.82 0 0 1-4.45-.36 6.84 6.84 0 0 1-3.26-3.08 6.82 6.82 0 0 1-.58-4.32c.32-1.45 1.1-2.73 2.22-3.64A6.8 6.8 0 0 1 7.42 12c.76 0 1.5.15 2.19.43v3.2a3.63 3.63 0 0 0-1.89-.52 3.65 3.65 0 0 0-2.58 1.06 3.64 3.64 0 0 0-1.06 2.58c0 .97.38 1.89 1.06 2.58a3.64 3.64 0 0 0 2.58 1.06c.97 0 1.89-.38 2.58-1.06a3.64 3.64 0 0 0 1.06-2.58V0z"/></svg>`;
          } else if (host.includes("zalo.me")) {
            label = "Zalo";
            iconSvg = `<svg class="w-4 h-4 inline-block text-blue-500 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5L2 22l5.12-1.31A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>`;
          } else {
            label = host;
          }
        } catch {
          label = "Liên kết";
        }

        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 font-semibold text-[#810C00] hover:text-[#560213] underline underline-offset-2 transition-colors cursor-pointer" title="${cleanUrl}">${iconSvg}<span>${label}</span></a>${trailing}`;
      });
    })
    .join("");
}

export function RichTextarea({
  label,
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  rows = 5,
  minHeight = "120px",
}: RichTextareaProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (startTag: string, endTag: string = "", defaultText: string = "văn bản") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = `${startTag}${selectedText}${endTag}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + startTag.length,
        start + startTag.length + selectedText.length
      );
    }, 0);
  };

  const handleAddLink = () => {
    const url = prompt("Nhập đường dẫn URL (ví dụ: https://gachthuanloi.vn):");
    if (!url) return;
    applyFormat(`<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#810C00] font-semibold underline">`, `</a>`, "tiêu đề liên kết");
  };

  const handleAddList = () => {
    const listSnippet = `\n<ul class="list-disc pl-5 space-y-1 my-2">\n  <li>Mục thứ nhất</li>\n  <li>Mục thứ hai</li>\n</ul>\n`;
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + listSnippet);
      return;
    }
    const start = textarea.selectionStart;
    const newValue = value.substring(0, start) + listSnippet + value.substring(start);
    onChange(newValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = e.clipboardData.getData("text/html");
    if (!html) return; // Allow normal plain text paste

    // Process Word / Docs rich text paste
    e.preventDefault();
    const cleaned = cleanWordHtml(html);
    if (!cleaned) return;

    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value ? `${value}\n\n${cleaned}` : cleaned);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + cleaned + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cleaned.length, start + cleaned.length);
    }, 0);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold text-[#560213]/80">{label}</label>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#810C00] font-medium bg-[#810C00]/8 px-2 py-0.5 rounded-full">
            <Sparkles className="h-3 w-3 text-[#810C00]" /> Hỗ trợ dán trực tiếp từ Word / Docs
          </span>
        </div>
      )}

      <div className="rounded-xl border border-[#810C00]/20 bg-white shadow-sm overflow-hidden transition-colors focus-within:border-[#810C00]">
        {/* Mini Word Formatting Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#810C00]/15 bg-slate-100/90 px-2.5 py-1.5 text-slate-700">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => applyFormat("<b>", "</b>", "văn bản in đậm")}
              className="rounded p-1.5 hover:bg-[#810C00]/10 hover:text-[#810C00] transition-colors font-bold"
              title="In đậm (Bold)"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat("<i>", "</i>", "văn bản in nghiêng")}
              className="rounded p-1.5 hover:bg-[#810C00]/10 hover:text-[#810C00] transition-colors italic"
              title="In nghiêng (Italic)"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat("<u>", "</u>", "văn bản gạch chân")}
              className="rounded p-1.5 hover:bg-[#810C00]/10 hover:text-[#810C00] transition-colors underline"
              title="Gạch chân (Underline)"
            >
              <Underline className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('<mark class="bg-amber-200/80 px-1 py-0.5 rounded font-medium">', "</mark>", "văn bản nổi bật")}
              className="rounded p-1.5 hover:bg-[#810C00]/10 hover:text-[#810C00] transition-colors"
              title="Tạo màu nổi bật (Highlight)"
            >
              <Highlighter className="h-4 w-4 text-amber-600" />
            </button>

            <div className="h-4 w-[1px] bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => applyFormat('<h3 class="text-lg font-bold text-[#560213] mt-3 mb-1">', "</h3>", "Tiêu đề mục nhỏ")}
              className="rounded p-1.5 hover:bg-[#810C00]/10 hover:text-[#810C00] transition-colors"
              title="Thêm Tiêu đề nhỏ (H3)"
            >
              <Heading3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleAddList}
              className="rounded p-1.5 hover:bg-[#810C00]/10 hover:text-[#810C00] transition-colors"
              title="Chèn danh sách dấu chấm (Bullet List)"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleAddLink}
              className="rounded p-1.5 hover:bg-[#810C00]/10 hover:text-[#810C00] transition-colors"
              title="Chèn đường dẫn (Link)"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
              isPreview 
                ? "bg-[#810C00] text-white" 
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {isPreview ? (
              <>
                <Edit3 className="h-3.5 w-3.5" /> Chỉnh sửa
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" /> Xem trước
              </>
            )}
          </button>
        </div>

        {/* Input Textarea vs Live Preview */}
        {isPreview ? (
          <div 
            className="p-3.5 text-sm leading-relaxed text-[#560213] bg-[#FAF5EF]/50 overflow-y-auto space-y-3 border-t border-slate-100"
            style={{ minHeight }}
          >
            {value.trim() ? (
              value.split(/\n\s*\n/).map((para, pIdx) => (
                <div 
                  key={pIdx} 
                  className="whitespace-pre-line text-slate-800"
                  dangerouslySetInnerHTML={{ __html: autoLinkify(para) }}
                />
              ))
            ) : (
              <span className="text-slate-400 italic text-xs">Chưa có nội dung để xem trước...</span>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
            rows={rows}
            placeholder={placeholder}
            className="w-full bg-[#C76B86]/5 px-3.5 py-2.5 text-sm text-[#560213] outline-none transition-colors focus:bg-white resize-y block font-normal"
            style={{ minHeight }}
          />
        )}
      </div>
    </div>
  );
}
