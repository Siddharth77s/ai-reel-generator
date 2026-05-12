import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Wand2,
  Download,
  RefreshCw,
  Sparkles,
  Type,
  Palette,
  Layout,
  AlertCircle,
  Loader2,
  Check,
  Copy,
  Save
} from 'lucide-react';
import { generateImage } from '../lib/gemini';

const thumbnailStyles = [
  { id: 'minimal', name: 'Minimal & Clean', color: 'from-slate-500 to-slate-600' },
  { id: 'bold', name: 'Bold & Punchy', color: 'from-red-500 to-orange-500' },
  { id: 'gradient', name: 'Vibrant Gradient', color: 'from-violet-500 to-fuchsia-500' },
  { id: 'dark', name: 'Dark & Moody', color: 'from-slate-800 to-black' },
  { id: 'neon', name: 'Neon Cyberpunk', color: 'from-cyan-500 to-purple-500' },
  { id: 'pastel', name: 'Soft Pastel', color: 'from-pink-300 to-purple-300' },
];

const imageRatios = [
  { id: '16:9', name: 'YouTube (16:9)', aspect: 'aspect-video' },
  { id: '9:16', name: 'TikTok/Reels (9:16)', aspect: 'aspect-[9/16]' },
  { id: '1:1', name: 'Instagram Post (1:1)', aspect: 'aspect-square' },
  { id: '4:5', name: 'Portrait (4:5)', aspect: 'aspect-[4/5]' },
];

export default function ThumbnailGenerator() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    style: 'bold',
    ratio: '16:9',
    includeText: true,
    mood: 'energetic'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = async () => {
    if (!formData.title) {
      setError('Please enter a title');
      return;
    }

    setError('');
    setIsGenerating(true);
    setGeneratedImages([]);

    try {
      // Generate 3 variations
      const images: string[] = [];
      for (let i = 0; i < 3; i++) {
        const imageUrl = await generateImage({
          title: formData.title,
          description: formData.description,
          style: formData.style,
          includeText: formData.includeText,
          mood: formData.mood
        });
        images.push(imageUrl);
      }
      setGeneratedImages(images);
    } catch (err) {
      setError('Failed to generate thumbnails. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `thumbnail-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAspectRatioClass = () => {
    const ratio = imageRatios.find(r => r.id === formData.ratio);
    return ratio?.aspect || 'aspect-video';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">AI Thumbnail Generator</h1>
        <p className="text-slate-400 mt-1">Create eye-catching thumbnails for your content</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-violet-400" />
            Thumbnail Settings
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
                Video Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., 5 Shocking Facts About Space"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description/Context
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your video content..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {imageRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setFormData({ ...formData, ratio: ratio.id })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.ratio === ratio.id
                        ? 'bg-violet-500 text-white'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {ratio.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Visual Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {thumbnailStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setFormData({ ...formData, style: style.id })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.style === style.id
                        ? 'bg-slate-700 text-white ring-2 ring-violet-500/50'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${style.color}`} />
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mood
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              >
                <option value="energetic">Energetic & Exciting</option>
                <option value="calm">Calm & Relaxing</option>
                <option value="mysterious">Mysterious & Intriguing</option>
                <option value="professional">Professional & Clean</option>
                <option value="funny">Funny & Lighthearted</option>
                <option value="dramatic">Dramatic & Intense</option>
              </select>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
              <input
                type="checkbox"
                id="includeText"
                checked={formData.includeText}
                onChange={(e) => setFormData({ ...formData, includeText: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-violet-500 focus:ring-violet-500/20"
              />
              <label htmlFor="includeText" className="text-slate-300 text-sm">
                Include title text on thumbnail
              </label>
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
                  Generate Thumbnails
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Results */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Image className="w-5 h-5 text-violet-400" />
              Generated Thumbnails
            </h2>
            {generatedImages.length > 0 && (
              <button
                onClick={() => setGeneratedImages([])}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {generatedImages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[500px] flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-24 h-24 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                  <Image className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">
                  {isGenerating ? 'Creating your thumbnails...' : 'No thumbnails yet'}
                </h3>
                <p className="text-slate-500 max-w-xs">
                  {isGenerating 
                    ? 'Our AI is working on stunning designs for your content' 
                    : 'Configure your settings and click generate to create thumbnails'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {generatedImages.map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className={`relative ${getAspectRatioClass()} rounded-xl overflow-hidden bg-slate-800`}>
                      <img
                        src={imageUrl}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDownload(imageUrl)}
                          className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl text-white transition-all"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setSelectedImage(imageUrl)}
                          className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl text-white transition-all"
                          title="View Full Size"
                        >
                          <Layout className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Variant Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                        Variant {index + 1}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Full size thumbnail"
                className="max-w-full max-h-[85vh] rounded-xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white"
              >
                Close
              </button>
              <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-3">
                <button
                  onClick={() => handleDownload(selectedImage)}
                  className="px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
