
import { Interview } from '@/types/interview';

const companies = ['腾讯', '字节跳动', '阿里', '百度', '美团'];
const sources: Array<'xiaohongshu' | 'zhihu' | 'niuke'> = ['xiaohongshu', 'zhihu', 'niuke'];
const types: Array<'campus' | 'social'> = ['campus', 'social'];

const questions = {
  frontend: [
    'JavaScript闭包的原理和应用场景是什么？',
    'React的虚拟DOM是如何工作的？',
    'CSS中的BFC是什么？如何触发？',
    'Vue的响应式原理是什么？',
    'Webpack的工作原理和优化策略？',
    'HTTP/HTTPS的区别和工作原理？',
    '前端性能优化的方法有哪些？',
    'TypeScript相比JavaScript的优势？',
    '如何实现一个深拷贝函数？',
    '浏览器的渲染过程是怎样的？'
  ],
  backend: [
    'MySQL的索引原理和优化策略？',
    'Redis的数据结构和使用场景？',
    'Spring Boot的自动配置原理？',
    '分布式系统的CAP理论？',
    '如何设计一个高并发的秒杀系统？',
    'Docker容器化的优势和原理？',
    'RESTful API的设计原则？',
    '数据库事务的ACID特性？',
    '消息队列的应用场景和选型？',
    'JVM的内存模型和垃圾回收？'
  ],
  algorithm: [
    '如何实现快速排序算法？',
    '二叉树的遍历方式有哪些？',
    '动态规划的基本思想和应用？',
    '哈希表的实现原理？',
    '图的最短路径算法？',
    '如何判断链表是否有环？',
    '字符串匹配的KMP算法？',
    '堆排序的时间复杂度分析？',
    '贪心算法的应用场景？',
    '递归和迭代的区别？'
  ],
  product: [
    '如何分析用户需求和痛点？',
    '产品生命周期管理策略？',
    'A/B测试的设计和分析？',
    '如何制定产品路线图？',
    '用户画像的构建方法？',
    '产品数据分析的关键指标？',
    '如何进行竞品分析？',
    '敏捷开发中的产品角色？',
    '如何平衡用户需求和技术实现？',
    '产品迭代的优先级排序？'
  ],
  design: [
    '用户体验设计的基本原则？',
    '如何进行用户研究和调研？',
    '设计系统的构建和维护？',
    '交互设计的可用性测试？',
    'UI设计的色彩搭配理论？',
    '响应式设计的实现方法？',
    '如何进行设计评审？',
    '原型设计工具的选择？',
    '无障碍设计的重要性？',
    '设计趋势的把握和应用？'
  ],
  test: [
    '自动化测试的框架选择？',
    '性能测试的方法和工具？',
    '接口测试的用例设计？',
    '如何进行兼容性测试？',
    '测试用例的设计原则？',
    'Bug的生命周期管理？',
    '白盒测试和黑盒测试的区别？',
    '回归测试的策略？',
    '测试环境的搭建和维护？',
    '质量保证流程的建立？'
  ]
};

export const generateMockData = (): Interview[] => {
  const interviews: Interview[] = [];
  const categories = {
    '开发': ['前端', '后端', '算法'],
    '产品': ['策划', '运营'],
    '设计': ['交互', 'UI'],
    '测试': ['测试']
  };

  let id = 1;

  Object.entries(categories).forEach(([category, subcategories]) => {
    subcategories.forEach(subcategory => {
      const questionSet = questions[subcategory.toLowerCase() as keyof typeof questions] || questions.frontend;
      
      questionSet.forEach(question => {
        companies.forEach(company => {
          if (Math.random() > 0.6) { // 不是每个公司都有每道题
            const interview: Interview = {
              id: String(id++),
              question,
              company,
              post: subcategory,
              type: types[Math.floor(Math.random() * types.length)],
              difficulty: (Math.floor(Math.random() * 9) + 1) as Interview['difficulty'],
              askedCount: Math.floor(Math.random() * 100) + 1,
              source: sources[Math.floor(Math.random() * sources.length)],
              date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 2).toISOString(),
              category,
              subcategory
            };
            interviews.push(interview);
          }
        });
      });
    });
  });

  return interviews.sort((a, b) => b.askedCount - a.askedCount);
};

export const mockInterviews = generateMockData();
