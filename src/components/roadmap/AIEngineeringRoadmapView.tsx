import React, { useState, useMemo } from 'react';
import {
  Play,
  ArrowRight,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Cpu,
  Code2,
  BookOpen
} from 'lucide-react';
import { AI_CURRICULUM, AI_PHASES, AITopic, TOTAL_AI_TOPICS } from '../../data/aiEngineeringCurriculum';
import { useApp } from '../../context/AppContext';
import { Checkbox } from '../common/Checkbox';
import { RoadmapToolbar } from '../common/RoadmapToolbar';
import { AITopicDetailModal } from './AITopicDetailModal';

export const AIEngineeringRoadmapView: React.FC = () => {
  const { state, toggleAITopic, toggleAIDailyPlan, setActivePage } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'not_started' | 'daily'>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'phase'>('order');
  const [viewLayout, setViewLayout] = useState<'sequential' | 'phases'>('sequential');
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    'phase-1': true
  });
  const [selectedTopic, setSelectedTopic] = useState<AITopic | null>(null);

  const aiRoadmapState = state.aiRoadmap || {};

  // All unique types for filter
  const types = useMemo(() => {
    const set = new Set<string>();
    AI_CURRICULUM.forEach((t) => set.add(t.type));
    return Array.from(set);
  }, []);

  // Filtered topics
  const filteredTopics = useMemo(() => {
    const filtered = AI_CURRICULUM.filter((topic) => {
      const topicState = aiRoadmapState[topic.id] || { completed: false };
      const isCompleted = !!topicState.completed;
      const inDaily = !!topicState.inDailyPlan;

      // Search matching
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        topic.title.toLowerCase().includes(q) ||
        topic.phase.toLowerCase().includes(q) ||
        topic.type.toLowerCase().includes(q) ||
        String(topic.number) === q ||
        `#${topic.number}`.includes(q) ||
        topic.description.toLowerCase().includes(q) ||
        topic.keyConcepts.some((c) => c.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Status matching
      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'not_started' && isCompleted) return false;
      if (statusFilter === 'daily' && !inDaily) return false;

      // Phase matching
      if (phaseFilter !== 'all' && topic.phase !== phaseFilter) return false;

      // Type matching
      if (typeFilter !== 'all' && topic.type !== typeFilter) return false;

      return true;
    });

    if (sortBy === 'name') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'phase') {
      return [...filtered].sort((a, b) => a.phaseNumber - b.phaseNumber || a.number - b.number);
    }
    // Default: exact course order
    return filtered;
  }, [searchQuery, statusFilter, phaseFilter, typeFilter, sortBy, aiRoadmapState]);

  // Overall Statistics
  const stats = useMemo(() => {
    let completedCount = 0;
    let scheduledDailyCount = 0;
    let totalMinutes = 0;

    AI_CURRICULUM.forEach((t) => {
      const s = aiRoadmapState[t.id];
      if (s?.completed) completedCount++;
      if (s?.inDailyPlan) scheduledDailyCount++;
      if (s?.studyMinutes) totalMinutes += s.studyMinutes;
    });

    const percent = Math.round((completedCount / TOTAL_AI_TOPICS) * 100);
    const nextIncomplete =
      AI_CURRICULUM.find((t) => !aiRoadmapState[t.id]?.completed) || AI_CURRICULUM[0];

    return {
      total: TOTAL_AI_TOPICS,
      completed: completedCount,
      scheduledDaily: scheduledDailyCount,
      totalMinutes,
      percent,
      nextIncomplete
    };
  }, [aiRoadmapState]);

  // Progress per phase
  const getPhaseProgress = (phaseName: string) => {
    const topicsInPhase = AI_CURRICULUM.filter((t) => t.phase === phaseName);
    const completedInPhase = topicsInPhase.filter((t) => aiRoadmapState[t.id]?.completed).length;
    const pct =
      topicsInPhase.length > 0 ? Math.round((completedInPhase / topicsInPhase.length) * 100) : 0;
    return { count: topicsInPhase.length, completed: completedInPhase, percent: pct };
  };

  const handleNextTopic = () => {
    if (!selectedTopic) return;
    const idx = AI_CURRICULUM.findIndex((t) => t.id === selectedTopic.id);
    if (idx < AI_CURRICULUM.length - 1) {
      setSelectedTopic(AI_CURRICULUM[idx + 1]);
    }
  };

  const handlePrevTopic = () => {
    if (!selectedTopic) return;
    const idx = AI_CURRICULUM.findIndex((t) => t.id === selectedTopic.id);
    if (idx > 0) {
      setSelectedTopic(AI_CURRICULUM[idx - 1]);
    }
  };

  const togglePhaseExpand = (phaseId: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Concept':
        return { bg: 'rgba(2, 184, 204, 0.08)', text: 'var(--color-signal-teal)', border: 'rgba(2, 184, 204, 0.25)' };
      case 'Practice':
        return { bg: 'rgba(99, 102, 241, 0.08)', text: 'var(--color-iris-violet)', border: 'rgba(99, 102, 241, 0.25)' };
      case 'Code':
        return { bg: 'rgba(228, 242, 34, 0.08)', text: 'var(--color-acid-lime)', border: 'rgba(228, 242, 34, 0.25)' };
      case 'Project':
        return { bg: 'rgba(39, 166, 68, 0.1)', text: 'var(--color-pulse-green)', border: 'rgba(39, 166, 68, 0.3)' };
      case 'Advanced':
        return { bg: 'rgba(139, 92, 246, 0.1)', text: 'var(--color-lavender)', border: 'rgba(139, 92, 246, 0.3)' };
      case 'Production':
        return { bg: 'rgba(235, 87, 87, 0.1)', text: 'var(--color-coral-red)', border: 'rgba(235, 87, 87, 0.3)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', text: 'var(--color-fog)', border: 'var(--color-graphite)' };
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
            <span style={{ color: 'var(--color-paper)' }}>AI Engineering</span>
          </div>
          <h1 className="view-title">AI Engineering Foundation Roadmap</h1>
          <p className="view-subtitle">
            Progressing from GenAI fundamentals to production-ready GenAI systems across 20 structured foundational topics.
          </p>
        </div>

        {/* Continue Learning CTA Button */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setSelectedTopic(stats.nextIncomplete)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Play size={14} fill="currentColor" />
            <span>Continue Learning (#{stats.nextIncomplete.number})</span>
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Card Grid (Identical to JS Roadmap) */}
      <div className="roadmap-stats-grid">
        {/* Main Progress Stat */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-label">Overall AI Progress</span>
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

        {/* Next Up Topic */}
        <div
          className="stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedTopic(stats.nextIncomplete)}
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
            {stats.nextIncomplete.phase} · {stats.nextIncomplete.type}
          </div>
        </div>

        {/* Daily Study Queue Link */}
        <div className="stat-card">
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
            <span style={{ fontSize: '12px', color: 'var(--color-fog)' }}>topics in today's plan</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-mist)', marginTop: '4px' }}>
            {stats.totalMinutes > 0 ? `${stats.totalMinutes}m logged studying AI` : 'Log time inside topic modal'}
          </div>
        </div>
      </div>

      {/* Standardized Reusable Toolbar */}
      <RoadmapToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search AI topics or concepts"
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => setStatusFilter(val as any)}
        statusOptions={[
          { id: 'all', label: 'All', count: TOTAL_AI_TOPICS },
          { id: 'not_started', label: 'Incomplete', count: TOTAL_AI_TOPICS - stats.completed },
          { id: 'completed', label: 'Completed', count: stats.completed },
          { id: 'daily', label: 'In Daily', count: stats.scheduledDaily }
        ]}
        sortBy={sortBy}
        onSortChange={(val) => setSortBy(val as any)}
        sortOptions={[
          { id: 'order', label: 'Course Order' },
          { id: 'name', label: 'Name A–Z' },
          { id: 'phase', label: 'Phase Order' }
        ]}
        categoryFilter={phaseFilter}
        onCategoryFilterChange={setPhaseFilter}
        categoryOptions={[
          ...Array.from(new Set(AI_CURRICULUM.map((t) => t.phase))).map((phaseName) => ({
            id: phaseName,
            label: phaseName,
            percent: getPhaseProgress(phaseName).percent
          }))
        ]}
        categoryLabel="Phases"
        onResetFilters={() => {
          setSearchQuery('');
          setStatusFilter('all');
          setPhaseFilter('all');
          setSortBy('order');
        }}
        rightActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setViewLayout((prev) => (prev === 'sequential' ? 'phases' : 'sequential'))}
              className="btn"
              style={{
                fontSize: '12px',
                height: '34px',
                padding: '0 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Toggle between linear sequential order and phase-grouped view"
            >
              <Layers size={13} />
              <span>{viewLayout === 'sequential' ? 'Group by Phases' : 'Show Flat List'}</span>
            </button>
          </div>
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
          Showing {filteredTopics.length} {filteredTopics.length === 1 ? 'topic' : 'topics'}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--color-fog)' }}>
          Click any topic card to open learning objectives, architecture notes, and official resources
        </span>
      </div>

      {/* Main Content: Grouped by Phase or Sequential List */}
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
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>No topics match your current filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setPhaseFilter('all');
              setTypeFilter('all');
            }}
            className="btn btn-secondary"
            style={{ fontSize: '12px' }}
          >
            Reset Filters
          </button>
        </div>
      ) : viewLayout === 'phases' ? (
        /* ==================== GROUPED BY PHASES VIEW ==================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {AI_PHASES.map((phaseGroup) => {
            const phaseTopics = filteredTopics.filter((t) => phaseGroup.topicIds.includes(t.id));
            if (phaseTopics.length === 0 && searchQuery) return null;

            const isExpanded = !!expandedPhases[phaseGroup.id] || searchQuery.trim().length > 0;
            const completedInGroup = phaseGroup.topicIds.filter(
              (id) => aiRoadmapState[id]?.completed
            ).length;
            const isPhaseDone = completedInGroup === phaseGroup.topicIds.length;

            return (
              <div
                key={phaseGroup.id}
                style={{
                  background: 'var(--color-carbon)',
                  border: '1px solid var(--color-graphite)',
                  borderLeft: isPhaseDone
                    ? '3px solid var(--color-pulse-green)'
                    : completedInGroup > 0
                    ? '3px solid var(--color-acid-lime)'
                    : '3px solid transparent',
                  borderRadius: 'var(--radius-buttons)',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s ease'
                }}
              >
                {/* Phase Accordion Header */}
                <div
                  onClick={() => togglePhaseExpand(phaseGroup.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      togglePhaseExpand(phaseGroup.id);
                    }
                  }}
                  style={{
                    padding: '14px 18px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    userSelect: 'none',
                    background: 'var(--color-obsidian)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <span
                        className="number-badge"
                        style={{
                          background: isPhaseDone ? 'rgba(39, 166, 68, 0.15)' : 'var(--color-charcoal)',
                          color: isPhaseDone ? 'var(--color-pulse-green)' : 'var(--color-paper)'
                        }}
                      >
                        P{phaseGroup.phaseNumber}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--color-paper)' }}>
                          {phaseGroup.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-fog)', marginTop: '2px' }}>
                          {phaseGroup.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <span
                        className="font-mono tab-num"
                        style={{
                          fontSize: '11px',
                          color: isPhaseDone
                            ? 'var(--color-pulse-green)'
                            : completedInGroup > 0
                            ? 'var(--color-acid-lime)'
                            : 'var(--color-fog)',
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          border: '1px solid var(--color-graphite)'
                        }}
                      >
                        {completedInGroup} / {phaseGroup.topicIds.length} done
                      </span>
                      <ChevronDown
                        size={16}
                        style={{
                          color: 'var(--color-fog)',
                          transform: isExpanded ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.18s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div className="linear-progress-bar" style={{ height: '3px' }}>
                    <div
                      className="linear-progress-bar-fill"
                      style={{
                        width: `${Math.round((completedInGroup / phaseGroup.topicIds.length) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Topics in Phase */}
                {isExpanded && (
                  <div
                    style={{
                      padding: '10px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      borderTop: '1px solid var(--color-graphite)'
                    }}
                  >
                    {phaseTopics.map((topic) => {
                      const topicState = aiRoadmapState[topic.id] || { completed: false };
                      const isCompleted = !!topicState.completed;
                      const inDaily = !!topicState.inDailyPlan;
                      const hasNotes = !!topicState.notes?.trim();
                      const studyMins = topicState.studyMinutes || 0;
                      const typeBadge = getTypeBadgeColor(topic.type);

                      return (
                        <div
                          key={topic.id}
                          className="lesson-card-row"
                          style={{
                            background: isCompleted ? 'rgba(74, 222, 128, 0.02)' : 'var(--color-carbon)',
                            border: isCompleted
                              ? '1px solid rgba(74, 222, 128, 0.2)'
                              : '1px solid var(--color-graphite)'
                          }}
                          onClick={() => setSelectedTopic(topic)}
                        >
                          {/* Checkbox */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Checkbox
                              id={`cb-group-${topic.id}`}
                              checked={isCompleted}
                              onChange={() => toggleAITopic(topic.id)}
                            />
                          </div>

                          {/* Number Badge */}
                          <span
                            className={`number-badge ${isCompleted ? 'completed' : ''}`}
                          >
                            #{String(topic.number).padStart(2, '0')}
                          </span>

                          {/* Topic Details */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span
                                style={{
                                  fontSize: '13.5px',
                                  fontWeight: 510,
                                  color: isCompleted ? 'var(--color-mist)' : 'var(--color-paper)',
                                  textDecoration: isCompleted ? 'line-through' : 'none',
                                  lineHeight: 1.4
                                }}
                              >
                                {topic.title}
                              </span>

                              {/* Type Badge */}
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontFamily: 'var(--font-mono)',
                                  background: typeBadge.bg,
                                  color: typeBadge.text,
                                  border: `1px solid ${typeBadge.border}`,
                                  padding: '1px 6px',
                                  borderRadius: '3px'
                                }}
                              >
                                {topic.type}
                              </span>

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
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginTop: '3px',
                                fontSize: '11.5px',
                                color: 'var(--color-fog)'
                              }}
                            >
                              <span>{topic.phase}</span>
                              <span>•</span>
                              <span>{topic.learningObjectives.length} objectives</span>
                              <span>•</span>
                              <span>{topic.resources.length} resources</span>
                              {studyMins > 0 && (
                                <>
                                  <span>•</span>
                                  <span style={{ color: 'var(--color-acid-lime)', fontFamily: 'var(--font-mono)' }}>
                                    {studyMins}m studied
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Right Action */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAIDailyPlan(topic.id);
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
      ) : (
        /* ==================== FLAT SEQUENTIAL LIST VIEW ==================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredTopics.map((topic) => {
            const topicState = aiRoadmapState[topic.id] || { completed: false };
            const isCompleted = !!topicState.completed;
            const inDaily = !!topicState.inDailyPlan;
            const hasNotes = !!topicState.notes?.trim();
            const studyMins = topicState.studyMinutes || 0;
            const typeBadge = getTypeBadgeColor(topic.type);

            return (
              <div
                key={topic.id}
                className="lesson-card-row"
                style={{
                  background: isCompleted ? 'rgba(74, 222, 128, 0.02)' : 'var(--color-obsidian)',
                  border: isCompleted
                    ? '1px solid rgba(74, 222, 128, 0.2)'
                    : '1px solid var(--color-graphite)'
                }}
                onClick={() => setSelectedTopic(topic)}
              >
                {/* Working Checkbox (Isolated from row click) */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Checkbox
                    id={`cb-flat-${topic.id}`}
                    checked={isCompleted}
                    onChange={() => toggleAITopic(topic.id)}
                    label={`Mark topic ${topic.number} complete`}
                  />
                </div>

                {/* Number Badge */}
                <span
                  className={`number-badge ${isCompleted ? 'completed' : ''}`}
                >
                  #{String(topic.number).padStart(2, '0')}
                </span>

                {/* Topic Title & Badges */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '13.5px',
                        fontWeight: 510,
                        color: isCompleted ? 'var(--color-mist)' : 'var(--color-paper)',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        lineHeight: 1.4
                      }}
                    >
                      {topic.title}
                    </span>

                    {/* Phase Badge */}
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-mono)',
                        background: 'var(--color-charcoal)',
                        color: 'var(--color-fog)',
                        border: '1px solid var(--color-graphite)',
                        padding: '1px 6px',
                        borderRadius: '3px'
                      }}
                    >
                      {topic.phase}
                    </span>

                    {/* Type Badge */}
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-mono)',
                        background: typeBadge.bg,
                        color: typeBadge.text,
                        border: `1px solid ${typeBadge.border}`,
                        padding: '1px 6px',
                        borderRadius: '3px'
                      }}
                    >
                      {topic.type}
                    </span>

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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '3px',
                      fontSize: '11.5px',
                      color: 'var(--color-fog)'
                    }}
                  >
                    <span>{topic.description.slice(0, 85)}...</span>
                    <span>•</span>
                    <span>{topic.learningObjectives.length} objectives</span>
                    {studyMins > 0 && (
                      <>
                        <span>•</span>
                        <span style={{ color: 'var(--color-acid-lime)', fontFamily: 'var(--font-mono)' }}>
                          {studyMins}m studied
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Action Icons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAIDailyPlan(topic.id);
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

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <AITopicDetailModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
          onNext={handleNextTopic}
          onPrev={handlePrevTopic}
        />
      )}
    </div>
  );
};
