import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Layers,
  FolderGit2,
  ExternalLink,
  GitBranch,
  Check,
  FileEdit,
  Sparkles,
  ArrowRight,
  X,
  Plus,
  StickyNote,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  SPRING_BOOT_CURRICULUM,
  SPRING_BOOT_PROJECTS,
  ALL_SPRING_BOOT_LESSONS,
  TOTAL_SPRING_BOOT_MODULES,
  TOTAL_SPRING_BOOT_LESSONS,
  TOTAL_SPRING_BOOT_HOURS,
  SpringBootLesson,
  SpringBootModule
} from '../../data/springBootCurriculum';
import { Checkbox } from '../common/Checkbox';

interface CircularProgressProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percent,
  size = 68,
  strokeWidth = 5.5
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      title={`${percent}% completed`}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--color-graphite)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--color-pulse-green)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: percent > 0 ? 'drop-shadow(0 0 4px rgba(39, 166, 68, 0.35))' : 'none'
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span
          className="font-mono tab-num"
          style={{
            fontSize: '13px',
            fontWeight: 650,
            color: 'var(--color-paper)',
            letterSpacing: '-0.02em'
          }}
        >
          {percent}%
        </span>
      </div>
    </div>
  );
};

export const SpringBootRoadmapView: React.FC = () => {
  const {
    state,
    toggleSpringBootLesson,
    updateSpringBootLessonNotes,
    updateSpringBootProject,
    toggleSpringBootProjectChecklist,
    createProject,
    setActivePage,
    setSelectedProjectId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'curriculum' | 'projects'>('curriculum');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'incomplete' | 'completed'>('all');

  // Expanded modules state: by default expand Module 1
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'sb-mod-1': true
  });

  // Modal / drawer state for lesson notes
  const [activeNotesLesson, setActiveNotesLesson] = useState<SpringBootLesson | null>(null);
  const [tempNotesText, setTempNotesText] = useState('');

  const springBootState = state.springBootRoadmap || {};
  const springBootProjectsState = state.springBootProjects || {};

  // Overall Statistics Calculation
  const stats = useMemo(() => {
    let completedCount = 0;
    let totalMinutesStudied = 0;
    let userNotesCount = 0;

    ALL_SPRING_BOOT_LESSONS.forEach(l => {
      const s = springBootState[l.id];
      if (s?.completed) completedCount++;
      if (s?.notes && s.notes.trim().length > 0) userNotesCount++;
    });

    const percent = Math.round((completedCount / TOTAL_SPRING_BOOT_LESSONS) * 100);

    // Find next incomplete lesson
    const nextIncomplete =
      ALL_SPRING_BOOT_LESSONS.find(l => !springBootState[l.id]?.completed) || ALL_SPRING_BOOT_LESSONS[0];

    return {
      totalModules: TOTAL_SPRING_BOOT_MODULES,
      totalLessons: TOTAL_SPRING_BOOT_LESSONS,
      completedLessons: completedCount,
      percent,
      estimatedHours: TOTAL_SPRING_BOOT_HOURS,
      totalNotes: userNotesCount,
      nextIncomplete
    };
  }, [springBootState]);

  // Filtered curriculum modules and lessons based on search and status
  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return SPRING_BOOT_CURRICULUM.map(module => {
      const filteredLessons = module.lessons.filter(lesson => {
        const isDone = !!springBootState[lesson.id]?.completed;

        // Status filter
        if (statusFilter === 'completed' && !isDone) return false;
        if (statusFilter === 'incomplete' && isDone) return false;

        // Search query filter
        if (!q) return true;

        const matchesTitle = lesson.title.toLowerCase().includes(q);
        const matchesCategory = lesson.category.toLowerCase().includes(q);
        const matchesDesc = lesson.description.toLowerCase().includes(q);
        const matchesConcepts = lesson.keyConcepts.some(c => c.toLowerCase().includes(q));
        const matchesModule = module.title.toLowerCase().includes(q);

        return matchesTitle || matchesCategory || matchesDesc || matchesConcepts || matchesModule;
      });

      const totalLessonsInModule = module.lessons.length;
      const completedInModule = module.lessons.filter(l => springBootState[l.id]?.completed).length;
      const modulePercent = totalLessonsInModule > 0 ? Math.round((completedInModule / totalLessonsInModule) * 100) : 0;
      const notesInModule = module.lessons.filter(l => (springBootState[l.id]?.notes || '').trim().length > 0).length;

      return {
        ...module,
        visibleLessons: filteredLessons,
        completedCount: completedInModule,
        totalCount: totalLessonsInModule,
        percent: modulePercent,
        notesCount: notesInModule,
        isCompleted: completedInModule === totalLessonsInModule && totalLessonsInModule > 0
      };
    }).filter(m => m.visibleLessons.length > 0 || !q);
  }, [searchQuery, statusFilter, springBootState]);

  // Expand / collapse all modules
  const handleToggleExpandAll = () => {
    const anyCollapsed = SPRING_BOOT_CURRICULUM.some(m => !expandedModules[m.id]);
    const nextState: Record<string, boolean> = {};
    SPRING_BOOT_CURRICULUM.forEach(m => {
      nextState[m.id] = anyCollapsed;
    });
    setExpandedModules(nextState);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const openLessonNotes = (lesson: SpringBootLesson) => {
    setActiveNotesLesson(lesson);
    setTempNotesText(springBootState[lesson.id]?.notes || '');
  };

  const handleSaveNotes = () => {
    if (!activeNotesLesson) return;
    updateSpringBootLessonNotes(activeNotesLesson.id, tempNotesText);
    setActiveNotesLesson(null);
  };

  // Sync project to main Projects Portfolio
  const handleSyncToProjectsPortfolio = (pDef: typeof SPRING_BOOT_PROJECTS[0]) => {
    const pState = springBootProjectsState[pDef.id] || {
      id: pDef.id,
      status: 'not_started',
      completedChecklist: []
    };

    const newId = createProject({
      title: pDef.title,
      description: pDef.description,
      technologies: pDef.technologies,
      sections: [{ id: `sec-${pDef.id}`, title: 'Project Deliverables', order: 0 }],
      tasks: pDef.checklist.map((item, idx) => ({
        id: `task-${pDef.id}-${idx}`,
        title: item,
        category: 'Build',
        status: pState.completedChecklist.includes(item) ? 'done' : 'todo'
      }))
    });

    setSelectedProjectId(newId);
    setActivePage('projects');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* ========================================================
          1. HEADER WITH CIRCULAR COMPLETION INDICATOR & METADATA
          ======================================================== */}
      <div
        className="linear-card"
        style={{
          background: 'var(--color-obsidian)',
          border: '1px solid var(--color-graphite)',
          padding: '22px 24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          {/* Left: Circular indicator & Heading Block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '280px' }}>
            <CircularProgress percent={stats.percent} size={68} strokeWidth={5.5} />

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-fog)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}
                >
                  Curriculum Track · Backend Mastery
                </span>
                {stats.percent === 100 && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10.5px',
                      background: 'rgba(39, 166, 68, 0.15)',
                      color: 'var(--color-pulse-green)',
                      padding: '1px 7px',
                      borderRadius: '10px',
                      border: '1px solid rgba(39, 166, 68, 0.3)'
                    }}
                  >
                    Completed
                  </span>
                )}
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: '24px',
                  letterSpacing: '-0.022em',
                  color: 'var(--color-paper)',
                  fontWeight: 600
                }}
              >
                Spring Boot Roadmap
              </h1>

              {/* Statistics Metadata Badges */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginTop: '8px',
                  fontSize: '12px',
                  color: 'var(--color-mist)'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Layers size={13} style={{ color: 'var(--color-acid-lime)' }} />
                  <strong style={{ color: 'var(--color-paper)' }}>{stats.totalModules}</strong> Modules
                </span>
                <span style={{ color: 'var(--color-smoke)' }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={13} style={{ color: 'var(--color-pulse-green)' }} />
                  <strong style={{ color: 'var(--color-paper)' }}>{stats.completedLessons}</strong> / {stats.totalLessons} Lessons
                </span>
                <span style={{ color: 'var(--color-smoke)' }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={13} style={{ color: 'var(--color-fog)' }} />
                  <strong style={{ color: 'var(--color-paper)' }}>~{stats.estimatedHours}</strong> Hours
                </span>
                {stats.totalNotes > 0 && (
                  <>
                    <span style={{ color: 'var(--color-smoke)' }}>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <StickyNote size={13} style={{ color: 'var(--color-signal-teal)' }} />
                      <strong style={{ color: 'var(--color-paper)' }}>{stats.totalNotes}</strong> {stats.totalNotes === 1 ? 'Note' : 'Notes'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Quick CTA & Tab Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: 'var(--color-carbon)', padding: '3px', borderRadius: '6px', border: '1px solid var(--color-graphite)' }}>
              <button
                onClick={() => setActiveTab('curriculum')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '4px',
                  border: 0,
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'curriculum' ? 550 : 400,
                  background: activeTab === 'curriculum' ? 'var(--surface-active)' : 'transparent',
                  color: activeTab === 'curriculum' ? 'var(--color-paper)' : 'var(--color-fog)',
                  transition: 'all 0.15s ease'
                }}
              >
                12 Modules
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '4px',
                  border: 0,
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'projects' ? 550 : 400,
                  background: activeTab === 'projects' ? 'var(--surface-active)' : 'transparent',
                  color: activeTab === 'projects' ? 'var(--color-paper)' : 'var(--color-fog)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>3 Projects</span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    padding: '1px 5px',
                    borderRadius: '8px',
                    background: 'rgba(228, 242, 34, 0.12)',
                    color: 'var(--color-acid-lime)'
                  }}
                >
                  Practical
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar & Filter Controls (Curriculum Tab) */}
        {activeTab === 'curriculum' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '18px',
              flexWrap: 'wrap'
            }}
          >
            {/* Search Input with Placeholder "Search lessons" */}
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '11px',
                  color: 'var(--color-fog)',
                  pointerEvents: 'none'
                }}
              />
              <input
                id="spring-boot-search-lessons"
                type="text"
                placeholder="Search lessons"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '34px',
                  paddingRight: searchQuery ? '30px' : '12px',
                  background: 'var(--color-carbon)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-inputs)',
                  color: 'var(--color-paper)',
                  fontSize: '13px',
                  height: '36px',
                  outline: 'none',
                  transition: 'border-color 0.15s ease'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    background: 'transparent',
                    border: 0,
                    color: 'var(--color-fog)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['all', 'incomplete', 'completed'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-buttons)',
                    border: '1px solid',
                    borderColor: statusFilter === st ? 'var(--color-smoke)' : 'var(--color-graphite)',
                    background: statusFilter === st ? 'var(--surface-active)' : 'transparent',
                    color: statusFilter === st ? 'var(--color-paper)' : 'var(--color-fog)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {st === 'all' ? 'All Lessons' : st === 'incomplete' ? 'Incomplete' : 'Completed'}
                </button>
              ))}
            </div>

            {/* Expand / Collapse All */}
            <button
              onClick={handleToggleExpandAll}
              className="btn"
              style={{
                fontSize: '12px',
                height: '36px',
                padding: '0 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Layers size={13} />
              <span>
                {SPRING_BOOT_CURRICULUM.some(m => !expandedModules[m.id]) ? 'Expand All' : 'Collapse All'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================
          2. TAB: CURRICULUM MODULES
          ======================================================== */}
      {activeTab === 'curriculum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredModules.length === 0 ? (
            <div
              className="linear-card"
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--color-fog)'
              }}
            >
              <Search size={28} style={{ margin: '0 auto 12px', color: 'var(--color-smoke)' }} />
              <div style={{ fontSize: '15px', color: 'var(--color-paper)', fontWeight: 500 }}>
                No lessons matched your search
              </div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>
                Try adjusting your search terms or clearing the status filter.
              </div>
              <button
                className="btn"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                style={{ marginTop: '14px' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredModules.map(module => {
              const isExpanded = !!expandedModules[module.id] || searchQuery.trim().length > 0;

              return (
                <div
                  key={module.id}
                  className="linear-card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    background: 'var(--color-carbon)',
                    border: '1px solid var(--color-graphite)',
                    borderLeft: module.isCompleted
                      ? '3px solid var(--color-pulse-green)'
                      : module.completedCount > 0
                      ? '3px solid var(--color-acid-lime)'
                      : '3px solid transparent',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  {/* Module Card Header */}
                  <div
                    onClick={() => toggleModule(module.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleModule(module.id);
                      }
                    }}
                    style={{
                      padding: '16px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      userSelect: 'none'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      {/* Left: Module Number & Title */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: module.isCompleted
                              ? 'rgba(39, 166, 68, 0.12)'
                              : module.completedCount > 0
                              ? 'rgba(228, 242, 34, 0.12)'
                              : 'var(--color-obsidian)',
                            color: module.isCompleted
                              ? 'var(--color-pulse-green)'
                              : module.completedCount > 0
                              ? 'var(--color-acid-lime)'
                              : 'var(--color-fog)',
                            border: '1px solid var(--color-graphite)',
                            flexShrink: 0
                          }}
                        >
                          MODULE {module.moduleNumber < 10 ? `0${module.moduleNumber}` : module.moduleNumber}
                        </div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <h2
                            style={{
                              fontSize: '15px',
                              fontWeight: 550,
                              color: 'var(--color-paper)',
                              margin: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {module.title}
                          </h2>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '12px',
                              color: 'var(--color-fog)',
                              marginTop: '2px',
                              flexWrap: 'wrap'
                            }}
                          >
                            <span>{module.totalCount} lessons</span>
                            <span>•</span>
                            <span>{module.estimatedDuration}</span>
                            {module.notesCount > 0 && (
                              <>
                                <span>•</span>
                                <span style={{ color: 'var(--color-signal-teal)' }}>
                                  {module.notesCount} {module.notesCount === 1 ? 'note' : 'notes'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Status badge & Chevron */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <span
                          className="font-mono tab-num"
                          style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            border: '1px solid',
                            borderColor: module.isCompleted
                              ? 'rgba(39, 166, 68, 0.3)'
                              : module.completedCount > 0
                              ? 'rgba(228, 242, 34, 0.3)'
                              : 'var(--color-graphite)',
                            background: module.isCompleted
                              ? 'rgba(39, 166, 68, 0.12)'
                              : module.completedCount > 0
                              ? 'rgba(228, 242, 34, 0.08)'
                              : 'transparent',
                            color: module.isCompleted
                              ? 'var(--color-pulse-green)'
                              : module.completedCount > 0
                              ? 'var(--color-acid-lime)'
                              : 'var(--color-fog)'
                          }}
                        >
                          {module.isCompleted
                            ? 'Completed'
                            : module.completedCount > 0
                            ? `${module.completedCount}/${module.totalCount} done`
                            : 'Not started'}
                        </span>

                        <ChevronDown
                          size={16}
                          style={{
                            color: 'var(--color-fog)',
                            transform: isExpanded ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Progress bar per module card */}
                    <div className="linear-progress-bar" style={{ height: '3px', marginTop: '4px' }}>
                      <div
                        className="linear-progress-bar-fill"
                        style={{
                          width: `${module.percent}%`,
                          background: module.isCompleted ? 'var(--color-pulse-green)' : 'var(--color-acid-lime)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Expanded Lessons List */}
                  {isExpanded && (
                    <div
                      style={{
                        borderTop: '1px solid var(--color-graphite)',
                        background: 'rgba(0, 0, 0, 0.15)',
                        padding: '8px 12px'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {module.visibleLessons.map(lesson => {
                          const isDone = !!springBootState[lesson.id]?.completed;
                          const hasNotes = !!springBootState[lesson.id]?.notes?.trim();

                          return (
                            <div
                              key={lesson.id}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                background: isDone ? 'rgba(255, 255, 255, 0.015)' : 'transparent',
                                border: '1px solid',
                                borderColor: isDone ? 'rgba(39, 166, 68, 0.12)' : 'transparent',
                                transition: 'background 0.12s ease, border-color 0.12s ease'
                              }}
                            >
                              {/* Working Checkbox */}
                              <Checkbox
                                id={`cb-${lesson.id}`}
                                checked={isDone}
                                onChange={() => toggleSpringBootLesson(lesson.id)}
                              />

                              {/* Lesson Content Block */}
                              <div
                                style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                                onClick={() => toggleSpringBootLesson(lesson.id)}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: '8px',
                                    flexWrap: 'wrap'
                                  }}
                                >
                                  {/* Lesson Number Prefix */}
                                  <span
                                    className="font-mono"
                                    style={{
                                      fontSize: '11px',
                                      color: isDone ? 'var(--color-pulse-green)' : 'var(--color-fog)'
                                    }}
                                  >
                                    #{lesson.globalIndex}
                                  </span>

                                  {/* Lesson Title: Visually distinct when completed, but perfectly readable */}
                                  <span
                                    style={{
                                      fontSize: '13.5px',
                                      fontWeight: isDone ? 450 : 500,
                                      color: isDone ? 'var(--color-ash)' : 'var(--color-paper)',
                                      lineHeight: 1.45,
                                      textDecoration: isDone ? 'line-through' : 'none',
                                      transition: 'color 0.15s ease'
                                    }}
                                  >
                                    {lesson.title}
                                  </span>

                                  {/* Completed badge */}
                                  {isDone && (
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '3px',
                                        fontSize: '10px',
                                        fontFamily: 'var(--font-mono)',
                                        color: 'var(--color-pulse-green)',
                                        background: 'rgba(39, 166, 68, 0.1)',
                                        padding: '1px 5px',
                                        borderRadius: '3px'
                                      }}
                                    >
                                      <Check size={10} strokeWidth={2.5} /> Done
                                    </span>
                                  )}
                                </div>

                                {/* Study Description */}
                                {lesson.description && (
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      color: 'var(--color-fog)',
                                      marginTop: '3px',
                                      lineHeight: 1.4
                                    }}
                                  >
                                    {lesson.description}
                                  </div>
                                )}
                              </div>

                              {/* Meta: Duration, Category & Notes Button */}
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  flexShrink: 0,
                                  marginLeft: 'auto'
                                }}
                              >
                                <span
                                  className="font-mono"
                                  style={{
                                    fontSize: '11px',
                                    color: 'var(--color-fog)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  <Clock size={11} /> {lesson.estimatedDuration}
                                </span>

                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    openLessonNotes(lesson);
                                  }}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid',
                                    borderColor: hasNotes ? 'var(--color-signal-teal)' : 'var(--color-graphite)',
                                    background: hasNotes ? 'rgba(2, 184, 204, 0.1)' : 'var(--color-carbon)',
                                    color: hasNotes ? 'var(--color-signal-teal)' : 'var(--color-fog)',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                    transition: 'all 0.12s ease'
                                  }}
                                  title={hasNotes ? 'Edit saved notes' : 'Add lesson notes'}
                                >
                                  <StickyNote size={11} />
                                  <span>{hasNotes ? 'Notes' : '+ Note'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================
          3. TAB: 3 PRACTICAL SPRING BOOT PROJECTS
          ======================================================== */}
      {activeTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              background: 'var(--color-obsidian)',
              border: '1px solid var(--color-graphite)',
              borderRadius: 'var(--radius-cards)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '16px', color: 'var(--color-paper)', margin: 0 }}>
                Practical Spring Boot Projects
              </h2>
              <div style={{ fontSize: '13px', color: 'var(--color-fog)', marginTop: '2px' }}>
                Three complete, portfolio-grade enterprise backends with checklists, notes, repository links, and live deployment tracking.
              </div>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-acid-lime)',
                background: 'rgba(228, 242, 34, 0.08)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(228, 242, 34, 0.2)'
              }}
            >
              Enterprise Portfolio
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {SPRING_BOOT_PROJECTS.map(proj => {
              const pState = springBootProjectsState[proj.id] || {
                id: proj.id,
                status: 'not_started',
                completedChecklist: []
              };

              const completedItems = pState.completedChecklist || [];
              const projectProgress = Math.round((completedItems.length / proj.checklist.length) * 100);

              return (
                <div
                  key={proj.id}
                  className="linear-card"
                  style={{
                    padding: '22px 24px',
                    background: 'var(--color-carbon)',
                    border: '1px solid var(--color-graphite)',
                    borderRadius: 'var(--radius-cards)',
                    borderLeft:
                      pState.status === 'done' || projectProgress === 100
                        ? '3px solid var(--color-pulse-green)'
                        : pState.status === 'in_progress' || completedItems.length > 0
                        ? '3px solid var(--color-acid-lime)'
                        : '3px solid var(--color-graphite)'
                  }}
                >
                  {/* Project Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px',
                      marginBottom: '12px'
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--color-acid-lime)',
                          marginBottom: '4px'
                        }}
                      >
                        PROJECT 0{proj.number}
                      </div>
                      <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-paper)', margin: 0 }}>
                        {proj.title}
                      </h2>
                      <p style={{ fontSize: '13px', color: 'var(--color-mist)', marginTop: '3px' }}>
                        {proj.tagline}
                      </p>
                    </div>

                    {/* Status & Sync CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <select
                        value={pState.status}
                        onChange={e =>
                          updateSpringBootProject(proj.id, {
                            status: e.target.value as any
                          })
                        }
                        style={{
                          height: '32px',
                          fontSize: '12px',
                          background: 'var(--color-obsidian)',
                          color: 'var(--color-paper)',
                          border: '1px solid var(--color-graphite)',
                          borderRadius: 'var(--radius-inputs)',
                          padding: '0 8px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Completed</option>
                      </select>

                      <button
                        className="btn btn-primary"
                        onClick={() => handleSyncToProjectsPortfolio(proj)}
                        style={{ fontSize: '12px', height: '32px', padding: '0 12px' }}
                        title="Add to main Projects Portfolio tab"
                      >
                        <FolderGit2 size={13} />
                        <span>Manage in Portfolio</span>
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '13.5px', color: 'var(--color-fog)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {proj.description}
                  </p>

                  {/* Tech stack badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {proj.technologies.map(t => (
                      <span
                        key={t}
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          background: 'var(--color-obsidian)',
                          border: '1px solid var(--color-graphite)',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          color: 'var(--color-mist)'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Checklist & Progress */}
                  <div
                    style={{
                      background: 'var(--color-obsidian)',
                      border: '1px solid var(--color-graphite)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                      }}
                    >
                      <span className="card-label">Deliverables Checklist</span>
                      <span className="font-mono tab-num" style={{ fontSize: '12px', color: 'var(--color-paper)' }}>
                        {completedItems.length} / {proj.checklist.length} ({projectProgress}%)
                      </span>
                    </div>

                    <div className="linear-progress-bar" style={{ height: '4px', marginBottom: '12px' }}>
                      <div
                        className="linear-progress-bar-fill"
                        style={{
                          width: `${projectProgress}%`,
                          background: projectProgress === 100 ? 'var(--color-pulse-green)' : 'var(--color-acid-lime)'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {proj.checklist.map((item, idx) => {
                        const checked = completedItems.includes(item);
                        return (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              cursor: 'pointer'
                            }}
                            onClick={() => toggleSpringBootProjectChecklist(proj.id, item)}
                          >
                            <Checkbox
                              checked={checked}
                              onChange={() => toggleSpringBootProjectChecklist(proj.id, item)}
                            />
                            <span
                              style={{
                                fontSize: '13px',
                                color: checked ? 'var(--color-ash)' : 'var(--color-mist)',
                                textDecoration: checked ? 'line-through' : 'none',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project Repositories, Live URL & Notes */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '12px'
                    }}
                  >
                    {/* GitHub URL */}
                    <div>
                      <div className="card-label" style={{ marginBottom: '4px' }}>
                        GitHub Repository URL
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="url"
                          placeholder="https://github.com/username/project"
                          value={pState.githubUrl || ''}
                          onChange={e =>
                            updateSpringBootProject(proj.id, {
                              githubUrl: e.target.value
                            })
                          }
                          style={{
                            flex: 1,
                            height: '34px',
                            background: 'var(--color-obsidian)',
                            border: '1px solid var(--color-graphite)',
                            borderRadius: 'var(--radius-inputs)',
                            color: 'var(--color-paper)',
                            fontSize: '12px',
                            padding: '0 10px'
                          }}
                        />
                        {pState.githubUrl && (
                          <a
                            href={pState.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn"
                            style={{ padding: '0 10px', height: '34px', display: 'flex', alignItems: 'center' }}
                            title="Open GitHub"
                          >
                            <GitBranch size={13} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Live Deployment URL */}
                    <div>
                      <div className="card-label" style={{ marginBottom: '4px' }}>
                        Deployment / API Live URL
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="url"
                          placeholder="https://api.yourdomain.com or Swagger UI"
                          value={pState.liveUrl || ''}
                          onChange={e =>
                            updateSpringBootProject(proj.id, {
                              liveUrl: e.target.value
                            })
                          }
                          style={{
                            flex: 1,
                            height: '34px',
                            background: 'var(--color-obsidian)',
                            border: '1px solid var(--color-graphite)',
                            borderRadius: 'var(--radius-inputs)',
                            color: 'var(--color-paper)',
                            fontSize: '12px',
                            padding: '0 10px'
                          }}
                        />
                        {pState.liveUrl && (
                          <a
                            href={pState.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn"
                            style={{ padding: '0 10px', height: '34px', display: 'flex', alignItems: 'center' }}
                            title="Open Live Deployment"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Architecture & Implementation Notes */}
                  <div style={{ marginTop: '12px' }}>
                    <div className="card-label" style={{ marginBottom: '4px' }}>
                      Architecture & Implementation Notes
                    </div>
                    <textarea
                      placeholder="Record design decisions, test coverage notes, database choices, or challenges faced..."
                      value={pState.notes || ''}
                      onChange={e =>
                        updateSpringBootProject(proj.id, {
                          notes: e.target.value
                        })
                      }
                      rows={2}
                      style={{
                        width: '100%',
                        background: 'var(--color-obsidian)',
                        border: '1px solid var(--color-graphite)',
                        borderRadius: 'var(--radius-inputs)',
                        color: 'var(--color-paper)',
                        fontSize: '12px',
                        padding: '8px 10px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          4. MODAL: LESSON NOTES & STUDY KEY CONCEPTS DRAWER
          ======================================================== */}
      {activeNotesLesson && (
        <div className="modal-overlay" onClick={() => setActiveNotesLesson(null)}>
          <div
            className="modal-container"
            style={{ maxWidth: '580px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-acid-lime)',
                    marginBottom: '2px'
                  }}
                >
                  Module {activeNotesLesson.moduleNumber} · Lesson #{activeNotesLesson.globalIndex}
                </div>
                <h2 style={{ fontSize: '16px', color: 'var(--color-paper)' }}>
                  {activeNotesLesson.title}
                </h2>
              </div>
              <button
                className="btn"
                style={{ border: 0, padding: '4px' }}
                onClick={() => setActiveNotesLesson(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Key Study Concepts */}
              <div
                style={{
                  background: 'var(--color-obsidian)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: '6px',
                  padding: '12px 14px'
                }}
              >
                <div className="card-label" style={{ marginBottom: '6px' }}>
                  Core Study Objectives & Key Concepts
                </div>
                <ul
                  style={{
                    paddingLeft: '18px',
                    margin: 0,
                    fontSize: '12.5px',
                    color: 'var(--color-mist)',
                    lineHeight: 1.5
                  }}
                >
                  {activeNotesLesson.keyConcepts.map((concept, idx) => (
                    <li key={idx} style={{ marginBottom: '3px' }}>
                      {concept}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Personal Notes Textarea */}
              <div>
                <div className="card-label" style={{ marginBottom: '6px' }}>
                  Your Study Notes & Code Snippets
                </div>
                <textarea
                  value={tempNotesText}
                  onChange={e => setTempNotesText(e.target.value)}
                  placeholder="Record your understanding, key annotations, Gotchas, or code examples..."
                  rows={8}
                  style={{
                    width: '100%',
                    background: 'var(--color-carbon)',
                    border: '1px solid var(--color-graphite)',
                    borderRadius: 'var(--radius-inputs)',
                    color: 'var(--color-paper)',
                    fontSize: '13px',
                    padding: '10px 12px',
                    outline: 'none',
                    lineHeight: 1.5,
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn" onClick={() => setActiveNotesLesson(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveNotes}>
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
