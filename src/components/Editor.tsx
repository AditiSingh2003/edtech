"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useYDoc } from "@/lib/useYDoc";

const COLORS = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#c084fc"];

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function Editor({
  documentId,
  userName,
}: {
  documentId: string;
  userName: string;
}) {
  const { ydoc, provider, synced, online } = useYDoc(documentId);

  const editor = useEditor(
    {
      extensions: ydoc
        ? [
            StarterKit.configure({ history: false }),
            Collaboration.configure({ document: ydoc }),
            ...(provider
              ? [
                  CollaborationCursor.configure({
                    provider,
                    user: { name: userName, color: randomColor() },
                  }),
                ]
              : []),
          ]
        : [StarterKit],
      immediatelyRender: false,
    },
    [ydoc, provider]
  );

  return (
    <div className="border rounded-lg p-4 max-w-3xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="font-medium">{documentId}</span>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            online ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {online ? "● Online — synced" : "○ Offline — saved locally"}
        </span>
      </div>
      {!synced ? (
        <p className="text-gray-400">Loading local document...</p>
      ) : (
        <EditorContent
          editor={editor}
          className="prose min-h-[300px] focus:outline-none border rounded p-3"
        />
      )}
    </div>
  );
}