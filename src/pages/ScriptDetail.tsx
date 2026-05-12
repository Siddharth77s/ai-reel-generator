import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Copy,
  Check,
  Trash2,
  Edit3,
  Download,
  Share2,
  Clock,
  Hash,
  Target,
  Zap,
  Image,
  FileText,
  MoreVertical
} from 'lucide-react';
import { useScripts } from '../contexts/ScriptsContext';

export default function ScriptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getScriptById, updateScript, deleteScript, duplicateScript, folders } = useScripts();
  const script = getScriptById(id || '');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (script) {
      setEditedScript({ ...script });
    }
  }, [script]);

  if (!script || !editedScript) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-2">Script not found</h3>
        <Link to="/scripts" className="text-violet-400 hover:text-violet-300">
          Back to scripts
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    updateScript(script.id, {
      title: editedScript.title,
      hook: editedScript.hook,
      script: editedScript.script,
      cta: editedScript.cta,
      hashtags: editedScript.hashtags,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteScript(script.id);
    navigate('/scripts');
  };

  const handleDuplicate = () => {
    duplicateScript(script.id);
    navigate('/scripts');
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadScript = () => {
    const content = `
Title: ${script.title}
Platform: ${script.platform}
Niche: ${script.niche}
Style: ${script.style}
Viral Score: ${script.viralScore}/100

HOOK:
${script.hook}

SCRIPT:
${script.script}

CALL TO ACTION:
${script.cta}

HASHTAGS:
${script.hashtags.map((h: string) => '#' + h).join(' ')}

SCENES:
${script.scenes.map((s: any) => `
Scene ${s.id} (${s.timestamp}):
${s.description}
Visual: ${s.visual}
`).join('')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/scripts"
            className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editedScript.title}
                onChange={(e) => setEditedScript({ ...editedScript, title: e.target.value })}
                className="text-2xl font-bold text-white bg-transparent border-b border-violet-500 focus:outline-none"
              />
            ) : (
              <h1 className="text-2xl font-bold text-white">{script.title}</h1>
            )}
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
              <span className="px-2 py-0.5 bg-slate-800 rounded-lg">{script.platform}</span>
              <span>•</span>
              <span>{script.niche}</span>
              <span>•</span>
              <span>{new Date(script.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={downloadScript}
                className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleDuplicate}
                className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
                title="Duplicate"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
                title="Edit"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Viral Score */}
      {script.viralScore && (
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
          <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Target className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-emerald-400 font-semibold">Viral Score Prediction</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  style={{ width: `${script.viralScore}%` }}
                />
              </div>
              <span className="text-emerald-400 font-bold text-lg">{script.viralScore}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Hook */}
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-violet-400 font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                HOOK (First 3 seconds)
              </span>
              <button
                onClick={() => copyToClipboard(script.hook, 'hook')}
                className="text-slate-400 hover:text-violet-400 transition-colors"
              >
                {copied === 'hook' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={editedScript.hook}
                onChange={(e) => setEditedScript({ ...editedScript, hook: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500 resize-none"
              />
            ) : (
              <p className="text-white text-lg font-medium leading-relaxed">{script.hook}</p>
            )}
          </div>

          {/* Script */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-semibold">SCRIPT</span>
              <button
                onClick={() => copyToClipboard(script.script, 'script')}
                className="text-slate-400 hover:text-violet-400 transition-colors"
              >
                {copied === 'script' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={editedScript.script}
                onChange={(e) => setEditedScript({ ...editedScript, script: e.target.value })}
                rows={10}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500 resize-none"
              />
            ) : (
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{script.script}</p>
            )}
          </div>

          {/* CTA */}
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-fuchsia-400 font-semibold">CALL TO ACTION</span>
              <button
                onClick={() => copyToClipboard(script.cta, 'cta')}
                className="text-slate-400 hover:text-fuchsia-400 transition-colors"
              >
                {copied === 'cta' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedScript.cta}
                onChange={(e) => setEditedScript({ ...editedScript, cta: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-fuchsia-500"
              />
            ) : (
              <p className="text-white">{script.cta}</p>
            )}
          </div>

          {/* Hashtags */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-400 font-semibold flex items-center gap-2">
                <Hash className="w-4 h-4" />
                HASHTAGS
              </span>
              <button
                onClick={() => copyToClipboard(script.hashtags.join(' '), 'hashtags')}
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                {copied === 'hashtags' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedScript.hashtags.join(' ')}
                onChange={(e) => setEditedScript({ ...editedScript, hashtags: e.target.value.split(' ') })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter hashtags separated by spaces"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {script.hashtags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Scenes */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-400" />
              Scene Breakdown
            </h3>
            <div className="space-y-4">
              {script.scenes.map((scene: any) => (
                <div key={scene.id} className="p-4 bg-slate-800/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-xs font-medium">
                      Scene {scene.id}
                    </span>
                    <span className="text-slate-500 text-xs">{scene.timestamp}</span>
                    <span className="text-slate-500 text-xs">({scene.duration}s)</span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{scene.description}</p>
                  <p className="text-slate-500 text-xs">
                    <span className="text-slate-400">Visual:</span> {scene.visual}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail */}
          {script.thumbnailUrl ? (
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-violet-400" />
                Thumbnail
              </h3>
              <img
                src={script.thumbnailUrl}
                alt="Thumbnail"
                className="w-full rounded-xl"
              />
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-violet-400" />
                Thumbnail
              </h3>
              <Link
                to="/thumbnails"
                className="block w-full py-8 border-2 border-dashed border-slate-700 rounded-xl text-center text-slate-500 hover:border-violet-500/50 hover:text-violet-400 transition-all"
              >
                <Image className="w-8 h-8 mx-auto mb-2" />
                Generate Thumbnail
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-2">Delete Script?</h3>
            <p className="text-slate-400 mb-6">
              This action cannot be undone. This will permanently delete "{script.title}".
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
