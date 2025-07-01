
import { FilterState } from '@/types/interview';
import { X } from 'lucide-react';

interface TopFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const TopFilters = ({ filters, onFiltersChange }: TopFiltersProps) => {
  const categories = {
    '开发': ['前端', '后端', '算法'],
    '产品': ['策划', '运营'],
    '设计': ['交互', 'UI'],
    '测试': ['测试']
  };

  const companies = ['腾讯', '字节跳动', '阿里', '百度', '美团', '京东', '网易', '滴滴', '小米', '华为'];

  const timeRanges = [
    { value: 'two_weeks', label: '最近两周' },
    { value: 'one_month', label: '最近一个月' },
    { value: 'half_year', label: '最近半年' },
    { value: 'one_year', label: '最近一年' },
    { value: 'two_years', label: '最近两年' }
  ];

  const updateFilters = (newFilters: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...newFilters });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      type: null,
      category: null,
      subcategory: null,
      companies: [],
      timeRange: null,
      difficulty: null
    });
  };

  const removeFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case 'type':
        updateFilters({ type: null });
        break;
      case 'category':
        updateFilters({ category: null, subcategory: null });
        break;
      case 'subcategory':
        updateFilters({ subcategory: null });
        break;
      case 'company':
        updateFilters({ 
          companies: filters.companies.filter(c => c !== value) 
        });
        break;
      case 'timeRange':
        updateFilters({ timeRange: null });
        break;
    }
  };

  const hasActiveFilters = filters.type || filters.category || filters.subcategory || 
    filters.companies.length > 0 || filters.timeRange;

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-sm border border-gray-100/50">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">筛选条件</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            清空全部
          </button>
        )}
      </div>

      {/* 已选标签 */}
      {hasActiveFilters && (
        <div className="mb-4">
          <h3 className="text-xs font-medium text-gray-700 mb-2">已选条件</h3>
          <div className="flex flex-wrap gap-1.5">
            {filters.type && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                {filters.type === 'campus' ? '校招' : '社招'}
                <X 
                  className="w-2.5 h-2.5 cursor-pointer hover:text-blue-900" 
                  onClick={() => removeFilter('type')}
                />
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                {filters.category}
                <X 
                  className="w-2.5 h-2.5 cursor-pointer hover:text-green-900" 
                  onClick={() => removeFilter('category')}
                />
              </span>
            )}
            {filters.subcategory && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                {filters.subcategory}
                <X 
                  className="w-2.5 h-2.5 cursor-pointer hover:text-purple-900" 
                  onClick={() => removeFilter('subcategory')}
                />
              </span>
            )}
            {filters.companies.map(company => (
              <span key={company} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                {company}
                <X 
                  className="w-2.5 h-2.5 cursor-pointer hover:text-orange-900" 
                  onClick={() => removeFilter('company', company)}
                />
              </span>
            ))}
            {filters.timeRange && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {timeRanges.find(t => t.value === filters.timeRange)?.label}
                <X 
                  className="w-2.5 h-2.5 cursor-pointer hover:text-gray-900" 
                  onClick={() => removeFilter('timeRange')}
                />
              </span>
            )}
          </div>
        </div>
      )}

      {/* 筛选选项 - 紧凑横向布局 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* 类型筛选 */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-2">类型</h3>
          <div className="space-y-1.5">
            {[
              { value: 'campus', label: '校招' },
              { value: 'social', label: '社招' }
            ].map(type => (
              <label key={type.value} className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  checked={filters.type === type.value}
                  onChange={() => updateFilters({ 
                    type: filters.type === type.value ? null : type.value as 'campus' | 'social'
                  })}
                  className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-1.5 text-xs text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 岗位筛选 */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-2">岗位</h3>
          <div className="space-y-1.5">
            {Object.entries(categories).map(([category, subcategories]) => (
              <div key={category}>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category}
                    onChange={() => {
                      if (filters.category === category) {
                        updateFilters({ category: null, subcategory: null });
                      } else {
                        updateFilters({ category, subcategory: null });
                      }
                    }}
                    className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-1.5 text-xs font-medium text-gray-900">{category}</span>
                </label>
                
                {filters.category === category && (
                  <div className="ml-4 space-y-0.5">
                    {subcategories.map(subcategory => (
                      <label key={subcategory} className="flex items-center">
                        <input
                          type="radio"
                          name="subcategory"
                          checked={filters.subcategory === subcategory}
                          onChange={() => updateFilters({ 
                            subcategory: filters.subcategory === subcategory ? null : subcategory
                          })}
                          className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-1.5 text-xs text-gray-600">{subcategory}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 公司筛选 - 移除搜索框 */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-2">公司</h3>
          <div className="space-y-1.5 max-h-24 overflow-y-auto">
            {companies.slice(0, 8).map(company => (
              <label key={company} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.companies.includes(company)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateFilters({ 
                        companies: [...filters.companies, company] 
                      });
                    } else {
                      updateFilters({ 
                        companies: filters.companies.filter(c => c !== company) 
                      });
                    }
                  }}
                  className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-1.5 text-xs text-gray-700">{company}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 时间筛选 */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-2">面经时间</h3>
          <div className="space-y-1.5">
            {timeRanges.slice(0, 4).map(range => (
              <label key={range.value} className="flex items-center">
                <input
                  type="radio"
                  name="timeRange"
                  checked={filters.timeRange === range.value}
                  onChange={() => updateFilters({ 
                    timeRange: filters.timeRange === range.value ? null : range.value as FilterState['timeRange']
                  })}
                  className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-1.5 text-xs text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopFilters;
