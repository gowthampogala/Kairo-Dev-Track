import { KairoStateV2, Task, Project } from '../types';
import { ROADMAP_BLOCKS, PHASES, RAW_BLOCKS } from '../data/curriculum';
import { getTodayDateString } from './storage';

export interface CurrentPosition {
  week: number;
  blockIndex: number;
  dayInBlock: number;
  phaseIndex: number;
  isRestDay: boolean;
}

export const calculateCurrentPosition = (startDateStr: string): CurrentPosition => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startParts = startDateStr.split('-').map(Number);
    const start = new Date(startParts[0], startParts[1] - 1, startParts[2]);
    start.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - start.getTime();
    const dayNumber = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    // Total 20 weeks = 140 days
    const week = Math.min(20, Math.max(1, Math.floor(dayNumber / 7) + 1));

    // Find block matching current week
    let bIdx = ROADMAP_BLOCKS.findIndex(b => week >= b.startWeek && week < b.startWeek + b.weekSpan);
    if (bIdx === -1) {
      bIdx = ROADMAP_BLOCKS.length - 1; // Fallback to final block
    }

    const currentBlock = ROADMAP_BLOCKS[bIdx];
    const daysSinceBlockStart = dayNumber - (currentBlock.startWeek - 1) * 7;
    const dayInBlock = Math.min(7 * currentBlock.weekSpan, Math.max(1, daysSinceBlockStart + 1));
    const isRestDay = dayInBlock % 7 === 0;

    return {
      week,
      blockIndex: bIdx,
      dayInBlock,
      phaseIndex: currentBlock.phaseIndex,
      isRestDay
    };
  } catch {
    return {
      week: 1,
      blockIndex: 0,
      dayInBlock: 1,
      phaseIndex: 0,
      isRestDay: false
    };
  }
};

export const calculateRoadmapProgress = (state: KairoStateV2) => {
  const allTasks = Object.values(state.roadmapTasks);
  const total = allTasks.length;
  const completed = allTasks.filter(t => t.status === 'done').length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percent };
};

export const calculatePhaseProgress = (state: KairoStateV2, phaseIndex: number) => {
  const phaseTasks = Object.values(state.roadmapTasks).filter(t => t.roadmapPhaseId === phaseIndex);
  const total = phaseTasks.length;
  const completed = phaseTasks.filter(t => t.status === 'done').length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percent };
};

export const calculateBlockProgress = (state: KairoStateV2, blockIndex: number) => {
  const blockTasks = Object.values(state.roadmapTasks).filter(t => t.roadmapBlockId === blockIndex);
  const total = blockTasks.length;
  const completed = blockTasks.filter(t => t.status === 'done').length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percent };
};

export const calculateProjectProgress = (project: Project) => {
  const total = project.tasks.length;
  const completed = project.tasks.filter(t => t.status === 'done').length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percent };
};

export const getNextMilestone = (state: KairoStateV2) => {
  // Find the earliest unfinished deliverable
  const deliverables = Object.values(state.roadmapTasks)
    .filter(t => t.isDeliverable && t.status !== 'done')
    .sort((a, b) => (a.roadmapBlockId || 0) - (b.roadmapBlockId || 0));

  if (deliverables.length > 0) {
    const next = deliverables[0];
    const block = ROADMAP_BLOCKS[next.roadmapBlockId || 0];
    return {
      title: next.title.replace(/^Deliverable:\s*/i, ''),
      blockTitle: block ? block.title : '',
      weekSpan: block ? (block.weekSpan > 1 ? `Weeks ${block.startWeek}–${block.startWeek + block.weekSpan - 1}` : `Week ${block.startWeek}`) : ''
    };
  }

  return null;
};

export const calculate7DayVelocity = (state: KairoStateV2) => {
  const days: string[] = [];
  const counts: number[] = [];
  const now = new Date();

  // Last 7 calendar days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = getTodayDateString(d);
    days.push(dateStr);

    let count = 0;
    // Roadmap tasks completed on date
    Object.values(state.roadmapTasks).forEach(t => {
      if (t.status === 'done' && t.completedAt === dateStr) {
        count++;
      }
    });

    // Project tasks completed on date
    state.projects.forEach(p => {
      p.tasks.forEach(t => {
        if (t.status === 'done' && t.completedAt === dateStr) {
          count++;
        }
      });
    });

    counts.push(count);
  }

  const max = Math.max(1, ...counts);
  const totalThisWeek = counts.reduce((a, b) => a + b, 0);

  return { days, counts, max, totalThisWeek };
};
