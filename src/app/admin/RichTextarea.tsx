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

        let label = "Xem liên kết";
        try {
          const parsed = new URL(cleanUrl);
          const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
          if (host.includes("youtube.com") || host.includes("youtu.be")) {
            label = "Xem video trên YouTube";
          } else if (host.includes("facebook.com") || host.includes("fb.watch")) {
            label = "Xem trên Facebook";
          } else if (host.includes("zalo.me")) {
            label = "Mở Zalo";
          } else {
            label = `Xem liên kết (${host})`;
          }
        } catch {
          label = "Xem liên kết";
        }

        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 font-semibold text-[#810C00] hover:text-[#560213] underline underline-offset-2 transition-colors cursor-pointer" title="${cleanUrl}">🔗 ${label}</a>${trailing}`;
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
