import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  searchPlaceholder?: string;
  searchButtonText?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterPlaceholder?: string;
  filterOptions?: FilterOption[];
  showFilter?: boolean;
}

export function SearchBar({
  searchValue,
  onSearchChange,
  onSearch,
  searchPlaceholder = 'Search...',
  searchButtonText = 'Search',
  filterValue,
  onFilterChange,
  filterPlaceholder = 'Filter',
  filterOptions = [],
  showFilter = false,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 max-w-md">
        <Input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {showFilter && filterValue !== undefined && onFilterChange && (
        <div className="w-48">
          <Select value={filterValue} onValueChange={onFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={filterPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Button
        variant="outline"
        className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
        onClick={onSearch}
      >
        <Search className="w-5 h-5" />
        {searchButtonText}
      </Button>
    </div>
  );
}
