
import { useState, useEffect } from 'react';
import { Interview } from '@/types/interview';
import { Slider } from '@/components/ui/slider';

interface DifficultySliderProps {
  interviews: Interview[];
  selectedDifficulty: number | null;
  onDifficultySelect: (difficulty: number | null) => void;
}

const DifficultySlider = ({ interviews, selectedDifficulty, onDifficultySelect }: DifficultySliderProps) => {
  const [sliderValue, setSliderValue] = useState<number[]>([selectedDifficulty || 5]);
  const [difficultyData, setDifficultyData] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const data: { [key: number]: number } = {};
    for (let i = 1; i <= 9; i++) {
      data[i] = interviews.filter(interview => interview.difficulty === i).length;
    }
    setDifficultyData(data);
  }, [interviews]);

  useEffect(() => {
    if (selectedDifficulty) {
      setSliderValue([selectedDifficulty]);
    }
  }, [selectedDifficulty]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const difficulty = value[0];
    onDifficultySelect(difficulty);
  };

  const clearDifficulty = () => {
    onDifficultySelect(null);
    setSliderValue([5]);
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['易1', '易2', '易3', '中1', '中2', '中3', '难1', '难2', '难3'];
    return labels[difficulty - 1];
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'text-emerald-600';
    if (difficulty <= 6) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBarColor = (difficulty: number, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-gradient-to-t from-blue-600 to-blue-500 shadow-lg shadow-blue-500/60 border-blue-400';
    }
    
    // 淡色显示未选中的难度
    if (difficulty <= 3) return 'bg-gradient-to-t from-emerald-200/60 to-emerald-100/60 border-emerald-200/40';
    if (difficulty <= 6) return 'bg-gradient-to-t from-amber-200/60 to-amber-100/60 border-amber-200/40';
    return 'bg-gradient-to-t from-red-200/60 to-red-100/60 border-red-200/40';
  };

  const getTextColor = (difficulty: number, isSelected: boolean) => {
    if (isSelected) return 'text-blue-700 font-bold';
    return 'text-gray-500';
  };

  const maxCount = Math.max(...Object.values(difficultyData));

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-5 shadow-sm border border-gray-100/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          难度分布
        </h3>
        {selectedDifficulty && (
          <button
            onClick={clearDifficulty}
            className="px-3 py-1.5 text-xs bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 rounded-full transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            清除筛选
          </button>
        )}
      </div>
      
      {/* 弧度曲线难度分布柱状图 - 参考上传图片的弧度设计 */}
      <div className="mb-6">
        <div className="flex justify-between items-end h-20 mb-3 px-1 relative">
          {/* 背景弧度曲线 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: '10px' }}>
            <path
              d="M 20 60 Q 180 40 340 60"
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4,4"
            />
          </svg>
          
          {Array.from({ length: 9 }, (_, i) => i + 1).map((difficulty) => {
            const isSelected = selectedDifficulty === difficulty;
            const count = difficultyData[difficulty] || 0;
            return (
              <div key={difficulty} className="flex flex-col items-center flex-1 group relative z-10">
                <div className={`text-xs font-medium mb-1.5 transition-all duration-300 ${getTextColor(difficulty, isSelected)}`}>
                  {count}
                </div>
                <div
                  className={`w-4 mx-auto rounded-t-md transition-all duration-500 ease-out transform group-hover:scale-110 border ${
                    getBarColor(difficulty, isSelected)
                  }`}
                  style={{
                    height: `${Math.max((count / maxCount) * 60, 6)}px`
                  }}
                />
                <div className="h-0.5 w-4 bg-gradient-to-r from-gray-300/50 to-gray-200/50 rounded-b-sm" />
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between text-xs font-medium px-1">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((difficulty) => {
            const isSelected = selectedDifficulty === difficulty;
            return (
              <div key={difficulty} className="flex-1 text-center">
                <span className={`transition-all duration-300 ${isSelected ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                  {getDifficultyLabel(difficulty)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 紧凑的滑动轴 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-700">当前选择:</span>
            <div className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
              selectedDifficulty 
                ? `${getDifficultyColor(selectedDifficulty)} bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200` 
                : 'text-gray-400 bg-gray-50 border border-gray-200'
            }`}>
              {selectedDifficulty ? getDifficultyLabel(selectedDifficulty) : '未选择'}
            </div>
          </div>
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border">
            {selectedDifficulty ? `${difficultyData[selectedDifficulty] || 0} 道题目` : '拖动选择难度'}
          </span>
        </div>
        
        {/* 自定义滑动轴容器 - 更紧凑 */}
        <div className="relative px-3 py-4">
          {/* 背景轨道 */}
          <div className="absolute inset-x-3 top-1/2 transform -translate-y-1/2">
            <div className="h-2.5 bg-gradient-to-r from-emerald-100 via-amber-100 to-red-100 rounded-full shadow-inner border border-gray-200/30" />
            {/* 渐变覆盖层 */}
            <div className="absolute inset-0 h-2.5 bg-gradient-to-r from-emerald-200/20 via-amber-200/20 to-red-200/20 rounded-full" />
          </div>
          
          {/* 难度刻度线 */}
          <div className="absolute inset-x-3 top-1/2 transform -translate-y-1/2 flex justify-between">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="w-px h-4 bg-gray-300/40" />
            ))}
          </div>
          
          <Slider
            value={sliderValue}
            onValueChange={handleSliderChange}
            max={9}
            min={1}
            step={1}
            className="w-full relative z-10"
          />
        </div>
        
        {/* 底部标签 - 更紧凑 */}
        <div className="flex justify-between text-xs font-medium text-gray-500 px-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" />
            <span>简单</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-300" />
            <span>中等</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-red-300" />
            <span>困难</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultySlider;
