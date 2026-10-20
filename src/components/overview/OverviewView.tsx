import React from 'react';
import { ArrowRight, CheckCircle2, Calendar, Target, Award, Code2, FileCode, Play, Server, Sparkles, Network } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  calculateRoadmapProgress,
  calculatePhaseProgress,
  calculateBlockProgress,
  getNextMilestone,
  calculate7DayVelocity
} from '../../services/progress';
import { ROADMAP_BLOCKS, PHASES, formatWeekLabel } from '../../data/curriculum';
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

  const overall = calculateRoadmapProgress(state);
  const phaseProg = calculatePhaseProgress(state, currentPosition.phaseIndex);
  const nextMilestone = getNextMilestone(state);
  const velocity = calculate7DayVelocity(state);

  // Active project
  const activeProj = state.projects.find(p => p.status === 'in_progress') || state.projects.find(p => p.status !== 'done') || state.projects[0];

  // Self-test for current block
  const currentReview = state.weeklyReviews[currentPosition.blockIndex];
  const selfTestStatus = currentReview?.selfTestResult === 'passed' ? 'Passed' : currentReview?.selfTestResult === 'needs_revision' ? 'Needs Revision' : 'Not taken';

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

      {/* Metrics Row (6 Compact Precision Cards) */}
      <div className="metrics-grid">
        {/* 1. Overall Roadmap */}
        <div className="linear-card">
          <div className="card-label">Overall roadmap</div>
          <div className="card-big-value">{overall.percent}%</div>
          <div className="linear-progress-bar">
            <div className="linear-progress-bar-fill" style={{ width: `${overall.percent}%` }} />
          </div>
          <div className="font-mono tab-num" style={{ fontSize: '11px', color: 'var(--color-fog)', marginTop: '8px' }}>
            {overall.completed} completed · {overall.total - overall.completed} remaining
          </div>
        </div>

        {/* 2. Current Phase */}
        <div className="linear-card">
          <div className="card-label">Current phase</div>
          <div className="card-big-value">{phaseProg.percent}%</div>
          <div className="linear-progress-bar">
            <div className="linear-progress-bar-fill" style={{ width: `${phaseProg.percent}%` }} />
          </div>
          <div className="font-mono tab-num" style={{ fontSize: '11px', color: 'var(--color-fog)', marginTop: '8px' }}>
            {phaseProg.completed}/{phaseProg.total} phase tasks
          </div>
        </div>

        {/* 3. Next Milestone */}
        <div className="linear-card">
          <div className="card-label">Next milestone</div>
          <div style={{ color: 'var(--color-paper)', fontSize: '13px', fontWeight: 510, marginTop: '6px', lineHeight: 1.4 }}>
            {nextMilestone ? nextMilestone.title : 'All deliverables completed!'}
          </div>
          {nextMilestone && (
            <div className="font-mono" style={{ fontSize: '11px', color: 'var(--color-fog)', marginTop: '4px' }}>
              {nextMilestone.weekSpan}
            </div>
          )}
        </div>

        {/* 4. Active Project */}
        <div className="linear-card">
          <div className="card-label">Current project</div>
          <div style={{ color: 'var(--color-paper)', fontSize: '13px', fontWeight: 510, marginTop: '6px' }}>
            {activeProj ? activeProj.title : 'No active project'}
          </div>
          <div className="font-mono" style={{ fontSize: '11px', color: 'var(--color-fog)', marginTop: '4px' }}>
            {activeProj?.status === 'done' ? 'Completed' : activeProj?.status === 'in_progress' ? 'In progress' : 'Not started'}
          </div>
        </div>

        {/* 5. Weekly Self-Test */}
        <div className="linear-card">
          <div className="card-label">Weekly self-test</div>
          <div style={{ color: 'var(--color-paper)', fontSize: '13px', fontWeight: 510, marginTop: '6px' }}>
            {currentBlock.selfTest ? selfTestStatus : 'No self-test this block'}
          </div>
          <div className="font-mono tab-num" style={{ fontSize: '11px', color: 'var(--color-fog)', marginTop: '4px' }}>
            Block progress: {calculateBlockProgress(state, currentPosition.blockIndex).percent}%
          </div>
        </div>

        {/* 6. Last 7 Days Activity */}
        <div className="linear-card">
          <div className="card-label">7-day task velocity</div>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end', height: '44px', marginTop: '8px' }}>
            {velocity.counts.map((cnt, i) => (
              <div
                key={i}
                title={`${velocity.days[i]}: ${cnt} tasks completed`}
                style={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    background: cnt > 0 ? 'var(--color-pulse-green)' : 'var(--color-smoke)',
                    borderRadius: '2px',
                    height: `${Math.max(6, (cnt / velocity.max) * 100)}%`,
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            ))}
          </div>
          <div className="font-mono tab-num" style={{ fontSize: '11px', color: 'var(--color-fog)', marginTop: '6px' }}>
            {velocity.totalThisWeek} tasks finished this week
          </div>
        </div>
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
