import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  FiBold,
  FiItalic,
  FiList,
  FiCode,
} from "react-icons/fi";
import './RichTextEditor.css';

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "", // Remove all styles from <p>
          },
        },
      }),
      Placeholder.configure({
        placeholder: "Add a description...",
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-md">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-white">
        {[
          { icon: <FiBold />, action: () => editor.chain().focus().toggleBold().run() },
          { icon: <FiItalic />, action: () => editor.chain().focus().toggleItalic().run() },
          { icon: <FiList />, action: () => editor.chain().focus().toggleBulletList().run() },
          { icon: <FiCode />, action: () => editor.chain().focus().toggleCodeBlock().run() },
        ].map(({ icon, action }, i) => (
          <button
            key={i}
            onClick={action}
            type="button"
            className="p-1 text-gray-600 hover:text-blue-600 transition bg-transparent border-none outline-none focus:outline-none"
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Editor Area - plain input feel */}
      <EditorContent
        editor={editor}
        className="p-3 text-sm min-h-[100px] focus:outline-none"
      />
    </div>
  );
}
