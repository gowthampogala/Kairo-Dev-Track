import {
  calculateStreakStats,
  getDateForStudyBlockKey,
  isDaySuccessful,
  getStudyActivityMap,
  addDaysToDateStr,
  parseLocalDate,
  formatLocalDate,
  MIN_QUALIFYING_BLOCKS
} from '../src/services/streak';
import { levelOf } from '../src/components/ui/contribution-skyline';
import { createDefaultState } from '../src/services/storage';

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failCount++;
  }
}

console.log('=== TEST SUITE: KAIRO DEV TRACK LEARNING STREAK & CONTRIBUTION SKYLINE ===\n');

// 1. 4-of-5 Rule Qualification tests
console.log('1. Testing 4-of-5 Qualification Rule:');
assert(isDaySuccessful([true, true, true, true, true]) === true, '5 blocks completed -> Qualifies');
assert(isDaySuccessful([true, true, true, true, false]) === true, '4 blocks completed -> Qualifies');
assert(isDaySuccessful([true, true, true, false, false]) === false, '3 blocks completed -> Does NOT qualify');
assert(isDaySuccessful([true, true, false, false, false]) === false, '2 blocks completed -> Does NOT qualify');
assert(isDaySuccessful([true, false, false, false, false]) === false, '1 block completed -> Does NOT qualify');
assert(isDaySuccessful([false, false, false, false, false]) === false, '0 blocks completed -> Does NOT qualify');

// 2. Heatmap Contribution Intensity (Levels 0..5)
console.log('\n2. Testing Heatmap Intensity Levels:');
assert(levelOf(0) === 0, '0 blocks -> Level 0 (floor slab)');
assert(levelOf(1) === 1, '1 block -> Level 1');
assert(levelOf(2) === 2, '2 blocks -> Level 2');
assert(levelOf(3) === 3, '3 blocks -> Level 3 (Active, but does NOT qualify)');
assert(levelOf(4) === 4, '4 blocks -> Level 4 (Streak qualifying level)');
assert(levelOf(5) === 5, '5 blocks -> Level 5 (Maximum acid-lime intensity)');

// 3. Local date formatting and no timezone drift
console.log('\n3. Testing Local Calendar Date Parsing & Arithmetic:');
const d = parseLocalDate('2026-10-22');
assert(formatLocalDate(d) === '2026-10-22', 'Date roundtrip matches 2026-10-22');
assert(addDaysToDateStr('2026-10-22', 1) === '2026-10-23', 'Add 1 day gives 2026-10-23');
assert(addDaysToDateStr('2026-10-22', -1) === '2026-10-21', 'Subtract 1 day gives 2026-10-21');
assert(addDaysToDateStr('2026-10-31', 1) === '2026-11-01', 'Month rollover works cleanly');
assert(addDaysToDateStr('2026-12-31', 1) === '2027-01-01', 'Year rollover works cleanly');

// 4. Empty State
console.log('\n4. Testing Empty State (New User):');
const emptyState = createDefaultState();
const emptyStats = calculateStreakStats(emptyState);
assert(emptyStats.currentStreak === 0, 'Empty state has currentStreak === 0');
assert(emptyStats.longestStreak === 0, 'Empty state has longestStreak === 0');
assert(emptyStats.qualifyingDaysCount === 0, 'Empty state has qualifyingDaysCount === 0');
assert(emptyStats.totalBlocksCount === 0, 'Empty state has totalBlocksCount === 0');
assert(emptyStats.todayCount === 0, 'Empty state has todayCount === 0');
assert(emptyStats.todayQualifies === false, 'Empty state has todayQualifies === false');

// 5. In-progress Current Day Streak Handling
console.log('\n5. Testing In-progress Current Day Streak Behavior:');
const stateTodayInProgress = createDefaultState();
const todayStr = emptyStats.endDateStr;
const yesterdayStr = addDaysToDateStr(todayStr, -1);
const dayBeforeYesterdayStr = addDaysToDateStr(todayStr, -2);

