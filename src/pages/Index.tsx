
import { useState, useEffect, useMemo } from 'react';
import { FilterState, Interview } from '@/types/interview';
import { mockInterviews } from '@/utils/mockData';
import TopFilters from '@/components/TopFilters';
import DifficultySlider from '@/components/DifficultySlider';
import InterviewCard from '@/components/InterviewCard';
import AIAnalysisModal from '@/components/AIAnalysisModal';
import MobileFilterDrawer from '@/components/MobileFilterDrawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { TrendingUp, Sparkles } from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<FilterState>({
    type: null,
    category: null,
    subcategory: null,
    companies: [],
    timeRange: null,
    difficulty: null
  });
  
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  const filteredInterviews = useMemo(() => {
    let result = mockInterviews;

    // 类型过滤
    if (filters.type) {
      result = result.filter(interview => interview.type === filters.type);
    }

    // 岗位过滤
    if (filters.category) {
      result = result.filter(interview => interview.category === filters.category);
    }
    if (filters.subcategory) {
      result = result.filter(interview => interview.subcategory === filters.subcategory);
    }

    // 公司过滤
    if (filters.companies.length > 0) {
      result = result.filter(interview => filters.companies.includes(interview.company));
    }

    // 时间过滤
    if (filters.timeRange) {
      const now = new Date();
      const timeRangeMap = {
        two_weeks: 14 * 24 * 60 * 60 * 1000,
        one_month: 30 * 24 * 60 * 60 * 1000,
        half_year: 182 * 24 * 60 * 60 * 1000,
        one_year: 365 * 24 * 60 * 60 * 1000,
        two_years: 730 * 24 * 60 * 60 * 1000
      };
      const timeLimit = timeRangeMap[filters.timeRange];
      result = result.filter(interview => 
        now.getTime() - new Date(interview.date).getTime() <= timeLimit
      );
    }

    // 难度过滤
    if (filters.difficulty) {
      result = result.filter(interview => interview.difficulty === filters.difficulty);
    }

    return result;
  }, [filters]);

  const handleAIAnalysis = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsAnalysisModalOpen(true);
  };

  const handleDifficultySelect = (difficulty: number | null) => {
    setFilters(prev => ({ ...prev, difficulty }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/10">
      {/* 精简头部 */}
      <header className="bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  面经聚合
                </h1>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>智能面试题库</span>
                </div>
              </div>
            </div>
            
            {isMobile && (
              <MobileFilterDrawer 
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredInterviews.length}
              />
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 紧凑的筛选条件 - 桌面端显示在顶部 */}
        {!isMobile && (
          <div className="mb-5">
            <TopFilters 
              filters={filters} 
              onFiltersChange={setFilters}
            />
          </div>
        )}

        {/* 紧凑的难度滑动轴 */}
        <div className="mb-6">
          <DifficultySlider
            interviews={mockInterviews}
            selectedDifficulty={filters.difficulty}
            onDifficultySelect={handleDifficultySelect}
          />
        </div>

        {/* 简洁的结果统计 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              面试题列表 ({filteredInterviews.length})
            </h2>
            {filteredInterviews.length > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100/50 px-2 py-1 rounded-full border border-gray-200/50">
                按热度排序
              </span>
            )}
          </div>
        </div>

        {/* 面试题列表 - 占据主要空间 */}
        <div className="min-h-[70vh]">
          {filteredInterviews.length > 0 ? (
            <div className="grid gap-4">
              {filteredInterviews.map((interview) => (
                <div key={interview.id} className="animate-fade-in">
                  <InterviewCard
                    interview={interview}
                    onAIAnalysis={handleAIAnalysis}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-lg rounded-xl p-12 shadow-lg border border-gray-100/50 text-center">
              <div className="text-gray-400 mb-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">暂无相关面试题</h3>
              <p className="text-gray-600 mb-4">
                请调整筛选条件
              </p>
              <button
                onClick={() => {
                  setFilters({
                    type: null,
                    category: null,
                    subcategory: null,
                    companies: [],
                    timeRange: null,
                    difficulty: null
                  });
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
              >
                清除筛选条件
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI 解析模态框 */}
      <AIAnalysisModal
        interview={selectedInterview}
        isOpen={isAnalysisModalOpen}
        onClose={() => {
          setIsAnalysisModalOpen(false);
          setSelectedInterview(null);
        }}
      />
    </div>
  );
};

export default Index;
