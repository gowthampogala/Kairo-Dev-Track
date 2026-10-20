import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  KairoStateV2,
  Task,
  Project,
  TaskCategory,
  WeeklyReview,
  AppSettings,
  ParsedImportPreview,
  SpringBootProjectState,
  SpringBootLessonState
} from '../types';
import {
  loadState,
  saveState,
  getTodayDateString,
  exportBackupJson,
  validateImportData,
  createDefaultState
} from '../services/storage';
import { calculateCurrentPosition, CurrentPosition } from '../services/progress';
import { DEFAULT_PROJECTS } from '../data/curriculum';

interface AppContextType {
  state: KairoStateV2;
  currentPosition: CurrentPosition;
  activePage: string;
  setActivePage: (page: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  isImporterOpen: boolean;
  setIsImporterOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Roadmap & Daily task operations
  toggleRoadmapTask: (taskId: string) => void;
  addCustomRoadmapTask: (blockId: number, day: number, taskData: { title: string; description?: string; category: TaskCategory; estimateMinutes?: number }) => void;
  editRoadmapTask: (taskId: string, updates: Partial<Task>) => void;
  deleteCustomRoadmapTask: (taskId: string) => void;

  // Project operations
  createProject: (projectData: { title: string; description: string; technologies: string[]; sections: { id: string; title: string; order: number }[]; tasks: Task[] }) => string;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => void;
  archiveProject: (projectId: string) => void;
  restoreProject: (projectId: string) => void;
  toggleProjectTask: (projectId: string, taskId: string) => void;
  addProjectTask: (projectId: string, sectionId: string, taskData: { title: string; description?: string; category: TaskCategory; estimateMinutes?: number }) => void;
  updateProjectTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteProjectTask: (projectId: string, taskId: string) => void;

  // Workspace task operations
  bulkUpdateTasks: (taskIds: string[], updates: Partial<Task>) => void;
  bulkDeleteTasks: (taskIds: string[]) => void;
  importParsedProject: (preview: ParsedImportPreview) => string;

  // Custom roadmap plans
  addCustomRoadmapPlan: (title: string, description: string, weekSpan: number, deliverable: string, topics: string[]) => void;

  // Study blocks & reflections
  toggleStudyBlock: (dayKey: string, blockIndex: number) => void;
  setStudyHours: (dayKey: string, hours: string | number) => void;
  setStudyNotes: (dayKey: string, notes: string) => void;

  // Weekly review operations
  updateWeeklyReview: (blockId: number, updates: Partial<WeeklyReview>) => void;

  // Settings & navigation
  updateSettings: (updates: Partial<AppSettings>) => void;
  setSelectedBlockAndDay: (block: number, day: number) => void;

  // JavaScript Roadmap operations
  toggleJSLesson: (lessonId: string) => void;
  toggleJSDailyPlan: (lessonId: string) => void;
  updateJSLessonNotes: (lessonId: string, notes: string) => void;
  toggleJSExercise: (lessonId: string, exerciseId: string) => void;
  toggleJSSelfAssessment: (lessonId: string, index: number) => void;
  logJSStudyTime: (lessonId: string, minutes: number) => void;

  // Spring Boot Roadmap operations
  toggleSpringBootLesson: (lessonId: string) => void;
  updateSpringBootLessonNotes: (lessonId: string, notes: string) => void;
  toggleSpringBootDailyPlan: (lessonId: string) => void;
  updateSpringBootProject: (projectId: string, updates: Partial<SpringBootProjectState>) => void;
  toggleSpringBootProjectChecklist: (projectId: string, item: string) => void;

  // Spring Framework Roadmap operations
  toggleSpringFrameworkLesson: (lessonId: string) => void;
  updateSpringFrameworkLessonTitle: (moduleId: string, lessonId: string, newTitle: string) => void;
  addSpringFrameworkLesson: (moduleId: string, title: string) => void;
  removeSpringFrameworkLesson: (moduleId: string, lessonId: string) => void;
  importSpringFrameworkVideos: (moduleId: string, videoTitles: string[], replaceExisting?: boolean) => void;
  importMultipleSpringFrameworkModules: (data: Record<string, string[]>) => void;
  updateSpringFrameworkLessonNotes: (lessonId: string, notes: string) => void;

  // AI Engineering Roadmap operations
  toggleAITopic: (topicId: string) => void;
  toggleAIDailyPlan: (topicId: string) => void;
  updateAITopicNotes: (topicId: string, notes: string) => void;
  logAIStudyTime: (topicId: string, minutes: number) => void;

  // Network Fundamentals Roadmap operations
  toggleNetworkTopic: (topicId: string) => void;
  toggleNetworkDailyPlan: (topicId: string) => void;
  updateNetworkTopicNotes: (topicId: string, notes: string) => void;

  // 20-Week Journey operations
  toggleWeekCompletion: (weekNumber: number) => void;

  // Backup & reset
  exportBackup: () => void;
  importBackup: (jsonContent: string) => { success: boolean; message: string };
  resetAllProgress: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<KairoStateV2>(() => loadState());
  const [activePage, setActivePage] = useState<string>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isImporterOpen, setIsImporterOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Auto-save changes to localStorage
  useEffect(() => {
    saveState(state);
    if (state.settings.theme) {
      document.documentElement.dataset.theme = state.settings.theme;
    }
  }, [state]);

  const currentPosition = useMemo(() => {
    return calculateCurrentPosition(state.settings.startDate);
  }, [state.settings.startDate]);

  // Toggle roadmap task
  const toggleRoadmapTask = useCallback((taskId: string) => {
    setState(prev => {
      const task = prev.roadmapTasks[taskId];
      if (!task) return prev;

      const isNowDone = task.status !== 'done';
      const updatedTasks = {
        ...prev.roadmapTasks,
        [taskId]: {
          ...task,
          status: (isNowDone ? 'done' : 'todo') as any,
          completedAt: isNowDone ? getTodayDateString() : undefined
        }
      };

      return {
        ...prev,
        roadmapTasks: updatedTasks
      };
    });
  }, []);

  // Add custom task to a daily block
  const addCustomRoadmapTask = useCallback((
    blockId: number,
    day: number,
    taskData: { title: string; description?: string; category: TaskCategory; estimateMinutes?: number }
  ) => {
    const newId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newTask: Task = {
      id: newId,
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category,
      status: 'todo',
      roadmapBlockId: blockId,
      roadmapDay: day,
      estimateMinutes: taskData.estimateMinutes,
      isCustom: true
    };

    setState(prev => ({
      ...prev,
      roadmapTasks: {
        ...prev.roadmapTasks,
        [newId]: newTask
      }
    }));
  }, []);

  // Edit roadmap task
  const editRoadmapTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setState(prev => {
      const task = prev.roadmapTasks[taskId];
      if (!task) return prev;
      return {
        ...prev,
        roadmapTasks: {
          ...prev.roadmapTasks,
          [taskId]: { ...task, ...updates }
        }
      };
    });
  }, []);

  // Delete custom roadmap task
  const deleteCustomRoadmapTask = useCallback((taskId: string) => {
    setState(prev => {
      const nextTasks = { ...prev.roadmapTasks };
      delete nextTasks[taskId];
      return {
        ...prev,
        roadmapTasks: nextTasks
      };
    });
  }, []);

  // Create project
  const createProject = useCallback((projectData: {
    title: string;
    description: string;
    technologies: string[];
    sections: { id: string; title: string; order: number }[];
    tasks: Task[];
  }): string => {
    const newId = `proj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();
    const newProj: Project = {
      id: newId,
      title: projectData.title,
      description: projectData.description,
      technologies: projectData.technologies,
      status: 'not_started',
      sections: projectData.sections,
      tasks: projectData.tasks.map(t => ({ ...t, projectId: newId })),
      createdAt: now,
      updatedAt: now
    };

    setState(prev => ({
      ...prev,
      projects: [newProj, ...prev.projects]
    }));

    return newId;
  }, []);

  // Update project metadata
  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      })
    }));
  }, []);

  // Delete project
  const deleteProject = useCallback((projectId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  }, [selectedProjectId]);

  // Duplicate project
  const duplicateProject = useCallback((projectId: string) => {
    setState(prev => {
      const original = prev.projects.find(p => p.id === projectId);
      if (!original) return prev;

      const dupId = `proj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const now = new Date().toISOString();

      const dupSections = original.sections.map((s, i) => ({
        ...s,
        id: `sec-${dupId}-${i}`
      }));

      const sectionMap = new Map<string, string>();
      original.sections.forEach((s, i) => {
        sectionMap.set(s.id, dupSections[i].id);
      });

      const dupTasks = original.tasks.map(t => ({
        ...t,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        projectId: dupId,
        sectionId: t.sectionId ? sectionMap.get(t.sectionId) || dupSections[0]?.id : undefined,
        status: 'todo' as const,
        completedAt: undefined
      }));

      const duplicated: Project = {
        ...original,
        id: dupId,
        title: `${original.title} (Copy)`,
        status: 'not_started',
        isOriginal: false,
        sections: dupSections,
        tasks: dupTasks,
        createdAt: now,
        updatedAt: now
      };

      return {
        ...prev,
        projects: [duplicated, ...prev.projects]
      };
    });
  }, []);

  // Archive project
  const archiveProject = useCallback((projectId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId
          ? { ...p, status: 'archived', archivedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          : p
      )
    }));
  }, []);

  // Restore project
  const restoreProject = useCallback((projectId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId
          ? { ...p, status: 'in_progress', archivedAt: undefined, updatedAt: new Date().toISOString() }
          : p
      )
    }));
  }, []);

  // Toggle project task
  const toggleProjectTask = useCallback((projectId: string, taskId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;

        const updatedTasks = p.tasks.map(t => {
          if (t.id !== taskId) return t;
          const isDone = t.status !== 'done';
          return {
            ...t,
            status: (isDone ? 'done' : 'todo') as any,
            completedAt: isDone ? getTodayDateString() : undefined
          };
        });

        // Auto-update project status if all done or partially done
        const allDone = updatedTasks.every(t => t.status === 'done');
        const anyDone = updatedTasks.some(t => t.status === 'done' || t.status === 'in_progress');
        const newStatus = allDone ? 'done' : anyDone ? 'in_progress' : p.status;

        return {
          ...p,
          status: newStatus,
          tasks: updatedTasks,
          updatedAt: new Date().toISOString()
        };
      })
    }));
  }, []);

  // Add project task
  const addProjectTask = useCallback((
    projectId: string,
    sectionId: string,
    taskData: { title: string; description?: string; category: TaskCategory; estimateMinutes?: number }
  ) => {
    const newTaskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newTask: Task = {
      id: newTaskId,
      projectId,
      sectionId,
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category,
      status: 'todo',
      estimateMinutes: taskData.estimateMinutes
    };

    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          tasks: [...p.tasks, newTask],
          updatedAt: new Date().toISOString()
        };
      })
    }));
  }, []);

  // Update project task
  const updateProjectTask = useCallback((projectId: string, taskId: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          tasks: p.tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t)),
          updatedAt: new Date().toISOString()
        };
      })
    }));
  }, []);

  // Delete project task
  const deleteProjectTask = useCallback((projectId: string, taskId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          tasks: p.tasks.filter(t => t.id !== taskId),
          updatedAt: new Date().toISOString()
        };
      })
    }));
  }, []);

  // Bulk update tasks
  const bulkUpdateTasks = useCallback((taskIds: string[], updates: Partial<Task>) => {
    setState(prev => {
      // 1. Update matching roadmap tasks
      const nextRoadmapTasks = { ...prev.roadmapTasks };
      taskIds.forEach(id => {
        if (nextRoadmapTasks[id]) {
          nextRoadmapTasks[id] = { ...nextRoadmapTasks[id], ...updates };
        }
      });

      // 2. Update matching project tasks
      const nextProjects = prev.projects.map(proj => ({
        ...proj,
        tasks: proj.tasks.map(t => (taskIds.includes(t.id) ? { ...t, ...updates } : t)),
        updatedAt: new Date().toISOString()
      }));

      return {
        ...prev,
        roadmapTasks: nextRoadmapTasks,
        projects: nextProjects
      };
    });
  }, []);

  // Bulk delete tasks
  const bulkDeleteTasks = useCallback((taskIds: string[]) => {
    setState(prev => {
      const nextRoadmapTasks = { ...prev.roadmapTasks };
      taskIds.forEach(id => {
        if (nextRoadmapTasks[id]?.isCustom) {
          delete nextRoadmapTasks[id];
        }
      });

      const nextProjects = prev.projects.map(proj => ({
        ...proj,
        tasks: proj.tasks.filter(t => !taskIds.includes(t.id)),
        updatedAt: new Date().toISOString()
      }));

      return {
        ...prev,
        roadmapTasks: nextRoadmapTasks,
        projects: nextProjects
      };
    });
  }, []);

  // Import parsed markdown into a new project
  const importParsedProject = useCallback((preview: ParsedImportPreview): string => {
    const newProjectId = `proj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();

    const sections = preview.sections.map((s, idx) => ({
      id: `sec-${newProjectId}-${idx}`,
      title: s.title,
      order: idx
    }));

    const tasks: Task[] = [];
    preview.sections.forEach((sec, idx) => {
      const sectionId = sections[idx].id;
      sec.tasks.forEach(t => {
        tasks.push({
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          projectId: newProjectId,
          sectionId,
          title: t.title,
          description: t.description || '',
          category: t.category,
          status: t.status,
          completedAt: t.status === 'done' ? getTodayDateString() : undefined,
          estimateMinutes: t.estimateMinutes
        });
      });
    });

    const newProject: Project = {
      id: newProjectId,
      title: preview.projectTitle,
      description: preview.projectDescription,
      technologies: preview.technologies,
      status: tasks.every(t => t.status === 'done') ? 'done' : 'in_progress',
      sections,
      tasks,
      createdAt: now,
      updatedAt: now
    };

    setState(prev => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }));

    return newProjectId;
  }, []);

  // Add custom roadmap plan
  const addCustomRoadmapPlan = useCallback((
    title: string,
    description: string,
    weekSpan: number,
    deliverable: string,
    topics: string[]
  ) => {
    setState(prev => {
      const currentBlocksCount = (prev.customRoadmapBlocks || []).length;
      const customBlockId = 100 + currentBlocksCount;

      const newBlock = {
        id: customBlockId,
        phaseIndex: 6, // Append to or extend learning plan
        startWeek: 21 + currentBlocksCount * weekSpan,
        weekSpan: Math.max(1, weekSpan),
        title,
        topics,
        deliverable,
        isCustom: true
      };

      // Create initial tasks
      const newTasks: Record<string, Task> = {};
      topics.forEach((t, i) => {
        const taskId = `custom-plan-b${customBlockId}-t${i}`;
        newTasks[taskId] = {
          id: taskId,
          title: t,
          category: 'Learn',
          status: 'todo',
          roadmapBlockId: customBlockId,
          roadmapDay: (i % 6) + 1,
          isCustom: true
        };
      });

      const delivTaskId = `custom-plan-b${customBlockId}-deliv`;
      newTasks[delivTaskId] = {
        id: delivTaskId,
        title: `Deliverable: ${deliverable}`,
        category: 'Build',
        status: 'todo',
        roadmapBlockId: customBlockId,
        roadmapDay: 6,
        isDeliverable: true,
        isCustom: true
      };

      return {
        ...prev,
        customRoadmapBlocks: [...(prev.customRoadmapBlocks || []), newBlock],
        roadmapTasks: {
          ...prev.roadmapTasks,
          ...newTasks
        }
      };
    });
  }, []);

  // Study blocks
  const toggleStudyBlock = useCallback((dayKey: string, blockIndex: number) => {
    setState(prev => {
      const existing = prev.studyBlocks[dayKey] || {
        dayKey,
        checkedBlocks: [false, false, false, false, false],
        hoursStudied: '',
        notes: ''
      };

      const updatedChecked = [...existing.checkedBlocks];
      updatedChecked[blockIndex] = !updatedChecked[blockIndex];

      return {
        ...prev,
        studyBlocks: {
          ...prev.studyBlocks,
          [dayKey]: {
            ...existing,
            checkedBlocks: updatedChecked
          }
        }
      };
    });
  }, []);

  const setStudyHours = useCallback((dayKey: string, hours: string | number) => {
    setState(prev => {
      const existing = prev.studyBlocks[dayKey] || {
        dayKey,
        checkedBlocks: [false, false, false, false, false],
        hoursStudied: '',
        notes: ''
      };
      return {
        ...prev,
        studyBlocks: {
          ...prev.studyBlocks,
          [dayKey]: {
            ...existing,
            hoursStudied: hours
          }
        }
      };
    });
  }, []);

  const setStudyNotes = useCallback((dayKey: string, notes: string) => {
    setState(prev => {
      const existing = prev.studyBlocks[dayKey] || {
        dayKey,
        checkedBlocks: [false, false, false, false, false],
        hoursStudied: '',
        notes: ''
      };
      return {
        ...prev,
        studyBlocks: {
          ...prev.studyBlocks,
          [dayKey]: {
            ...existing,
            notes
          }
        }
      };
    });
  }, []);

  // Weekly review update
  const updateWeeklyReview = useCallback((blockId: number, updates: Partial<WeeklyReview>) => {
    setState(prev => {
      const existing = prev.weeklyReviews[blockId] || {
        blockId,
        isCompleted: false,
        selfTestResult: 'not_taken',
        learned: '',
        struggled: '',
        revise: '',
        nextPriority: ''
      };

      return {
        ...prev,
        weeklyReviews: {
          ...prev.weeklyReviews,
          [blockId]: {
            ...existing,
            ...updates
          }
        }
      };
    });
  }, []);

  // Settings update
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates
      }
    }));
  }, []);

  const setSelectedBlockAndDay = useCallback((block: number, day: number) => {
    setState(prev => ({
      ...prev,
      selectedBlock: block,
      selectedDay: day
    }));
  }, []);

  // Export & Import
  const exportBackup = useCallback(() => {
    exportBackupJson(state);
  }, [state]);

  const importBackup = useCallback((jsonContent: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonContent);
      const validation = validateImportData(parsed);
      if (!validation.isValid || !validation.state) {
        return { success: false, message: validation.error || 'Invalid backup file structure.' };
      }

      setState(validation.state);
      saveState(validation.state);
      return { success: true, message: 'All roadmap progress, projects, and settings restored successfully!' };
    } catch {
      return { success: false, message: 'JSON parsing failed. Please verify the file is a valid JSON document.' };
    }
  }, []);

  const resetAllProgress = useCallback(() => {
    const fresh = createDefaultState();
    setState(fresh);
    saveState(fresh);
  }, []);

  // JavaScript Roadmap operations
  const toggleJSLesson = useCallback((lessonId: string) => {
    setState(prev => {
      const jsRoadmap = { ...(prev.jsRoadmap || {}) };
      const current = jsRoadmap[lessonId] || { completed: false };
      const nextCompleted = !current.completed;
      jsRoadmap[lessonId] = {
        ...current,
        completed: nextCompleted,
        completedAt: nextCompleted ? getTodayDateString() : undefined
      };
      return {
        ...prev,
        jsRoadmap
      };
    });
  }, []);

  const toggleJSDailyPlan = useCallback((lessonId: string) => {
    setState(prev => {
      const jsRoadmap = { ...(prev.jsRoadmap || {}) };
      const current = jsRoadmap[lessonId] || { completed: false };
      const nextInDaily = !current.inDailyPlan;
      jsRoadmap[lessonId] = {
        ...current,
        inDailyPlan: nextInDaily,
        dailyPlanDate: nextInDaily ? getTodayDateString() : undefined
      };
      return {
        ...prev,
        jsRoadmap
      };
    });
  }, []);

  const updateJSLessonNotes = useCallback((lessonId: string, notes: string) => {
    setState(prev => {
      const jsRoadmap = { ...(prev.jsRoadmap || {}) };
      const current = jsRoadmap[lessonId] || { completed: false };
      jsRoadmap[lessonId] = {
        ...current,
        notes
      };
      return {
        ...prev,
        jsRoadmap
      };
    });
  }, []);

  const toggleJSExercise = useCallback((lessonId: string, exerciseId: string) => {
    setState(prev => {
      const jsRoadmap = { ...(prev.jsRoadmap || {}) };
      const current = jsRoadmap[lessonId] || { completed: false };
      const exercisesCompleted = { ...(current.exercisesCompleted || {}) };
      exercisesCompleted[exerciseId] = !exercisesCompleted[exerciseId];
      jsRoadmap[lessonId] = {
        ...current,
        exercisesCompleted
      };
      return {
        ...prev,
        jsRoadmap
      };
    });
  }, []);

  const toggleJSSelfAssessment = useCallback((lessonId: string, index: number) => {
    setState(prev => {
      const jsRoadmap = { ...(prev.jsRoadmap || {}) };
      const current = jsRoadmap[lessonId] || { completed: false };
      const selfAssessmentCompleted = { ...(current.selfAssessmentCompleted || {}) };
      selfAssessmentCompleted[index] = !selfAssessmentCompleted[index];
      jsRoadmap[lessonId] = {
        ...current,
        selfAssessmentCompleted
      };
      return {
        ...prev,
        jsRoadmap
      };
    });
  }, []);

  const logJSStudyTime = useCallback((lessonId: string, minutes: number) => {
    setState(prev => {
      const jsRoadmap = { ...(prev.jsRoadmap || {}) };
      const current = jsRoadmap[lessonId] || { completed: false };
      jsRoadmap[lessonId] = {
        ...current,
        studyMinutes: (current.studyMinutes || 0) + minutes
      };
      return {
        ...prev,
        jsRoadmap
      };
    });
  }, []);

  // Spring Boot Roadmap operations
  const toggleSpringBootLesson = useCallback((lessonId: string) => {
    setState(prev => {
      const springBootRoadmap = { ...(prev.springBootRoadmap || {}) };
      const current = springBootRoadmap[lessonId] || { completed: false };
      const nextCompleted = !current.completed;
      springBootRoadmap[lessonId] = {
        ...current,
        completed: nextCompleted,
        completedAt: nextCompleted ? getTodayDateString() : undefined
      };
      return {
        ...prev,
        springBootRoadmap
      };
    });
  }, []);

  const updateSpringBootLessonNotes = useCallback((lessonId: string, notes: string) => {
    setState(prev => {
      const springBootRoadmap = { ...(prev.springBootRoadmap || {}) };
      const current = springBootRoadmap[lessonId] || { completed: false };
      springBootRoadmap[lessonId] = {
        ...current,
        notes
      };
      return {
        ...prev,
        springBootRoadmap
      };
    });
  }, []);

  const toggleSpringBootDailyPlan = useCallback((lessonId: string) => {
    setState(prev => {
      const springBootRoadmap = { ...(prev.springBootRoadmap || {}) };
      const current = springBootRoadmap[lessonId] || { completed: false };
      const nextInDaily = !current.inDailyPlan;
      springBootRoadmap[lessonId] = {
        ...current,
        inDailyPlan: nextInDaily,
        dailyPlanDate: nextInDaily ? getTodayDateString() : undefined
      };
      return {
        ...prev,
        springBootRoadmap
      };
    });
  }, []);

  const updateSpringBootProject = useCallback((projectId: string, updates: Partial<SpringBootProjectState>) => {
    setState(prev => {
      const springBootProjects = { ...(prev.springBootProjects || {}) };
      const current = springBootProjects[projectId] || {
        id: projectId,
        status: 'not_started',
        completedChecklist: []
      };
      springBootProjects[projectId] = {
        ...current,
        ...updates
      };
      return {
        ...prev,
        springBootProjects
      };
    });
  }, []);

  const toggleSpringBootProjectChecklist = useCallback((projectId: string, item: string) => {
    setState(prev => {
      const springBootProjects = { ...(prev.springBootProjects || {}) };
      const current = springBootProjects[projectId] || {
        id: projectId,
        status: 'not_started',
        completedChecklist: []
      };
      const exists = current.completedChecklist.includes(item);
      const nextChecklist = exists
        ? current.completedChecklist.filter(i => i !== item)
        : [...current.completedChecklist, item];
      springBootProjects[projectId] = {
        ...current,
        completedChecklist: nextChecklist,
        status: nextChecklist.length === 0 ? 'not_started' : 'in_progress'
      };
      return {
        ...prev,
        springBootProjects
      };
    });
  }, []);

  // Spring Framework Roadmap operations
  const toggleSpringFrameworkLesson = useCallback((lessonId: string) => {
    setState(prev => {
      const springFrameworkRoadmap = { ...(prev.springFrameworkRoadmap || {}) };
      const current = springFrameworkRoadmap[lessonId] || { completed: false };
      const nextCompleted = !current.completed;
      springFrameworkRoadmap[lessonId] = {
        ...current,
        completed: nextCompleted,
        completedAt: nextCompleted ? getTodayDateString() : undefined
      };
      return {
        ...prev,
        springFrameworkRoadmap
      };
    });
  }, []);

  const updateSpringFrameworkLessonTitle = useCallback((moduleId: string, lessonId: string, newTitle: string) => {
    setState(prev => {
      const customVideosMap = { ...(prev.springFrameworkCustomVideos || {}) };
      const moduleVideos = customVideosMap[moduleId] || [];
      const updated = moduleVideos.map(v => v.id === lessonId ? { ...v, title: newTitle, isPlaceholder: false } : v);
      customVideosMap[moduleId] = updated;
      return {
        ...prev,
        springFrameworkCustomVideos: customVideosMap
      };
    });
  }, []);

  const addSpringFrameworkLesson = useCallback((moduleId: string, title: string) => {
    setState(prev => {
      const customVideosMap = { ...(prev.springFrameworkCustomVideos || {}) };
      const moduleVideos = customVideosMap[moduleId] || [];
      const modNum = Number(moduleId.replace('sf-mod-', '')) || 1;
      const newVideoId = `sf-${moduleId}-v-${Date.now()}`;
      const newVideo = {
        id: newVideoId,
        moduleId,
        moduleNumber: modNum,
        videoIndex: moduleVideos.length + 1,
        title: title.trim() || `Video ${moduleVideos.length + 1}`,
        isPlaceholder: false
      };
      customVideosMap[moduleId] = [...moduleVideos, newVideo];
      return {
        ...prev,
        springFrameworkCustomVideos: customVideosMap
      };
    });
  }, []);

  const removeSpringFrameworkLesson = useCallback((moduleId: string, lessonId: string) => {
    setState(prev => {
      const customVideosMap = { ...(prev.springFrameworkCustomVideos || {}) };
      const moduleVideos = customVideosMap[moduleId] || [];
      customVideosMap[moduleId] = moduleVideos.filter(v => v.id !== lessonId);
      return {
        ...prev,
        springFrameworkCustomVideos: customVideosMap
      };
    });
  }, []);

  const importSpringFrameworkVideos = useCallback((moduleId: string, videoTitles: string[]) => {
    setState(prev => {
      const customVideosMap = { ...(prev.springFrameworkCustomVideos || {}) };
      const modNum = Number(moduleId.replace('sf-mod-', '')) || 1;
      const cleanTitles = videoTitles.map(t => t.trim()).filter(Boolean);
      customVideosMap[moduleId] = cleanTitles.map((title, idx) => ({
        id: `sf-m${modNum}-v${idx + 1}`,
        moduleId,
        moduleNumber: modNum,
        videoIndex: idx + 1,
        title,
        isPlaceholder: false
      }));
      return {
        ...prev,
        springFrameworkCustomVideos: customVideosMap
      };
    });
  }, []);

  const importMultipleSpringFrameworkModules = useCallback((data: Record<string, string[]>) => {
    setState(prev => {
      const customVideosMap = { ...(prev.springFrameworkCustomVideos || {}) };
      Object.entries(data).forEach(([moduleId, titles]) => {
        const modNum = Number(moduleId.replace('sf-mod-', '')) || 1;
        const cleanTitles = titles.map(t => t.trim()).filter(Boolean);
        customVideosMap[moduleId] = cleanTitles.map((title, idx) => ({
          id: `sf-m${modNum}-v${idx + 1}`,
          moduleId,
          moduleNumber: modNum,
          videoIndex: idx + 1,
          title,
          isPlaceholder: false
        }));
      });
      return {
        ...prev,
        springFrameworkCustomVideos: customVideosMap
      };
    });
  }, []);

  const updateSpringFrameworkLessonNotes = useCallback((lessonId: string, notes: string) => {
    setState(prev => {
      const springFrameworkRoadmap = { ...(prev.springFrameworkRoadmap || {}) };
      const current = springFrameworkRoadmap[lessonId] || { completed: false };
      springFrameworkRoadmap[lessonId] = {
        ...current,
        notes
      };
      return {
        ...prev,
        springFrameworkRoadmap
      };
    });
  }, []);

  // AI Engineering Roadmap operations
  const toggleAITopic = useCallback((topicId: string) => {
    setState(prev => {
      const aiRoadmap = { ...(prev.aiRoadmap || {}) };
      const current = aiRoadmap[topicId] || { completed: false };
      const nextCompleted = !current.completed;
      aiRoadmap[topicId] = {
        ...current,
        completed: nextCompleted,
        completedAt: nextCompleted ? getTodayDateString() : undefined
      };
      return {
        ...prev,
        aiRoadmap
      };
    });
  }, []);

  const toggleAIDailyPlan = useCallback((topicId: string) => {
    setState(prev => {
      const aiRoadmap = { ...(prev.aiRoadmap || {}) };
      const current = aiRoadmap[topicId] || { completed: false };
      const nextInDaily = !current.inDailyPlan;
      aiRoadmap[topicId] = {
        ...current,
        inDailyPlan: nextInDaily,
        dailyPlanDate: nextInDaily ? getTodayDateString() : undefined
      };
      return {
        ...prev,
        aiRoadmap
      };
    });
  }, []);

  const updateAITopicNotes = useCallback((topicId: string, notes: string) => {
    setState(prev => {
      const aiRoadmap = { ...(prev.aiRoadmap || {}) };
      const current = aiRoadmap[topicId] || { completed: false };
      aiRoadmap[topicId] = {
        ...current,
        notes
      };
      return {
        ...prev,
        aiRoadmap
      };
    });
  }, []);

  const logAIStudyTime = useCallback((topicId: string, minutes: number) => {
    setState(prev => {
      const aiRoadmap = { ...(prev.aiRoadmap || {}) };
      const current = aiRoadmap[topicId] || { completed: false };
      aiRoadmap[topicId] = {
        ...current,
        studyMinutes: (current.studyMinutes || 0) + minutes
      };
      return {
        ...prev,
        aiRoadmap
      };
    });
  }, []);

  // Network Fundamentals Roadmap operations
  const toggleNetworkTopic = useCallback((topicId: string) => {
    setState(prev => {
      const networkRoadmap = { ...(prev.networkRoadmap || {}) };
      const current = networkRoadmap[topicId] || { completed: false };
      const nextCompleted = !current.completed;
      networkRoadmap[topicId] = {
        ...current,
        completed: nextCompleted,
        completedAt: nextCompleted ? getTodayDateString() : undefined
      };
      return {
        ...prev,
        networkRoadmap
      };
    });
  }, []);

  const toggleNetworkDailyPlan = useCallback((topicId: string) => {
    setState(prev => {
      const networkRoadmap = { ...(prev.networkRoadmap || {}) };
      const current = networkRoadmap[topicId] || { completed: false };
      const nextInDaily = !current.inDailyPlan;
      networkRoadmap[topicId] = {
        ...current,
        inDailyPlan: nextInDaily,
        dailyPlanDate: nextInDaily ? getTodayDateString() : undefined
      };
      return {
        ...prev,
        networkRoadmap
      };
    });
  }, []);

  const updateNetworkTopicNotes = useCallback((topicId: string, notes: string) => {
    setState(prev => {
      const networkRoadmap = { ...(prev.networkRoadmap || {}) };
      const current = networkRoadmap[topicId] || { completed: false };
      networkRoadmap[topicId] = {
        ...current,
        notes
      };
      return {
        ...prev,
        networkRoadmap
      };
    });
  }, []);

  const toggleWeekCompletion = useCallback((weekNumber: number) => {
    setState(prev => {
      const current = prev.completedWeeks || [];
      const exists = current.includes(weekNumber);
      const updated = exists ? current.filter(w => w !== weekNumber) : [...current, weekNumber];
      return {
        ...prev,
        completedWeeks: updated
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      state,
      currentPosition,
      activePage,
      setActivePage,
      selectedProjectId,
      setSelectedProjectId,
      isImporterOpen,
      setIsImporterOpen,
      mobileMenuOpen,
      setMobileMenuOpen,
      toggleRoadmapTask,
      addCustomRoadmapTask,
      editRoadmapTask,
      deleteCustomRoadmapTask,
      createProject,
      updateProject,
      deleteProject,
      duplicateProject,
      archiveProject,
      restoreProject,
      toggleProjectTask,
      addProjectTask,
      updateProjectTask,
      deleteProjectTask,
      bulkUpdateTasks,
      bulkDeleteTasks,
      importParsedProject,
      addCustomRoadmapPlan,
      toggleStudyBlock,
      setStudyHours,
      setStudyNotes,
      updateWeeklyReview,
      updateSettings,
      setSelectedBlockAndDay,
      exportBackup,
      importBackup,
      resetAllProgress,
      toggleJSLesson,
      toggleJSDailyPlan,
      updateJSLessonNotes,
      toggleJSExercise,
      toggleJSSelfAssessment,
      logJSStudyTime,
      toggleSpringBootLesson,
      updateSpringBootLessonNotes,
      toggleSpringBootDailyPlan,
      updateSpringBootProject,
      toggleSpringBootProjectChecklist,
      toggleSpringFrameworkLesson,
      updateSpringFrameworkLessonTitle,
      addSpringFrameworkLesson,
      removeSpringFrameworkLesson,
      importSpringFrameworkVideos,
      importMultipleSpringFrameworkModules,
      updateSpringFrameworkLessonNotes,
      toggleAITopic,
      toggleAIDailyPlan,
      updateAITopicNotes,
      logAIStudyTime,
      toggleNetworkTopic,
      toggleNetworkDailyPlan,
      updateNetworkTopicNotes,
      toggleWeekCompletion
    }),
    [
      state,
      currentPosition,
      activePage,
      selectedProjectId,
      isImporterOpen,
      mobileMenuOpen,
      toggleRoadmapTask,
      addCustomRoadmapTask,
      editRoadmapTask,
      deleteCustomRoadmapTask,
      createProject,
      updateProject,
      deleteProject,
      duplicateProject,
      archiveProject,
      restoreProject,
      toggleProjectTask,
      addProjectTask,
      updateProjectTask,
      deleteProjectTask,
      bulkUpdateTasks,
      bulkDeleteTasks,
      importParsedProject,
      addCustomRoadmapPlan,
      toggleStudyBlock,
      setStudyHours,
      setStudyNotes,
      updateWeeklyReview,
      updateSettings,
      setSelectedBlockAndDay,
      exportBackup,
      importBackup,
      resetAllProgress,
      toggleJSLesson,
      toggleJSDailyPlan,
      updateJSLessonNotes,
      toggleJSExercise,
      toggleJSSelfAssessment,
      logJSStudyTime,
      toggleSpringBootLesson,
      updateSpringBootLessonNotes,
      toggleSpringBootDailyPlan,
      updateSpringBootProject,
      toggleSpringBootProjectChecklist,
      toggleSpringFrameworkLesson,
      updateSpringFrameworkLessonTitle,
      addSpringFrameworkLesson,
      removeSpringFrameworkLesson,
      importSpringFrameworkVideos,
      importMultipleSpringFrameworkModules,
      updateSpringFrameworkLessonNotes,
      toggleAITopic,
      toggleAIDailyPlan,
      updateAITopicNotes,
      logAIStudyTime,
      toggleNetworkTopic,
      toggleNetworkDailyPlan,
      updateNetworkTopicNotes,
      toggleWeekCompletion
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
