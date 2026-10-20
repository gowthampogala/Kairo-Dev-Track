export interface AcademyVideo {
  id: string; // stable identifier e.g. 'sf-m1-v1'
  moduleId: string; // e.g. 'sf-mod-1'
  moduleNumber: number; // 1..8
  videoIndex: number; // 1..N
  title: string;
  isPlaceholder: boolean;
}

export interface AcademyModule {
  id: string; // e.g. 'sf-mod-1'
  moduleNumber: number; // 1..8
  title: string;
  lessonsCount: number;
  duration: string;
  durationMinutes: number;
  pages?: number;
  defaultVideos: AcademyVideo[];
}

export const SPRING_FRAMEWORK_MODULES: AcademyModule[] = [
  {
    id: 'sf-mod-1',
    moduleNumber: 1,
    title: 'Springs Introduction',
    lessonsCount: 5,
    duration: '30 mins',
    durationMinutes: 30,
    pages: 20,
    defaultVideos: [
      { id: 'sf-m1-v1', moduleId: 'sf-mod-1', moduleNumber: 1, videoIndex: 1, title: 'Video 1', isPlaceholder: true },
      { id: 'sf-m1-v2', moduleId: 'sf-mod-1', moduleNumber: 1, videoIndex: 2, title: 'Video 2', isPlaceholder: true },
      { id: 'sf-m1-v3', moduleId: 'sf-mod-1', moduleNumber: 1, videoIndex: 3, title: 'Video 3', isPlaceholder: true },
      { id: 'sf-m1-v4', moduleId: 'sf-mod-1', moduleNumber: 1, videoIndex: 4, title: 'Video 4', isPlaceholder: true },
      { id: 'sf-m1-v5', moduleId: 'sf-mod-1', moduleNumber: 1, videoIndex: 5, title: 'Video 5', isPlaceholder: true }
    ]
  },
  {
    id: 'sf-mod-2',
    moduleNumber: 2,
    title: 'Inversion of control',
    lessonsCount: 4,
    duration: '30 mins',
    durationMinutes: 30,
    pages: 9,
    defaultVideos: [
      { id: 'sf-m2-v1', moduleId: 'sf-mod-2', moduleNumber: 2, videoIndex: 1, title: 'Video 1', isPlaceholder: true },
      { id: 'sf-m2-v2', moduleId: 'sf-mod-2', moduleNumber: 2, videoIndex: 2, title: 'Video 2', isPlaceholder: true },
      { id: 'sf-m2-v3', moduleId: 'sf-mod-2', moduleNumber: 2, videoIndex: 3, title: 'Video 3', isPlaceholder: true },
      { id: 'sf-m2-v4', moduleId: 'sf-mod-2', moduleNumber: 2, videoIndex: 4, title: 'Video 4', isPlaceholder: true }
    ]
  },
  {
    id: 'sf-mod-3',
    moduleNumber: 3,
    title: 'Dependency Injection',
    lessonsCount: 4,
    duration: '56 mins',
    durationMinutes: 56,
    pages: 17,
    defaultVideos: [
      { id: 'sf-m3-v1', moduleId: 'sf-mod-3', moduleNumber: 3, videoIndex: 1, title: 'Video 1', isPlaceholder: true },
      { id: 'sf-m3-v2', moduleId: 'sf-mod-3', moduleNumber: 3, videoIndex: 2, title: 'Video 2', isPlaceholder: true },
      { id: 'sf-m3-v3', moduleId: 'sf-mod-3', moduleNumber: 3, videoIndex: 3, title: 'Video 3', isPlaceholder: true },
      { id: 'sf-m3-v4', moduleId: 'sf-mod-3', moduleNumber: 3, videoIndex: 4, title: 'Video 4', isPlaceholder: true }
    ]
  },
  {
    id: 'sf-mod-4',
    moduleNumber: 4,
    title: 'Scope of a Bean',
    lessonsCount: 2,
    duration: '9 mins',
    durationMinutes: 9,
    pages: 3,
    defaultVideos: [
      { id: 'sf-m4-v1', moduleId: 'sf-mod-4', moduleNumber: 4, videoIndex: 1, title: 'Video 1', isPlaceholder: true },
      { id: 'sf-m4-v2', moduleId: 'sf-mod-4', moduleNumber: 4, videoIndex: 2, title: 'Video 2', isPlaceholder: true }
    ]
  },
  {
    id: 'sf-mod-5',
    moduleNumber: 5,
    title: 'Bean Lifecycle',
    lessonsCount: 3,
    duration: '16 mins',
    durationMinutes: 16,
    pages: 10,
    defaultVideos: [
      { id: 'sf-m5-v1', moduleId: 'sf-mod-5', moduleNumber: 5, videoIndex: 1, title: 'Video 1', isPlaceholder: true },
      { id: 'sf-m5-v2', moduleId: 'sf-mod-5', moduleNumber: 5, videoIndex: 2, title: 'Video 2', isPlaceholder: true },
      { id: 'sf-m5-v3', moduleId: 'sf-mod-5', moduleNumber: 5, videoIndex: 3, title: 'Video 3', isPlaceholder: true }
    ]
  },
  {
    id: 'sf-mod-6',
    moduleNumber: 6,
    title: 'Annotations',
    lessonsCount: 13,
    duration: '1 Hr 14 mins',
    durationMinutes: 74,
    pages: 34,
    defaultVideos: Array.from({ length: 13 }, (_, i) => ({
      id: `sf-m6-v${i + 1}`,
      moduleId: 'sf-mod-6',
      moduleNumber: 6,
      videoIndex: i + 1,
      title: `Video ${i + 1}`,
      isPlaceholder: true
    }))
  },
  {
    id: 'sf-mod-7',
    moduleNumber: 7,
    title: 'Java Configuration File',
    lessonsCount: 2,
    duration: '9 mins',
    durationMinutes: 9,
    pages: 3,
    defaultVideos: [
      { id: 'sf-m7-v1', moduleId: 'sf-mod-7', moduleNumber: 7, videoIndex: 1, title: 'Video 1', isPlaceholder: true },
      { id: 'sf-m7-v2', moduleId: 'sf-mod-7', moduleNumber: 7, videoIndex: 2, title: 'Video 2', isPlaceholder: true }
    ]
  },
  {
    id: 'sf-mod-8',
    moduleNumber: 8,
    title: 'Revision of all spring core concepts',
    lessonsCount: 1,
    duration: '7 mins',
    durationMinutes: 7,
    // Pages not shown in screenshot
    defaultVideos: [
      { id: 'sf-m8-v1', moduleId: 'sf-mod-8', moduleNumber: 8, videoIndex: 1, title: 'Video 1', isPlaceholder: true }
    ]
  }
];

export const TOTAL_ACADEMY_MODULES = SPRING_FRAMEWORK_MODULES.length; // 8

export const TOTAL_ACADEMY_LESSONS = SPRING_FRAMEWORK_MODULES.reduce(
  (acc, m) => acc + m.lessonsCount,
  0
); // 34

export const TOTAL_ACADEMY_DURATION_LABEL = '3 Hr 51 mins';

export const TOTAL_ACADEMY_PAGES = SPRING_FRAMEWORK_MODULES.reduce(
  (acc, m) => acc + (m.pages || 0),
  0
); // 96
