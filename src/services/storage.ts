import { KairoStateV2, Task, Project } from '../types';
import { generateDefaultRoadmapTasks, DEFAULT_PROJECTS, RAW_BLOCKS } from '../data/curriculum';

export const STORAGE_KEY_V2 = 'kairo-dev-track-v2';
export const STORAGE_KEY_V1 = 'kairo-dev-track-v1';

export const getTodayDateString = (d?: Date): string => {
  const date = d || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const createDefaultState = (): KairoStateV2 => {
  const today = getTodayDateString();
  return {
    version: 2,
    settings: {
      startDate: today,
      dailyTargetHours: 6,
      theme: 'dark',
      viewMode: 'comfortable'
    },
    projects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)),
    roadmapTasks: generateDefaultRoadmapTasks(),
    customRoadmapBlocks: [],
    customRoadmapPhases: [],
    weeklyReviews: {},
    studyBlocks: {},
    jsRoadmap: {},
    springFrameworkRoadmap: {},
    springFrameworkCustomVideos: {},
    springBootRoadmap: {},
    springBootProjects: {},
    aiRoadmap: {},
    networkRoadmap: {},
    completedWeeks: [],
    selectedBlock: 0,
    selectedDay: 1,
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Migration engine: converts v1 state format into v2 schema without loss
 */
export const migrateV1ToV2 = (v1Data: any): KairoStateV2 => {
  const base = createDefaultState();

  if (!v1Data || typeof v1Data !== 'object') {
    return base;
  }

  // 1. Settings
  if (v1Data.start) base.settings.startDate = v1Data.start;
  if (v1Data.target) base.settings.dailyTargetHours = Number(v1Data.target) || 6;
  if (v1Data.theme === 'light' || v1Data.theme === 'dark') base.settings.theme = v1Data.theme;

  // 2. Roadmap tasks completion
  if (v1Data.done && typeof v1Data.done === 'object') {
    Object.entries(v1Data.done).forEach(([legacyKey, dateVal]) => {
      // legacyKey is like "0.1" (blockIndex.itemIndex)
      const [bStr, kStr] = legacyKey.split('.');
      if (bStr !== undefined && kStr !== undefined) {
        const stableId = `curric-b${bStr}-t${kStr}`;
        if (base.roadmapTasks[stableId]) {
          base.roadmapTasks[stableId].status = 'done';
          base.roadmapTasks[stableId].completedAt = typeof dateVal === 'string' ? dateVal : getTodayDateString();
        }
      }
    });
  }

  // 3. Custom roadmap tasks
  if (Array.isArray(v1Data.custom)) {
    v1Data.custom.forEach((c: any) => {
      if (c && c.title) {
        const customId = c.id || `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        base.roadmapTasks[customId] = {
          id: customId,
          title: c.title,
          description: c.desc || '',
          category: c.cat || 'Learn',
          status: c.done ? 'done' : 'todo',
          completedAt: c.done || undefined,
          estimateMinutes: Number(c.min) || undefined,
          roadmapBlockId: Number(c.b) || 0,
          roadmapDay: Number(c.d) || 1,
          isCustom: true
        };
      }
    });
  }

  // 4. Projects
  if (v1Data.proj && typeof v1Data.proj === 'object') {
    base.projects.forEach((proj, idx) => {
      const pData = v1Data.proj[idx];
      if (pData) {
        if (pData.st === 'In progress') proj.status = 'in_progress';
        else if (pData.st === 'Done') proj.status = 'done';
        else proj.status = 'not_started';

        if (pData.repo) proj.githubUrl = pData.repo;
        if (pData.live) proj.liveUrl = pData.live;
        if (pData.notes) proj.notes = pData.notes;

        if (pData.done && typeof pData.done === 'object') {
          proj.tasks.forEach((t, tIdx) => {
            if (pData.done[tIdx]) {
              t.status = 'done';
              t.completedAt = getTodayDateString();
            }
          });
        }
      }
    });
  }

  // 5. Weekly Reviews
  if (v1Data.rev && typeof v1Data.rev === 'object') {
    Object.entries(v1Data.rev).forEach(([bIdxStr, rVal]: [string, any]) => {
      const bIdx = Number(bIdxStr);
      if (!isNaN(bIdx)) {
        base.weeklyReviews[bIdx] = {
          blockId: bIdx,
          isCompleted: !!rVal?.done,
          completedAt: rVal?.done ? getTodayDateString() : undefined,
          selfTestResult: v1Data.st?.[bIdx] === 'Passed' ? 'passed' : v1Data.st?.[bIdx] === 'Needs revision' ? 'needs_revision' : 'not_taken',
          learned: rVal?.learned || '',
          struggled: rVal?.struggled || '',
          revise: rVal?.revise || '',
          nextPriority: rVal?.next || ''
        };
      }
    });
  }

  // 6. Study blocks
  if (v1Data.blk && typeof v1Data.blk === 'object') {
    Object.entries(v1Data.blk).forEach(([dayKey, bVal]: [string, any]) => {
      if (bVal && typeof bVal === 'object') {
        base.studyBlocks[dayKey] = {
          dayKey,
          checkedBlocks: Array.isArray(bVal.d) ? bVal.d : [false, false, false, false, false],
          hoursStudied: bVal.h ?? '',
          notes: bVal.n ?? ''
        };
      }
    });
  }

  // Selected view position
  if (v1Data.sel && typeof v1Data.sel === 'object') {
    base.selectedBlock = Number(v1Data.sel.b) || 0;
    base.selectedDay = Number(v1Data.sel.d) || 1;
  }

  base.lastUpdated = new Date().toISOString();
  return base;
};

/**
 * Load state safely from localStorage
 */
export const loadState = (): KairoStateV2 => {
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY_V2);
    if (rawV2) {
      const parsed = JSON.parse(rawV2);
      if (parsed && parsed.version === 2) {
        // Ensure roadmap tasks integrity
        const defaultTasks = generateDefaultRoadmapTasks();
        const mergedTasks = { ...defaultTasks, ...(parsed.roadmapTasks || {}) };
        return {
          ...createDefaultState(),
          ...parsed,
          roadmapTasks: mergedTasks,
          studyBlocks: parsed.studyBlocks || {},
          jsRoadmap: parsed.jsRoadmap || {},
          springFrameworkRoadmap: parsed.springFrameworkRoadmap || {},
          springFrameworkCustomVideos: parsed.springFrameworkCustomVideos || {},
          springBootRoadmap: parsed.springBootRoadmap || {},
          springBootProjects: parsed.springBootProjects || {},
          aiRoadmap: parsed.aiRoadmap || {},
          networkRoadmap: parsed.networkRoadmap || {},
          completedWeeks: Array.isArray(parsed.completedWeeks) ? parsed.completedWeeks : []
        };
      }
    }

    // Attempt migration from v1
    const rawV1 = localStorage.getItem(STORAGE_KEY_V1);
    if (rawV1) {
      const parsedV1 = JSON.parse(rawV1);
      const migrated = migrateV1ToV2(parsedV1);
      // Save migrated v2, but leave v1 as a backup
      saveState(migrated);
      return migrated;
    }
  } catch (err) {
    console.warn('Storage read error, using default state:', err);
  }

  return createDefaultState();
};

/**
 * Save state safely to localStorage
 */
export const saveState = (state: KairoStateV2): boolean => {
  try {
    const stateToSave = {
      ...state,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(stateToSave));
    return true;
  } catch (err) {
    console.error('Storage write error:', err);
    return false;
  }
};

/**
 * Validate imported JSON schema
 */
export const validateImportData = (data: any): { isValid: boolean; error?: string; state?: KairoStateV2 } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'File content is not a valid JSON object.' };
  }

  // If already v2
  if (data.version === 2 && data.roadmapTasks && Array.isArray(data.projects)) {
    return { isValid: true, state: data as KairoStateV2 };
  }

  // If legacy v1
  if (data.done || data.start || data.proj) {
    const migrated = migrateV1ToV2(data);
    return { isValid: true, state: migrated };
  }

  return { isValid: false, error: 'Unrecognized file format. Must be a valid Kairo Dev Track backup.' };
};

/**
 * Trigger browser download of current state JSON
 */
export const exportBackupJson = (state: KairoStateV2, filename?: string) => {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `kairo-dev-track-backup-${getTodayDateString()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
