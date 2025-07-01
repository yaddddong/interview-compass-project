
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FilterState } from '@/types/interview';
import { Filter } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

interface MobileFilterDrawerProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
}

const MobileFilterDrawer = ({ filters, onFiltersChange, resultCount }: MobileFilterDrawerProps) => {
  const hasActiveFilters = filters.type || filters.category || filters.subcategory || 
    filters.companies.length > 0 || filters.timeRange;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">筛选</span>
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
              {[
                filters.type,
                filters.category,
                filters.subcategory,
                ...filters.companies,
                filters.timeRange
              ].filter(Boolean).length}
            </span>
          )}
        </button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="text-left">筛选面试题</SheetTitle>
          <p className="text-sm text-gray-600 text-left">
            共找到 {resultCount} 道相关面试题
          </p>
        </SheetHeader>
        
        <div className="overflow-y-auto h-full">
          <FilterSidebar 
            filters={filters} 
            onFiltersChange={onFiltersChange}
            className="border-0"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterDrawer;
