import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Layers,
  Edit2,
  Plus,
  Trash2,
  Upload,
  X,
  Check,
  StickyNote,
  SlidersHorizontal,
  ArrowUpDown,
  Play,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  SPRING_FRAMEWORK_MODULES,
  TOTAL_ACADEMY_MODULES,
  TOTAL_ACADEMY_LESSONS,
  TOTAL_ACADEMY_DURATION_LABEL,
  TOTAL_ACADEMY_PAGES,
  AcademyModule,
  AcademyVideo
} from '../../data/springFrameworkCurriculum';
import { Checkbox } from '../common/Checkbox';
import { RoadmapToolbar } from '../common/RoadmapToolbar';
import { ImportVideoTitlesModal } from './ImportVideoTitlesModal';

export const SpringFrameworkRoadmapView: React.FC = () => {
  const {
    state,
    toggleSpringFrameworkLesson,
    updateSpringFrameworkLessonTitle,
    addSpringFrameworkLesson,
    removeSpringFrameworkLesson,
    importSpringFrameworkVideos,
    importMultipleSpringFrameworkModules,
    updateSpringFrameworkLessonNotes
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'incomplete' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'progress'>('order');

  // Expanded modules state: default expand Module 1
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'sf-mod-1': true
  });

  // Import Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTargetModuleId, setImportTargetModuleId] = useState<string | undefined>();

  // In-line video renaming state
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingVideoTitle, setEditingVideoTitle] = useState('');

  // In-line video add state
  const [addingToModuleId, setAddingToModuleId] = useState<string | null>(null);
  const [newVideoTitle, setNewVideoTitle] = useState('');

  // Lesson notes modal
  const [activeNotesVideo, setActiveNotesVideo] = useState<{ id: string; title: string; moduleName: string } | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const springFrameworkState = state.springFrameworkRoadmap || {};
  const customVideosMap = state.springFrameworkCustomVideos || {};

  // Resolve videos for each module (custom/imported videos if present, else defaultVideos)
  const getModuleVideos = (module: AcademyModule): AcademyVideo[] => {
    const customList = customVideosMap[module.id];
    if (customList && customList.length > 0) {
      return customList;
    }
    return module.defaultVideos;
  };

  // Calculate totals and overall progress
  const { totalVideosCount, completedVideosCount, overallPercent, totalPagesCount } = useMemo(() => {
    let totalVideos = 0;
    let completedVideos = 0;
    let totalPages = 0;

    SPRING_FRAMEWORK_MODULES.forEach(mod => {
      const videos = getModuleVideos(mod);
      totalVideos += videos.length;
      videos.forEach(v => {
        if (springFrameworkState[v.id]?.completed) {
          completedVideos++;
        }
      });
      if (mod.pages) {
        totalPages += mod.pages;
      }
    });

    const percent = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

    return {
      totalVideosCount: totalVideos,
      completedVideosCount: completedVideos,
      overallPercent: percent,
      totalPagesCount: totalPages
    };
  }, [customVideosMap, springFrameworkState]);

  // Process filtered and sorted modules
  const processedModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // Map modules with resolved videos and progress
    const list = SPRING_FRAMEWORK_MODULES.map(module => {
      const videos = getModuleVideos(module);
      const totalInMod = videos.length;
      const completedInMod = videos.filter(v => springFrameworkState[v.id]?.completed).length;
      const modPercent = totalInMod > 0 ? Math.round((completedInMod / totalInMod) * 100) : 0;

      // Filter videos by status and search
      const visibleVideos = videos.filter(v => {
        const isDone = !!springFrameworkState[v.id]?.completed;

        // Status filter
        if (statusFilter === 'completed' && !isDone) return false;
        if (statusFilter === 'incomplete' && isDone) return false;

        // Search match
        if (!q) return true;
        const matchesTitle = v.title.toLowerCase().includes(q);
        const matchesModule = module.title.toLowerCase().includes(q);
        return matchesTitle || matchesModule;
      });

      return {
        ...module,
        videos,
        visibleVideos,
        totalInMod,
        completedInMod,
        modPercent,
        isCompleted: completedInMod === totalInMod && totalInMod > 0
      };
    });

    // Filter out modules that have 0 visible videos when searching or filtering
    const filtered = list.filter(m => m.visibleVideos.length > 0 || !q);

    // Sort modules
    if (sortBy === 'name') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'progress') {
      return [...filtered].sort((a, b) => b.modPercent - a.modPercent);
    }
    // Default: course order
    return filtered;
  }, [searchQuery, statusFilter, sortBy, customVideosMap, springFrameworkState]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleToggleExpandAll = () => {
    const anyCollapsed = SPRING_FRAMEWORK_MODULES.some(m => !expandedModules[m.id]);
    const nextState: Record<string, boolean> = {};
    SPRING_FRAMEWORK_MODULES.forEach(m => {
      nextState[m.id] = anyCollapsed;
    });
    setExpandedModules(nextState);
  };

  const startEditingVideo = (video: AcademyVideo) => {
    setEditingVideoId(video.id);
    setEditingVideoTitle(video.title);
  };

  const saveEditingVideo = (moduleId: string) => {
    if (!editingVideoId) return;
    const title = editingVideoTitle.trim();
    if (title) {
      updateSpringFrameworkLessonTitle(moduleId, editingVideoId, title);
    }
    setEditingVideoId(null);
    setEditingVideoTitle('');
  };

  const handleAddVideo = (moduleId: string) => {
    const title = newVideoTitle.trim();
    if (title) {
      addSpringFrameworkLesson(moduleId, title);
    }
    setNewVideoTitle('');
    setAddingToModuleId(null);
  };

  const openNotesModal = (video: AcademyVideo, moduleName: string) => {
    setActiveNotesVideo({ id: video.id, title: video.title, moduleName });
    setTempNotes(springFrameworkState[video.id]?.notes || '');
  };

  const saveNotes = () => {
    if (!activeNotesVideo) return;
    updateSpringFrameworkLessonNotes(activeNotesVideo.id, tempNotes);
    setActiveNotesVideo(null);
  };

  // Next incomplete video
  const nextIncompleteVideo = useMemo(() => {
    for (const m of SPRING_FRAMEWORK_MODULES) {
      const vList = customVideosMap[m.id] || m.defaultVideos;
      const found = vList.find(v => !springFrameworkState[v.id]?.completed);
      if (found) {
        return { video: found, module: m };
      }
    }
    return null;
  }, [customVideosMap, springFrameworkState]);

  return (
    <div className="view-container">
      {/* Top Header */}
      <div className="view-header">
        <div>
          <div className="view-breadcrumb">
            <span>Roadmap</span>
            <span>/</span>
            <span style={{ color: 'var(--color-paper)' }}>Spring Framework</span>
          </div>
          <h1 className="view-title">Spring Framework Roadmap</h1>
          <p className="view-subtitle">
            Comprehensive modular curriculum covering Spring Core, IoC, Dependency Injection, MVC, REST APIs, and enterprise deployment.
          </p>
        </div>

        {/* Actions CTA */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => {
              setImportTargetModuleId(SPRING_FRAMEWORK_MODULES[0].id);
              setIsImportModalOpen(true);
            }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Upload size={14} />
            <span>Import Video Titles</span>
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Cards Grid */}
      <div className="roadmap-stats-grid">
        {/* Main Progress Stat */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-label">Overall Spring Progress</span>
            <span
              className="font-mono tab-num"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-acid-lime)'
              }}
            >
              {completedVideosCount} / {totalVideosCount} Lessons
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 600, color: 'var(--color-paper)' }}>
              {overallPercent}%
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-fog)' }}>completed</span>
          </div>
          <div className="linear-progress-bar" style={{ marginTop: '10px' }}>
            <div className="linear-progress-bar-fill" style={{ width: `${overallPercent}%` }} />
          </div>
        </div>

        {/* Next Incomplete Lesson */}
        <div
          className="stat-card"
          style={{ cursor: nextIncompleteVideo ? 'pointer' : 'default' }}
          onClick={() => {
            if (nextIncompleteVideo) {
              setExpandedModules(prev => ({ ...prev, [nextIncompleteVideo.module.id]: true }));
            }
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-label">Next Up</span>
            {nextIncompleteVideo && (
              <span style={{ fontSize: '11px', color: 'var(--color-acid-lime)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                Module #{nextIncompleteVideo.module.moduleNumber} <ArrowRight size={11} />
              </span>
            )}
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
            {nextIncompleteVideo ? nextIncompleteVideo.video.title : 'All Lessons Completed!'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-mist)', marginTop: '4px' }}>
            {nextIncompleteVideo ? nextIncompleteVideo.module.title : 'Great job completing Spring Framework!'}
          </div>
        </div>

        {/* Modules & Resources */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-label">Curriculum Scope</span>
            <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-signal-teal)' }}>
              {TOTAL_ACADEMY_DURATION_LABEL}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 600, color: 'var(--color-paper)' }}>
              {TOTAL_ACADEMY_MODULES}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-fog)' }}>modules · {totalPagesCount} pages</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-mist)', marginTop: '4px' }}>
            Editable video titles & study notes
          </div>
        </div>
      </div>

      {/* Standardized Reusable Toolbar */}
      <RoadmapToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search lessons, topics, or concepts..."
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => setStatusFilter(val as any)}
        statusOptions={[
          { id: 'all', label: 'All', count: totalVideosCount },
          { id: 'incomplete', label: 'Incomplete', count: totalVideosCount - completedVideosCount },
          { id: 'completed', label: 'Completed', count: completedVideosCount }
        ]}
        sortBy={sortBy}
        onSortChange={(val) => setSortBy(val as any)}
        sortOptions={[
          { id: 'order', label: 'Course Order' },
          { id: 'name', label: 'Name A–Z' },
          { id: 'progress', label: 'Progress' }
        ]}
        onResetFilters={() => {
          setSearchQuery('');
          setStatusFilter('all');
          setSortBy('order');
        }}
        rightActions={
          <button
            onClick={handleToggleExpandAll}
            className="btn"
            style={{
              fontSize: '12px',
              height: '34px',
              padding: '0 12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={13} />
            <span>
              {SPRING_FRAMEWORK_MODULES.some(m => !expandedModules[m.id]) ? 'Expand All' : 'Collapse All'}
            </span>
          </button>
        }
      />

      {/* ========================================================
          2. VERTICALLY STACKED NUMBERED MODULE CARDS
          ======================================================== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {processedModules.length === 0 ? (
          <div
            className="linear-card"
            style={{
              textAlign: 'center',
              padding: '48px 20px',
              color: 'var(--color-fog)',
              background: 'var(--color-obsidian)',
              border: '1px solid var(--color-graphite)'
            }}
          >
            <Search size={28} style={{ margin: '0 auto 12px', color: 'var(--color-smoke)' }} />
            <div style={{ fontSize: '15px', color: 'var(--color-paper)', fontWeight: 550 }}>
              No lessons found
            </div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>
              No video or module matched "{searchQuery}". Try a different keyword or reset filters.
            </div>
            <button
              className="btn"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              style={{ marginTop: '16px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          processedModules.map(module => {
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
                    : module.completedInMod > 0
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
                      gap: '14px'
                    }}
                  >
                    {/* Left: Module Number in Small Rounded Square & Exact Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          fontWeight: 650,
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: module.isCompleted
                            ? 'rgba(39, 166, 68, 0.14)'
                            : module.completedInMod > 0
                            ? 'rgba(228, 242, 34, 0.14)'
                            : 'var(--color-obsidian)',
                          color: module.isCompleted
                            ? 'var(--color-pulse-green)'
                            : module.completedInMod > 0
                            ? 'var(--color-acid-lime)'
                            : 'var(--color-fog)',
                          border: '1px solid var(--color-graphite)',
                          flexShrink: 0
                        }}
                      >
                        {module.moduleNumber < 10 ? `0${module.moduleNumber}` : module.moduleNumber}
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

                        {/* Metadata row: lessons, duration, pages */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            color: 'var(--color-fog)',
                            marginTop: '3px',
                            flexWrap: 'wrap'
                          }}
                        >
                          <span>{module.totalInMod} lessons</span>
                          <span>•</span>
                          <span>{module.duration}</span>
                          {module.pages !== undefined && (
                            <>
                              <span>•</span>
                              <span>{module.pages} pages</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Progress Badge & Chevron */}
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
                            : module.completedInMod > 0
                            ? 'rgba(228, 242, 34, 0.3)'
                            : 'var(--color-graphite)',
                          background: module.isCompleted
                            ? 'rgba(39, 166, 68, 0.12)'
                            : module.completedInMod > 0
                            ? 'rgba(228, 242, 34, 0.08)'
                            : 'transparent',
                          color: module.isCompleted
                            ? 'var(--color-pulse-green)'
                            : module.completedInMod > 0
                            ? 'var(--color-acid-lime)'
                            : 'var(--color-fog)'
                        }}
                      >
                        {module.isCompleted
                          ? 'Completed'
                          : module.completedInMod > 0
                          ? `${module.completedInMod}/${module.totalInMod} done`
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

                  {/* Module Progress Bar */}
                  <div className="linear-progress-bar" style={{ height: '3px', marginTop: '4px' }}>
                    <div
                      className="linear-progress-bar-fill"
                      style={{
                        width: `${module.modPercent}%`,
                        background: module.isCompleted ? 'var(--color-pulse-green)' : 'var(--color-acid-lime)'
                      }}
                    />
                  </div>
                </div>

                {/* Expanded Checklist of Videos */}
                {isExpanded && (
                  <div
                    style={{
                      borderTop: '1px solid var(--color-graphite)',
                      background: 'rgba(0, 0, 0, 0.18)',
                      padding: '10px 14px'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {module.visibleVideos.map((video, vIdx) => {
                        const isDone = !!springFrameworkState[video.id]?.completed;
                        const hasNotes = !!springFrameworkState[video.id]?.notes?.trim();
                        const isEditing = editingVideoId === video.id;

                        return (
                          <div
                            key={video.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              background: isDone ? 'rgba(255, 255, 255, 0.015)' : 'transparent',
                              border: '1px solid',
                              borderColor: isDone ? 'rgba(39, 166, 68, 0.15)' : 'transparent',
                              transition: 'background 0.12s ease'
                            }}
                          >
                            {/* Working Checkbox */}
                            <Checkbox
                              id={`cb-${video.id}`}
                              checked={isDone}
                              onChange={() => toggleSpringFrameworkLesson(video.id)}
                            />

                            {/* Video Number Badge */}
                            <span
                              className={`number-badge ${isDone ? 'completed' : ''}`}
                              style={{
                                fontSize: '11px',
                                padding: '1px 6px',
                                minWidth: '28px'
                              }}
                            >
                              #{String(vIdx + 1).padStart(2, '0')}
                            </span>

                            {/* Video Title (or inline edit input) */}
                            {isEditing ? (
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  flex: 1
                                }}
                                onClick={e => e.stopPropagation()}
                              >
                                <input
                                  type="text"
                                  autoFocus
                                  value={editingVideoTitle}
                                  onChange={e => setEditingVideoTitle(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') saveEditingVideo(module.id);
                                    if (e.key === 'Escape') setEditingVideoId(null);
                                  }}
                                  style={{
                                    flex: 1,
                                    height: '28px',
                                    background: 'var(--color-obsidian)',
                                    border: '1px solid var(--color-acid-lime)',
                                    borderRadius: '4px',
                                    color: 'var(--color-paper)',
                                    fontSize: '13px',
                                    padding: '0 8px',
                                    outline: 'none'
                                  }}
                                />
                                <button
                                  className="btn btn-primary"
                                  style={{ height: '28px', padding: '0 8px', fontSize: '11px' }}
                                  onClick={() => saveEditingVideo(module.id)}
                                >
                                  Save
                                </button>
                                <button
                                  className="btn"
                                  style={{ height: '28px', padding: '0 6px', fontSize: '11px' }}
                                  onClick={() => setEditingVideoId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div
                                style={{
                                  flex: 1,
                                  minWidth: 0,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  flexWrap: 'wrap'
                                }}
                                onClick={() => toggleSpringFrameworkLesson(video.id)}
                              >
                                <span
                                  style={{
                                    fontSize: '13.5px',
                                    fontWeight: isDone ? 450 : 500,
                                    color: isDone ? 'var(--color-ash)' : 'var(--color-paper)',
                                    textDecoration: isDone ? 'line-through' : 'none',
                                    lineHeight: 1.45,
                                    transition: 'color 0.15s ease'
                                  }}
                                >
                                  {video.title}
                                </span>

                                {/* Placeholder Indicator */}
                                {video.isPlaceholder && (
                                  <span
                                    style={{
                                      fontFamily: 'var(--font-mono)',
                                      fontSize: '10px',
                                      color: 'var(--color-fog)',
                                      background: 'rgba(255, 255, 255, 0.04)',
                                      padding: '1px 6px',
                                      borderRadius: '3px',
                                      border: '1px solid var(--color-graphite)'
                                    }}
                                    title="Placeholder title. Click edit to rename with your academy video title."
                                  >
                                    Placeholder
                                  </span>
                                )}

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
                                    <Check size={10} strokeWidth={2.5} /> Completed
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Actions: Edit Title, Notes, Remove */}
                            {!isEditing && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    startEditingVideo(video);
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: 0,
                                    color: 'var(--color-fog)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  title="Rename video title"
                                >
                                  <Edit2 size={12} />
                                </button>

                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    openNotesModal(video, module.title);
                                  }}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    border: '1px solid',
                                    borderColor: hasNotes ? 'var(--color-signal-teal)' : 'var(--color-graphite)',
                                    background: hasNotes ? 'rgba(2, 184, 204, 0.1)' : 'transparent',
                                    color: hasNotes ? 'var(--color-signal-teal)' : 'var(--color-fog)',
                                    fontSize: '11px',
                                    cursor: 'pointer'
                                  }}
                                  title="View or edit notes"
                                >
                                  <StickyNote size={11} />
                                  <span>{hasNotes ? 'Note' : '+ Note'}</span>
                                </button>

                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    removeSpringFrameworkLesson(module.id, video.id);
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: 0,
                                    color: 'var(--color-smoke)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  title="Remove video entry"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Add Video Row or Trigger */}
                      {addingToModuleId === module.id ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            background: 'var(--color-obsidian)',
                            borderRadius: '6px',
                            border: '1px solid var(--color-graphite)',
                            marginTop: '4px'
                          }}
                        >
                          <input
                            type="text"
                            autoFocus
                            placeholder="e.g. 5. Spring IoC Container Internals"
                            value={newVideoTitle}
                            onChange={e => setNewVideoTitle(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleAddVideo(module.id);
                              if (e.key === 'Escape') setAddingToModuleId(null);
                            }}
                            style={{
                              flex: 1,
                              height: '30px',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--color-paper)',
                              fontSize: '13px',
                              outline: 'none'
                            }}
                          />
                          <button
                            className="btn btn-primary"
                            style={{ height: '28px', padding: '0 10px', fontSize: '11px' }}
                            onClick={() => handleAddVideo(module.id)}
                          >
                            Add Video
                          </button>
                          <button
                            className="btn"
                            style={{ height: '28px', padding: '0 8px', fontSize: '11px' }}
                            onClick={() => setAddingToModuleId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '6px 12px',
                            marginTop: '4px'
                          }}
                        >
                          <button
                            onClick={() => {
                              setAddingToModuleId(module.id);
                              setNewVideoTitle('');
                            }}
                            style={{
                              background: 'transparent',
                              border: 0,
                              color: 'var(--color-fog)',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: 0
                            }}
                          >
                            <Plus size={13} />
                            <span>Add video to this module</span>
                          </button>

                          <span style={{ color: 'var(--color-smoke)' }}>•</span>

                          <button
                            onClick={() => {
                              setImportTargetModuleId(module.id);
                              setIsImportModalOpen(true);
                            }}
                            style={{
                              background: 'transparent',
                              border: 0,
                              color: 'var(--color-acid-lime)',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: 0
                            }}
                          >
                            <Upload size={12} />
                            <span>Paste video list for this module</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================
          3. IMPORT VIDEO TITLES MODAL
          ======================================================== */}
      <ImportVideoTitlesModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        defaultModuleId={importTargetModuleId}
        onImportSingleModule={(modId, titles) => importSpringFrameworkVideos(modId, titles)}
        onImportMultipleModules={data => importMultipleSpringFrameworkModules(data)}
      />

      {/* ========================================================
          4. VIDEO NOTES MODAL
          ======================================================== */}
      {activeNotesVideo && (
        <div className="modal-overlay" onClick={() => setActiveNotesVideo(null)}>
          <div
            className="modal-container"
            style={{ maxWidth: '520px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div className="font-mono" style={{ fontSize: '11px', color: 'var(--color-acid-lime)' }}>
                  {activeNotesVideo.moduleName}
                </div>
                <h2 style={{ fontSize: '15px', color: 'var(--color-paper)', marginTop: '2px' }}>
                  {activeNotesVideo.title}
                </h2>
              </div>
              <button className="btn" style={{ border: 0, padding: '4px' }} onClick={() => setActiveNotesVideo(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div className="card-label" style={{ marginBottom: '6px' }}>
                Video Notes & Key Timestamps
              </div>
              <textarea
                value={tempNotes}
                onChange={e => setTempNotes(e.target.value)}
                placeholder="Write timestamps, important concept notes, or key academy lecture takeaways..."
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

            <div className="modal-footer">
              <button className="btn" onClick={() => setActiveNotesVideo(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveNotes}>
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
