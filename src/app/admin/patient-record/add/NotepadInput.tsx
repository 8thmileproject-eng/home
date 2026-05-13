"use client";

import { useState, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading2, Pen, Type } from "lucide-react";
import DrawingCanvas, { type DrawingCanvasHandle } from "./DrawingCanvas";

const MenuButton = ({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1.5 rounded transition-colors ${
      active ? "bg-[#2d5a3d] text-white" : "text-gray-500 hover:text-[#2d5a3d] hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

function TypeEditor({
  value,
  onChange,
  placeholder,
  onSwitchToDraw,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onSwitchToDraw: () => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2] } }),
      Underline,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[100px] px-4 py-3 text-gray-900",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  const buttons = [
    { key: "bold", icon: Bold, action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold") ?? false },
    { key: "italic", icon: Italic, action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic") ?? false },
    { key: "underline", icon: UnderlineIcon, action: () => editor?.chain().focus().toggleUnderline().run(), active: editor?.isActive("underline") ?? false },
    { key: "heading", icon: Heading2, action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive("heading", { level: 2 }) ?? false },
    { key: "list", icon: List, action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive("bulletList") ?? false },
    { key: "ordered-list", icon: ListOrdered, action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive("orderedList") ?? false },
  ];

  return (
    <>
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50/50">
        {buttons.map((b) => {
          const Icon = b.icon;
          return (
            <MenuButton key={b.key} onClick={b.action} active={b.active}>
              <Icon className="w-3.5 h-3.5" />
            </MenuButton>
          );
        })}
        <div className="ml-auto flex items-center gap-1">
          <span className="text-[10px] text-gray-400 mr-1">{placeholder}</span>
          <MenuButton onClick={onSwitchToDraw} active={false}>
            <Pen className="w-3.5 h-3.5" />
          </MenuButton>
        </div>
      </div>
      {editor && <EditorContent editor={editor} />}
    </>
  );
}

export default function NotepadInput({ value, onChange, placeholder }: NotepadInputProps) {
  const isDraw = value.startsWith("<img");
  const [editorKey, setEditorKey] = useState(0);
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const convertingRef = useRef(false);

  const switchToDraw = () => {
    onChange(`<img src="" data-drawing="true" />`);
  };

  const switchToText = useCallback(async () => {
    if (convertingRef.current) return;
    const canvas = canvasRef.current;
    if (canvas?.hasStrokes()) {
      convertingRef.current = true;
      const text = await canvas.recognize();
      if (text) {
        onChange(text);
        setEditorKey((k) => k + 1);
      } else {
        onChange("");
      }
      convertingRef.current = false;
    } else {
      onChange("");
    }
  }, [onChange]);

  const handleDrawingChange = (val: string) => {
    if (!val) return;
    if (val.startsWith("data:")) {
      onChange(`<img src="${val}" data-drawing="true" alt="Handwriting" />`);
    } else {
      onChange(val);
      setEditorKey((k) => k + 1);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#2d5a3d] focus-within:border-transparent">
      {isDraw ? (
        <div tabIndex={-1} onBlur={switchToText} className="outline-none">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Pen className="w-3.5 h-3.5" />
              <span>Draw with your finger or pen</span>
            </div>
            <MenuButton onClick={switchToText} active={false}>
              <Type className="w-3.5 h-3.5" />
            </MenuButton>
          </div>
          <div className="p-3">
            <DrawingCanvas ref={canvasRef} value={value} onChange={handleDrawingChange} />
          </div>
        </div>
      ) : (
        <TypeEditor key={editorKey} value={value} onChange={onChange} placeholder={placeholder} onSwitchToDraw={switchToDraw} />
      )}
    </div>
  );
}

interface NotepadInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
