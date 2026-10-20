import { RoadmapPhase, RoadmapBlock, Task, Project } from '../types';

export const PHASES: RoadmapPhase[] = [
  { id: 0, title: 'Frontend development', description: 'Modern JavaScript, ES6+, asynchronous programming, and React ecosystem fundamentals.', blocks: [0, 1, 2] },
  { id: 1, title: 'Java strengthening', description: 'Core Java mastery, modern functional features, generics, concurrency, and unit testing.', blocks: [3] },
  { id: 2, title: 'Spring Boot backend', description: 'REST APIs, Spring Data JPA, database integration, validation, automated testing, and cloud deployment.', blocks: [4, 5, 6, 7, 8] },
  { id: 3, title: 'Security and full-stack integration', description: 'Spring Security, JWT authentication, RBAC, CORS, secure full-stack React integration.', blocks: [9, 10, 11] },
  { id: 4, title: 'AI engineering foundations', description: 'LLMs, prompt engineering, embeddings, pgvector, and Retrieval-Augmented Generation (RAG).', blocks: [12, 13, 14] },
  { id: 5, title: 'AI full-stack capstone', description: 'End-to-end AI document assistant with vector search, authentication, Docker, and CI/CD.', blocks: [15, 16] },
  { id: 6, title: 'Interview preparation', description: 'Data structures, algorithms, system design, portfolio presentation, and technical mock interviews.', blocks: [17] }
];

export interface RawBlockData {
  p: number; // phase index
  s: number; // start week
  n: number; // week span
  t: string; // title
  topics: string[];
  deliverable: string;
  selfTest?: string;
}

