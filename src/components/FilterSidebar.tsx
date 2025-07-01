
import { useState } from 'react';
import { FilterState } from '@/types/interview';
import { X, Search, Filter } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

const FilterSidebar = ({ filters, onFiltersChange, className = '' }: FilterSidebarProps) => {
  const [companySearch, setCompanySearch] = useState('');

  const categories = {
    '开发': ['前端', '后端', '算法'],
    '产品': ['策划', '运营'],
    '设计': ['交互', 'UI'],
    '测试': ['测试']
  };

  const companies = ['腾讯', '字节跳动', '阿里', '百度', '美团'];
  const filteredCompanies = companies.filter(company => 
    company.toLowerCase().includes(companySearch.toLowerCase())
  );

  const timeRanges = [
    { value: 'two_weeks', label: '2周' },
    { value: 'one_month', label: '1月' },
    { value: 'half_year', label: '半年' },
    { value: 'one_year', label: '1年' },
    { value: 'two_years', label: '2年' }
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
    <div className={`bg-transparent ${className}`}>
      <div className="p-4">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              筛选器
            </h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-blue-600 hover:text-blue-700 transition-colors px-2 py-1 rounded-md hover:bg-blue-50"
            >
              清空
            </button>
          )}
        </div>

        {/* 已选标签 - 紧凑显示 */}
        {hasActiveFilters && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {filters.type && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                  {filters.type === 'campus' ? '校招' : '社招'}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-blue-900" 
                    onClick={() => removeFilter('type')}
                  />
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                  {filters.category}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-green-900" 
                    onClick={() => removeFilter('category')}
                  />
                </span>
              )}
              {filters.subcategory && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs">
                  {filters.subcategory}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-purple-900" 
                    onClick={() => removeFilter('subcategory')}
                  />
                </span>
              )}
              {filters.companies.map(company => (
                <span key={company} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs">
                  {company}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-orange-900" 
                    onClick={() => removeFilter('company', company)}
                  />
                </span>
              ))}
              {filters.timeRange && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
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

        <div className="space-y-4">
          {/* 类型筛选 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-2">类型</h3>
            <div className="space-y-1">
              {[
                { value: 'campus', label: '校招' },
                { value: 'social', label: '社招' }
              ].map(type => (
                <label key={type.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={filters.type === type.value}
                    onChange={() => updateFilters({ 
                      type: filters.type === type.value ? null : type.value as 'campus' | 'social'
                    })}
                    className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-xs text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 岗位筛选 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-2">岗位</h3>
            <div className="space-y-2">
              {Object.entries(categories).map(([category, subcategories]) => (
                <div key={category}>
                  <label className="flex items-center mb-1 cursor-pointer">
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
                    <span className="ml-2 text-xs font-medium text-gray-900">{category}</span>
                  </label>
                  
                  {filters.category === category && (
                    <div className="ml-4 space-y-1">
                      {subcategories.map(subcategory => (
                        <label key={subcategory} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="subcategory"
                            checked={filters.subcategory === subcategory}
                            onChange={() => updateFilters({ 
                              subcategory: filters.subcategory === subcategory ? null : subcategory
                            })}
                            className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-xs text-gray-600">{subcategory}</span>
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
            <h3 className="text-xs font-semibold text-gray-700 mb-2">公司</h3>
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                type="text"
                placeholder="搜索..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs"
              />
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {filteredCompanies.map(company => (
                <label key={company} className="flex items-center cursor-pointer">
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
                  <span className="ml-2 text-xs text-gray-700">{company}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 时间筛选 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-2">时间</h3>
            <div className="space-y-1">
              {timeRanges.map(range => (
                <label key={range.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="timeRange"
                    checked={filters.timeRange === range.value}
                    onChange={() => updateFilters({ 
                      timeRange: filters.timeRange === range.value ? null : range.value as FilterState['timeRange']
                    })}
                    className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-xs text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
