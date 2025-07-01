
import { useState, useEffect } from 'react';
import { Interview, DifficultyData } from '@/types/interview';

interface DifficultyChartProps {
  interviews: Interview[];
  selectedDifficulty: number | null;
  onDifficultySelect: (difficulty: number | null) => void;
}

const DifficultyChart = ({ interviews, selectedDifficulty, onDifficultySelect }: DifficultyChartProps) => {
  const [data, setData] = useState<DifficultyData[]>([]);

  useEffect(() => {
    const difficultyData: DifficultyData[] = [];
    const difficultyLabels = ['易1', '易2', '易3', '中1', '中2', '中3', '难1', '难2', '难3'];
    
    for (let i = 1; i <= 9; i++) {
      const count = interviews.filter(interview => interview.difficulty === i).length;
      difficultyData.push({
        difficulty: i,
        count,
        label: difficultyLabels[i - 1]
      });
    }
    
    setData(difficultyData);
  }, [interviews]);

  const maxCount = Math.max(...data.map(d => d.count));
  
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-green-500';
    if (difficulty <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDifficultyColorLight = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-green-100';
    if (difficulty <= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">难度分布</h3>
      
      {/* 清除选择按钮 */}
      {selectedDifficulty && (
        <button
          onClick={() => onDifficultySelect(null)}
          className="mb-4 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          清除难度筛选
        </button>
      )}
      
      <div className="relative">
        {/* 背景曲线 */}
        <div className="relative h-32 mb-4">
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05"/>
              </linearGradient>
            </defs>
            {data.length > 0 && (
              <>
                {/* 面积图 */}
                <path
                  d={`M 0 ${128 - (data[0].count / maxCount) * 80} ${data.map((d, i) => 
                    `L ${(i / (data.length - 1)) * 100}% ${128 - (d.count / maxCount) * 80}`
                  ).join(' ')} L 100% 128 L 0 128 Z`}
                  fill="url(#areaGradient)"
                  className="transition-all duration-500"
                />
                {/* 曲线 */}
                <path
                  d={`M 0 ${128 - (data[0].count / maxCount) * 80} ${data.map((d, i) => 
                    `L ${(i / (data.length - 1)) * 100}% ${128 - (d.count / maxCount) * 80}`
                  ).join(' ')}`}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  className="transition-all duration-500"
                />
              </>
            )}
          </svg>
        </div>
        
        {/* 难度柱状图 */}
        <div className="flex justify-between items-end h-24 mb-2">
          {data.map((item) => (
            <div key={item.difficulty} className="flex flex-col items-center flex-1">
              <div className="relative group cursor-pointer">
                {/* 数量标签 */}
                <div className="text-xs font-medium text-gray-600 mb-1 text-center">
                  {item.count}
                </div>
                {/* 柱子 */}
                <div
                  className={`w-6 mx-auto rounded-t transition-all duration-300 hover:opacity-80 ${
                    selectedDifficulty === item.difficulty
                      ? getDifficultyColor(item.difficulty)
                      : getDifficultyColorLight(item.difficulty)
                  } ${selectedDifficulty === item.difficulty ? 'ring-2 ring-blue-500' : ''}`}
                  style={{
                    height: `${Math.max((item.count / maxCount) * 80, 4)}px`
                  }}
                  onClick={() => onDifficultySelect(
                    selectedDifficulty === item.difficulty ? null : item.difficulty
                  )}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* 难度标签 */}
        <div className="flex justify-between">
          {data.map((item) => (
            <div
              key={item.difficulty}
              className={`text-xs text-center flex-1 cursor-pointer transition-colors ${
                selectedDifficulty === item.difficulty
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-500'
              }`}
              onClick={() => onDifficultySelect(
                selectedDifficulty === item.difficulty ? null : item.difficulty
              )}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DifficultyChart;