export const RAW_BLOCKS: RawBlockData[] = [
  {
    p: 0, s: 1, n: 1, t: 'JavaScript fundamentals',
    topics: [
      'Variables, data types, operators and type conversion',
      'Conditions, loops, functions and scope',
      'Arrays, objects and strings',
      'Destructuring, spread/rest and modules',
      'map, filter, find, reduce and array transformations',
      'DOM manipulation and event handling'
    ],
    deliverable: 'Build an interactive JavaScript application without copying a complete tutorial',
    selfTest: 'Transform an array of objects and render the result on a webpage'
  },
  {
    p: 0, s: 2, n: 1, t: 'Asynchronous JavaScript and React foundations',
    topics: [
      'Promises and async/await',
      'fetch, HTTP requests and JSON',
      'Error handling with try/catch',
      'React components and JSX',
      'Props, state and event handling',
      'Conditional rendering, lists and keys'
    ],
    deliverable: 'Build a React app that fetches public API data and handles loading, success and error states'
  },
  {
    p: 0, s: 3, n: 1, t: 'React application development',
    topics: [
      'useState and useEffect',
      'Forms and controlled inputs',
      'React Router',
      'Reusable components and basic custom hooks',
      'API integration and component organization',
      'Responsive CSS and basic accessibility'
    ],
    deliverable: 'Build a multi-page task manager or learning tracker with add, edit, delete and filter features',
    selfTest: 'Rebuild the core features without following a tutorial'
  },
  {
    p: 1, s: 4, n: 1, t: 'Modern Java and testing',
    topics: [
      'Lambdas and functional interfaces',
      'Streams and common stream operations',
      'Generics and exception handling',
      'equals and hashCode contracts',
      'Object-oriented programming revision',
      'Basic concurrency concepts',
      'Maven and JUnit fundamentals',
      'JDBC and prepared statements'
    ],
    deliverable: 'Build a tested Java program that processes collections and reads or writes data through JDBC',
    selfTest: 'Solve collection problems, create a custom exception and write unit tests'
  },
  {
    p: 2, s: 5, n: 1, t: 'Spring Boot fundamentals',
    topics: [
      'Project structure and Maven',
      'Dependency injection and configuration',
      'Controllers, services and repositories',
      'REST APIs, JSON and HTTP methods',
      'HTTP status codes and API design'
    ],
    deliverable: 'Build a REST API with a controller-service-repository structure'
  },
  {
    p: 2, s: 6, n: 1, t: 'Database integration',
    topics: [
      'MySQL or PostgreSQL',
      'Spring Data JPA and Hibernate',
      'Entities, primary keys and relationships',
      'CRUD operations and pagination',
      'SQL joins, indexes and transactions'
    ],
    deliverable: 'Build a persistent API with related database entities and pagination'
  },
  {
    p: 2, s: 7, n: 1, t: 'Reliable API development',
    topics: [
      'DTOs and request/response design',
      'Bean Validation',
      'Global exception handling',
      'Transactions and data consistency',
      'Logging and environment-based configuration'
    ],
    deliverable: 'An API with meaningful validation errors and appropriate HTTP responses'
  },
  {
    p: 2, s: 8, n: 1, t: 'Testing and database performance',
    topics: [
      'JUnit and Mockito',
      'Unit and integration testing',
      'Repository and API tests',
      'SQL logging and query analysis',
      'Detecting and fixing N+1 query problems'
    ],
    deliverable: 'A tested API with reliable critical endpoints and no known avoidable N+1 issues'
  },
  {
    p: 2, s: 9, n: 1, t: 'First deployment',
    topics: [
      'Production builds and runtime configuration',
      'Environment variables and secrets',
      'Production database configuration',
      'Basic Linux commands and application logs',
      'Deploy the backend to a suitable hosting service'
    ],
    deliverable: 'A live API with a README and documented endpoints'
  },
  {
    p: 3, s: 10, n: 1, t: 'Authentication',
    topics: [
      'Spring Security fundamentals',
      'Password hashing',
      'Registration and login flows',
      'Authentication versus authorization',
      'Sessions and JWT concepts'
    ],
    deliverable: 'Secure registration and login with hashed passwords'
  },
  {
    p: 3, s: 11, n: 1, t: 'Authorization and web security',
    topics: [
      'JWT validation and expiration',
      'Role-based access control',
      'Protected endpoints',
      'CORS and secure configuration',
      'SQL injection and broken access control',
      'Security testing and error handling'
    ],
    deliverable: 'Users can access only resources they are authorized to use'
  },
  {
    p: 3, s: 12, n: 1, t: 'Complete full-stack application',
    topics: [
      'Connect React to Spring Boot',
      'Login, logout and protected pages',
      'Form validation and error messages',
      'Test important user flows',
      'Responsive UI, deployment and documentation'
    ],
    deliverable: 'A deployed full-stack application with authentication, CRUD, database persistence and tests'
  },
  {
    p: 4, s: 13, n: 1, t: 'LLM fundamentals',
    topics: [
      'Tokens and context windows',
      'Prompt design and structured outputs',
      'LLM API integration',
      'Basic Python needed for AI experiments',
      'Streaming and tool/function calling concepts',
      'Timeouts, retries, rate limits and API costs'
    ],
    deliverable: 'An AI utility that calls an LLM API and returns structured results'
  },
  {
    p: 4, s: 14, n: 1, t: 'Embeddings and semantic retrieval',
    topics: [
      'Embeddings and semantic similarity',
      'Document chunking',
      'Vector search and metadata filtering',
      'PostgreSQL with pgvector or an equivalent vector database',
      'Evaluate retrieval relevance'
    ],
    deliverable: 'Search a collection of documents and return relevant passages'
  },
  {
    p: 4, s: 15, n: 1, t: 'Retrieval-augmented generation',
    topics: [
      'RAG architecture',
      'Retrieval and context construction',
      'Answer generation grounded in retrieved information',
      'Citations and hallucination checks',
      'Evaluation and basic prompt-injection awareness',
      'AI privacy and handling sensitive information'
    ],
    deliverable: 'A document question-answering prototype that displays supporting source passages'
  },
  {
    p: 5, s: 16, n: 2, t: 'Build the capstone',
    topics: [
      'React user interface',
      'Spring Boot API and relational database',
      'LLM integration through the backend',
      'Document ingestion and retrieval',
      'Authentication and access control',
      'Add tool calling only when it solves a real problem'
    ],
    deliverable: 'A working end-to-end AI application'
  },
  {
    p: 5, s: 18, n: 2, t: 'Production readiness',
    topics: [
      'Docker and Docker Compose',
      'Automated build and test pipeline',
      'Deployment, logging and error handling',
      'Security review and environment configuration',
      'Edge-case testing and UI improvements',
      'Architecture documentation and README'
    ],
    deliverable: 'A deployed capstone with a live link, source code, setup instructions and an architecture explanation'
  },
  {
    p: 6, s: 20, n: 1, t: 'Job readiness',
    topics: [
      'Java, OOP, collections and exception revision',
      'SQL, DBMS and networking revision',
      'DSA practice and complexity analysis',
      'Technical and HR mock interviews',
      'Resume and GitHub cleanup',
      'Practise explaining project decisions in English'
    ],
    deliverable: 'A polished portfolio, a project presentation and a list of topics to revise before interviews'
  }
];

