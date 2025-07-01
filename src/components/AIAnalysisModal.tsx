
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Interview } from '@/types/interview';
import { Brain, Lightbulb, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AIAnalysisModalProps {
  interview: Interview | null;
  isOpen: boolean;
  onClose: () => void;
}

const AIAnalysisModal = ({ interview, isOpen, onClose }: AIAnalysisModalProps) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');

  useEffect(() => {
    if (interview && isOpen) {
      setLoading(true);
      setAnalysis('');
      
      // 模拟AI分析过程
      setTimeout(() => {
        const mockAnalysis = generateMockAnalysis(interview);
        setAnalysis(mockAnalysis);
        setLoading(false);
      }, 2000);
    }
  }, [interview, isOpen]);

  const generateMockAnalysis = (interview: Interview) => {
    const analysisTemplates = {
      前端: `这是一道经典的前端面试题，主要考察候选人对核心概念的理解。

**知识点分析：**
• 需要深入理解JavaScript基础机制
• 考察对现代前端框架的掌握程度
• 涉及浏览器底层原理

**回答思路：**
1. 首先解释核心概念和基本原理
2. 通过具体例子说明应用场景
3. 对比不同解决方案的优缺点
4. 结合实际项目经验分享

**加分项：**
• 能够从性能优化角度分析
• 提及相关的最佳实践
• 展示对新技术趋势的了解`,

      后端: `这是一道考察后端架构设计能力的题目，需要展现系统性思维。

**技术要点：**
• 数据库设计和性能优化
• 分布式系统架构理解
• 高并发场景处理能力

**解答框架：**
1. 分析业务需求和技术挑战
2. 设计系统架构和数据模型
3. 考虑性能、安全、可扩展性
4. 讨论可能的技术方案对比

**深入方向：**
• 缓存策略和数据一致性
• 微服务拆分和治理
• 监控和故障处理机制`,

      算法: `这是一道经典算法题，主要考察编程思维和优化能力。

**算法分析：**
• 时间复杂度：O(n log n)
• 空间复杂度：O(1)
• 适用场景：大规模数据处理

**解题步骤：**
1. 理解题目要求和约束条件
2. 分析暴力解法的时间复杂度
3. 优化算法，降低复杂度
4. 编写代码并测试边界情况

**优化思路：**
• 使用合适的数据结构
• 考虑递归vs迭代的选择
• 注意内存使用和性能优化`
    };

    const category = interview.subcategory;
    return analysisTemplates[category as keyof typeof analysisTemplates] || analysisTemplates.前端;
  };

  if (!interview) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="w-6 h-6 text-blue-600" />
            AI 解析
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 问题展示 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-2">面试题目</h3>
            <p className="text-gray-700 leading-relaxed">{interview.question}</p>
            
            <div className="flex items-center gap-2 mt-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                {interview.company}
              </span>
              <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                {interview.category} · {interview.subcategory}
              </span>
              <span className="text-sm text-gray-500">
                被问 {interview.askedCount} 次
              </span>
            </div>
          </div>

          {/* AI分析内容 */}
          <div className="bg-white border rounded-xl p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">AI正在分析中...</p>
                  <p className="text-sm text-gray-500 mt-2">正在生成专业解析和答题思路</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h4 className="font-semibold text-gray-900">智能解析</h4>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  {analysis.split('\n').map((line, index) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <h5 key={index} className="font-semibold text-gray-900 mt-4 mb-2">
                          {line.replace(/\*\*/g, '')}
                        </h5>
                      );
                    }
                    if (line.startsWith('•')) {
                      return (
                        <div key={index} className="flex items-start gap-2 ml-4">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{line.substring(2)}</p>
                        </div>
                      );
                    }
                    if (line.match(/^\d+\./)) {
                      return (
                        <div key={index} className="flex items-start gap-2 ml-4">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {line.match(/^(\d+)\./)?.[1]}
                          </div>
                          <p className="text-gray-700">{line.replace(/^\d+\.\s*/, '')}</p>
                        </div>
                      );
                    }
                    if (line.trim()) {
                      return (
                        <p key={index} className="text-gray-700 leading-relaxed">
                          {line}
                        </p>
                      );
                    }
                    return <br key={index} />;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 底部操作 */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>解析生成时间：{new Date().toLocaleTimeString('zh-CN')}</span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                关闭
              </button>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                收藏解析
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAnalysisModal;
