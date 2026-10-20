import React, { useState, useMemo } from 'react';
import {
  Play,
  ArrowRight,
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Network,
  Sparkles,
  Info,
  ShieldAlert,
  Compass,
  Zap,
  X,
  FileText
} from 'lucide-react';
import {
  NETWORK_LEVELS,
  NETWORK_TOPICS,
  TOTAL_NETWORK_TOPICS,
  NETWORK_STUDY_PRIORITIES
} from '../../data/networkFundamentalsCurriculum';
import { NetworkTopic } from '../../types';
import { useApp } from '../../context/AppContext';
import { Checkbox } from '../common/Checkbox';
import { RoadmapToolbar } from '../common/RoadmapToolbar';

export const NetworkFundamentalsRoadmapView: React.FC = () => {
  const {
    state,
    toggleNetworkTopic,
    toggleNetworkDailyPlan,
    updateNetworkTopicNotes,
    setActivePage
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'not_started' | 'daily'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'status'>('order');

  // Expanded levels state: default expand Level 1
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({
    'level-1': true
  });

  // Active topic for notes/detail modal
  const [activeModalTopic, setActiveModalTopic] = useState<NetworkTopic | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const networkRoadmapState = state.networkRoadmap || {};

  // Overall Statistics
  const stats = useMemo(() => {
    let completedCount = 0;
    let scheduledDailyCount = 0;

    NETWORK_TOPICS.forEach((t) => {
      const s = networkRoadmapState[t.id];
      if (s?.completed) completedCount++;
      if (s?.inDailyPlan) scheduledDailyCount++;
    });

    const percent = Math.round((completedCount / TOTAL_NETWORK_TOPICS) * 100);
    const nextIncomplete =
      NETWORK_TOPICS.find((t) => !networkRoadmapState[t.id]?.completed) || NETWORK_TOPICS[0];

    const currentLevel =
      NETWORK_LEVELS.find((lvl) => lvl.id === nextIncomplete.levelId) || NETWORK_LEVELS[0];

    return {
      total: TOTAL_NETWORK_TOPICS,
      completed: completedCount,
      scheduledDaily: scheduledDailyCount,
      percent,
      nextIncomplete,
      currentLevel
    };
  }, [networkRoadmapState]);

  // Level progress helper
  const getLevelProgress = (levelId: string) => {
    const level = NETWORK_LEVELS.find((l) => l.id === levelId);
    if (!level) return { count: 0, completed: 0, percent: 0 };
    const topicsInLevel = NETWORK_TOPICS.filter((t) => t.levelId === levelId);
    const completed = topicsInLevel.filter((t) => networkRoadmapState[t.id]?.completed).length;
    const pct = topicsInLevel.length > 0 ? Math.round((completed / topicsInLevel.length) * 100) : 0;
    return { count: topicsInLevel.length, completed, percent: pct };
  };

  // Filtered topics calculation
  const filteredTopics = useMemo(() => {
    const filtered = NETWORK_TOPICS.filter((topic) => {
      const topicState = networkRoadmapState[topic.id] || { completed: false };
      const isCompleted = !!topicState.completed;
      const inDaily = !!topicState.inDailyPlan;

      // Search match
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        topic.title.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q) ||
        topic.levelTitle.toLowerCase().includes(q) ||
        String(topic.number) === q ||
        `#${topic.number}`.includes(q) ||
        (topic.keyPoints && topic.keyPoints.some((p) => p.toLowerCase().includes(q)));

      if (!matchesSearch) return false;

      // Status match
      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'not_started' && isCompleted) return false;
      if (statusFilter === 'daily' && !inDaily) return false;

      // Level match
      if (levelFilter !== 'all' && topic.levelId !== levelFilter) return false;

      return true;
    });

    if (sortBy === 'name') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'status') {
      return [...filtered].sort((a, b) => {
        const aDone = !!networkRoadmapState[a.id]?.completed;
        const bDone = !!networkRoadmapState[b.id]?.completed;
        if (aDone === bDone) return a.number - b.number;
        return aDone ? 1 : -1;
      });
    }
    // Default: original course order
    return filtered;
  }, [searchQuery, statusFilter, levelFilter, sortBy, networkRoadmapState]);

  // Toggle level expansion
  const toggleLevel = (levelId: string) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };

  const handleToggleExpandAll = () => {
    const allExpanded = NETWORK_LEVELS.every((l) => expandedLevels[l.id]);
    const nextState: Record<string, boolean> = {};
    NETWORK_LEVELS.forEach((l) => {
      nextState[l.id] = !allExpanded;
    });
    setExpandedLevels(nextState);
  };

  // When searching, auto-expand levels with matches
  const hasActiveSearch = searchQuery.trim().length > 0;

  const openNotesModal = (topic: NetworkTopic) => {
    setActiveModalTopic(topic);
    setTempNotes(networkRoadmapState[topic.id]?.notes || '');
  };

  const saveNotes = () => {
    if (!activeModalTopic) return;
    updateNetworkTopicNotes(activeModalTopic.id, tempNotes);
    setActiveModalTopic(null);
  };

  return (
    <div className="view-container">
      {/* Top Header */}
      <div className="view-header">
        <div>
          <div className="view-breadcrumb">
            <span>Roadmap</span>
            <span>/</span>
            <span style={{ color: 'var(--color-paper)' }}>Network Fundamentals</span>
          </div>
          <h1 className="view-title">Network Fundamentals Roadmap</h1>
          <p className="view-subtitle">
            A web developer's guide to understanding how browsers, frontend applications, APIs, backend services, and servers communicate.
          </p>
        </div>

        {/* Continue Learning CTA Button */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => {
              setExpandedLevels((prev) => ({
                ...prev,
                [stats.nextIncomplete.levelId]: true
              }));
              openNotesModal(stats.nextIncomplete);
            }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Play size={14} fill="currentColor" />
            <span>Continue Learning (#{stats.nextIncomplete.number})</span>
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Cards Grid (Master JS Roadmap pattern) */}
      <div className="roadmap-stats-grid">
        {/* Card 1: Overall Progress */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-label">Overall Network Progress</span>
            <span
              className="font-mono tab-num"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-acid-lime)'
              }}
            >
              {stats.completed} / {stats.total} Topics
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

        {/* Card 2: Next Incomplete Topic */}
        <div
          className="stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setExpandedLevels((prev) => ({
              ...prev,
              [stats.nextIncomplete.levelId]: true
            }));
            openNotesModal(stats.nextIncomplete);
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-label">Next Up</span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-acid-lime)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              Topic #{stats.nextIncomplete.number} <ArrowRight size={11} />
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
            {stats.currentLevel.title} · {stats.nextIncomplete.priority === 'must-know' ? 'Must Know' : 'Core Topic'}
          </div>
        </div>

        {/* Card 3: Scope & Daily Queue */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-label">Curriculum Scope</span>
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
              5 Levels
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-fog)' }}>50 total topics</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-mist)', marginTop: '4px' }}>
            {stats.scheduledDaily > 0
              ? `${stats.scheduledDaily} topics scheduled in today's study plan`
              : 'Add topics to daily plan for focused revision'}
          </div>
        </div>
      </div>

      {/* Standardized Reusable Toolbar */}
      <RoadmapToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search networking topics..."
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => setStatusFilter(val as any)}
        statusOptions={[
          { id: 'all', label: 'All', count: TOTAL_NETWORK_TOPICS },
          { id: 'not_started', label: 'Incomplete', count: TOTAL_NETWORK_TOPICS - stats.completed },
          { id: 'completed', label: 'Completed', count: stats.completed },
          { id: 'daily', label: 'In Daily', count: stats.scheduledDaily }
        ]}
        sortBy={sortBy}
        onSortChange={(val) => setSortBy(val as any)}
        sortOptions={[
          { id: 'order', label: 'Roadmap Order' },
          { id: 'name', label: 'Name A–Z' },
          { id: 'status', label: 'Completion Status' }
        ]}
        categoryFilter={levelFilter}
        onCategoryFilterChange={setLevelFilter}
        categoryOptions={NETWORK_LEVELS.map((lvl) => ({
          id: lvl.id,
          label: `Level ${lvl.levelNumber}`,
          percent: getLevelProgress(lvl.id).percent
        }))}
        categoryLabel="Levels"
        onResetFilters={() => {
          setSearchQuery('');
          setStatusFilter('all');
          setLevelFilter('all');
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
              {NETWORK_LEVELS.some((l) => !expandedLevels[l.id]) ? 'Expand All' : 'Collapse All'}
            </span>
          </button>
        }
      />

      {/* Topics Header Count */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <span className="card-label">
          Showing {filteredTopics.length} of {TOTAL_NETWORK_TOPICS} topics across 5 levels
        </span>
        <span style={{ fontSize: '12px', color: 'var(--color-fog)' }}>
          Click any card to open study details & add personal revision notes
        </span>
      </div>

      {/* Empty State */}
      {filteredTopics.length === 0 ? (
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
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            No networking topics match your current search or filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setLevelFilter('all');
              setSortBy('order');
            }}
            className="btn btn-secondary"
            style={{ fontSize: '12px' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Expandable Level Cards (Matching JS Roadmap Master Design) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {NETWORK_LEVELS.map((level) => {
            const levelTopics = filteredTopics.filter((t) => t.levelId === level.id);

            // If searching or filtering and no topics match in this level, skip unless no filter
            if (levelTopics.length === 0 && (searchQuery || statusFilter !== 'all')) {
              return null;
            }

            const isExpanded = !!expandedLevels[level.id] || hasActiveSearch;
            const progress = getLevelProgress(level.id);
            const isLevelDone = progress.completed === progress.count && progress.count > 0;

            return (
              <div
                key={level.id}
                style={{
                  background: 'var(--color-carbon)',
                  border: '1px solid var(--color-graphite)',
                  borderLeft: isLevelDone
                    ? '3px solid var(--color-pulse-green)'
                    : progress.completed > 0
                    ? '3px solid var(--color-acid-lime)'
                    : '3px solid transparent',
                  borderRadius: 'var(--radius-buttons)',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s ease'
                }}
              >
                {/* Level Card Header */}
                <div
                  onClick={() => toggleLevel(level.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleLevel(level.id);
                    }
                  }}
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    userSelect: 'none',
                    background: 'var(--color-obsidian)'
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
                    {/* Left: Level Number Badge & Title */}
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
                          background: isLevelDone
                            ? 'rgba(39, 166, 68, 0.14)'
                            : progress.completed > 0
                            ? 'rgba(228, 242, 34, 0.14)'
                            : 'var(--color-charcoal)',
                          color: isLevelDone
                            ? 'var(--color-pulse-green)'
                            : progress.completed > 0
                            ? 'var(--color-acid-lime)'
                            : 'var(--color-fog)',
                          border: '1px solid var(--color-graphite)',
                          flexShrink: 0
                        }}
                      >
                        {level.levelNumber < 10 ? `0${level.levelNumber}` : level.levelNumber}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h2
                            style={{
                              fontSize: '15px',
                              fontWeight: 550,
                              color: 'var(--color-paper)',
                              margin: 0
                            }}
                          >
                            {level.title}
                          </h2>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              color: 'var(--color-fog)',
                              background: 'rgba(255, 255, 255, 0.04)',
                              padding: '1px 6px',
                              borderRadius: '3px',
                              border: '1px solid var(--color-graphite)'
                            }}
                          >
                            {level.subtitle}
                          </span>
                        </div>

                        <div style={{ fontSize: '12px', color: 'var(--color-fog)', marginTop: '3px' }}>
                          {level.description} · {level.topicIds.length} topics
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
                          borderColor: isLevelDone
                            ? 'rgba(39, 166, 68, 0.3)'
                            : progress.completed > 0
                            ? 'rgba(228, 242, 34, 0.3)'
                            : 'var(--color-graphite)',
                          background: isLevelDone
                            ? 'rgba(39, 166, 68, 0.12)'
                            : progress.completed > 0
                            ? 'rgba(228, 242, 34, 0.08)'
                            : 'transparent',
                          color: isLevelDone
                            ? 'var(--color-pulse-green)'
                            : progress.completed > 0
                            ? 'var(--color-acid-lime)'
                            : 'var(--color-fog)'
                        }}
                      >
                        {isLevelDone
                          ? 'Completed'
                          : progress.completed > 0
                          ? `${progress.completed}/${progress.count} done (${progress.percent}%)`
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

                  {/* Level Progress Bar */}
                  <div className="linear-progress-bar" style={{ height: '3px', marginTop: '2px' }}>
                    <div
                      className="linear-progress-bar-fill"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Checklist of Topics */}
                {isExpanded && (
                  <div
                    style={{
                      borderTop: '1px solid var(--color-graphite)',
                      background: 'rgba(0, 0, 0, 0.15)',
                      padding: '10px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    {levelTopics.map((topic) => {
                      const topicState = networkRoadmapState[topic.id] || { completed: false };
                      const isDone = !!topicState.completed;
                      const inDaily = !!topicState.inDailyPlan;
                      const hasNotes = !!topicState.notes?.trim();

                      return (
                        <div
                          key={topic.id}
                          className="lesson-card-row"
                          style={{
                            background: isDone ? 'rgba(74, 222, 128, 0.02)' : 'var(--color-carbon)',
                            border: isDone
                              ? '1px solid rgba(74, 222, 128, 0.2)'
                              : '1px solid var(--color-graphite)',
                            padding: '11px 14px'
                          }}
                          onClick={() => openNotesModal(topic)}
                        >
                          {/* Working Checkbox (Isolated from row click) */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Checkbox
                              id={`cb-net-${topic.id}`}
                              checked={isDone}
                              onChange={() => toggleNetworkTopic(topic.id)}
                              label={`Mark ${topic.title} complete`}
                            />
                          </div>

                          {/* Number Badge */}
                          <span className={`number-badge ${isDone ? 'completed' : ''}`}>
                            #{String(topic.number).padStart(2, '0')}
                          </span>

                          {/* Topic Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span
                                style={{
                                  fontSize: '13.5px',
                                  fontWeight: 510,
                                  color: isDone ? 'var(--color-mist)' : 'var(--color-paper)',
                                  textDecoration: isDone ? 'line-through' : 'none',
                                  lineHeight: 1.4
                                }}
                              >
                                {topic.title}
                              </span>

                              {/* Priority Tag */}
                              {topic.priority === 'must-know' && (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    color: 'var(--color-acid-lime)',
                                    background: 'rgba(228, 242, 34, 0.08)',
                                    padding: '1px 6px',
                                    borderRadius: '3px',
                                    border: '1px solid rgba(228, 242, 34, 0.25)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                  title="Must-know topic for web developer interviews and daily work"
                                >
                                  <Zap size={9} /> Must Know
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

                            <div
                              style={{
                                fontSize: '12px',
                                color: 'var(--color-fog)',
                                marginTop: '3px',
                                lineHeight: 1.4,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {topic.description}
                            </div>
                          </div>

                          {/* Right Action Icons */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleNetworkDailyPlan(topic.id);
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
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          8. STUDY PRIORITY SECTION (Faithful to PDF)
          ======================================================== */}
      <div
        className="linear-card"
        style={{
          marginTop: '16px',
          background: 'var(--color-obsidian)',
          border: '1px solid var(--color-graphite)',
          padding: '22px 24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Compass size={18} style={{ color: 'var(--color-acid-lime)' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-paper)', margin: 0 }}>
            Study Priority Guide (For Web & Java Full-Stack Developers)
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--color-fog)', marginBottom: '18px', lineHeight: 1.5 }}>
          Focused study guidance from the curriculum reference. Focus your revision on the communication layer that connects browsers, APIs, and servers.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {NETWORK_STUDY_PRIORITIES.map((group) => {
            const isMustKnow = group.category === 'must-know';
            const isGoodToKnow = group.category === 'good-to-know';

            const accentColor = isMustKnow
              ? 'var(--color-acid-lime)'
              : isGoodToKnow
              ? 'var(--color-signal-teal)'
              : 'var(--color-ash)';

            const borderAccent = isMustKnow
              ? 'rgba(228, 242, 34, 0.3)'
              : isGoodToKnow
              ? 'rgba(2, 184, 204, 0.3)'
              : 'var(--color-graphite)';

            const bgAccent = isMustKnow
              ? 'rgba(228, 242, 34, 0.04)'
              : isGoodToKnow
              ? 'rgba(2, 184, 204, 0.04)'
              : 'rgba(255, 255, 255, 0.015)';

            return (
              <div
                key={group.category}
                style={{
                  background: bgAccent,
                  border: `1px solid ${borderAccent}`,
                  borderRadius: 'var(--radius-buttons)',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-paper)' }}>
                    {group.title}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: accentColor,
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      border: `1px solid ${borderAccent}`
                    }}
                  >
                    {group.badge}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--color-fog)', lineHeight: 1.45, margin: 0 }}>
                  {group.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {group.items.map((item, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: 'var(--color-carbon)',
                        border: '1px solid var(--color-graphite)',
                        color: isMustKnow ? 'var(--color-paper)' : 'var(--color-mist)'
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          DETAIL & NOTES MODAL
          ======================================================== */}
      {activeModalTopic && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalTopic(null);
          }}
        >
          <div
            className="modal-container"
            style={{
              maxWidth: '680px',
              width: '100%',
              background: 'var(--color-carbon)',
              border: '1px solid var(--color-graphite)',
              borderRadius: 'var(--radius-cards)',
              boxShadow: 'var(--shadow-modal)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid var(--color-graphite)',
                background: 'var(--color-obsidian)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="number-badge">
                  #{String(activeModalTopic.number).padStart(2, '0')}
                </span>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-paper)', margin: 0 }}>
                    {activeModalTopic.title}
                  </h2>
                  <div style={{ fontSize: '12px', color: 'var(--color-fog)', marginTop: '2px' }}>
                    {activeModalTopic.levelTitle}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModalTopic(null)}
                className="btn"
                style={{ padding: '6px 10px', fontSize: '12px' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                maxHeight: '68vh',
                overflowY: 'auto'
              }}
            >
              {/* Description */}
              <div
                style={{
                  background: 'var(--color-obsidian)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-buttons)',
                  padding: '14px 16px'
                }}
              >
                <div className="card-label" style={{ marginBottom: '6px' }}>Core Concept</div>
                <p style={{ fontSize: '13.5px', color: 'var(--color-paper)', lineHeight: 1.55, margin: 0 }}>
                  {activeModalTopic.description}
                </p>
              </div>

              {/* Key Takeaways */}
              {activeModalTopic.keyPoints && activeModalTopic.keyPoints.length > 0 && (
                <div
                  style={{
                    background: 'var(--color-obsidian)',
                    border: '1px solid var(--color-graphite)',
                    borderRadius: 'var(--radius-buttons)',
                    padding: '14px 16px'
                  }}
                >
                  <div className="card-label" style={{ marginBottom: '10px' }}>Key Architecture Takeaways</div>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {activeModalTopic.keyPoints.map((pt, i) => (
                      <li key={i} style={{ fontSize: '13px', color: 'var(--color-mist)', lineHeight: 1.5 }}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Completion Toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--color-obsidian)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-buttons)',
                  cursor: 'pointer'
                }}
                onClick={() => toggleNetworkTopic(activeModalTopic.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Checkbox
                    id={`modal-cb-net-${activeModalTopic.id}`}
                    checked={!!networkRoadmapState[activeModalTopic.id]?.completed}
                    onChange={() => toggleNetworkTopic(activeModalTopic.id)}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-paper)' }}>
                    Mark topic as completed
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: networkRoadmapState[activeModalTopic.id]?.completed
                      ? 'var(--color-pulse-green)'
                      : 'var(--color-fog)'
                  }}
                >
                  {networkRoadmapState[activeModalTopic.id]?.completed ? 'Done' : 'Incomplete'}
                </span>
              </div>

              {/* Notes Input */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="card-label">My Study Notes & Revision Insights</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-fog)' }}>Saved locally</span>
                </div>
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Record your understanding, code examples, curl snippets, or interview questions..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    fontFamily: 'var(--font-inter)',
                    lineHeight: 1.55,
                    background: 'var(--color-obsidian)',
                    border: '1px solid var(--color-graphite)',
                    borderRadius: 'var(--radius-inputs)',
                    color: 'var(--color-paper)',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '14px 22px',
                borderTop: '1px solid var(--color-graphite)',
                background: 'var(--color-obsidian)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <button
                onClick={() => toggleNetworkDailyPlan(activeModalTopic.id)}
                className={
                  networkRoadmapState[activeModalTopic.id]?.inDailyPlan
                    ? 'btn btn-primary'
                    : 'btn btn-secondary'
                }
                style={{ fontSize: '12px' }}
              >
                <Calendar size={13} />
                <span>
                  {networkRoadmapState[activeModalTopic.id]?.inDailyPlan
                    ? 'In Daily Plan'
                    : '+ Add to Daily Plan'}
                </span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setActiveModalTopic(null)}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveNotes}
                  className="btn btn-primary"
                  style={{ fontSize: '12px' }}
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
