
export interface Interview {
  id: string;
  question: string;
  company: string;
  post: string;
  type: 'campus' | 'social';
  difficulty: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  askedCount: number;
  source: 'xiaohongshu' | 'zhihu' | 'niuke';
  date: string;
  category: string;
  subcategory: string;
}

export interface FilterState {
  type: 'campus' | 'social' | null;
  category: string | null;
  subcategory: string | null;
  companies: string[];
  timeRange: 'two_weeks' | 'one_month' | 'half_year' | 'one_year' | 'two_years' | null;
  difficulty: number | null;
}

export interface DifficultyData {
  difficulty: number;
  count: number;
  label: string;
}
