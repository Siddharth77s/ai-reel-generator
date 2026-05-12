import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Flame,
  Clock,
  ArrowUpRight,
  Sparkles,
  Zap,
  Target,
  RefreshCw,
  Filter,
  Search,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

const platforms = ['All', 'TikTok', 'Instagram', 'YouTube', 'Twitter/X'];
const categories = ['All', 'Entertainment', 'Education', 'Tech', 'Lifestyle', 'Business', 'Gaming'];

interface TrendingTopic {
  id: string;
  title: string;
  platform: string;
  category: string;
  growth: number;
  posts: string;
  engagement: string;
  hashtags: string[];
  isNew?: boolean;
}

const mockTrends: TrendingTopic[] = [
  {
    id: '1',
    title: 'Day in the Life',
    platform: 'TikTok',
    category: 'Lifestyle',
    growth: 245,
    posts: '2.4M',
    engagement: '8.5%',
    hashtags: ['dayinmylife', 'morningroutine', 'productivity'],
    isNew: true
  },
  {
    id: '2',
    title: 'AI Explained Simply',
    platform: 'YouTube',
    category: 'Tech',
    growth: 189,
    posts: '850K',
    engagement: '12.3%',
    hashtags: ['artificialintelligence', 'aieducation', 'tech']
  },
  {
    id: '3',
    title: 'Quiet Luxury Aesthetic',
    platform: 'Instagram',
    category: 'Lifestyle',
    growth: 156,
    posts: '1.2M',
    engagement: '6.8%',
    hashtags: ['quietluxury', 'aesthetic', 'minimalism']
  },
  {
    id: '4',
    title: '5-9 Before 9-5',
    platform: 'TikTok',
    category: 'Lifestyle',
    growth: 312,
    posts: '3.1M',
    engagement: '9.2%',
    hashtags: ['5to9', 'morningroutine', 'thatgirl'],
    isNew: true
  },
  {
    id: '5',
    title: 'Learn with Me',
    platform: 'YouTube',
    category: 'Education',
    growth: 134,
    posts: '420K',
    engagement: '15.1%',
    hashtags: ['studytok', 'learnwithme', 'education']
  },
  {
    id: '6',
    title: 'Rate My Setup',
    platform: 'Twitter/X',
    category: 'Tech',
    growth: 98,
    posts: '180K',
    engagement: '4.5%',
    hashtags: ['setup', 'desksetup', 'wfh']
  },
  {
    id: '7',
    title: 'Get Ready With Me',
    platform: 'TikTok',
    category: 'Entertainment',
    growth: 178,
    posts: '5.2M',
    engagement: '7.3%',
    hashtags: ['grwm', 'getreadywithme', 'makeup']
  },
  {
    id: '8',
    title: 'POV: You\'re a...',
    platform: 'Instagram',
    category: 'Entertainment',
    growth: 203,
    posts: '1.8M',
    engagement: '11.2%',
    hashtags: ['pov', 'relatable', 'comedy']
  },
  {
    id: '9',
    title: 'Unboxing Experience',
    platform: 'YouTube',
    category: 'Tech',
    growth: 87,
    posts: '320K',
    engagement: '9.8%',
    hashtags: ['unboxing', 'asmr', 'satisfying']
  },
  {
    id: '10',
    title: 'Skincare Routine',
    platform: 'TikTok',
    category: 'Lifestyle',
    growth: 145,
    posts: '890K',
    engagement: '8.1%',
    hashtags: ['skincare', 'skincareroutine', 'glowup']
  },
  {
    id: '11',
    title: 'Side Hustle Ideas',
    platform: 'Twitter/X',
    category: 'Business',
    growth: 267,
    posts: '560K',
    engagement: '13.5%',
    hashtags: ['sidehustle', 'entrepreneur', 'passiveincome'],
    isNew: true
  },
  {
    id: '12',
    title: 'Speedrun Challenge',
    platform: 'YouTube',
    category: 'Gaming',
    growth: 198,
    posts: '750K',
    engagement: '16.2%',
    hashtags: ['speedrun', 'gaming', 'challenge']
  }
];

export default function TrendingTopics() {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const filteredTrends = mockTrends.filter(trend => {
    const matchesPlatform = selectedPlatform === 'All' || trend.platform === selectedPlatform;
    const matchesCategory = selectedCategory === 'All' || trend.category === selectedCategory;
    const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trend.hashtags.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPlatform && matchesCategory && matchesSearch;
  });

  const copyHashtags = (hashtags: string[], id: string) => {
    navigator.clipboard.writeText(hashtags.map(h => '#' + h).join(' '));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const refreshData = () => {
    setLastUpdated(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Trending Topics</h1>
          <p className="text-slate-400 mt-1">
            Discover what's viral across platforms • Updated {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Trending Now', value: '24', icon: Flame, color: 'from-red-500 to-orange-500' },
          { label: 'New This Week', value: '8', icon: Sparkles, color: 'from-violet-500 to-fuchsia-500' },
          { label: 'Total Posts', value: '18.5M', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
          { label: 'Avg Engagement', value: '9.8%', icon: Target, color: 'from-blue-500 to-cyan-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Platform Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
          {platforms.map(platform => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${
                selectedPlatform === platform
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800/30 text-slate-500 hover:bg-slate-800/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trends or hashtags..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
        </div>
      </div>

      {/* Trending Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTrends.map((trend, index) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-slate-900/50 border border-slate-800/50 hover:border-violet-500/30 rounded-2xl p-5 transition-all hover:bg-slate-800/30"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  trend.platform === 'TikTok' ? 'bg-black' :
                  trend.platform === 'Instagram' ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-500' :
                  trend.platform === 'YouTube' ? 'bg-red-600' :
                  'bg-slate-800'
                }`}>
                  <span className="text-white text-xs font-bold">
                    {trend.platform.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-violet-400 transition-colors">
                    {trend.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{trend.category}</span>
                    {trend.isNew && (
                      <span className="px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                +{trend.growth}%
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-slate-800/30 rounded-xl">
                <p className="text-2xl font-bold text-white">{trend.posts}</p>
                <p className="text-slate-500 text-xs">Posts</p>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-xl">
                <p className="text-2xl font-bold text-white">{trend.engagement}</p>
                <p className="text-slate-500 text-xs">Engagement</p>
              </div>
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {trend.hashtags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-800/50 text-slate-400 rounded-lg text-xs">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => copyHashtags(trend.hashtags, trend.id)}
                className="flex-1 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {copiedId === trend.id ? (
                  <><Check className="w-4 h-4" /> Copied</>
                ) : (
                  <><Copy className="w-4 h-4" /> Copy Tags</>
                )}
              </button>
              <button className="px-3 py-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTrends.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">No trends found</h3>
          <p className="text-slate-500">Try adjusting your filters</p>
        </div>
      )}

      {/* Pro Tip */}
      <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Pro Tip: Trend Jackacking</h3>
            <p className="text-slate-400 text-sm">
              Don't just copy trends — add your unique twist. Take a trending format and adapt it to your niche 
              for maximum engagement while staying authentic to your brand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
