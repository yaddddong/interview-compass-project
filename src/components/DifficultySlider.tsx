
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

  const getDifficultyIcon = (difficulty: number) => {
    const icons = ['●', '●●', '●●●', '◆', '◆◆', '◆◆◆', '▲', '▲▲', '▲▲▲'];
    return icons[difficulty - 1];
  };

  const getDifficultyColor = (difficulty: number, isSelected: boolean) => {
    if (isSelected) {
      return 'text-white font-bold';
    }
    if (difficulty <= 3) return 'text-emerald-500';
    if (difficulty <= 6) return 'text-amber-500';
    return 'text-red-500';
  };

  const getBarGradient = (difficulty: number, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-gradient-to-t from-indigo-600 via-purple-600 to-blue-500 shadow-xl shadow-purple-500/60 border-purple-400';
    }
    
    if (difficulty <= 3) return 'bg-gradient-to-t from-emerald-300/40 to-emerald-200/30 border-emerald-200/30';
    if (difficulty <= 6) return 'bg-gradient-to-t from-amber-300/40 to-amber-200/30 border-amber-200/30';
    return 'bg-gradient-to-t from-red-300/40 to-red-200/30 border-red-200/30';
  };

  const maxCount = Math.max(...Object.values(difficultyData));

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-sm border border-gray-100/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
          <h3 className="text-sm font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            难度热力图
          </h3>
        </div>
        {selectedDifficulty && (
          <button
            onClick={clearDifficulty}
            className="px-2 py-1 text-xs bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 rounded-md transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            重置
          </button>
        )}
      </div>
      
      {/* 炫酷的分布图 - 采用密集的圆点设计 */}
      <div className="mb-4">
        <div className="flex justify-between items-end h-16 mb-2 px-1 relative overflow-hidden">
          {/* 动态背景光效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent opacity-60" />
          
          {/* 网格背景 */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-9 h-full gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border-r border-dashed border-gray-300 last:border-r-0" />
              ))}
            </div>
          </div>
          
          {Array.from({ length: 9 }, (_, i) => i + 1).map((difficulty) => {
            const isSelected = selectedDifficulty === difficulty;
            const count = difficultyData[difficulty] || 0;
            const height = Math.max((count / maxCount) * 50, 4);
            
            return (
              <div key={difficulty} className="flex flex-col items-center flex-1 group relative z-10">
                {/* 数量显示 */}
                <div className={`text-xs font-bold mb-1 transition-all duration-300 ${
                  isSelected ? 'text-purple-600 scale-110' : 'text-gray-500'
                }`}>
                  {count}
                </div>
                
                {/* 立体柱状图 */}
                <div className="relative">
                  <div
                    className={`w-6 mx-auto rounded-lg transition-all duration-700 ease-out transform group-hover:scale-110 border-2 relative overflow-hidden ${
                      getBarGradient(difficulty, isSelected)
                    }`}
                    style={{ height: `${height}px` }}
                  >
                    {/* 内部高光效果 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10" />
                    {/* 顶部光泽 */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-white/40 rounded-t-lg" />
                  </div>
                  
                  {/* 底部阴影 */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-1 bg-gray-300/20 rounded-full blur-sm" />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 图标标签行 - 更密集紧凑 */}
        <div className="flex justify-between text-sm font-bold px-1">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((difficulty) => {
            const isSelected = selectedDifficulty === difficulty;
            return (
              <div key={difficulty} className="flex-1 text-center">
                <span className={`transition-all duration-300 ${
                  isSelected 
                    ? 'text-purple-600 scale-125 drop-shadow-sm' 
                    : getDifficultyColor(difficulty, false)
                }`}>
                  {getDifficultyIcon(difficulty)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 精简的控制区域 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-700">当前:</span>
            <div className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all duration-300 ${
              selectedDifficulty 
                ? 'text-white bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30' 
                : 'text-gray-400 bg-gray-100 border border-gray-200'
            }`}>
              {selectedDifficulty ? getDifficultyIcon(selectedDifficulty) : '未选择'}
            </div>
          </div>
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border">
            {selectedDifficulty ? `${difficultyData[selectedDifficulty] || 0} 题` : '拖动选择'}
          </span>
        </div>
        
        {/* 渐变滑动轴 */}
        <div className="relative px-2 py-3">
          {/* 彩虹轨道 */}
          <div className="absolute inset-x-2 top-1/2 transform -translate-y-1/2">
            <div className="h-3 bg-gradient-to-r from-emerald-300 via-amber-300 to-red-300 rounded-full shadow-inner border border-gray-200/50" />
            <div className="absolute inset-0 h-3 bg-gradient-to-r from-emerald-400/30 via-amber-400/30 to-red-400/30 rounded-full" />
          </div>
          
          {/* 刻度点 */}
          <div className="absolute inset-x-2 top-1/2 transform -translate-y-1/2 flex justify-between">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="w-0.5 h-5 bg-white/60 rounded-full shadow-sm" />
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
        
        {/* 图例 - 更紧凑 */}
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-emerald-500 font-bold">●●●</span>
            <span className="text-gray-600">简单</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500 font-bold">◆◆◆</span>
            <span className="text-gray-600">中等</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-500 font-bold">▲▲▲</span>
            <span className="text-gray-600">困难</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultySlider;
