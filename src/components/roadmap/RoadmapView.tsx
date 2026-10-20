import React, { useState } from 'react';
import {
  ChevronRight,
  Search,
  CheckCircle2,
  Calendar,
  Target,
  ArrowRight,
  Sparkles,
  X,
  Clock,
  Layers,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  WEEKLY_JOURNEY,
  getPhaseGroups,
  getWeekStatus,
  WeeklyJourneyItem,
  PhaseGroup
} from '../../data/weeklyLearningJourney';
import { PHASES } from '../../data/curriculum';
import { getNextMilestone } from '../../services/progress';
import { Badge } from '../common/Badge';

export const RoadmapView: React.FC = () => {
  const {
    state,
    currentPosition,
    setActivePage,
    toggleWeekCompletion
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // Expand current phase by default
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    [currentPosition.phaseIndex]: true
  });

  const togglePhase = (phaseId: number) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    getPhaseGroups().forEach(p => {
      all[p.id] = true;
    });
    setExpandedPhases(all);
  };

  const collapseAll = () => {
    setExpandedPhases({});
  };

  // 1. Calculate overall weekly metrics
  const totalWeeks = 20;
  const completedWeeksCount = WEEKLY_JOURNEY.filter(
    w => getWeekStatus(w, currentPosition.week, state) === 'completed'
  ).length;
  const overallRoadmapPercent = Math.round((completedWeeksCount / totalWeeks) * 100);

  // Current learning phase
  const activePhase = PHASES[currentPosition.phaseIndex] || PHASES[0];

  // Next milestone from roadmap or current week
  const rawNextMilestone = getNextMilestone(state);
  const currentWeekItem = WEEKLY_JOURNEY.find(w => w.weekNumber === currentPosition.week) || WEEKLY_JOURNEY[0];
  const nextIncompleteWeek = WEEKLY_JOURNEY.find(
    w => getWeekStatus(w, currentPosition.week, state) !== 'completed'
  ) || WEEKLY_JOURNEY[WEEKLY_JOURNEY.length - 1];

  const milestoneTitle = rawNextMilestone?.title || nextIncompleteWeek.deliverable;
  const milestoneTarget = rawNextMilestone?.weekSpan || `Week ${nextIncompleteWeek.weekNumber}`;

  // 2. Filter weeks based on search query
  const query = searchQuery.trim().toLowerCase();

  const phaseGroups = getPhaseGroups();

  const filteredPhaseGroups = phaseGroups
    .map(group => {
      const matchingWeeks = group.weeks.filter(week => {
        if (!query) return true;
        const inTitle = week.title.toLowerCase().includes(query);
        const inFocus = week.focus.toLowerCase().includes(query);
        const inDeliverable = week.deliverable.toLowerCase().includes(query);
        const inTech = week.technologies.some(t => t.toLowerCase().includes(query));
        const inWeekNum = `week ${week.weekNumber}`.includes(query);
        const inPhase = group.title.toLowerCase().includes(query);
        return inTitle || inFocus || inDeliverable || inTech || inWeekNum || inPhase;
      });

      return {
        ...group,
        weeks: matchingWeeks
      };
    })
    .filter(group => group.weeks.length > 0);

  const totalFilteredWeeks = filteredPhaseGroups.reduce((acc, g) => acc + g.weeks.length, 0);

  return (
    <div className="view-container">
      {/* Page Header */}
      <div className="view-header">
        <div className="view-breadcrumb">
          <span>CURRICULUM</span>
          <span>/</span>
          <span>WORKFLOW</span>
        </div>
        <h1 className="view-title">20-Week Learning Journey</h1>
        <p className="view-subtitle">
          A structured weekly plan to become a job-ready Java Full-Stack Developer with practical AI engineering skills.
        </p>
      </div>

      {/* Summary Stats Cards */}
      <div className="roadmap-stats-grid">
        {/* Card 1: Current Week */}
        <div className="stat-card">
          <div className="stat-card-label">CURRENT WEEK</div>
          <div className="stat-card-value font-mono">
            Week {currentPosition.week} <span style={{ fontSize: '13px', color: 'var(--color-fog)', fontWeight: 400 }}>/ 20</span>
          </div>
          <div className="stat-card-subtext" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentWeekItem.title}
          </div>
        </div>

        {/* Card 2: Current Learning Phase */}
        <div className="stat-card">
          <div className="stat-card-label">CURRENT PHASE</div>
          <div className="stat-card-value font-mono">
            Phase {currentPosition.phaseIndex + 1}
          </div>
          <div className="stat-card-subtext" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activePhase.title}
          </div>
        </div>

        {/* Card 3: Overall Roadmap Progress */}
        <div className="stat-card">
          <div className="stat-card-label">ROADMAP PROGRESS</div>
          <div className="stat-card-value font-mono">
            {overallRoadmapPercent}%
          </div>
          <div className="linear-progress-bar" style={{ marginTop: '6px', height: '4px' }}>
            <div
              className="linear-progress-bar-fill"
              style={{ width: `${overallRoadmapPercent}%` }}
            />
          </div>
          <div className="stat-card-subtext font-mono" style={{ marginTop: '5px' }}>
            {completedWeeksCount} of {totalWeeks} weeks completed
          </div>
        </div>

        {/* Card 4: Next Major Milestone */}
        <div className="stat-card">
          <div className="stat-card-label">NEXT MILESTONE</div>
          <div
            className="stat-card-value"
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-paper)',
              lineHeight: 1.3,
              marginTop: '2px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {milestoneTitle}
          </div>
          <div className="stat-card-subtext font-mono" style={{ color: 'var(--color-accent-text)', marginTop: '4px' }}>
            ● Target: {milestoneTarget}
          </div>
        </div>
      </div>

      {/* Clean Single Search Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'var(--color-obsidian)',
          border: '1px solid var(--color-graphite)',
          borderRadius: 'var(--radius-buttons)',
          padding: '10px 14px'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '220px' }}>
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
            placeholder="Search weeks, topics, or technologies..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '34px',
              paddingRight: searchQuery ? '32px' : '12px',
              height: '34px',
              background: 'var(--color-carbon)',
              border: '1px solid var(--color-graphite)',
              borderRadius: 'var(--radius-buttons)',
              color: 'var(--color-paper)',
              fontSize: '13px'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 0,
                color: 'var(--color-fog)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="font-mono tab-num" style={{ fontSize: '12px', color: 'var(--color-fog)' }}>
            Showing {totalFilteredWeeks} of {totalWeeks} weeks
          </span>
          <button
            onClick={expandAll}
            className="btn btn-secondary"
            style={{ fontSize: '11.5px', height: '28px', padding: '0 10px' }}
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="btn btn-secondary"
            style={{ fontSize: '11.5px', height: '28px', padding: '0 10px' }}
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredPhaseGroups.length === 0 && (
        <div
          className="linear-card"
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'var(--color-obsidian)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Search size={32} style={{ color: 'var(--color-fog)', opacity: 0.5 }} />
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-paper)' }}>
            No matching weeks found
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-mist)', maxWidth: '380px' }}>
            No weeks or technologies match &ldquo;{searchQuery}&rdquo;. Try clearing your search term.
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="btn btn-secondary"
            style={{ marginTop: '6px' }}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Expandable Phase Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredPhaseGroups.map(group => {
          const isPhaseOpen = !!query || !!expandedPhases[group.id];
          const isCurrentPhase = currentPosition.phaseIndex === group.id;

          // Phase statistics
          const phaseTotalWeeks = group.weeks.length;
          const phaseCompletedWeeks = group.weeks.filter(
            w => getWeekStatus(w, currentPosition.week, state) === 'completed'
          ).length;
          const phasePercent = phaseTotalWeeks > 0
            ? Math.round((phaseCompletedWeeks / phaseTotalWeeks) * 100)
            : 0;

          const startWeekNum = group.weeks[0]?.weekNumber || 1;
          const endWeekNum = group.weeks[group.weeks.length - 1]?.weekNumber || startWeekNum;
          const weekRangeLabel = startWeekNum === endWeekNum ? `Week ${startWeekNum}` : `Weeks ${startWeekNum}–${endWeekNum}`;

          return (
            <div
              key={group.id}
              className="linear-card"
              style={{
                background: 'var(--color-obsidian)',
                border: '1px solid var(--color-graphite)',
                borderLeft: isCurrentPhase ? '2px solid var(--color-acid-lime)' : '1px solid var(--color-graphite)',
                padding: 0,
                overflow: 'hidden'
              }}
            >
              {/* Phase Header Accordion */}
              <div
                onClick={() => togglePhase(group.id)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  background: isCurrentPhase ? 'rgba(228, 242, 34, 0.02)' : 'transparent'
                }}
              >
                {/* Chevron */}
                <div
                  style={{
                    color: 'var(--color-fog)',
                    transform: isPhaseOpen ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.18s ease',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0
                  }}
                >
                  <ChevronRight size={16} />
                </div>

                {/* Phase Number Badge */}
                <div className="number-badge" style={{ flexShrink: 0 }}>
                  {String(group.id + 1).padStart(2, '0')}
                </div>

                {/* Title & Metadata */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-paper)' }}>
                      {group.title}
                    </span>
                    <span
                      className="font-mono tab-num"
                      style={{
                        fontSize: '11px',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background: 'var(--color-charcoal)',
                        color: 'var(--color-mist)',
                        border: '1px solid var(--color-graphite)'
                      }}
                    >
                      {weekRangeLabel}
                    </span>
                    {isCurrentPhase && <Badge variant="active">Active Phase</Badge>}
                    {phasePercent === 100 && <Badge variant="completed">Completed</Badge>}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--color-mist)', marginTop: '3px', lineHeight: 1.4 }}>
                    {group.subtitle}
                  </div>
                </div>

                {/* Phase Progress Counter & Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                  <span className="font-mono tab-num" style={{ fontSize: '12px', color: 'var(--color-fog)' }}>
                    {phaseCompletedWeeks}/{phaseTotalWeeks} weeks ({phasePercent}%)
                  </span>
                  <div className="linear-progress-bar" style={{ width: '80px', height: '4px' }}>
                    <div className="linear-progress-bar-fill" style={{ width: `${phasePercent}%` }} />
                  </div>
                </div>
              </div>

              {/* Weekly Cards List */}
              {isPhaseOpen && (
                <div
                  style={{
                    borderTop: '1px solid var(--color-graphite)',
                    background: 'var(--color-deep-surface)',
                    padding: '14px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {group.weeks.map(week => {
                    const status = getWeekStatus(week, currentPosition.week, state);
                    const isCompleted = status === 'completed';
                    const isCurrent = status === 'current';

                    return (
                      <div
                        key={week.weekNumber}
                        style={{
                          background: isCurrent
                            ? 'rgba(228, 242, 34, 0.025)'
                            : isCompleted
                            ? 'rgba(39, 166, 68, 0.02)'
                            : 'var(--color-obsidian)',
                          border: isCurrent
                            ? '1px solid rgba(228, 242, 34, 0.35)'
                            : '1px solid var(--color-graphite)',
                          borderLeft: isCurrent
                            ? '3px solid var(--color-acid-lime)'
                            : isCompleted
                            ? '3px solid var(--color-pulse-green)'
                            : '1px solid var(--color-graphite)',
                          borderRadius: 'var(--radius-buttons)',
                          padding: '16px 18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          transition: 'border-color 0.15s ease'
                        }}
                      >
                        {/* Top Row: Week Badge, Title, Technologies, Status */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '10px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1, minWidth: '240px' }}>
                            {/* Week Badge */}
                            <div
                              className="font-mono tab-num"
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '6px',
                                background: isCompleted
                                  ? 'rgba(39, 166, 68, 0.1)'
                                  : isCurrent
                                  ? 'rgba(228, 242, 34, 0.1)'
                                  : 'var(--color-charcoal)',
                                border: isCompleted
                                  ? '1px solid rgba(39, 166, 68, 0.3)'
                                  : isCurrent
                                  ? '1px solid rgba(228, 242, 34, 0.35)'
                                  : '1px solid var(--color-graphite)',
                                color: isCompleted
                                  ? 'var(--color-pulse-green)'
                                  : isCurrent
                                  ? 'var(--color-accent-text)'
                                  : 'var(--color-mist)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 600,
                                flexShrink: 0
                              }}
                            >
                              W{week.weekNumber}
                            </div>

                            {/* Title & Status */}
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span
                                  style={{
                                    fontSize: '14.5px',
                                    fontWeight: 600,
                                    color: 'var(--color-paper)'
                                  }}
                                >
                                  Week {week.weekNumber}: {week.title}
                                </span>

                                {/* Status Badges */}
                                {isCompleted && (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontSize: '11px',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      background: 'rgba(39, 166, 68, 0.12)',
                                      color: 'var(--color-pulse-green)',
                                      border: '1px solid rgba(39, 166, 68, 0.3)',
                                      fontFamily: 'var(--font-mono)'
                                    }}
                                  >
                                    <Check size={11} strokeWidth={2.5} />
                                    <span>Completed</span>
                                  </span>
                                )}

                                {isCurrent && (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      fontSize: '11px',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      background: 'rgba(228, 242, 34, 0.14)',
                                      color: 'var(--color-accent-text)',
                                      border: '1px solid rgba(228, 242, 34, 0.35)',
                                      fontFamily: 'var(--font-mono)'
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: 'var(--color-acid-lime)'
                                      }}
                                    />
                                    <span>Current Week</span>
                                  </span>
                                )}

                                {!isCompleted && !isCurrent && (
                                  <span
                                    style={{
                                      fontSize: '11px',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      background: 'var(--color-charcoal)',
                                      color: 'var(--color-fog)',
                                      border: '1px solid var(--color-graphite)',
                                      fontFamily: 'var(--font-mono)'
                                    }}
                                  >
                                    Upcoming
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Roadmap Navigation Link & Completion Toggle */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            {week.relatedRoadmap && (
                              <button
                                onClick={() => setActivePage(week.relatedRoadmap!.page)}
                                className="btn btn-secondary"
                                style={{
                                  fontSize: '11.5px',
                                  height: '28px',
                                  padding: '0 10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  color: 'var(--color-paper)'
                                }}
                                title={week.relatedRoadmap.title}
                              >
                                <span>{week.relatedRoadmap.title}</span>
                                <ArrowRight size={12} />
                              </button>
                            )}

                            {/* Mark Week Completed Toggle */}
                            <button
                              onClick={() => toggleWeekCompletion(week.weekNumber)}
                              className="btn btn-secondary"
                              style={{
                                fontSize: '11.5px',
                                height: '28px',
                                padding: '0 10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: isCompleted ? 'rgba(39, 166, 68, 0.1)' : undefined,
                                borderColor: isCompleted ? 'rgba(39, 166, 68, 0.3)' : undefined,
                                color: isCompleted ? 'var(--color-pulse-green)' : 'var(--color-mist)'
                              }}
                              title={isCompleted ? 'Mark week as incomplete' : 'Mark week as completed'}
                            >
                              <Check size={12} strokeWidth={2.5} />
                              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Technology / Concept Pills */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11.5px', color: 'var(--color-fog)', marginRight: '2px' }}>
                            Focus Areas:
                          </span>
                          {week.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '11px',
                                padding: '2px 7px',
                                borderRadius: '4px',
                                background: 'var(--color-carbon)',
                                border: '1px solid var(--color-graphite)',
                                color: 'var(--color-paper)',
                                fontFamily: 'var(--font-mono)'
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Learning Objective / Focus */}
                        <div
                          style={{
                            fontSize: '13px',
                            color: 'var(--color-mist)',
                            lineHeight: 1.5,
                            background: 'var(--color-carbon)',
                            border: '1px solid var(--color-graphite)',
                            borderRadius: '6px',
                            padding: '10px 14px'
                          }}
                        >
                          <span style={{ color: 'var(--color-paper)', fontWeight: 500, marginRight: '6px' }}>
                            Learning Objective:
                          </span>
                          {week.focus}
                        </div>

                        {/* Major Deliverable / Outcome Milestone */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            fontSize: '12.5px',
                            padding: '9px 12px',
                            borderRadius: '6px',
                            background: 'rgba(228, 242, 34, 0.03)',
                            border: '1px solid rgba(228, 242, 34, 0.15)',
                            color: 'var(--color-paper)'
                          }}
                        >
                          <Target
                            size={15}
                            style={{
                              color: 'var(--color-accent-text)',
                              flexShrink: 0,
                              marginTop: '2px'
                            }}
                          />
                          <div>
                            <span style={{ color: 'var(--color-accent-text)', fontWeight: 600, marginRight: '6px' }}>
                              Major Deliverable / Milestone:
                            </span>
                            <span style={{ color: 'var(--color-mist)' }}>
                              {week.deliverable}
                            </span>
                          </div>
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
    </div>
  );
};
