export type TaskCategory = 'Learn' | 'Practise' | 'Build' | 'Test' | 'Review';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string; // stable identifier
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  completedAt?: string; // YYYY-MM-DD
  estimateMinutes?: number;
  dueDate?: string;
  notes?: string;
  
  // Linkages
  projectId?: string;
  sectionId?: string;
  roadmapPhaseId?: number; // 0..6
  roadmapBlockId?: number; // 0..17
  roadmapDay?: number; // 1..N
  
  // Metadata
  isCustom?: boolean;
  isDeliverable?: boolean;
  isSelfTest?: boolean;
  order?: number;
}

export interface ProjectSection {
  id: string;
  title: string;
  description?: string;
  order: number;
}

export type ProjectStatus = 'not_started' | 'in_progress' | 'done' | 'archived';

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: ProjectStatus;
  sections: ProjectSection[];
  tasks: Task[];
  githubUrl?: string;
  liveUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  isOriginal?: boolean;
}

export interface RoadmapBlock {
  id: number; // 0..17
  phaseIndex: number; // 0..6
  startWeek: number;
  weekSpan: number;
  title: string;
  topics: string[];
  deliverable: string;
  selfTest?: string;
  isCustom?: boolean;
}

export interface RoadmapPhase {
  id: number; // 0..6
  title: string;
  description?: string;
  blocks: number[]; // block IDs
  isCustom?: boolean;
}

export interface WeeklyReview {
  blockId: number;
  isCompleted: boolean;
  completedAt?: string;
  selfTestResult: 'not_taken' | 'passed' | 'needs_revision';
  learned: string;
  struggled: string;
  revise: string;
  nextPriority: string;
}

export interface StudyBlockEntry {
  dayKey: string; // `${blockId}:${day}`
  date?: string; // YYYY-MM-DD
  checkedBlocks: boolean[]; // 5 blocks
  hoursStudied: number | string;
  notes: string;
}

export interface AppSettings {
  startDate: string; // YYYY-MM-DD
  dailyTargetHours: number;
  theme: 'dark' | 'light';
  viewMode?: 'compact' | 'comfortable';
}

export interface JSLessonState {
  completed: boolean;
  completedAt?: string;
  notes?: string;
  inDailyPlan?: boolean;
  dailyPlanDate?: string;
  exercisesCompleted?: Record<string, boolean>;
  selfAssessmentCompleted?: Record<number, boolean>;
  studyMinutes?: number;
}

export interface SpringBootLessonState {
  completed: boolean;
  completedAt?: string;
  notes?: string;
  inDailyPlan?: boolean;
  dailyPlanDate?: string;
  studyMinutes?: number;
}

export interface SpringBootProjectState {
  id: string;
  status: 'not_started' | 'in_progress' | 'done';
  githubUrl?: string;
  liveUrl?: string;
  notes?: string;
  completedChecklist: string[];
}

export interface SpringFrameworkLessonState {
  completed: boolean;
  completedAt?: string;
  notes?: string;
  inDailyPlan?: boolean;
}

export interface SpringFrameworkCustomVideo {
  id: string;
  moduleId: string;
  moduleNumber: number;
  videoIndex: number;
  title: string;
  isPlaceholder: boolean;
}

export type AITopicType = 'Concept' | 'Practice' | 'Code' | 'Project' | 'Advanced' | 'Production';

export interface AIRepositoryResource {
  title: string;
  url: string;
  type?: 'docs' | 'paper' | 'guide' | 'repo';
}

export interface AITopic {
  id: string; // e.g. 'ai-topic-1'
  number: number; // 1..20
  title: string;
  phase: string; // 'Phase 1'..'Phase 9'
  phaseNumber: number; // 1..9
  type: AITopicType;
  description: string;
  learningObjectives: string[];
  keyConcepts: string[];
  resources: AIRepositoryResource[];
  practiceExercises: string[];
}

export interface AITopicState {
  completed: boolean;
  completedAt?: string;
  notes?: string;
  inDailyPlan?: boolean;
  dailyPlanDate?: string;
  studyMinutes?: number;
}

export type NetworkPriority = 'must-know' | 'good-to-know' | 'standard';

export interface NetworkTopic {
  id: string; // e.g. 'net-t1'
  number: number; // 1..50
  levelNumber: number; // 1..5
  levelId: string; // 'level-1'..'level-5'
  levelTitle: string;
  title: string;
  description: string;
  priority?: NetworkPriority;
  keyPoints?: string[];
}

export interface NetworkLevel {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  description: string;
  topicIds: string[];
}

export interface NetworkTopicState {
  completed: boolean;
  completedAt?: string;
  notes?: string;
  inDailyPlan?: boolean;
  dailyPlanDate?: string;
}

export interface KairoStateV2 {
  version: 2;
  settings: AppSettings;
  projects: Project[];
  roadmapTasks: Record<string, Task>; // keyed by stable taskId e.g. curric-b0-t0
  customRoadmapBlocks?: RoadmapBlock[];
  customRoadmapPhases?: RoadmapPhase[];
  weeklyReviews: Record<number, WeeklyReview>;
  studyBlocks: Record<string, StudyBlockEntry>;
  jsRoadmap?: Record<string, JSLessonState>; // keyed by lesson.id e.g. 'js-lesson-1'
  springFrameworkRoadmap?: Record<string, SpringFrameworkLessonState>; // keyed by video.id e.g. 'sf-m1-v1'
  springFrameworkCustomVideos?: Record<string, SpringFrameworkCustomVideo[]>; // custom/imported videos per moduleId
  springBootRoadmap?: Record<string, SpringBootLessonState>;
  springBootProjects?: Record<string, SpringBootProjectState>;
  aiRoadmap?: Record<string, AITopicState>; // keyed by topic.id e.g. 'ai-topic-1'
  networkRoadmap?: Record<string, NetworkTopicState>; // keyed by topic.id e.g. 'net-t1'
  completedWeeks?: number[]; // list of manually completed week numbers
  selectedBlock: number;
  selectedDay: number;
  lastUpdated: string;
}

export interface ParsedImportPreview {
  projectTitle: string;
  projectDescription: string;
  technologies: string[];
  sections: {
    id: string;
    title: string;
    tasks: {
      id: string;
      title: string;
      description?: string;
      category: TaskCategory;
      status: TaskStatus;
      estimateMinutes?: number;
    }[];
  }[];
}