export const ROADMAP_BLOCKS: RoadmapBlock[] = RAW_BLOCKS.map((b, i) => ({
  id: i,
  phaseIndex: b.p,
  startWeek: b.s,
  weekSpan: b.n,
  title: b.t,
  topics: b.topics,
  deliverable: b.deliverable,
  selfTest: b.selfTest
}));

export const formatWeekLabel = (b: { startWeek: number; weekSpan: number } | RoadmapBlock) =>
  b.weekSpan > 1 ? `Weeks ${b.startWeek}–${b.startWeek + b.weekSpan - 1}` : `Week ${b.startWeek}`;

export const inferCategory = (title: string): 'Learn' | 'Practise' | 'Build' | 'Test' | 'Review' => {
  if (/^(Deploy|Connect|Add |Docker|Automated|Production|Build|Implement|Scaffold)/i.test(title)) return 'Build';
  if (/revision|mock|practi|DSA|Evaluate|Detect|Solve/i.test(title)) return 'Practise';
  if (/test|verify|assert|debug/i.test(title)) return 'Test';
  if (/review|cleanup|audit|retrospective|optimize/i.test(title)) return 'Review';
  return 'Learn';
};

export const generateDefaultRoadmapTasks = (): Record<string, Task> => {
  const tasks: Record<string, Task> = {};

  RAW_BLOCKS.forEach((block, bIdx) => {
    const totalDays = 6 * block.n;
    const items: Array<{ title: string; isDeliv?: boolean; isSelfTest?: boolean }> = [
      ...block.topics.map(t => ({ title: t })),
      { title: `Deliverable: ${block.deliverable}`, isDeliv: true },
      ...(block.selfTest ? [{ title: `Self-test: ${block.selfTest}`, isSelfTest: true }] : [])
    ];

    items.forEach((item, k) => {
      const q = Math.floor(k * totalDays / items.length);
      const day = q + Math.floor(q / 6) + 1; // 6 days per week, day 7 is rest
      const id = `curric-b${bIdx}-t${k}`;
      const legacyId = `${bIdx}.${k}`;

      tasks[id] = {
        id,
        title: item.title,
        category: item.isDeliv ? 'Build' : item.isSelfTest ? 'Test' : inferCategory(item.title),
        status: 'todo',
        roadmapPhaseId: block.p,
        roadmapBlockId: bIdx,
        roadmapDay: day,
        isDeliverable: item.isDeliv,
        isSelfTest: item.isSelfTest,
        notes: `Legacy ID: ${legacyId}`
      };
    });
  });

  return tasks;
};

