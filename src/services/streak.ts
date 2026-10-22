import { KairoStateV2, StudyBlockEntry } from '../types';
import { ROADMAP_BLOCKS } from '../data/curriculum';
import { getTodayDateString } from './storage';

export const MIN_QUALIFYING_BLOCKS = 4;
export const TOTAL_STUDY_BLOCKS = 5;

/**
 * Format a local Date object into 'YYYY-MM-DD' without timezone drift.
 */
export const formatLocalDate = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse a 'YYYY-MM-DD' string into a local Date object (00:00:00 local time).
 */
export const parseLocalDate = (dateStr: string): Date => {
  const parts = dateStr.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    const fallback = new Date();
    fallback.setHours(0, 0, 0, 0);
    return fallback;
  }
  return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
};

/**
 * Add or subtract calendar days from a 'YYYY-MM-DD' string in local time.
 */
export const addDaysToDateStr = (dateStr: string, days: number): string => {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatLocalDate(d);
};

/**
 * Map a studyBlock dayKey (e.g. '0:1' or '2026-10-22') to a calendar date string 'YYYY-MM-DD'.
 */
export const getDateForStudyBlockKey = (dayKey: string, startDateStr: string): string => {
  // If already a YYYY-MM-DD string
  if (/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
    return dayKey;
  }

  // If in format `${blockIndex}:${dayInBlock}`
  const colonIdx = dayKey.indexOf(':');
  if (colonIdx !== -1) {
    const bIdx = parseInt(dayKey.slice(0, colonIdx), 10);
    const dayInBlock = parseInt(dayKey.slice(colonIdx + 1), 10);

    if (!isNaN(bIdx) && !isNaN(dayInBlock) && ROADMAP_BLOCKS[bIdx]) {
      const block = ROADMAP_BLOCKS[bIdx];
      // Day offset in curriculum relative to week 1, day 1
      const dayOffset = (block.startWeek - 1) * 7 + (dayInBlock - 1);
      return addDaysToDateStr(startDateStr, dayOffset);
    }
  }

  // Fallback to today's date
  return getTodayDateString();
};

/**
 * Check if the number of completed study blocks satisfies the 4-of-5 streak rule.
 */
export const isDaySuccessful = (checkedBlocks: boolean[]): boolean => {
  const completed = (checkedBlocks || []).filter(Boolean).length;
  return completed >= MIN_QUALIFYING_BLOCKS;
};

export interface DayActivityInfo {
  date: string;
  count: number; // 0 to 5 completed blocks
  qualifies: boolean; // count >= 4
  hoursStudied: number | string;
  notes: string;
  dayKey: string;
}

export interface StreakStatsResult {
  currentStreak: number;
  longestStreak: number;
  qualifyingDaysCount: number; // in displayed 1-year period
  totalBlocksCount: number; // in displayed 1-year period
  todayCount: number;
  todayQualifies: boolean;
  dateRangeStr: string;
  startDateStr: string;
  endDateStr: string;
  activityDays: { date: string; count: number }[];
  dateActivityMap: Map<string, DayActivityInfo>;
}

/**
 * Build a unified map of local calendar date -> DayActivityInfo from saved studyBlocks.
 */
export const getStudyActivityMap = (state: KairoStateV2): Map<string, DayActivityInfo> => {
  const map = new Map<string, DayActivityInfo>();
  const studyBlocks = state.studyBlocks || {};

  for (const [dayKey, entry] of Object.entries(studyBlocks)) {
    if (!entry) continue;
    const date = entry.date || getDateForStudyBlockKey(dayKey, state.settings.startDate);
    const checked = Array.isArray(entry.checkedBlocks) ? entry.checkedBlocks : [];
    const count = Math.min(TOTAL_STUDY_BLOCKS, checked.filter(Boolean).length);
    const qualifies = count >= MIN_QUALIFYING_BLOCKS;

    const existing = map.get(date);
    if (!existing || count >= existing.count) {
      map.set(date, {
        date,
        count,
        qualifies,
        hoursStudied: entry.hoursStudied ?? '',
        notes: entry.notes ?? '',
        dayKey
      });
    }
  }

  return map;
};

/**
 * Calculate streaks and activity feed for the Contribution Skyline and Overview page.
 */
