
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
    setSliderValue([5]); // 重置到中间值
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['易1', '易2', '易3', '中1', '中2', '中3', '难1', '难2', '难3'];
    return labels[difficulty - 1];
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'text-green-600';
    if (difficulty <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const maxCount = Math.max(...Object.values(difficultyData));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">难度分布 (拖动选择)</h3>
        {selectedDifficulty && (
          <button
            onClick={clearDifficulty}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            清除难度筛选
          </button>
        )}
      </div>
      
      {/* 难度分布柱状图 */}
      <div className="mb-6">
        <div className="flex justify-between items-end h-20 mb-4">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((difficulty) => (
            <div key={difficulty} className="flex flex-col items-center flex-1">
              <div className="text-xs font-medium text-gray-600 mb-1">
                {difficultyData[difficulty] || 0}
              </div>
              <div
                className={`w-4 mx-auto rounded-t transition-all duration-300 ${
                  selectedDifficulty === difficulty
                    ? 'bg-blue-500'
                    : difficulty <= 3
                    ? 'bg-green-200'
                    : difficulty <= 6
                    ? 'bg-yellow-200'
                    : 'bg-red-200'
                }`}
                style={{
                  height: `${Math.max((difficultyData[difficulty] / maxCount) * 60, 4)}px`
                }}
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((difficulty) => (
            <div key={difficulty} className="flex-1 text-center">
              {getDifficultyLabel(difficulty)}
            </div>
          ))}
        </div>
      </div>

      {/* 可拖动的难度滑动轴 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            当前选择: 
            <span className={`ml-2 font-bold ${selectedDifficulty ? getDifficultyColor(selectedDifficulty) : 'text-gray-400'}`}>
              {selectedDifficulty ? getDifficultyLabel(selectedDifficulty) : '未选择'}
            </span>
          </span>
          <span className="text-sm text-gray-500">
            {selectedDifficulty ? `${difficultyData[selectedDifficulty] || 0} 道题目` : '拖动选择难度'}
          </span>
        </div>
        
        <div className="px-3">
          <Slider
            value={sliderValue}
            onValueChange={handleSliderChange}
            max={9}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 px-3">
          <span>简单</span>
          <span>中等</span>
          <span>困难</span>
        </div>
      </div>
    </div>
  );
};

export default DifficultySlider;
