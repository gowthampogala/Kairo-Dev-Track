import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  Play,
  Layers,
  ChevronRight,
  Check,
  CheckSquare,
  FileCode,
  RotateCcw
} from 'lucide-react';
import { JS_CURRICULUM, JSLesson } from '../../data/javascriptCurriculum';
import { useApp } from '../../context/AppContext';
import { Checkbox } from '../common/Checkbox';
import { RoadmapToolbar } from '../common/RoadmapToolbar';
import { JSLessonDetailModal } from './JSLessonDetailModal';

export const JSRoadmapView: React.FC = () => {
  const { state, toggleJSLesson, toggleJSDailyPlan, setActivePage } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'not_started' | 'daily'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'order' | 'name-asc' | 'name-desc' | 'incomplete-first' | 'completed-first'>('order');
  const [selectedLesson, setSelectedLesson] = useState<JSLesson | null>(null);

  const jsRoadmapState = state.jsRoadmap || {};

  // All categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    JS_CURRICULUM.forEach(l => set.add(l.category));
    return Array.from(set);
  }, []);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortBy('order');
  };

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    const filtered = JS_CURRICULUM.filter(lesson => {
      const lessonState = jsRoadmapState[lesson.id] || { completed: false };
      const isCompleted = !!lessonState.completed;
      const inDaily = !!lessonState.inDailyPlan;

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        lesson.title.toLowerCase().includes(query) ||
        lesson.category.toLowerCase().includes(query) ||
        String(lesson.number) === query ||
        `#${lesson.number}`.includes(query) ||
        (lesson.explanation && lesson.explanation.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Status match
      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'not_started' && isCompleted) return false;
      if (statusFilter === 'daily' && !inDaily) return false;

      // Category match
      if (categoryFilter !== 'all' && lesson.category !== categoryFilter) return false;

      return true;
    });

    if (sortBy === 'name-asc') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'name-desc') {
      return [...filtered].sort((a, b) => b.title.localeCompare(a.title));
    }
    if (sortBy === 'incomplete-first') {
      return [...filtered].sort((a, b) => {
        const aDone = !!jsRoadmapState[a.id]?.completed;
        const bDone = !!jsRoadmapState[b.id]?.completed;
        if (aDone === bDone) return a.number - b.number;
        return aDone ? 1 : -1;
      });
    }
    if (sortBy === 'completed-first') {
      return [...filtered].sort((a, b) => {
        const aDone = !!jsRoadmapState[a.id]?.completed;
        const bDone = !!jsRoadmapState[b.id]?.completed;
        if (aDone === bDone) return a.number - b.number;
        return aDone ? -1 : 1;
      });
    }
    return [...filtered].sort((a, b) => a.number - b.number);
  }, [searchQuery, statusFilter, categoryFilter, sortBy, jsRoadmapState]);

  // Overall Statistics
  const stats = useMemo(() => {
    let completedCount = 0;
    let scheduledDailyCount = 0;
    let totalMinutes = 0;

    JS_CURRICULUM.forEach(l => {
      const s = jsRoadmapState[l.id];
      if (s?.completed) completedCount++;
      if (s?.inDailyPlan) scheduledDailyCount++;
      if (s?.studyMinutes) totalMinutes += s.studyMinutes;
    });

    const percent = Math.round((completedCount / JS_CURRICULUM.length) * 100);

    // Find next incomplete lesson
    const nextIncomplete = JS_CURRICULUM.find(l => !jsRoadmapState[l.id]?.completed) || JS_CURRICULUM[0];

    return {
      total: JS_CURRICULUM.length,
      completed: completedCount,
      scheduledDaily: scheduledDailyCount,
      totalMinutes,
      percent,
      nextIncomplete
    };
  }, [jsRoadmapState]);

  // Category progress helper
  const getCategoryProgress = (cat: string) => {
    const lessonsInCat = JS_CURRICULUM.filter(l => l.category === cat);
    const completedInCat = lessonsInCat.filter(l => jsRoadmapState[l.id]?.completed).length;
    const pct = lessonsInCat.length > 0 ? Math.round((completedInCat / lessonsInCat.length) * 100) : 0;
    return { count: lessonsInCat.length, completed: completedInCat, percent: pct };
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = JS_CURRICULUM.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < JS_CURRICULUM.length - 1) {
      setSelectedLesson(JS_CURRICULUM[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = JS_CURRICULUM.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      setSelectedLesson(JS_CURRICULUM[currentIndex - 1]);
    }
  };

  return (
    <div className="view-container">
      {/* Top Header */}
      <div className="view-header">
        <div>
          <div className="view-breadcrumb">
            <span>Roadmap</span>
            <span>/</span>
            <span style={{ color: 'var(--color-paper)' }}>JavaScript Curriculum</span>
          </div>
          <h1 className="view-title">JavaScript Mastery Roadmap</h1>
          <p className="view-subtitle">
            41 verified sequential lessons from basic computer architecture to closures, promises, and the DOM.
          </p>
        </div>

        {/* Continue Learning CTA */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setSelectedLesson(stats.nextIncomplete)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Play size={14} fill="currentColor" />
            <span>Continue Learning (#{stats.nextIncomplete.number})</span>
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        {/* Main Progress Stat */}
        <div
          style={{
            background: 'var(--color-obsidian)',
            border: '1px solid var(--color-graphite)',
            borderRadius: 'var(--radius-buttons)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-label">Overall JS Progress</span>
            <span
              className="font-mono tab-num"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-accent-text)'
              }}
            >
              {stats.completed} / {stats.total} Lessons
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 600, color: 'var(--color-paper)' }}>
              {stats.percent}%
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-fog)' }}>mastered</span>
          </div>
          <div className="linear-progress-bar" style={{ marginTop: '10px' }}>
            <div className="linear-progress-bar-fill" style={{ width: `${stats.percent}%` }} />
          </div>
        </div>

        {/* Current Active Topic */}
        <div
          style={{
            background: 'var(--color-obsidian)',
            border: '1px solid var(--color-graphite)',
            borderRadius: 'var(--radius-buttons)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedLesson(stats.nextIncomplete)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-label">Next Up</span>
            <span style={{ fontSize: '11px', color: 'var(--color-accent-text)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              Lesson #{stats.nextIncomplete.number} <ArrowRight size={11} />
            </span>
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 510,
              color: 'var(--color-paper)',
              marginTop: '6px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {stats.nextIncomplete.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-mist)', marginTop: '4px' }}>
            {stats.nextIncomplete.category} · {stats.nextIncomplete.estimatedDuration || 'Not specified'}
          </div>
        </div>

        {/* Daily Study Link */}
        <div
          style={{
            background: 'var(--color-obsidian)',
            border: '1px solid var(--color-graphite)',
            borderRadius: 'var(--radius-buttons)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-label">Daily Study Queue</span>
            <button
              onClick={() => setActivePage('daily')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-fog)',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Open Daily <ArrowRight size={11} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 600, color: 'var(--color-paper)' }}>
              {stats.scheduledDaily}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-fog)' }}>lessons in today's plan</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-mist)', marginTop: '4px' }}>
            {stats.totalMinutes > 0 ? `${stats.totalMinutes}m logged studying JS` : 'Log time inside lesson modal'}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <RoadmapToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search lessons, topics, or concepts..."
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => setStatusFilter(val as any)}
        statusOptions={[
          { id: 'all', label: 'All', count: JS_CURRICULUM.length },
          { id: 'not_started', label: 'Incomplete', count: JS_CURRICULUM.length - stats.completed },
          { id: 'completed', label: 'Completed', count: stats.completed },
          { id: 'daily', label: 'In Daily', count: stats.scheduledDaily }
        ]}
        sortBy={sortBy}
        onSortChange={(val) => setSortBy(val as any)}
        sortOptions={[
          { id: 'order', label: 'Course order' },
          { id: 'name-asc', label: 'Alphabetical A–Z' },
          { id: 'name-desc', label: 'Alphabetical Z–A' },
          { id: 'incomplete-first', label: 'Incomplete first' },
          { id: 'completed-first', label: 'Completed first' }
        ]}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categoryOptions={categories.map(cat => ({
          id: cat,
          label: cat,
          count: getCategoryProgress(cat).count,
          percent: getCategoryProgress(cat).percent
        }))}
        categoryLabel="Categories"
        onResetFilters={handleResetFilters}
      />

      {/* Lessons List Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span className="card-label">
          Showing {filteredLessons.length} {filteredLessons.length === 1 ? 'lesson' : 'lessons'}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--color-fog)' }}>
          Click any card to open full study materials and code tracing
        </span>
      </div>

      {/* Lesson Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredLessons.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              background: 'var(--color-obsidian)',
              border: '1px solid var(--color-graphite)',
              borderRadius: 'var(--radius-buttons)',
              color: 'var(--color-mist)'
            }}
          >
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>No lessons match your current filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="btn btn-secondary"
              style={{ fontSize: '12px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredLessons.map((lesson: JSLesson) => {
            const lessonState = jsRoadmapState[lesson.id] || { completed: false };
            const isCompleted = !!lessonState.completed;
            const inDaily = !!lessonState.inDailyPlan;
            const hasNotes = !!lessonState.notes;
            const studyMins = lessonState.studyMinutes || 0;

            return (
              <div
                key={lesson.id}
                style={{
                  background: isCompleted ? 'rgba(74, 222, 128, 0.02)' : 'var(--color-obsidian)',
                  border: isCompleted
                    ? '1px solid rgba(74, 222, 128, 0.2)'
                    : '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-buttons)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                  position: 'relative'
                }}
                onClick={() => setSelectedLesson(lesson)}
                className="lesson-card-row"
              >
                {/* Checkbox (Isolated from row click) */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Checkbox
                    checked={isCompleted}
                    onChange={() => toggleJSLesson(lesson.id)}
                    label={`Mark lesson ${lesson.number} complete`}
                  />
                </div>

                {/* Number Badge */}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isCompleted ? 'var(--color-accent-text)' : 'var(--color-fog)',
                    background: 'var(--color-charcoal)',
                    border: '1px solid var(--color-graphite)',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    minWidth: '34px',
                    textAlign: 'center',
                    flexShrink: 0
                  }}
                >
                  #{String(lesson.number).padStart(2, '0')}
                </span>

                {/* Lesson Title & Category */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '13.5px',
                        fontWeight: 510,
                        color: isCompleted ? 'var(--color-mist)' : 'var(--color-paper)',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        lineHeight: '1.4'
                      }}
                    >
                      {lesson.title}
                    </span>
                    {lesson.isContentPrepared && (
                      <span
                        style={{
                          fontSize: '10px',
                          color: 'var(--color-accent-text)',
                          background: 'rgba(228, 242, 34, 0.12)',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          border: '1px solid rgba(228, 242, 34, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Sparkles size={9} /> Deep Guide
                      </span>
                    )}
                    {inDaily && (
                      <span
                        style={{
                          fontSize: '10px',
                          color: '#38bdf8',
                          background: 'rgba(56, 189, 248, 0.1)',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Calendar size={9} /> In Daily Plan
                      </span>
                    )}
                    {hasNotes && (
                      <span
                        style={{
                          fontSize: '10px',
                          color: 'var(--color-fog)',
                          background: 'var(--color-charcoal)',
                          padding: '1px 5px',
                          borderRadius: '3px'
                        }}
                      >
                        📝 Notes
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px', fontSize: '11.5px', color: 'var(--color-fog)' }}>
                    <span>{lesson.category}</span>
                    <span>·</span>
                    <span>Lessons: {lesson.lessonsCount || 'Not specified'}</span>
                    <span>·</span>
                    <span>Duration: {lesson.estimatedDuration || 'Not specified'}</span>
                    {studyMins > 0 && (
                      <>
                        <span>·</span>
                        <span style={{ color: 'var(--color-accent-text)', fontFamily: 'var(--font-mono)' }}>{studyMins}m studied</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Action Icons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleJSDailyPlan(lesson.id);
                    }}
                    title={inDaily ? "Remove from today's plan" : "Add to today's study plan"}
                    className={inDaily ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Calendar size={12} />
                    <span className="hide-mobile">{inDaily ? 'Planned' : '+ Daily'}</span>
                  </button>

                  <ChevronRight size={16} style={{ color: 'var(--color-fog)' }} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Lesson Detail Modal */}
      {selectedLesson && (
        <JSLessonDetailModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onNext={handleNextLesson}
          onPrev={handlePrevLesson}
        />
      )}
    </div>
  );
};
