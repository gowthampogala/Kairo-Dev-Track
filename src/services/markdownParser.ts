import { ParsedImportPreview, TaskCategory, TaskStatus } from '../types';

export const inferTaskCategory = (text: string): TaskCategory => {
  const lower = text.toLowerCase();
  if (/^(build|create|implement|design|scaffold|deploy|setup|integrate|code|add|configure)\b/i.test(lower)) {
    return 'Build';
  }
  if (/^(practise|practice|solve|exercise|drill|dsa|challenge|algorithm|problem)\b/i.test(lower)) {
    return 'Practise';
  }
  if (/^(test|verify|assert|debug|mock|validate|check)\b/i.test(lower)) {
    return 'Test';
  }
  if (/^(review|retrospective|cleanup|clean up|audit|refactor|revisit|summary)\b/i.test(lower)) {
    return 'Review';
  }
  return 'Learn';
};

export const extractMinutesEstimate = (text: string): number | undefined => {
  // Matches e.g. (45m), (1h), [30 min], 90 minutes, 2 hours
  const hrMatch = text.match(/\b(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/i);
  if (hrMatch) {
    return Math.round(parseFloat(hrMatch[1]) * 60);
  }
  const minMatch = text.match(/\b(\d+)\s*(?:minutes?|mins?|m)\b/i);
  if (minMatch) {
    return parseInt(minMatch[1], 10);
  }
  return undefined;
};

/**
 * Reliable local Markdown and plain text project parser
 */
export const parseMarkdownToProject = (rawText: string): ParsedImportPreview => {
  const lines = rawText.split(/\r?\n/);

  let projectTitle = '';
  let projectDescription = '';
  const techSet = new Set<string>();

  interface RawSection {
    id: string;
    title: string;
    tasks: Array<{
      id: string;
      title: string;
      description?: string;
      category: TaskCategory;
      status: TaskStatus;
      estimateMinutes?: number;
    }>;
  }

  const sections: RawSection[] = [];
  let currentSection: RawSection | null = null;

  const ensureSection = (title = 'General Tasks') => {
    if (!currentSection) {
      currentSection = {
        id: `sec-${Date.now()}-${sections.length}`,
        title,
        tasks: []
      };
      sections.push(currentSection);
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) continue;

    // 1. Detect H1: Project Title
    if (line.startsWith('# ') && !projectTitle) {
      projectTitle = line.replace(/^#\s+/, '').trim();
      continue;
    }

    // 2. Detect H2 or H3: Section / Milestone
    if (line.startsWith('## ') || line.startsWith('### ')) {
      const secTitle = line.replace(/^#{2,3}\s+/, '').trim();
      currentSection = {
        id: `sec-${Date.now()}-${sections.length}`,
        title: secTitle,
        tasks: []
      };
      sections.push(currentSection);
      continue;
    }

    // 3. Detect Task Item (Bullets, Checkboxes, Numbered lists)
    const checkboxMatch = line.match(/^[-*+]\s+\[([ xX])\]\s+(.*)$/);
    const bulletMatch = line.match(/^[-*+]\s+(.*)$/);
    const numberMatch = line.match(/^\d+[\.\)]\s+(.*)$/);

    if (checkboxMatch || bulletMatch || numberMatch) {
      ensureSection();

      let isDone = false;
      let taskContent = '';

      if (checkboxMatch) {
        isDone = checkboxMatch[1].toLowerCase() === 'x';
        taskContent = checkboxMatch[2].trim();
      } else if (bulletMatch) {
        taskContent = bulletMatch[1].trim();
      } else if (numberMatch) {
        taskContent = numberMatch[1].trim();
      }

      // Extract estimate
      const estimate = extractMinutesEstimate(taskContent);
      // Clean up bracketed estimate from title if desired, or leave intact
      const category = inferTaskCategory(taskContent);

      currentSection!.tasks.push({
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title: taskContent,
        category,
        status: isDone ? 'done' : 'todo',
        estimateMinutes: estimate
      });
      continue;
    }

    // 4. Non-heading, non-bullet text:
    // If we haven't set a project description, or if it's under a heading, preserve it!
    if (!projectTitle) {
      projectTitle = line;
    } else if (!projectDescription) {
      projectDescription = line;
    } else {
      // Preserve as text note or task rather than silently discarding
      ensureSection();
      currentSection!.tasks.push({
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title: line,
        category: inferTaskCategory(line),
        status: 'todo'
      });
    }
  }

  // Fallbacks if input was minimal
  if (!projectTitle) {
    projectTitle = 'Untitled Learning Project';
  }

  // Ensure at least one section exists if tasks were parsed
  if (sections.length === 0) {
    sections.push({
      id: `sec-${Date.now()}-0`,
      title: 'Milestones & Tasks',
      tasks: []
    });
  }

  // Extract common tech tags from title and content
  const commonTech = ['React', 'Java', 'Spring Boot', 'TypeScript', 'JavaScript', 'Python', 'SQL', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'HTML', 'CSS'];
  commonTech.forEach(tech => {
    if (new RegExp(`\\b${tech}\\b`, 'i').test(rawText)) {
      techSet.add(tech);
    }
  });

  return {
    projectTitle,
    projectDescription: projectDescription || 'Created from pasted notes & curriculum plan.',
    technologies: Array.from(techSet),
    sections
  };
};
