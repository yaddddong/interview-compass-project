
import { useState, useEffect } from 'react';
import { Interview } from '@/types/interview';
import { Slider } from '@/components/ui/slider';
import { BarChart3 } from 'lucide-react';

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
      {/* 难度标签和重置按钮 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-md flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="text-base font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            难度分布
          </h3>
        </div>
        {selectedDifficulty && (
          <button
            onClick={() => onDifficultySelect(null)}
            className="px-3 py-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-all duration-200 rounded-lg hover:bg-primary/10 border border-primary/20 hover:border-primary/30"
          >
            查看全部
          </button>
        )}
      </div>
      
      {/* 平滑曲线分布图 */}
      <div className="mb-4">
        <div className="relative h-20 mb-2 px-1 overflow-hidden">
          {/* 动态背景光效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent opacity-60" />
          
          {/* SVG曲线图 */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6"/>
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2"/>
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981"/>
                <stop offset="50%" stopColor="#F59E0B"/>
                <stop offset="100%" stopColor="#EF4444"/>
              </linearGradient>
            </defs>
            
            {/* 生成平滑曲线路径 */}
            {maxCount > 0 && (() => {
              const points = Array.from({ length: 9 }, (_, i) => {
                const x = (i / 8) * 95 + 2.5; // 留出边距
                const count = difficultyData[i + 1] || 0;
                const y = 75 - (count / maxCount) * 60; // 增加高度范围
                return { x, y, count, difficulty: i + 1 };
              });
              
              // 创建平滑曲线
              const createSmoothPath = (points: {x: number, y: number}[]) => {
                if (points.length < 2) return '';
                
                let path = `M ${points[0].x} ${points[0].y}`;
                
                for (let i = 1; i < points.length; i++) {
                  const prev = points[i - 1];
                  const curr = points[i];
                  const next = points[i + 1];
                  
                  // 使用三次贝塞尔曲线创建更平滑的效果
                  const tension = 0.3;
                  const cp1x = prev.x + (curr.x - prev.x) * tension;
                  const cp2x = curr.x - (next ? (next.x - prev.x) : (curr.x - prev.x)) * tension;
                  
                  path += ` C ${cp1x} ${prev.y} ${cp2x} ${curr.y} ${curr.x} ${curr.y}`;
                }
                
                return path;
              };
              
              const smoothPath = createSmoothPath(points);
              const areaPath = smoothPath + ` L 97.5 75 L 2.5 75 Z`;
              
              return (
                <>
                  {/* 填充区域 */}
                  <path
                    d={areaPath}
                    fill="url(#curveGradient)"
                    className="transition-all duration-700"
                  />
                  {/* 曲线描边 */}
                  <path
                    d={smoothPath}
                    fill="none"
                    stroke="url(#strokeGradient)"
                    strokeWidth="3"
                    className="transition-all duration-700 drop-shadow-sm"
                  />
                  {/* 数据点 */}
                  {points.map((point, i) => {
                    const isSelected = selectedDifficulty === point.difficulty;
                    return (
                      <g key={i}>
                        {/* 点击区域 */}
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="8"
                          fill="transparent"
                          className="cursor-pointer"
                          onClick={() => onDifficultySelect(selectedDifficulty === point.difficulty ? null : point.difficulty)}
                        />
                        {/* 可视化圆点 */}
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={isSelected ? "4" : "3"}
                          fill={isSelected ? "#8B5CF6" : "#FFFFFF"}
                          stroke={isSelected ? "#FFFFFF" : "#8B5CF6"}
                          strokeWidth="2"
                          className="transition-all duration-300 drop-shadow-md pointer-events-none"
                        />
                        {/* 数量标签 */}
                        <text
                          x={point.x}
                          y={point.y - 12}
                          textAnchor="middle"
                          className={`text-xs font-bold transition-all duration-300 pointer-events-none ${
                            isSelected ? 'fill-purple-600' : 'fill-gray-500'
                          }`}
                          fontSize="10"
                        >
                          {point.count}
                        </text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>
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
