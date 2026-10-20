import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

export interface StatusOption {
  id: string;
  label: string;
  count?: number;
}

export interface SortOption {
  id: string;
  label: string;
}

export interface CategoryOption {
  id: string;
  label: string;
  count?: number;
  percent?: number;
}

export interface RoadmapToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  statusOptions?: StatusOption[];
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  sortOptions?: SortOption[];
  categoryFilter?: string;
  onCategoryFilterChange?: (cat: string) => void;
  categoryOptions?: CategoryOption[];
  categoryLabel?: string;
  onResetFilters?: () => void;
  rightActions?: React.ReactNode;
}

export const RoadmapToolbar: React.FC<RoadmapToolbarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search lessons, topics, or concepts...',
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  sortBy,
  onSortChange,
  sortOptions = [
    { id: 'order', label: 'Course order' },
    { id: 'name-asc', label: 'Alphabetical A–Z' },
    { id: 'name-desc', label: 'Alphabetical Z–A' },
    { id: 'incomplete-first', label: 'Incomplete first' },
    { id: 'completed-first', label: 'Completed first' }
  ],
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions,
  categoryLabel = 'Categories',
  onResetFilters,
  rightActions
}) => {
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    (statusFilter && statusFilter !== 'all') ||
    (categoryFilter && categoryFilter !== 'all') ||
    (sortBy && sortBy !== 'order')
  );

  return (
    <div
      className="toolbar-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'var(--color-obsidian)',
        border: '1px solid var(--color-graphite)',
        borderRadius: 'var(--radius-buttons)',
        padding: '12px 14px',
        marginBottom: '20px'
      }}
    >
      {/* Main Responsive Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}
      >
        {/* Left Side: Search + Segmented Status Control */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            flex: '1 1 400px',
            minWidth: '260px'
          }}
        >
          {/* Search Input */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 220px',
              minWidth: '200px'
            }}
          >
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-fog)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                paddingLeft: '34px',
                paddingRight: searchQuery ? '30px' : '12px',
                background: 'var(--color-carbon)',
                border: '1px solid var(--color-graphite)',
                borderRadius: 'var(--radius-inputs)',
                color: 'var(--color-paper)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'var(--font-inter)',
                transition: 'border-color 0.15s ease'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '9px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 0,
                  color: 'var(--color-fog)',
                  cursor: 'pointer',
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '3px'
                }}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Segmented Status Control */}
          {statusOptions && onStatusFilterChange && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--color-carbon)',
                border: '1px solid var(--color-graphite)',
                borderRadius: 'var(--radius-buttons)',
                padding: '2px',
                gap: '2px',
                height: '36px',
                boxSizing: 'border-box'
              }}
              role="tablist"
              aria-label="Status filters"
            >
              {statusOptions.map((opt) => {
                const isActive = statusFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => onStatusFilterChange(opt.id)}
                    style={{
                      height: '30px',
                      padding: '0 10px',
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--color-paper)' : 'var(--color-fog)',
                      background: isActive ? 'var(--color-charcoal)' : 'transparent',
                      border: isActive ? '1px solid var(--color-graphite)' : '1px solid transparent',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.12s ease',
                      whiteSpace: 'nowrap',
                      boxShadow: isActive ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'
                    }}
                  >
                    <span>{opt.label}</span>
                    {opt.count !== undefined && (
                      <span
                        className="font-mono tab-num"
                        style={{
                          fontSize: '10.5px',
                          padding: '1px 5px',
                          borderRadius: '9999px',
                          background: isActive ? 'rgba(0, 0, 0, 0.08)' : 'var(--color-charcoal)',
                          color: isActive ? 'var(--color-paper)' : 'var(--color-fog)'
                        }}
                      >
                        {opt.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Category Filter Dropdown + Sort Dropdown + Reset Button + Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginLeft: 'auto'
          }}
        >
          {/* Compact Category Dropdown */}
          {categoryOptions && onCategoryFilterChange && categoryOptions.length > 0 && (
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <select
                value={categoryFilter || 'all'}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 28px 0 10px',
                  background: 'var(--color-carbon)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-buttons)',
                  color: categoryFilter && categoryFilter !== 'all' ? 'var(--color-paper)' : 'var(--color-fog)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none',
                  fontWeight: categoryFilter && categoryFilter !== 'all' ? 600 : 400,
                  fontFamily: 'var(--font-inter)',
                  minWidth: '140px',
                  maxWidth: '220px'
                }}
                aria-label={`Filter by ${categoryLabel}`}
              >
                <option value="all">All {categoryLabel} ({categoryOptions.length})</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} {cat.count !== undefined ? `(${cat.count})` : ''} {cat.percent !== undefined ? `[${cat.percent}%]` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Compact Sort Dropdown */}
          {sortOptions && onSortChange && sortBy && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--color-fog)', whiteSpace: 'nowrap' }}>
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 28px 0 10px',
                  background: 'var(--color-carbon)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-buttons)',
                  color: 'var(--color-paper)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'var(--font-inter)',
                  minWidth: '130px'
                }}
                aria-label="Sort lessons"
              >
                {sortOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Filters Button */}
          {hasActiveFilters && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="btn btn-secondary"
              style={{
                height: '36px',
                padding: '0 10px',
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: 'var(--color-paper)'
              }}
              title="Reset all search and filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}

          {/* Custom right actions */}
          {rightActions}
        </div>
      </div>
    </div>
  );
};
