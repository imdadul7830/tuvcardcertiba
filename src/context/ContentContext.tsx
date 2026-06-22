import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SiteContent = {
  hero: {
    subtitle: string;
    title1: string;
    titleHighlight: string;
    description: string;
    buttonText: string;
    imageUrl: string;
  };
  stats: Array<{ label: string; value: string }>;
  contact: {
    phone: string;
    email: string;
    address: string;
    fax: string;
  };
  coursesSection: {
    title: string;
    subtitle: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  featuresSection: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
};

type ContentContextType = {
  content: SiteContent | null;
  refreshContent: () => Promise<void>;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(null);

  const refreshContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      setContent(data);
    } catch (e) {
      console.error("Failed to load site content");
    }
  };

  useEffect(() => {
    refreshContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, refreshContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a ContentProvider');
  }
  return context;
}
