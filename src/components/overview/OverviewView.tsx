import React, { useMemo } from 'react';
import { ArrowRight, CheckCircle2, Calendar, Target, Award, Code2, FileCode, Play, Server, Sparkles, Network, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROADMAP_BLOCKS, PHASES, formatWeekLabel } from '../../data/curriculum';
import { calculateStreakStats } from '../../services/streak';
import ContributionSkyline from '../ui/contribution-skyline';
import { JS_CURRICULUM } from '../../data/javascriptCurriculum';
import {
  SPRING_FRAMEWORK_MODULES,
  TOTAL_ACADEMY_LESSONS
} from '../../data/springFrameworkCurriculum';
import { AI_CURRICULUM, TOTAL_AI_TOPICS } from '../../data/aiEngineeringCurriculum';
import { NETWORK_TOPICS, TOTAL_NETWORK_TOPICS } from '../../data/networkFundamentalsCurriculum';
import { Badge } from '../common/Badge';
import { Checkbox } from '../common/Checkbox';

export const OverviewView: React.FC = () => {
  const {
    state,
    currentPosition,
    setActivePage,
    setSelectedBlockAndDay,
    toggleStudyBlock,
    setStudyHours,
    setStudyNotes
  } = useApp();

  const currentBlock = ROADMAP_BLOCKS[currentPosition.blockIndex];
  const currentPhase = PHASES[currentPosition.phaseIndex];

  const streakStats = useMemo(() => calculateStreakStats(state), [state]);

  // 5 Standard Study Blocks (360 mins = 6 hours)
  const STUDY_BLOCKS = [
    { id: 0, name: 'Main learning', minutes: 150 },
    { id: 1, name: 'Project work', minutes: 90 },
    { id: 2, name: 'DSA and SQL', minutes: 45 },
    { id: 3, name: 'AI or computer science fundamentals', minutes: 45 },
    { id: 4, name: 'English speaking and revision', minutes: 30 }
  ];

  const dayKey = `${currentPosition.blockIndex}:${currentPosition.dayInBlock}`;
  const studyBlockData = state.studyBlocks[dayKey] || {
    dayKey,
    checkedBlocks: [false, false, false, false, false],
    hoursStudied: '',
    notes: ''
  };

  const checkedBlocks = studyBlockData.checkedBlocks || [false, false, false, false, false];
  const completedBlocksCount = checkedBlocks.filter(Boolean).length;
  const totalBlocksCount = STUDY_BLOCKS.length;
  const blocksPercent = Math.round((completedBlocksCount / totalBlocksCount) * 100);

  const completedPlannedMinutes = STUDY_BLOCKS.reduce((sum, b, idx) => {
    return sum + (checkedBlocks[idx] ? b.minutes : 0);
  }, 0);
  const completedPlannedHours = (completedPlannedMinutes / 60).toFixed(1).replace(/\.0$/, '');

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setStudyHours(dayKey, '');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 24) {
      setStudyHours(dayKey, val);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStudyNotes(dayKey, e.target.value);
  };

  const handleContinueLearning = () => {
    setSelectedBlockAndDay(currentPosition.blockIndex, currentPosition.dayInBlock);
    setActivePage('daily');
  };

  const jsCompleted = Object.values(state.jsRoadmap || {}).filter(l => l?.completed).length;
  const jsPercent = Math.round((jsCompleted / JS_CURRICULUM.length) * 100);
  const nextJSLesson = JS_CURRICULUM.find(l => !state.jsRoadmap?.[l.id]?.completed) || JS_CURRICULUM[0];

  const springFrameworkCompleted = Object.values(state.springFrameworkRoadmap || {}).filter(l => l?.completed).length;
  const springFrameworkPercent = Math.round((springFrameworkCompleted / TOTAL_ACADEMY_LESSONS) * 100);
  const customVideosMap = state.springFrameworkCustomVideos || {};

  let nextSpringFrameworkVideo: { title: string; moduleTitle: string } | null = null;
  for (const m of SPRING_FRAMEWORK_MODULES) {
    const vList = customVideosMap[m.id] || m.defaultVideos;
    const found = vList.find(v => !state.springFrameworkRoadmap?.[v.id]?.completed);
    if (found) {
      nextSpringFrameworkVideo = { title: found.title, moduleTitle: m.title };
      break;
    }
  }
  if (!nextSpringFrameworkVideo) {
    nextSpringFrameworkVideo = { title: 'All videos completed!', moduleTitle: 'Course Complete' };
  }

  const networkCompleted = Object.values(state.networkRoadmap || {}).filter(t => t?.completed).length;
  const networkPercent = Math.round((networkCompleted / TOTAL_NETWORK_TOPICS) * 100);
  const nextNetworkTopic = NETWORK_TOPICS.find(t => !state.networkRoadmap?.[t.id]?.completed) || NETWORK_TOPICS[0];

  const aiCompleted = Object.values(state.aiRoadmap || {}).filter(t => t?.completed).length;
  const aiPercent = Math.round((aiCompleted / TOTAL_AI_TOPICS) * 100);
  const nextAITopic = AI_CURRICULUM.find(t => !state.aiRoadmap?.[t.id]?.completed) || AI_CURRICULUM[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="font-mono tab-num" style={{ fontSize: '11px', letterSpacing: '0.04em', color: 'var(--color-fog)' }}>
            PHASE {currentPosition.phaseIndex + 1} · {formatWeekLabel(currentBlock).toUpperCase()}
          </div>
          <h1 style={{ marginTop: '4px' }}>{currentBlock.title}</h1>
          <p className="card-subtext" style={{ fontSize: '14px' }}>
            {currentPhase.title} · Day {currentPosition.dayInBlock} of {currentBlock.weekSpan * 7}
            {currentPosition.isRestDay && ' (Scheduled Rest / Light Revision Day)'}
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleContinueLearning}>
          Continue Daily Tasks <ArrowRight size={15} />
        </button>
      </div>

      {/* Curriculum Spotlights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
        {/* JavaScript Curriculum Spotlight */}
        <div
          className="linear-card"
          style={{
            borderLeft: '2px solid var(--color-acid-lime)',
            background: 'var(--color-obsidian)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            padding: '16px 18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(228, 242, 34, 0.12)',
                border: '1px solid rgba(228, 242, 34, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-text)',
                flexShrink: 0
              }}
            >
              <FileCode size={19} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="card-label">JavaScript Curriculum</div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-paper)',
                  marginTop: '1px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Next: #{nextJSLesson.number} {nextJSLesson.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-mist)', marginTop: '2px' }}>
                {jsCompleted} of {JS_CURRICULUM.length} lessons ({jsPercent}%)
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setActivePage('js-roadmap')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', height: '32px', padding: '0 12px' }}
          >
            <span>JS Track</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Spring Framework Course Spotlight */}
        <div
          className="linear-card"
          style={{
            borderLeft: '2px solid var(--color-pulse-green)',
            background: 'var(--color-obsidian)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            padding: '16px 18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(39, 166, 68, 0.08)',
                border: '1px solid rgba(39, 166, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-pulse-green)',
                flexShrink: 0
              }}
            >
              <Server size={19} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="card-label">Spring Framework Track</div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-paper)',
                  marginTop: '1px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Next: {nextSpringFrameworkVideo.title} ({nextSpringFrameworkVideo.moduleTitle})
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-mist)', marginTop: '2px' }}>
                {springFrameworkCompleted} of {TOTAL_ACADEMY_LESSONS} videos ({springFrameworkPercent}%) · 8 modules
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setActivePage('spring-framework')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', height: '32px', padding: '0 12px' }}
          >
            <span>Spring Track</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Network Fundamentals Spotlight */}
        <div
          className="linear-card"
          style={{
            borderLeft: '2px solid #38bdf8',
            background: 'var(--color-obsidian)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            padding: '16px 18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                flexShrink: 0
              }}
            >
              <Network size={19} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="card-label">Network Fundamentals</div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-paper)',
                  marginTop: '1px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Next: L{nextNetworkTopic.levelId} · #{nextNetworkTopic.number} {nextNetworkTopic.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-mist)', marginTop: '2px' }}>
                {networkCompleted} of {TOTAL_NETWORK_TOPICS} topics ({networkPercent}%) · 5 levels
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setActivePage('network-roadmap')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', height: '32px', padding: '0 12px' }}
          >
            <span>Network Track</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* AI Engineering Foundation Spotlight */}
        <div
          className="linear-card"
          style={{
            borderLeft: '2px solid #c084fc',
            background: 'var(--color-obsidian)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            padding: '16px 18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(192, 132, 252, 0.08)',
                border: '1px solid rgba(192, 132, 252, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc',
                flexShrink: 0
              }}
            >
              <Sparkles size={19} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="card-label">AI Engineering Track</div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-paper)',
                  marginTop: '1px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Next: P{nextAITopic.phase} · #{nextAITopic.id} {nextAITopic.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-mist)', marginTop: '2px' }}>
                {aiCompleted} of {TOTAL_AI_TOPICS} topics ({aiPercent}%) · 9 phases
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setActivePage('ai-roadmap')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', height: '32px', padding: '0 12px' }}
          >
            <span>AI Track</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Learning Streak & Contribution Skyline Section */}
      <div className="linear-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--color-paper)' }}>Learning Streak</h2>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-badges)',
                  background: 'var(--color-brand-subtle)',
                  color: 'var(--color-brand-text)',
                  border: '1px solid var(--color-brand-border)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Flame size={13} style={{ color: 'var(--color-brand)' }} />
                {streakStats.currentStreak > 0 ? `${streakStats.currentStreak}-Day Streak` : 'Streak Inactive'}
              </span>
            </div>
            <div className="card-subtext" style={{ marginTop: '3px', fontSize: '13px' }}>
              Complete 4 of 5 daily blocks to keep your streak.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div className="font-mono tab-num" style={{ fontSize: '12px', color: 'var(--color-fog)', textAlign: 'right' }}>
              <div>Range: <span style={{ color: 'var(--color-paper)' }}>{streakStats.dateRangeStr}</span></div>
              <div style={{ marginTop: '2px' }}>
                Today: <span style={{ color: streakStats.todayQualifies ? 'var(--color-brand-text)' : 'var(--color-paper)', fontWeight: 600 }}>
                  {streakStats.todayCount}/5 blocks completed
                  {streakStats.todayQualifies ? ' · Qualified' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Quick Metric Precision Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
          <div className="linear-card-obsidian" style={{ padding: '12px 14px' }}>
            <div className="card-label">Current Streak</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-brand)', marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span className="font-mono tab-num">{streakStats.currentStreak}</span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-fog)' }}>{streakStats.currentStreak === 1 ? 'day' : 'days'}</span>
            </div>
          </div>

          <div className="linear-card-obsidian" style={{ padding: '12px 14px' }}>
            <div className="card-label">Longest Streak</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-paper)', marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span className="font-mono tab-num">{streakStats.longestStreak}</span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-fog)' }}>{streakStats.longestStreak === 1 ? 'day' : 'days'}</span>
            </div>
          </div>

          <div className="linear-card-obsidian" style={{ padding: '12px 14px' }}>
            <div className="card-label">Qualifying Days</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-paper)', marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span className="font-mono tab-num">{streakStats.qualifyingDaysCount}</span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-fog)' }}>{streakStats.qualifyingDaysCount === 1 ? 'day' : 'days'}</span>
            </div>
          </div>

          <div className="linear-card-obsidian" style={{ padding: '12px 14px' }}>
            <div className="card-label">Blocks Completed</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-paper)', marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span className="font-mono tab-num">{streakStats.totalBlocksCount}</span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-fog)' }}>completed</span>
            </div>
          </div>
        </div>

        {/* Skyline Heatmap Visualization */}
        <ContributionSkyline
          data={streakStats.activityDays}
          defaultView="2d"
          palette="kairo"
          showStats={false}
          showLegend={true}
          showToggle={true}
          unit="study block"
          unitPlural="study blocks"
          heightScale={1.1}
          duration={650}
        />
      </div>

      {/* Study Blocks & Daily Reflection */}
      <div className="linear-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Study Blocks & Daily Reflection</h2>
              <div className="card-subtext" style={{ marginTop: '2px', fontSize: '13px' }}>
                Day {currentPosition.dayInBlock} · 6-hour structured learning architecture across 5 focus blocks
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <div className="font-mono tab-num" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)' }}>
                {completedBlocksCount}/{totalBlocksCount} blocks completed
              </div>
              <div className="font-mono tab-num" style={{ fontSize: '11px', color: 'var(--color-fog)' }}>
                {completedPlannedHours} {completedPlannedHours === '1' ? 'hour' : 'hours'} completed out of 6.0 planned
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="linear-progress-bar" style={{ height: '7px', borderRadius: '4px', background: 'var(--color-charcoal)', overflow: 'hidden' }}>
            <div
              className="linear-progress-bar-fill"
              style={{
                width: `${blocksPercent}%`,
                background: 'var(--color-pulse-green)',
                height: '100%',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* 5 Study Blocks List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {STUDY_BLOCKS.map(block => {
            const isChecked = Boolean(checkedBlocks[block.id]);
            return (
              <div
                key={block.id}
                onClick={() => toggleStudyBlock(dayKey, block.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  background: isChecked ? 'rgba(34, 197, 94, 0.05)' : 'var(--color-carbon)',
                  border: `1px solid ${isChecked ? 'rgba(34, 197, 94, 0.25)' : 'var(--color-graphite)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div onClick={e => e.stopPropagation()}>
                    <Checkbox
                      checked={isChecked}
                      onChange={() => toggleStudyBlock(dayKey, block.id)}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: isChecked ? 'var(--color-mist)' : 'var(--color-paper)',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        transition: 'color 0.15s ease'
                      }}
                    >
                      {block.id + 1}. {block.name}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span
                    className="font-mono tab-num"
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: isChecked ? 'rgba(34, 197, 94, 0.12)' : 'var(--color-charcoal)',
                      color: isChecked ? 'var(--color-pulse-green)' : 'var(--color-fog)',
                      border: `1px solid ${isChecked ? 'rgba(34, 197, 94, 0.25)' : 'var(--color-graphite)'}`
                    }}
                  >
                    {block.minutes} mins
                  </span>
                  {isChecked && (
                    <CheckCircle2 size={14} style={{ color: 'var(--color-pulse-green)' }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fields: Hours Studied & Daily Reflections */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            paddingTop: '8px',
            borderTop: '1px solid var(--color-graphite)'
          }}
        >
          {/* Hours Studied Today */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="hours-studied-input"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)' }}
            >
              Hours Studied Today
            </label>
            <div style={{ fontSize: '11px', color: 'var(--color-fog)' }}>
              Record actual time invested (Target: 6.0 hours / day)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <input
                id="hours-studied-input"
                type="number"
                step="0.1"
                min="0"
                max="24"
                value={studyBlockData.hoursStudied ?? ''}
                onChange={handleHoursChange}
                placeholder="e.g. 5.5"
                style={{
                  width: '110px',
                  padding: '8px 12px',
                  background: 'var(--color-carbon)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: '6px',
                  color: 'var(--color-paper)',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
              <span className="font-mono tab-num" style={{ fontSize: '12px', color: 'var(--color-fog)' }}>
                / 6.0 hrs daily target
              </span>
            </div>
          </div>

          {/* Daily Notes & Reflections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="daily-notes-textarea"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)' }}
            >
              Daily Notes & Reflections
            </label>
            <div style={{ fontSize: '11px', color: 'var(--color-fog)' }}>
              Record learning progress, breakthroughs, or blockers encountered
            </div>
            <textarea
              id="daily-notes-textarea"
              rows={3}
              value={studyBlockData.notes || ''}
              onChange={handleNotesChange}
              placeholder="What worked well, key breakthroughs or roadblocks today?"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--color-carbon)',
                border: '1px solid var(--color-graphite)',
                borderRadius: '6px',
                color: 'var(--color-paper)',
                fontSize: '13px',
                lineHeight: 1.5,
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                marginTop: '4px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
