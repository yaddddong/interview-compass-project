
import { useState } from 'react';
import { FilterState } from '@/types/interview';
import { X, Search } from 'lucide-react';

interface TopFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const TopFilters = ({ filters, onFiltersChange }: TopFiltersProps) => {
  const [companySearch, setCompanySearch] = useState('');

  const categories = {
    '开发': ['前端', '后端', '算法'],
    '产品': ['策划', '运营'],
    '设计': ['交互', 'UI'],
    '测试': ['测试']
  };

  const companies = ['腾讯', '字节跳动', '阿里', '百度', '美团', '京东', '网易', '滴滴', '小米', '华为'];
  const filteredCompanies = companies.filter(company => 
    company.toLowerCase().includes(companySearch.toLowerCase())
  );

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
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">筛选条件</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            清空全部
          </button>
        )}
      </div>

      {/* 已选标签 */}
      {hasActiveFilters && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">已选条件</h3>
          <div className="flex flex-wrap gap-2">
            {filters.type && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {filters.type === 'campus' ? '校招' : '社招'}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-blue-900" 
                  onClick={() => removeFilter('type')}
                />
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {filters.category}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-green-900" 
                  onClick={() => removeFilter('category')}
                />
              </span>
            )}
            {filters.subcategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {filters.subcategory}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-purple-900" 
                  onClick={() => removeFilter('subcategory')}
                />
              </span>
            )}
            {filters.companies.map(company => (
              <span key={company} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                {company}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-orange-900" 
                  onClick={() => removeFilter('company', company)}
                />
              </span>
            ))}
            {filters.timeRange && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {timeRanges.find(t => t.value === filters.timeRange)?.label}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-gray-900" 
                  onClick={() => removeFilter('timeRange')}
                />
              </span>
            )}
          </div>
        </div>
      )}

      {/* 筛选选项 - 横向布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* 类型筛选 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">类型</h3>
          <div className="space-y-2">
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
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 岗位筛选 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">岗位</h3>
          <div className="space-y-2">
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
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900">{category}</span>
                </label>
                
                {filters.category === category && (
                  <div className="ml-6 space-y-1">
                    {subcategories.map(subcategory => (
                      <label key={subcategory} className="flex items-center">
                        <input
                          type="radio"
                          name="subcategory"
                          checked={filters.subcategory === subcategory}
                          onChange={() => updateFilters({ 
                            subcategory: filters.subcategory === subcategory ? null : subcategory
                          })}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">{subcategory}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 公司筛选 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">公司</h3>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索公司..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {filteredCompanies.slice(0, 6).map(company => (
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
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{company}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 时间筛选 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">面经时间</h3>
          <div className="space-y-2">
            {timeRanges.slice(0, 5).map(range => (
              <label key={range.value} className="flex items-center">
                <input
                  type="radio"
                  name="timeRange"
                  checked={filters.timeRange === range.value}
                  onChange={() => updateFilters({ 
                    timeRange: filters.timeRange === range.value ? null : range.value as FilterState['timeRange']
                  })}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopFilters;
