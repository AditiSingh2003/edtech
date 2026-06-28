"use client";

import { useEffect, useState } from "react";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebsocketProvider } from "y-websocket";

export function useYDoc(documentId: string) {
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [synced, setSynced] = useState(false);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const doc = new Y.Doc();

    const persistence = new IndexeddbPersistence(documentId, doc);
    persistence.on("synced", () => {
      setSynced(true);
    });

    const wsProvider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:1234",
      documentId,
      doc
    );

    wsProvider.on("status", (event: { status: string }) => {
      setOnline(event.status === "connected");
    });

    setYdoc(doc);
    setProvider(wsProvider);

    return () => {
      wsProvider.destroy();
      persistence.destroy();
      doc.destroy();
    };
  }, [documentId]);

  return { ydoc, provider, synced, online };
}