
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
    <div className={`bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-lg border-r border-white/20 shadow-sm ${className}`}>
      <div className="p-6">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
              <Filter className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              筛选器
            </h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-primary hover:text-primary/80 transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-primary/10 font-medium"
            >
              清空
            </button>
          )}
        </div>

        {/* 已选标签 */}
        {hasActiveFilters && (
          <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
            <div className="flex flex-wrap gap-2">
              {filters.type && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 rounded-lg text-xs font-medium border border-blue-200/50">
                  {filters.type === 'campus' ? '校招' : '社招'}
                  <X 
                    className="w-3.5 h-3.5 cursor-pointer hover:text-blue-900 transition-colors" 
                    onClick={() => removeFilter('type')}
                  />
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-700 rounded-lg text-xs font-medium border border-green-200/50">
                  {filters.category}
                  <X 
                    className="w-3.5 h-3.5 cursor-pointer hover:text-green-900 transition-colors" 
                    onClick={() => removeFilter('category')}
                  />
                </span>
              )}
              {filters.subcategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-purple-600/10 text-purple-700 rounded-lg text-xs font-medium border border-purple-200/50">
                  {filters.subcategory}
                  <X 
                    className="w-3.5 h-3.5 cursor-pointer hover:text-purple-900 transition-colors" 
                    onClick={() => removeFilter('subcategory')}
                  />
                </span>
              )}
              {filters.companies.map(company => (
                <span key={company} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-700 rounded-lg text-xs font-medium border border-orange-200/50">
                  {company}
                  <X 
                    className="w-3.5 h-3.5 cursor-pointer hover:text-orange-900 transition-colors" 
                    onClick={() => removeFilter('company', company)}
                  />
                </span>
              ))}
              {filters.timeRange && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-500/10 to-gray-600/10 text-gray-700 rounded-lg text-xs font-medium border border-gray-200/50">
                  {timeRanges.find(t => t.value === filters.timeRange)?.label}
                  <X 
                    className="w-3.5 h-3.5 cursor-pointer hover:text-gray-900 transition-colors" 
                    onClick={() => removeFilter('timeRange')}
                  />
                </span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* 类型筛选 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              类型
            </h3>
            <div className="space-y-2">
              {[
                { value: 'campus', label: '校招' },
                { value: 'social', label: '社招' }
              ].map(type => (
                <label key={type.value} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="type"
                    checked={filters.type === type.value}
                    onChange={() => updateFilters({ 
                      type: filters.type === type.value ? null : type.value as 'campus' | 'social'
                    })}
                    className="w-4 h-4 text-primary border-border focus:ring-primary/30 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-foreground group-hover:text-primary transition-colors">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 岗位筛选 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              岗位
            </h3>
            <div className="space-y-3">
              {Object.entries(categories).map(([category, subcategories]) => (
                <div key={category}>
                  <label className="flex items-center mb-2 cursor-pointer group">
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
                      className="w-4 h-4 text-primary border-border focus:ring-primary/30 focus:ring-2"
                    />
                    <span className="ml-3 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{category}</span>
                  </label>
                  
                  {filters.category === category && (
                    <div className="ml-6 space-y-2 animate-fade-in">
                      {subcategories.map(subcategory => (
                        <label key={subcategory} className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name="subcategory"
                            checked={filters.subcategory === subcategory}
                            onChange={() => updateFilters({ 
                              subcategory: filters.subcategory === subcategory ? null : subcategory
                            })}
                            className="w-3.5 h-3.5 text-primary border-border focus:ring-primary/30 focus:ring-2"
                          />
                          <span className="ml-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">{subcategory}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 公司筛选 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              公司
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {companies.map(company => (
                <label key={company} className="flex items-center cursor-pointer group">
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
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary/30 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-foreground group-hover:text-primary transition-colors">{company}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 时间筛选 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              时间
            </h3>
            <div className="space-y-2">
              {timeRanges.map(range => (
                <label key={range.value} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="timeRange"
                    checked={filters.timeRange === range.value}
                    onChange={() => updateFilters({ 
                      timeRange: filters.timeRange === range.value ? null : range.value as FilterState['timeRange']
                    })}
                    className="w-4 h-4 text-primary border-border focus:ring-primary/30 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-foreground group-hover:text-primary transition-colors">{range.label}</span>
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
