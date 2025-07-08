
import { Interview } from '@/types/interview';
import { Flame } from 'lucide-react';

interface InterviewCardProps {
  interview: Interview;
  onAIAnalysis: (interview: Interview) => void;
}

const InterviewCard = ({ interview, onAIAnalysis }: InterviewCardProps) => {
  const getSourceLabel = (source: string) => {
    const sourceMap = {
      xiaohongshu: '小红书',
      zhihu: '知乎',
      niuke: '牛客'
    };
    return sourceMap[source as keyof typeof sourceMap] || source;
  };

  const getSourceColor = (source: string) => {
    const colorMap = {
      xiaohongshu: 'text-pink-600 bg-pink-50 hover:bg-pink-100',
      zhihu: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
      niuke: 'text-green-600 bg-green-50 hover:bg-green-100'
    };
    return colorMap[source as keyof typeof colorMap] || 'text-gray-600 bg-gray-50 hover:bg-gray-100';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'text-green-600 bg-green-50';
    if (difficulty <= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['易1', '易2', '易3', '中1', '中2', '中3', '难1', '难2', '难3'];
    return labels[difficulty - 1] || `难度${difficulty}`;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-200 group">
      {/* 头部：热度和难度 */}
      <div className="flex justify-between items-start mb-4">
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(interview.difficulty)}`}>
          {getDifficultyLabel(interview.difficulty)}
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium">
          <Flame className="w-4 h-4" />
          <span>被问 {interview.askedCount} 次</span>
        </div>
      </div>

      {/* 问题内容 */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed line-clamp-3">
          {interview.question}
        </h3>
      </div>

      {/* 公司和岗位信息 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          {interview.company}
        </span>
        <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm">
          {interview.category} · {interview.subcategory}
        </span>
        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
          {interview.type === 'campus' ? '校招' : '社招'}
        </span>
      </div>

      {/* 底部信息和操作 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 mr-1">来源：</span>
            {interview.sources.map((source, index) => (
              <button
                key={source.platform}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(source.url, '_blank');
                }}
                className={`px-2 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${getSourceColor(source.platform)}`}
              >
                {getSourceLabel(source.platform)}
              </button>
            ))}
          </div>
          {/* 显示时间 */}
          <div className="text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-50 rounded-md border">
              {new Date(interview.date).toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAIAnalysis(interview);
          }}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 group-hover:shadow-lg"
        >
          AI解析
        </button>
      </div>
    </div>
  );
};

export default InterviewCard;
