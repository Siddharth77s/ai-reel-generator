import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  Save,
  RefreshCw,
  Download,
  Clock,
  Hash,
  Target,
  Zap,
  Image as ImageIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useScripts } from '../contexts/ScriptsContext';
import { useAuth } from '../contexts/AuthContext';
import { generateScript, generateHook, generateHashtags, generateScenes, calculateViralScore } from '../lib/gemini';

const platforms = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Twitter/X'];
const niches = [
  'Tech & Gadgets', 'Fitness & Health', 'Business & Finance', 'Lifestyle & Vlog',
  'Education & Learning', 'Entertainment & Comedy', 'Fashion & Beauty', 'Food & Cooking',
  'Travel & Adventure', 'Gaming', 'Motivation & Self-improvement', 'News & Commentary'
];
const styles = ['Energetic & Fast', 'Calm & Informative', 'Funny & Relatable', 'Professional & Authoritative', 'Storytelling', 'Controversial/Debate'];

export default function ScriptGenerator() {
  const { user } = useAuth();
  const { addScript } = useScripts();
  const [formData, setFormData] = useState({
    topic: '',
    niche: '',
    platform: 'TikTok',
    style: 'Energetic & Fast'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!formData.topic || !formData.niche) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      // Generate content in sequence
      const hook = await generateHook(formData.topic, formData.platform, formData.style);
      const script = await generateScript(formData.topic, formData.niche, formData.platform, formData.style);
      const hashtags = await generateHashtags(formData.topic, formData.niche, formData.platform);
      const scenes = await generateScenes(script);
      const viralScore = await calculateViralScore(formData.topic, hook, formData.platform);

      const title = `${formData.topic} - ${formData.niche}`;
      const cta = getCTA(formData.platform);

      setGeneratedContent({
        title,
        hook,
        script,
        scenes,
        cta,
        hashtags,
        viralScore,
        topic: formData.topic,
        niche: formData.niche,
        platform: formData.platform,
        style: formData.style
      });
    } catch (err) {
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCTA = (platform: string) => {
    const ctas: Record<string, string> = {
      'TikTok': 'Follow for more! → Drop a ❤️ if you agree',
      'Instagram Reels': 'Save this for later! → Share with a friend who needs this',
      'YouTube Shorts': 'Subscribe for more! → Comment below your thoughts',
      'Twitter/X': 'Retweet if helpful! → Follow for daily tips'
    };
    return ctas[platform] || 'Follow for more content!';
  };

  const handleSave = () => {
    if (!generatedContent || !user) return;

    addScript({
      userId: user.id,
      title: generatedContent.title,
      topic: generatedContent.topic,
      niche: generatedContent.niche,
      platform: generatedContent.platform,
      style: generatedContent.style,
      hook: generatedContent.hook,
      script: generatedContent.script,
      scenes: generatedContent.scenes,
      cta: generatedContent.cta,
      hashtags: generatedContent.hashtags,
      viralScore: generatedContent.viralScore,
      status: 'draft'
    });

    alert('Script saved successfully!');
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Script Generator</h1>
          <p className="text-slate-400 mt-1">Create viral short-form content in seconds</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-violet-400" />
            Content Details
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Topic/Idea <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., 5 Productivity Hacks for Remote Workers"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Niche/Category <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              >
                <option value="">Select a niche...</option>
                {niches.map(niche => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                >
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Content Style
                </label>
                <select
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                >
                  {styles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Script
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <p className="text-amber-300 font-medium text-sm">Pro Tip</p>
                <p className="text-amber-200/70 text-sm mt-1">
                  Be specific with your topic. Instead of "fitness tips", try "5 minute morning workout for busy professionals"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Content */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              Generated Content
            </h2>
            {generatedContent && (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all"
                  title="Save Script"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleGenerate()}
                  className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all"
                  title="Regenerate"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!generatedContent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[500px] flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Ready to Create</h3>
                <p className="text-slate-500 max-w-xs">
                  Fill in the details and click generate to create your viral script
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 max-h-[600px] overflow-y-auto pr-2"
              >
                {/* Viral Score */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Target className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-400 font-semibold">Viral Score Prediction</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${generatedContent.viralScore}%` }}
                        />
                      </div>
                      <span className="text-emerald-400 font-bold">{generatedContent.viralScore}/100</span>
                    </div>
                  </div>
                </div>

                {/* Hook */}
                <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-violet-400 font-medium text-sm flex items-center gap-1">
                      <Zap className="w-4 h-4" /> HOOK (First 3 seconds)
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedContent.hook, 'hook')}
                      className="text-slate-400 hover:text-violet-400 transition-colors"
                    >
                      {copied === 'hook' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-white text-lg font-medium leading-relaxed">
                    {generatedContent.hook}
                  </p>
                </div>

                {/* Script */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 font-medium text-sm">SCRIPT</span>
                    <button
                      onClick={() => copyToClipboard(generatedContent.script, 'script')}
                      className="text-slate-400 hover:text-violet-400 transition-colors"
                    >
                      {copied === 'script' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {generatedContent.script}
                  </p>
                </div>

                {/* Scenes */}
                <div className="space-y-2">
                  <span className="text-slate-400 font-medium text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" /> SCENE BREAKDOWN
                  </span>
                  {generatedContent.scenes.map((scene: any) => (
                    <div key={scene.id} className="p-3 bg-slate-800/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-violet-400 font-medium text-sm">Scene {scene.id}</span>
                        <span className="text-slate-500 text-xs">{scene.timestamp} ({scene.duration}s)</span>
                      </div>
                      <p className="text-slate-300 text-sm">{scene.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> {scene.visual}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="p-4 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-fuchsia-400 font-medium text-sm">CALL TO ACTION</span>
                    <button
                      onClick={() => copyToClipboard(generatedContent.cta, 'cta')}
                      className="text-slate-400 hover:text-fuchsia-400 transition-colors"
                    >
                      {copied === 'cta' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-white">{generatedContent.cta}</p>
                </div>

                {/* Hashtags */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 font-medium text-sm flex items-center gap-1">
                      <Hash className="w-4 h-4" /> HASHTAGS
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedContent.hashtags.join(' '), 'hashtags')}
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {copied === 'hashtags' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.hashtags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