export const STUDY_BLOCK_DEFINITIONS = [
  { name: 'Main learning', minutes: 150 },
  { name: 'Project work', minutes: 90 },
  { name: 'DSA and SQL', minutes: 45 },
  { name: 'AI or computer science fundamentals', minutes: 45 },
  { name: 'English speaking and revision', minutes: 30 }
];

export const getStudyBlockName = (blockIndex: number, studyBlockIndex: number): string => {
  if (studyBlockIndex === 3 && RAW_BLOCKS[blockIndex].s >= 5) {
    return 'AI learning (supporting track)';
  }
  return STUDY_BLOCK_DEFINITIONS[studyBlockIndex].name;
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-react-api',
    title: 'React API application',
    description: 'Build a production-quality React app consuming a public API with routing, forms, validation, and clean state handling.',
    technologies: ['React', 'JavaScript', 'React Router', 'Fetch API', 'CSS Modules'],
    status: 'not_started',
    isOriginal: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      { id: 'sec-react-core', title: 'Core Implementation', order: 0 }
    ],
    tasks: [
      { id: 'proj-react-t0', projectId: 'proj-react-api', sectionId: 'sec-react-core', title: 'Scaffold app and routing structure', category: 'Build', status: 'todo' },
      { id: 'proj-react-t1', projectId: 'proj-react-api', sectionId: 'sec-react-core', title: 'Fetch and render public API data with error boundaries', category: 'Build', status: 'todo' },
      { id: 'proj-react-t2', projectId: 'proj-react-api', sectionId: 'sec-react-core', title: 'Handle loading, empty, and error states gracefully', category: 'Build', status: 'todo' },
      { id: 'proj-react-t3', projectId: 'proj-react-api', sectionId: 'sec-react-core', title: 'Implement forms with controlled inputs and CRUD interactions', category: 'Build', status: 'todo' },
      { id: 'proj-react-t4', projectId: 'proj-react-api', sectionId: 'sec-react-core', title: 'Responsive styling, keyboard accessibility and semantic HTML', category: 'Review', status: 'todo' },
      { id: 'proj-react-t5', projectId: 'proj-react-api', sectionId: 'sec-react-core', title: 'Deploy live to Vercel/Netlify and write comprehensive README', category: 'Build', status: 'todo' }
    ]
  },
  {
    id: 'proj-spring-api',
    title: 'Java and Spring Boot REST API',
    description: 'Design a persistent, validated, and thoroughly tested REST API using Spring Boot, Hibernate, and relational databases.',
    technologies: ['Java 17', 'Spring Boot', 'Spring Data JPA', 'PostgreSQL / MySQL', 'JUnit 5', 'Mockito'],
    status: 'not_started',
    isOriginal: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      { id: 'sec-spring-core', title: 'API & Persistence', order: 0 }
    ],
    tasks: [
      { id: 'proj-spring-t0', projectId: 'proj-spring-api', sectionId: 'sec-spring-core', title: 'Implement Controller-Service-Repository architecture pattern', category: 'Build', status: 'todo' },
      { id: 'proj-spring-t1', projectId: 'proj-spring-api', sectionId: 'sec-spring-core', title: 'Model entities, primary keys and JPA relationships (OneToMany, ManyToOne)', category: 'Build', status: 'todo' },
      { id: 'proj-spring-t2', projectId: 'proj-spring-api', sectionId: 'sec-spring-core', title: 'Create DTOs with Bean Validation annotations', category: 'Build', status: 'todo' },
      { id: 'proj-spring-t3', projectId: 'proj-spring-api', sectionId: 'sec-spring-core', title: 'Implement @ControllerAdvice global exception handling', category: 'Build', status: 'todo' },
      { id: 'proj-spring-t4', projectId: 'proj-spring-api', sectionId: 'sec-spring-core', title: 'Write comprehensive JUnit 5 and Mockito unit and integration tests', category: 'Test', status: 'todo' },
      { id: 'proj-spring-t5', projectId: 'proj-spring-api', sectionId: 'sec-spring-core', title: 'Deploy backend, verify N+1 queries, and document Swagger endpoints', category: 'Build', status: 'todo' }
    ]
  },
  {
    id: 'proj-fullstack-auth',
    title: 'Full-stack application with authentication',
    description: 'React front-end paired with Spring Security, stateless JWT authentication, and role-based endpoint protection.',
    technologies: ['React', 'Spring Boot', 'Spring Security', 'JWT', 'PostgreSQL', 'Docker'],
    status: 'not_started',
    isOriginal: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      { id: 'sec-auth-core', title: 'Fullstack Security Pipeline', order: 0 }
    ],
    tasks: [
      { id: 'proj-auth-t0', projectId: 'proj-fullstack-auth', sectionId: 'sec-auth-core', title: 'User registration, login, and BCrypt password hashing', category: 'Build', status: 'todo' },
      { id: 'proj-auth-t1', projectId: 'proj-fullstack-auth', sectionId: 'sec-auth-core', title: 'Stateless JWT generation, validation, and expiration filter', category: 'Build', status: 'todo' },
      { id: 'proj-auth-t2', projectId: 'proj-fullstack-auth', sectionId: 'sec-auth-core', title: 'Role-based access control (RBAC) and protected endpoints', category: 'Build', status: 'todo' },
      { id: 'proj-auth-t3', projectId: 'proj-fullstack-auth', sectionId: 'sec-auth-core', title: 'Authenticated CRUD flows with relational database persistence', category: 'Build', status: 'todo' },
      { id: 'proj-auth-t4', projectId: 'proj-fullstack-auth', sectionId: 'sec-auth-core', title: 'End-to-end user flow testing and secure token storage in cookies', category: 'Test', status: 'todo' },
      { id: 'proj-auth-t5', projectId: 'proj-fullstack-auth', sectionId: 'sec-auth-core', title: 'Deploy front-end and backend with production CORS configuration', category: 'Build', status: 'todo' }
    ]
  },
  {
    id: 'proj-ai-capstone',
    title: 'AI-enabled full-stack capstone',
    description: 'End-to-end intelligent document question-answering system with semantic vector search and grounded responses.',
    technologies: ['React', 'Spring Boot / FastAPI', 'PostgreSQL pgvector', 'OpenAI / Claude API', 'Docker Compose'],
    status: 'not_started',
    isOriginal: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      { id: 'sec-ai-core', title: 'RAG Pipeline & Production', order: 0 }
    ],
    tasks: [
      { id: 'proj-ai-t0', projectId: 'proj-ai-capstone', sectionId: 'sec-ai-core', title: 'Document ingestion, PDF/Markdown parsing, and text chunking', category: 'Build', status: 'todo' },
      { id: 'proj-ai-t1', projectId: 'proj-ai-capstone', sectionId: 'sec-ai-core', title: 'Vector embeddings generation and pgvector similarity index', category: 'Build', status: 'todo' },
      { id: 'proj-ai-t2', projectId: 'proj-ai-capstone', sectionId: 'sec-ai-core', title: 'RAG generation pipeline grounded in retrieved chunks with citations', category: 'Build', status: 'todo' },
      { id: 'proj-ai-t3', projectId: 'proj-ai-capstone', sectionId: 'sec-ai-core', title: 'User authentication, document permission limits, and chat session history', category: 'Build', status: 'todo' },
      { id: 'proj-ai-t4', projectId: 'proj-ai-capstone', sectionId: 'sec-ai-core', title: 'Docker Compose orchestration and automated test suite', category: 'Build', status: 'todo' },
      { id: 'proj-ai-t5', projectId: 'proj-ai-capstone', sectionId: 'sec-ai-core', title: 'Cloud deployment, architecture documentation diagram, and demo video', category: 'Review', status: 'todo' }
    ]
  }
];
