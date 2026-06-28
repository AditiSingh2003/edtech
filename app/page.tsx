"use client";

import Editor from "@/components/Editor";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        House of EdTech — Collaborative Editor
      </h1>
      <Editor documentId="demo-doc-1" userName="Adith" />
    </main>
  );
}