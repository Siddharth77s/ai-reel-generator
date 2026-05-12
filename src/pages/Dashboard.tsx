import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  FileText,
  Image,
  Clock,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useScripts } from '../contexts/ScriptsContext';

const stats = [
  { label: 'Scripts Created', value: '0', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  { label: 'Thumbnails Made', value: '0', icon: Image, color: 'from-violet-500 to-fuchsia-500' },
  { label: 'Viral Score Avg', value: '0', icon: Target, color: 'from-emerald-500 to-teal-500' },
  { label: 'Time Saved', value: '0h', icon: Clock, color: 'from-amber-500 to-orange-500' },
];

const quickActions = [
  { label: 'Generate Script', icon: Sparkles, path: '/generate', color: 'violet' },
  { label: 'Create Thumbnail', icon: Image, path: '/thumbnails', color: 'fuchsia' },
  { label: 'View Trending', icon: TrendingUp, path: '/trending', color: 'emerald' },
  { label: 'My Scripts', icon: FileText, path: '/scripts', color: 'blue' },
];

const recentActivity = [
  { type: 'script', title: 'AI-generated script for "5 Productivity Hacks"', time: '2 hours ago', platform: 'TikTok' },
  { type: 'thumbnail', title: 'Created thumbnail for fitness reel', time: '5 hours ago', platform: 'Instagram' },
  { type: 'script', title: 'Generated script about morning routine', time: '1 day ago', platform: 'YouTube Shorts' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { scripts, folders } = useScripts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate real stats
  const realStats = [
    { label: 'Scripts Created', value: scripts.length.toString(), icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'Thumbnails Made', value: scripts.filter(s => s.thumbnailUrl).length.toString(), icon: Image, color: 'from-violet-500 to-fuchsia-500' },
    { label: 'Viral Score Avg', value: scripts.length > 0 ? Math.round(scripts.reduce((acc, s) => acc + (s.viralScore || 0), 0) / scripts.length).toString() : '0', icon: Target, color: 'from-emerald-500 to-teal-500' },
    { label: 'Folders', value: folders.length.toString(), icon: Clock, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your content</p>
        </div>
        <Link
          to="/generate"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {realStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link
                to={action.path}
                className={`group flex flex-col items-center gap-3 p-6 bg-slate-900/50 border border-slate-800/50 hover:border-${action.color}-500/50 rounded-2xl transition-all hover:bg-slate-800/50`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-${action.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-7 h-7 text-${action.color}-400`} />
                </div>
                <span className="text-slate-300 font-medium text-center">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Scripts & Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Scripts */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Scripts</h2>
            <Link to="/scripts" className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {scripts.slice(0, 5).length > 0 ? (
            <div className="space-y-3">
              {scripts.slice(0, 5).map((script, index) => (
                <motion.div
                  key={script.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{script.title}</p>
                    <p className="text-slate-500 text-sm">{script.platform} • {script.niche}</p>
                  </div>
                  {script.viralScore && (
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                      {script.viralScore}/100
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-500">No scripts yet</p>
              <Link to="/generate" className="text-violet-400 hover:text-violet-300 text-sm mt-2 inline-block">
                Generate your first script
              </Link>
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">AI Insights</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-violet-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Optimal Posting Time</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Based on your audience, post between 6-8 PM EST for maximum engagement
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Trending in Your Niche</p>
                  <p className="text-slate-400 text-sm mt-1">
                    "Day in the life" and "POV" formats are trending +45% this week
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Content Tip</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Scripts with hooks under 3 seconds have 2x better retention rates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Banner */}
      {user?.plan === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h3>
            <p className="text-violet-100">Get unlimited scripts, AI thumbnails, and viral score predictions</p>
          </div>
          <button className="px-8 py-3 bg-white text-violet-600 font-semibold rounded-xl hover:bg-violet-50 transition-colors">
            Upgrade Now
          </button>
        </motion.div>
      )}
    </div>
  );
}