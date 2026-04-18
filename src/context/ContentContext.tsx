/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface CMSContent {
  id: string;
  key: string;
  value: string;
  color?: string;
  type: "text" | "image" | "rich-text";
}

interface ContentContextType {
  content: Record<string, CMSContent>;
  loading: boolean;
  t: (key: string, defaultValue: string) => string;
  getMetadata: (key: string) => CMSContent | undefined;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
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
          color: d.color,
          type: d.type || "text"
        };
      });
      setContent(data);
      setLoading(false);
    }, (error) => {
      console.error("Content snapshot error:", error);
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

  return (
    <ContentContext.Provider value={{ content, loading, t, getMetadata }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
