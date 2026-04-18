/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface CMSContent {
  id: string;
  key: string;
  value: string;
  type: "text" | "image" | "rich-text";
}

export const useContent = () => {
  const [content, setContent] = useState<Record<string, CMSContent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "siteContent"));
    const unsub = onSnapshot(q, (snap) => {
      const data: Record<string, CMSContent> = {};
      snap.docs.forEach(doc => {
        const d = doc.data();
        data[d.key] = {
          id: doc.id,
          key: d.key,
          value: d.value,
          type: d.type || "text"
        };
      });
      setContent(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const t = (key: string, defaultValue: string) => {
    return content[key]?.value || defaultValue;
  };

  const getMetadata = (key: string) => {
    return content[key];
  };

  return { t, getMetadata, loading, content };
};
