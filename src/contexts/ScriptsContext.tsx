import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Script {
  id: string;
  userId: string;
  title: string;
  topic: string;
  niche: string;
  platform: string;
  style: string;
  hook: string;
  script: string;
  scenes: Scene[];
  cta: string;
  hashtags: string[];
  viralScore?: number;
  thumbnailUrl?: string;
  folder?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Scene {
  id: number;
  timestamp: string;
  description: string;
  visual: string;
  audio: string;
  duration: number;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

interface ScriptsContextType {
  scripts: Script[];
  folders: Folder[];
  addScript: (script: Omit<Script, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateScript: (id: string, updates: Partial<Script>) => void;
  deleteScript: (id: string) => void;
  duplicateScript: (id: string) => void;
  moveToFolder: (scriptId: string, folderId: string | null) => void;
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => void;
  deleteFolder: (id: string) => void;
  getScriptById: (id: string) => Script | undefined;
}

const ScriptsContext = createContext<ScriptsContextType | undefined>(undefined);

export function ScriptsProvider({ children }: { children: React.ReactNode }) {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    // Load from localStorage
    const storedScripts = localStorage.getItem('reelai_scripts');
    const storedFolders = localStorage.getItem('reelai_folders');
    
    if (storedScripts) {
      const parsed = JSON.parse(storedScripts);
      setScripts(parsed.map((s: Script) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt)
      })));
    }
    
    if (storedFolders) {
      const parsed = JSON.parse(storedFolders);
      setFolders(parsed.map((f: Folder) => ({
        ...f,
        createdAt: new Date(f.createdAt)
      })));
    } else {
      // Default folders
      const defaultFolders: Folder[] = [
        { id: '1', name: 'TikTok Ideas', color: '#FF0050', createdAt: new Date() },
        { id: '2', name: 'Instagram Reels', color: '#E4405F', createdAt: new Date() },
        { id: '3', name: 'YouTube Shorts', color: '#FF0000', createdAt: new Date() }
      ];
      setFolders(defaultFolders);
      localStorage.setItem('reelai_folders', JSON.stringify(defaultFolders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reelai_scripts', JSON.stringify(scripts));
  }, [scripts]);

  useEffect(() => {
    localStorage.setItem('reelai_folders', JSON.stringify(folders));
  }, [folders]);

  const addScript = (script: Omit<Script, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newScript: Script = {
      ...script,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setScripts(prev => [newScript, ...prev]);
  };

  const updateScript = (id: string, updates: Partial<Script>) => {
    setScripts(prev => prev.map(script => 
      script.id === id 
        ? { ...script, ...updates, updatedAt: new Date() }
        : script
    ));
  };

  const deleteScript = (id: string) => {
    setScripts(prev => prev.filter(script => script.id !== id));
  };

  const duplicateScript = (id: string) => {
    const script = scripts.find(s => s.id === id);
    if (script) {
      const duplicated: Script = {
        ...script,
        id: Date.now().toString(),
        title: `${script.title} (Copy)`,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setScripts(prev => [duplicated, ...prev]);
    }
  };

  const moveToFolder = (scriptId: string, folderId: string | null) => {
    setScripts(prev => prev.map(script =>
      script.id === scriptId
        ? { ...script, folder: folderId || undefined, updatedAt: new Date() }
        : script
    ));
  };

  const addFolder = (folder: Omit<Folder, 'id' | 'createdAt'>) => {
    const newFolder: Folder = {
      ...folder,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== id));
    // Move scripts to no folder
    setScripts(prev => prev.map(script =>
      script.folder === id
        ? { ...script, folder: undefined, updatedAt: new Date() }
        : script
    ));
  };

  const getScriptById = (id: string) => {
    return scripts.find(script => script.id === id);
  };

  return (
    <ScriptsContext.Provider value={{
      scripts,
      folders,
      addScript,
      updateScript,
      deleteScript,
      duplicateScript,
      moveToFolder,
      addFolder,
      deleteFolder,
      getScriptById
    }}>
      {children}
    </ScriptsContext.Provider>
  );
}

export function useScripts() {
  const context = useContext(ScriptsContext);
  if (context === undefined) {
    throw new Error('useScripts must be used within a ScriptsProvider');
  }
  return context;
}
