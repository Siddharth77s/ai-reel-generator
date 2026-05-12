import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  FolderOpen,
  MoreVertical,
  Copy,
  Trash2,
  Edit3,
  Folder,
  Plus,
  Grid,
  List,
  FileText,
  Clock,
  Hash,
  X,
  Check
} from 'lucide-react';
import { useScripts, Folder as FolderType } from '../contexts/ScriptsContext';

export default function MyScripts() {
  const { scripts, folders, deleteScript, duplicateScript, moveToFolder, addFolder, deleteFolder } = useScripts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#8B5CF6');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const colors = ['#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1'];

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         script.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder ? script.folder === selectedFolder : true;
    return matchesSearch && matchesFolder;
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder({ name: newFolderName, color: newFolderColor });
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateScript(id);
    setMenuOpen(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this script?')) {
      deleteScript(id);
    }
    setMenuOpen(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Scripts</h1>
          <p className="text-slate-400 mt-1">Manage and organize your content</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewFolderModal(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Folder className="w-4 h-4" />
            New Folder
          </button>
          <Link
            to="/generate"
            className="px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-lg flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Generate New
          </Link>
        </div>
      </div>

      {/* Folders */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedFolder(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
            selectedFolder === null
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          All Scripts
          <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs">{scripts.length}</span>
        </button>
        {folders.map(folder => (
          <button
            key={folder.id}
            onClick={() => setSelectedFolder(folder.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all group ${
              selectedFolder === folder.id
                ? 'bg-slate-700 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: folder.color }}
            />
            {folder.name}
            <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs">
              {scripts.filter(s => s.folder === folder.id).length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this folder? Scripts will be moved to uncategorized.')) {
                  deleteFolder(folder.id);
                  if (selectedFolder === folder.id) setSelectedFolder(null);
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600 rounded transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scripts..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 rounded-xl transition-all ${
              viewMode === 'grid'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 rounded-xl transition-all ${
              viewMode === 'list'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scripts Grid/List */}
      {filteredScripts.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredScripts.map((script, index) => (
            <motion.div
              key={script.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group bg-slate-900/50 border border-slate-800/50 hover:border-violet-500/30 rounded-2xl transition-all ${
                viewMode === 'grid' ? 'p-5' : 'p-4 flex items-center gap-4'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === script.id ? null : script.id)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {menuOpen === script.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 py-1"
                          >
                            <Link
                              to={`/scripts/${script.id}`}
                              className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                            >
                              <Edit3 className="w-4 h-4" /> Edit
                            </Link>
                            <button
                              onClick={() => handleDuplicate(script.id)}
                              className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" /> Duplicate
                            </button>
                            <button
                              onClick={() => handleDelete(script.id)}
                              className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <Link to={`/scripts/${script.id}`}>
                    <h3 className="text-white font-semibold mb-2 line-clamp-2 hover:text-violet-400 transition-colors">
                      {script.title}
                    </h3>
                  </Link>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{script.hook}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-slate-800 rounded-lg text-slate-400 text-xs">
                        {script.platform}
                      </span>
                      {script.viralScore && (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs">
                          {script.viralScore}/100
                        </span>
                      )}
                    </div>
                    <span className="text-slate-500 text-xs">
                      {new Date(script.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/scripts/${script.id}`}>
                      <h3 className="text-white font-semibold hover:text-violet-400 transition-colors truncate">
                        {script.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span>{script.platform}</span>
                      <span>•</span>
                      <span>{script.niche}</span>
                      <span>•</span>
                      <span>{new Date(script.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {script.viralScore && (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium">
                        {script.viralScore}/100
                      </span>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === script.id ? null : script.id)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {menuOpen === script.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 py-1"
                          >
                            <Link
                              to={`/scripts/${script.id}`}
                              className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                            >
                              <Edit3 className="w-4 h-4" /> Edit
                            </Link>
                            <button
                              onClick={() => handleDuplicate(script.id)}
                              className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" /> Duplicate
                            </button>
                            <button
                              onClick={() => handleDelete(script.id)}
                              className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">
            {searchQuery ? 'No scripts found' : 'No scripts yet'}
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto mb-6">
            {searchQuery 
              ? 'Try adjusting your search or filters'
              : 'Generate your first script to get started'}
          </p>
          {!searchQuery && (
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
              Generate Script
            </Link>
          )}
        </div>
      )}

      {/* New Folder Modal */}
      <AnimatePresence>
        {showNewFolderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewFolderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Create New Folder</h3>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 mb-4"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <div className="mb-6">
                <label className="text-sm text-slate-400 mb-2 block">Choose Color</label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewFolderColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        newFolderColor === color ? 'ring-2 ring-white scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewFolderModal(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-1 py-3 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white rounded-xl transition-colors"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
