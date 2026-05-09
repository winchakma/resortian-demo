"use client";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing…",
  hasError = false,
  minHeight = 160,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Set content when value changes externally (e.g. form reset)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    // Only overwrite if focus is elsewhere (not mid-edit)
    if (document.activeElement !== el && el.innerHTML !== (value ?? "")) {
      el.innerHTML = value ?? "";
    }
  }, [value]);

  const exec = useCallback(
    (command: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
    },
    [onChange],
  );

  const handleInput = useCallback(() => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const btnCls =
    "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors";

  return (
    <div
      className={`overflow-hidden rounded-xl border ${
        hasError
          ? "border-red-400 dark:border-red-500"
          : "border-gray-200 dark:border-gray-700"
      } bg-white dark:bg-gray-900`}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-gray-100 px-2 py-1.5 dark:border-gray-800">
        <button type="button" onClick={() => exec("bold")} className={btnCls} title="Bold">
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("italic")} className={btnCls} title="Italic">
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("underline")} className={btnCls} title="Underline">
          <Underline className="h-3.5 w-3.5" />
        </button>
        <div className="mx-1.5 h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          className={btnCls}
          title="Bullet list"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          className={btnCls}
          title="Numbered list"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className={[
          "px-4 py-3 text-sm text-gray-900 outline-none dark:text-white",
          "[&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal",
          "[&_b]:font-semibold [&_strong]:font-semibold [&_i]:italic [&_em]:italic",
          "before:pointer-events-none before:text-gray-400 dark:before:text-gray-500",
          "empty:before:content-[attr(data-placeholder)]",
        ].join(" ")}
        style={{ minHeight }}
      />
    </div>
  );
}