export const calculateStreakStats = (
  state: KairoStateV2,
  overrideEndDateStr?: string
): StreakStatsResult => {
  const todayStr = getTodayDateString();
  const endDateStr = overrideEndDateStr || todayStr;
  const activityMap = getStudyActivityMap(state);

  // 1. Grid of 371 days (53 weeks * 7 days) ending on endDateStr
  // to ensure a full GitHub-style year grid
  const TOTAL_GRID_DAYS = 371;
  const activityDays: { date: string; count: number }[] = [];
  const startGridDateStr = addDaysToDateStr(endDateStr, -(TOTAL_GRID_DAYS - 1));

  let qualifyingDaysCount = 0;
  let totalBlocksCount = 0;

  for (let i = 0; i < TOTAL_GRID_DAYS; i++) {
    const curDateStr = addDaysToDateStr(startGridDateStr, i);
    const info = activityMap.get(curDateStr);
    const count = info ? info.count : 0;

    activityDays.push({ date: curDateStr, count });

    if (count >= MIN_QUALIFYING_BLOCKS) {
      qualifyingDaysCount++;
    }
    totalBlocksCount += count;
  }

  // 2. Current Streak calculation with today-in-progress handling:
  // - If today has >= 4 blocks: today qualifies, streak counts back from today.
  // - If today has < 4 blocks: today is in progress. Do not break an active streak
  //   achieved through yesterday. If yesterday qualified, current streak is the streak
  //   ending yesterday. If yesterday was missed (< 4 blocks), current streak is 0.
  const todayInfo = activityMap.get(todayStr);
  const todayCount = todayInfo ? todayInfo.count : 0;
  const todayQualifies = todayCount >= MIN_QUALIFYING_BLOCKS;

  let currentStreak = 0;

  if (todayQualifies) {
    // Today qualifies! Count backwards starting from today
    let checkDateStr = todayStr;
    while (true) {
      const info = activityMap.get(checkDateStr);
      if (info && info.count >= MIN_QUALIFYING_BLOCKS) {
        currentStreak++;
        checkDateStr = addDaysToDateStr(checkDateStr, -1);
      } else {
        break;
      }
    }
  } else {
    // Today is in progress (< 4 blocks).
    // Check if yesterday was a qualifying day
    const yesterdayStr = addDaysToDateStr(todayStr, -1);
    const yesterdayInfo = activityMap.get(yesterdayStr);

    if (yesterdayInfo && yesterdayInfo.count >= MIN_QUALIFYING_BLOCKS) {
      // Streak through yesterday is still active!
      let checkDateStr = yesterdayStr;
      while (true) {
        const info = activityMap.get(checkDateStr);
        if (info && info.count >= MIN_QUALIFYING_BLOCKS) {
          currentStreak++;
          checkDateStr = addDaysToDateStr(checkDateStr, -1);
        } else {
          break;
        }
      }
    } else {
      // Yesterday was missed and is definitively over
      currentStreak = 0;
    }
  }

  // 3. Longest Streak calculation across the user's entire saved history
  // Gather all unique dates with >= 4 blocks and sort chronologically
  const allQualifyingDates = Array.from(activityMap.entries())
    .filter(([_, info]) => info.count >= MIN_QUALIFYING_BLOCKS)
    .map(([date]) => date)
    .sort();

  let longestStreak = 0;
  let currentRun = 0;
  let previousDateStr: string | null = null;

  for (const dateStr of allQualifyingDates) {
    if (previousDateStr === null) {
      currentRun = 1;
    } else {
      const expectedNext = addDaysToDateStr(previousDateStr, 1);
      if (dateStr === expectedNext) {
        currentRun++;
      } else {
        currentRun = 1;
      }
    }
    if (currentRun > longestStreak) {
      longestStreak = currentRun;
    }
    previousDateStr = dateStr;
  }

  // Ensure longest streak is at least as large as current streak
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  // Format date range string for display
  const startFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .format(parseLocalDate(startGridDateStr));
  const endFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .format(parseLocalDate(endDateStr));
  const dateRangeStr = `${startFmt} – ${endFmt}`;

  return {
    currentStreak,
    longestStreak,
    qualifyingDaysCount,
    totalBlocksCount,
    todayCount,
    todayQualifies,
    dateRangeStr,
    startDateStr: startGridDateStr,
    endDateStr,
    activityDays,
    dateActivityMap: activityMap
  };
};
