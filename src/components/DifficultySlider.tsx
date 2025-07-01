
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
      return 'bg-gradient-to-t from-blue-500 to-blue-400 shadow-lg shadow-blue-500/50';
    }
    if (difficulty <= 3) return 'bg-gradient-to-t from-emerald-200 to-emerald-100';
    if (difficulty <= 6) return 'bg-gradient-to-t from-amber-200 to-amber-100';
    return 'bg-gradient-to-t from-red-200 to-red-100';
  };

  const maxCount = Math.max(...Object.values(difficultyData));

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-8 shadow-lg border border-gray-100/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          难度分布
        </h3>
        {selectedDifficulty && (
          <button
            onClick={clearDifficulty}
            className="px-4 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 rounded-full transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            清除筛选
          </button>
        )}
      </div>
      
      {/* 炫酷的难度分布柱状图 */}
      <div className="mb-10">
        <div className="flex justify-between items-end h-32 mb-6 px-2">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((difficulty) => (
            <div key={difficulty} className="flex flex-col items-center flex-1 group">
              <div className="text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {difficultyData[difficulty] || 0}
              </div>
              <div
                className={`w-6 mx-auto rounded-t-lg transition-all duration-500 ease-out transform group-hover:scale-110 ${
                  getBarColor(difficulty, selectedDifficulty === difficulty)
                } border border-white/50`}
                style={{
                  height: `${Math.max((difficultyData[difficulty] / maxCount) * 100, 8)}px`
                }}
              />
              <div className="h-1 w-6 bg-gradient-to-r from-gray-300 to-gray-200 rounded-b-lg" />
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-sm font-medium text-gray-600 px-2">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((difficulty) => (
            <div key={difficulty} className="flex-1 text-center">
              <span className={`${selectedDifficulty === difficulty ? 'text-blue-600 font-bold' : ''}`}>
                {getDifficultyLabel(difficulty)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 炫酷的可拖动难度滑动轴 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">当前选择:</span>
            <div className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 ${
              selectedDifficulty 
                ? `${getDifficultyColor(selectedDifficulty)} bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200` 
                : 'text-gray-400 bg-gray-50 border border-gray-200'
            }`}>
              {selectedDifficulty ? getDifficultyLabel(selectedDifficulty) : '未选择'}
            </div>
          </div>
          <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border">
            {selectedDifficulty ? `${difficultyData[selectedDifficulty] || 0} 道题目` : '拖动选择难度'}
          </span>
        </div>
        
        {/* 自定义滑动轴容器 */}
        <div className="relative px-4 py-6">
          {/* 背景轨道 */}
          <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2">
            <div className="h-3 bg-gradient-to-r from-emerald-100 via-amber-100 to-red-100 rounded-full shadow-inner border border-gray-200/50" />
            {/* 渐变覆盖层 */}
            <div className="absolute inset-0 h-3 bg-gradient-to-r from-emerald-200/30 via-amber-200/30 to-red-200/30 rounded-full" />
          </div>
          
          {/* 难度刻度线 */}
          <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2 flex justify-between">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="w-px h-6 bg-gray-300/50" />
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
        
        {/* 底部标签 */}
        <div className="flex justify-between text-xs font-medium text-gray-500 px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" />
            <span>简单</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-300" />
            <span>中等</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-300" />
            <span>困难</span>
          </div>
        </div>
      </div>

      {/* 装饰性元素 */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-1000" />
    </div>
  );
};

export default DifficultySlider;
