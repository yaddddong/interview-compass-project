
import { useState, useEffect, useMemo } from 'react';
import { FilterState, Interview } from '@/types/interview';
import { mockInterviews } from '@/utils/mockData';
import TopFilters from '@/components/TopFilters';
import DifficultySlider from '@/components/DifficultySlider';
import InterviewCard from '@/components/InterviewCard';
import AIAnalysisModal from '@/components/AIAnalysisModal';
import MobileFilterDrawer from '@/components/MobileFilterDrawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search, TrendingUp } from 'lucide-react';

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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  const filteredInterviews = useMemo(() => {
    let result = mockInterviews;

    // 搜索过滤
    if (searchTerm.trim()) {
      result = result.filter(interview => 
        interview.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
  }, [filters, searchTerm]);

  const handleAIAnalysis = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsAnalysisModalOpen(true);
  };

  const handleDifficultySelect = (difficulty: number | null) => {
    setFilters(prev => ({ ...prev, difficulty }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">面经聚合</h1>
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
        {/* 搜索栏 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索面试题、公司或岗位..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 筛选条件 - 桌面端显示在顶部 */}
        {!isMobile && (
          <div className="mb-6">
            <TopFilters 
              filters={filters} 
              onFiltersChange={setFilters}
            />
          </div>
        )}

        {/* 难度滑动轴 */}
        <div className="mb-6">
          <DifficultySlider
            interviews={filteredInterviews}
            selectedDifficulty={filters.difficulty}
            onDifficultySelect={handleDifficultySelect}
          />
        </div>

        {/* 结果统计 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              面试题列表 ({filteredInterviews.length})
            </h2>
            {filteredInterviews.length > 0 && (
              <span className="text-sm text-gray-500">
                按热度排序
              </span>
            )}
          </div>
        </div>

        {/* 面试题列表 */}
        {filteredInterviews.length > 0 ? (
          <div className="grid gap-4 md:gap-6">
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
          <div className="bg-white rounded-xl p-12 shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无相关面试题</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? '请尝试其他搜索关键词' : '请调整筛选条件'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  type: null,
                  category: null,
                  subcategory: null,
                  companies: [],
                  timeRange: null,
                  difficulty: null
                });
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              清除筛选条件
            </button>
          </div>
        )}
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