// Suppose 2 days before yesterday and yesterday were both qualifying days (4 blocks)
stateTodayInProgress.studyBlocks[dayBeforeYesterdayStr] = {
  dayKey: dayBeforeYesterdayStr,
  date: dayBeforeYesterdayStr,
  checkedBlocks: [true, true, true, true, false], // 4 blocks -> qualifies
  hoursStudied: 5,
  notes: ''
};
stateTodayInProgress.studyBlocks[yesterdayStr] = {
  dayKey: yesterdayStr,
  date: yesterdayStr,
  checkedBlocks: [true, true, true, true, false], // 4 blocks -> qualifies
  hoursStudied: 5,
  notes: ''
};
// Today only has 2 blocks completed so far (in progress)
stateTodayInProgress.studyBlocks[todayStr] = {
  dayKey: todayStr,
  date: todayStr,
  checkedBlocks: [true, true, false, false, false], // 2 blocks -> in progress
  hoursStudied: 2.5,
  notes: ''
};

const statsInProgress = calculateStreakStats(stateTodayInProgress);
assert(statsInProgress.todayCount === 2, 'Today shows 2 blocks completed');
assert(statsInProgress.todayQualifies === false, 'Today does not qualify yet');
assert(statsInProgress.currentStreak === 2, 'Current streak is 2 (NOT broken by today being in progress!)');

// Now user finishes 4th block today!
stateTodayInProgress.studyBlocks[todayStr].checkedBlocks[2] = true;
stateTodayInProgress.studyBlocks[todayStr].checkedBlocks[3] = true; // now 4 blocks completed
const statsTodayFinished = calculateStreakStats(stateTodayInProgress);
assert(statsTodayFinished.todayCount === 4, 'Today shows 4 blocks completed');
assert(statsTodayFinished.todayQualifies === true, 'Today qualifies');
assert(statsTodayFinished.currentStreak === 3, 'Current streak increments to 3 upon completing 4th block today!');

// 6. Missed Completed Day Breaks Current Streak & Longest Streak Preserved
console.log('\n6. Testing Missed Day & Longest Streak Preservation:');
const stateWithBreak = createDefaultState();
// 5-day streak in past
for (let i = 10; i >= 6; i--) {
  const dStr = addDaysToDateStr(todayStr, -i);
  stateWithBreak.studyBlocks[dStr] = {
    dayKey: dStr,
    date: dStr,
    checkedBlocks: [true, true, true, true, true], // 5 blocks
    hoursStudied: 6,
    notes: ''
  };
}
// Day -5 was MISSED (1 block)
const missedDayStr = addDaysToDateStr(todayStr, -5);
stateWithBreak.studyBlocks[missedDayStr] = {
  dayKey: missedDayStr,
  date: missedDayStr,
  checkedBlocks: [true, false, false, false, false], // 1 block
  hoursStudied: 1,
  notes: ''
};
// Day -4 was MISSED (0 blocks)
// Day -1 (yesterday) had only 3 blocks (unsuccessful day)
stateWithBreak.studyBlocks[yesterdayStr] = {
  dayKey: yesterdayStr,
  date: yesterdayStr,
  checkedBlocks: [true, true, true, false, false], // 3 blocks (does not qualify!)
  hoursStudied: 4,
  notes: ''
};
// Today has 1 block
stateWithBreak.studyBlocks[todayStr] = {
  dayKey: todayStr,
  date: todayStr,
  checkedBlocks: [true, false, false, false, false], // 1 block
  hoursStudied: 1,
  notes: ''
};

const statsWithBreak = calculateStreakStats(stateWithBreak);
assert(statsWithBreak.currentStreak === 0, 'Current streak is 0 because yesterday was unsuccessful and today is not qualified');
assert(statsWithBreak.longestStreak === 5, 'Longest streak of 5 is preserved despite streak resetting!');
assert(statsWithBreak.qualifyingDaysCount === 5, 'Qualifying days count is 5');

// 7. Activity intensity vs Streak qualification:
console.log('\n7. Testing Active Heatmap without Streak Qualification:');
const activityMap = getStudyActivityMap(stateWithBreak);
const missedDayActivity = activityMap.get(yesterdayStr);
assert(missedDayActivity?.count === 3, 'Yesterday has 3 completed blocks in heatmap');
assert(missedDayActivity?.qualifies === false, 'Yesterday does NOT qualify for streak');
assert(levelOf(missedDayActivity?.count || 0) === 3, 'Yesterday renders at intensity Level 3 on heatmap');

console.log(`\n======================================================`);
console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`======================================================\n`);

if (failCount > 0) {
  process.exit(1);
}
