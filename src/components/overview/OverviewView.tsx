import React, { useMemo } from 'react';
import { FileCode, Server, Sparkles, Network, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
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
import { Checkbox } from '../common/Checkbox';



/* ─────────────────────────────────────────────────────────
   Small stat display inside the streak row
───────────────────────────────────────────────────────── */
const StreamStat: React.FC<{
  label: string;
  value: number;
  unit: string;
  accent?: boolean;
}> = ({ label, value, unit, accent }) => (
  <div style={{ minWidth: 0 }}>
    <div
      className="card-label"
      style={{ fontSize: '10.5px', letterSpacing: '0.05em' }}
    >
      {label}
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '4px',
        marginTop: '3px',
      }}
    >
      <span
        className="font-mono tab-num"
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: accent ? 'var(--color-brand)' : 'var(--color-paper)',
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: '11px', color: 'var(--color-fog)' }}>
        {unit}
      </span>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   Main Overview component
───────────────────────────────────────────────────────── */
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
    if (val === '') { setStudyHours(dayKey, ''); return; }
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 24) setStudyHours(dayKey, val);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStudyNotes(dayKey, e.target.value);
  };

  const handleContinueLearning = () => {
    setSelectedBlockAndDay(currentPosition.blockIndex, currentPosition.dayInBlock);
    setActivePage('daily');
  };

  // ── Track data ──────────────────────────────────────────
  const jsCompleted = Object.values(state.jsRoadmap || {}).filter(l => l?.completed).length;
  const jsTotal = JS_CURRICULUM.length;
  const jsPercent = Math.round((jsCompleted / jsTotal) * 100);
  const nextJSLesson = JS_CURRICULUM.find(l => !state.jsRoadmap?.[l.id]?.completed) || JS_CURRICULUM[0];
  const jsNextText = `#${nextJSLesson.number} — ${nextJSLesson.title}`;

  const springFrameworkCompleted = Object.values(state.springFrameworkRoadmap || {}).filter(l => l?.completed).length;
  const springFrameworkPercent = Math.round((springFrameworkCompleted / TOTAL_ACADEMY_LESSONS) * 100);
  const customVideosMap = state.springFrameworkCustomVideos || {};

  let nextSpringVideo: { title: string; moduleTitle: string } | null = null;
  for (const m of SPRING_FRAMEWORK_MODULES) {
    const vList = customVideosMap[m.id] || m.defaultVideos;
    const found = vList.find(v => !state.springFrameworkRoadmap?.[v.id]?.completed);
    if (found) { nextSpringVideo = { title: found.title, moduleTitle: m.title }; break; }
  }
  if (!nextSpringVideo) nextSpringVideo = { title: 'All videos completed!', moduleTitle: 'Course Complete' };
  const springNextText = `${nextSpringVideo.title} — ${nextSpringVideo.moduleTitle}`;

  const networkCompleted = Object.values(state.networkRoadmap || {}).filter(t => t?.completed).length;
  const networkPercent = Math.round((networkCompleted / TOTAL_NETWORK_TOPICS) * 100);
  const nextNetworkTopic = NETWORK_TOPICS.find(t => !state.networkRoadmap?.[t.id]?.completed) || NETWORK_TOPICS[0];
  const networkNextText = `L${nextNetworkTopic.levelNumber} · ${nextNetworkTopic.title}`;

  const aiCompleted = Object.values(state.aiRoadmap || {}).filter(t => t?.completed).length;
  const aiPercent = Math.round((aiCompleted / TOTAL_AI_TOPICS) * 100);
  const nextAITopic = AI_CURRICULUM.find(t => !state.aiRoadmap?.[t.id]?.completed) || AI_CURRICULUM[0];
  const aiNextText = `${nextAITopic.phase} · ${nextAITopic.title}`;

  // ── Track card definitions ───────────────────────────────
  const tracks = [
    {
      key: 'js',
      cardLabel: 'JAVASCRIPT CURRICULUM',
      icon: <FileCode size={19} />,
      accentColor: 'var(--color-acid-lime)',
      iconBg: 'rgba(228, 242, 34, 0.12)',
      iconBorder: 'rgba(228, 242, 34, 0.35)',
      iconColor: 'var(--color-accent-text)',
      nextText: jsNextText,
      progressLine: `${jsCompleted} of ${jsTotal} lessons (${jsPercent}%)`,
      percent: jsPercent,
      barColor: 'var(--color-acid-lime)',
      btnLabel: 'JS Track',
      onClick: () => setActivePage('js-roadmap'),
    },
    {
      key: 'spring',
      cardLabel: 'SPRING FRAMEWORK TRACK',
      icon: <Server size={19} />,
      accentColor: 'var(--color-pulse-green)',
      iconBg: 'rgba(39, 166, 68, 0.08)',
      iconBorder: 'rgba(39, 166, 68, 0.25)',
      iconColor: 'var(--color-pulse-green)',
      nextText: springNextText,
      progressLine: `${springFrameworkCompleted} of ${TOTAL_ACADEMY_LESSONS} videos (${springFrameworkPercent}%) · 8 modules`,
      percent: springFrameworkPercent,
      barColor: 'var(--color-pulse-green)',
      btnLabel: 'Spring Track',
      onClick: () => setActivePage('spring-framework'),
    },
    {
      key: 'network',
      cardLabel: 'NETWORK FUNDAMENTALS',
      icon: <Network size={19} />,
      accentColor: '#38bdf8',
      iconBg: 'rgba(56, 189, 248, 0.08)',
      iconBorder: 'rgba(56, 189, 248, 0.25)',
      iconColor: '#38bdf8',
      nextText: networkNextText,
      progressLine: `${networkCompleted} of ${TOTAL_NETWORK_TOPICS} topics (${networkPercent}%) · 5 levels`,
      percent: networkPercent,
      barColor: '#38bdf8',
      btnLabel: 'Network Track',
      onClick: () => setActivePage('network-roadmap'),
    },
    {
      key: 'ai',
      cardLabel: 'AI ENGINEERING TRACK',
      icon: <Sparkles size={19} />,
      accentColor: '#c084fc',
      iconBg: 'rgba(192, 132, 252, 0.08)',
      iconBorder: 'rgba(192, 132, 252, 0.25)',
      iconColor: '#c084fc',
      nextText: aiNextText,
      progressLine: `${aiCompleted} of ${TOTAL_AI_TOPICS} topics (${aiPercent}%) · 9 phases`,
      percent: aiPercent,
      barColor: '#c084fc',
      btnLabel: 'AI Track',
      onClick: () => setActivePage('ai-roadmap'),
    },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Page Header ──────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div
            className="font-mono tab-num"
            style={{ fontSize: '11px', letterSpacing: '0.05em', color: 'var(--color-fog)', textTransform: 'uppercase' }}
          >
            Phase {currentPosition.phaseIndex + 1} · {formatWeekLabel(currentBlock)}
          </div>
          <h1 style={{ marginTop: '4px', marginBottom: 0 }}>{currentBlock.title}</h1>
          <p className="card-subtext" style={{ marginTop: '3px', fontSize: '13.5px' }}>
            {currentPhase.title} · Day {currentPosition.dayInBlock} of {currentBlock.weekSpan * 7}
            {currentPosition.isRestDay && ' · Rest / Light Revision Day'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleContinueLearning} style={{ gap: '6px' }}>
          Continue Learning <ArrowRight size={14} />
        </button>
      </div>

      {/* ── Learning Track Cards ─────────────────────────────── */}
      <section>
        {/* 2-column grid on desktop, 1-column on mobile */}
        <div
          className="kairo-track-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
          }}
        >
          {tracks.map(track => (
            <div
              key={track.key}
              className="linear-card"
              style={{
                background: 'var(--color-obsidian)',
                borderLeft: `2px solid ${track.accentColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                padding: '16px 18px',
              }}
            >
              {/* Left: icon + text */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                {/* Icon badge */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: track.iconBg,
                    border: `1px solid ${track.iconBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: track.iconColor,
                    flexShrink: 0,
                  }}
                >
                  {track.icon}
                </div>

                {/* Text: label / next / progress */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    className="card-label"
                    style={{ fontSize: '10px', letterSpacing: '0.06em' }}
                  >
                    {track.cardLabel}
                  </div>

                  {/* Next: — truncated to one line */}
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--color-paper)',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Next: {track.nextText}
                  </div>

                  {/* Progress line */}
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-mist)',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {track.progressLine}
                  </div>
                </div>
              </div>

              {/* Right: action button */}
              <button
                className="btn btn-primary"
                onClick={track.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  height: '32px',
                  padding: '0 14px',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {track.btnLabel} <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>

      </section>

      {/* ── Learning Streak & Contribution Heatmap ───────────── */}
      <section className="linear-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Section heading + today status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Learning Streak</h2>
              {streakStats.currentStreak > 0 && (
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Flame size={12} style={{ color: 'var(--color-brand)' }} />
                  {streakStats.currentStreak}-day streak
                </span>
              )}
            </div>
            <div className="card-subtext" style={{ marginTop: '2px', fontSize: '12.5px' }}>
              Complete 4 of 5 daily blocks to qualify. Range: {streakStats.dateRangeStr}
            </div>
          </div>

          {/* Today's count badge */}
          <div
            className="font-mono tab-num"
            style={{
              fontSize: '12px',
              color: streakStats.todayQualifies ? 'var(--color-brand-text)' : 'var(--color-fog)',
              background: streakStats.todayQualifies ? 'var(--color-brand-subtle)' : 'var(--color-charcoal)',
              border: `1px solid ${streakStats.todayQualifies ? 'var(--color-brand-border)' : 'var(--color-graphite)'}`,
              padding: '4px 10px',
              borderRadius: '6px',
              alignSelf: 'flex-start',
            }}
          >
            Today: {streakStats.todayCount}/5
            {streakStats.todayQualifies ? ' · Qualified ✓' : ' blocks'}
          </div>
        </div>

        {/* 4 streak stats — horizontal row, no nested cards */}
        <div
          className="kairo-streak-stats"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
            paddingTop: '14px',
            borderTop: '1px solid var(--color-graphite)',
          }}
        >
          {[
            { label: 'Current Streak', value: streakStats.currentStreak, unit: streakStats.currentStreak === 1 ? 'day' : 'days', accent: true },
            { label: 'Longest Streak', value: streakStats.longestStreak, unit: streakStats.longestStreak === 1 ? 'day' : 'days' },
            { label: 'Qualifying Days', value: streakStats.qualifyingDaysCount, unit: streakStats.qualifyingDaysCount === 1 ? 'day' : 'days' },
            { label: 'Blocks Completed', value: streakStats.totalBlocksCount, unit: 'total' },
          ].map((stat, i, arr) => (
            <div
              key={stat.label}
              style={{
                padding: '0 16px',
                borderRight: i < arr.length - 1 ? '1px solid var(--color-graphite)' : 'none',
              }}
            >
              <StreamStat {...stat} />
            </div>
          ))}
        </div>

        {/* Contribution Heatmap — unchanged */}
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
      </section>

      {/* ── Study Blocks & Daily Reflection ──────────────────── */}
      <section className="linear-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Study Blocks & Daily Reflection</h2>
            <div className="card-subtext" style={{ marginTop: '2px', fontSize: '12.5px' }}>
              Day {currentPosition.dayInBlock} · 5 blocks · 6 hours planned
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="font-mono tab-num" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)' }}>
              {completedBlocksCount}/{totalBlocksCount} blocks
            </div>
            <div className="font-mono tab-num" style={{ fontSize: '11px', color: 'var(--color-fog)', marginTop: '1px' }}>
              {completedPlannedHours}h of 6.0h planned
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '4px', background: 'var(--color-graphite)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${blocksPercent}%`,
              background: 'var(--color-brand)',
              borderRadius: '9999px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* 5 Study Block rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {STUDY_BLOCKS.map(block => {
            const isChecked = Boolean(checkedBlocks[block.id]);
            return (
              <div
                key={block.id}
                onClick={() => toggleStudyBlock(dayKey, block.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 13px',
                  borderRadius: '6px',
                  background: isChecked ? 'rgba(228, 242, 34, 0.04)' : 'transparent',
                  border: `1px solid ${isChecked ? 'rgba(228, 242, 34, 0.2)' : 'var(--color-graphite)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div onClick={e => e.stopPropagation()}>
                  <Checkbox
                    checked={isChecked}
                    onChange={() => toggleStudyBlock(dayKey, block.id)}
                  />
                </div>
                <span
                  style={{
                    flex: 1,
                    fontSize: '13px',
                    fontWeight: 500,
                    color: isChecked ? 'var(--color-ash)' : 'var(--color-paper)',
                    textDecoration: isChecked ? 'line-through' : 'none',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {block.id + 1}. {block.name}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
                  <span
                    className="font-mono tab-num"
                    style={{
                      fontSize: '11px',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      background: 'var(--color-charcoal)',
                      color: isChecked ? 'var(--color-fog)' : 'var(--color-fog)',
                      border: '1px solid var(--color-graphite)',
                    }}
                  >
                    {block.minutes}m
                  </span>
                  {isChecked && (
                    <CheckCircle2
                      size={14}
                      style={{ color: 'var(--color-brand)', opacity: 0.8 }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hours & Notes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--color-graphite)',
          }}
        >
          {/* Hours Studied */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label
              htmlFor="hours-studied-input"
              style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-paper)' }}
            >
              Hours Studied Today
            </label>
            <div style={{ fontSize: '11px', color: 'var(--color-fog)' }}>
              Target: 6.0 hrs / day
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
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
                  width: '100px',
                  padding: '7px 11px',
                  background: 'var(--color-carbon)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: '6px',
                  color: 'var(--color-paper)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                }}
              />
              <span className="font-mono tab-num" style={{ fontSize: '11.5px', color: 'var(--color-fog)' }}>
                / 6.0 hrs
              </span>
            </div>
          </div>

          {/* Daily Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label
              htmlFor="daily-notes-textarea"
              style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-paper)' }}
            >
              Daily Notes & Reflections
            </label>
            <div style={{ fontSize: '11px', color: 'var(--color-fog)' }}>
              Breakthroughs, blockers, or key learnings
            </div>
            <textarea
              id="daily-notes-textarea"
              rows={3}
              value={studyBlockData.notes || ''}
              onChange={handleNotesChange}
              placeholder="What worked well, key breakthroughs or roadblocks today?"
              style={{
                width: '100%',
                padding: '9px 11px',
                background: 'var(--color-carbon)',
                border: '1px solid var(--color-graphite)',
                borderRadius: '6px',
                color: 'var(--color-paper)',
                fontSize: '13px',
                lineHeight: 1.5,
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                marginTop: '2px',
              }}
            />
          </div>
        </div>
      </section>

    </div>
  );
};
