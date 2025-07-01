
import { Interview } from '@/types/interview';

const companies = ['腾讯', '字节跳动', '阿里', '百度', '美团', '京东', '网易', '滴滴', '小米', '华为'];
const categories = ['开发', '产品', '设计', '测试'];
const subcategories = {
  '开发': ['前端', '后端', '算法'],
  '产品': ['策划', '运营'],
  '设计': ['交互', 'UI'],
  '测试': ['测试']
};

const sampleQuestions = [
  '请介绍一下你的项目经验',
  '如何优化网页性能',
  '什么是闭包，请举例说明',
  'React和Vue的区别是什么',
  '如何处理异步编程',
  '数据库索引的作用是什么',
  '如何设计一个高并发系统',
  '什么是RESTful API',
  '如何进行代码测试',
  '你对我们公司有什么了解'
];

const sources = ['xiaohongshu', 'zhihu', 'niuke'] as const;
const types = ['campus', 'social'] as const;

// 生成1000道模拟题目
export const mockInterviews: Interview[] = Array.from({ length: 1000 }, (_, index) => {
  const company = companies[Math.floor(Math.random() * companies.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const subcategory = subcategories[category as keyof typeof subcategories][
    Math.floor(Math.random() * subcategories[category as keyof typeof subcategories].length)
  ];
  const type = types[Math.floor(Math.random() * types.length)];
  const source = sources[Math.floor(Math.random() * sources.length)];
  const difficulty = Math.floor(Math.random() * 9) + 1;
  const question = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
  
  // 生成随机日期（最近两年内）
  const now = new Date();
  const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
  const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
  const date = new Date(randomTime);

  return {
    id: `interview-${index + 1}`,
    question: `${question} - ${company} ${subcategory}岗位`,
    company,
    post: `${subcategory}工程师`,
    type,
    difficulty: difficulty as Interview['difficulty'],
    askedCount: Math.floor(Math.random() * 500) + 1,
    source,
    date: date.toISOString(),
    category,
    subcategory
  };
});
