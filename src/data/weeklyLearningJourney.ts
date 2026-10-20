import { KairoStateV2 } from '../types';
import { calculateBlockProgress } from '../services/progress';

export interface WeeklyJourneyItem {
  weekNumber: number;
  phaseId: number;
  phaseTitle: string;
  phaseSubtitle: string;
  title: string;
  technologies: string[];
  focus: string;
  deliverable: string;
  relatedRoadmap?: {
    title: string;
    page: 'js-roadmap' | 'spring-framework' | 'ai-roadmap' | 'network-roadmap' | 'projects';
  };
  blockIndex: number;
}

export const WEEKLY_JOURNEY: WeeklyJourneyItem[] = [
  // Phase 1 — Frontend Development (Weeks 1–3)
  {
    weekNumber: 1,
    phaseId: 0,
    phaseTitle: 'Phase 1 — Frontend Development',
    phaseSubtitle: 'Modern JavaScript, ES6+, asynchronous programming, and React ecosystem fundamentals.',
    title: 'JavaScript Fundamentals',
    technologies: ['JavaScript ES6+', 'Data Types', 'Closures', 'Arrays & Objects', 'DOM API'],
    focus: 'JavaScript syntax, primitive vs reference types, functions, lexical scoping, closures, array transformations (map, filter, reduce), and event-driven DOM programming.',
    deliverable: 'Build an interactive JavaScript application without copying a complete tutorial.',
    relatedRoadmap: { title: 'Open JavaScript Roadmap', page: 'js-roadmap' },
    blockIndex: 0
  },
  {
    weekNumber: 2,
    phaseId: 0,
    phaseTitle: 'Phase 1 — Frontend Development',
    phaseSubtitle: 'Modern JavaScript, ES6+, asynchronous programming, and React ecosystem fundamentals.',
    title: 'Modern JavaScript and Asynchronous Programming',
    technologies: ['Promises', 'async/await', 'Fetch API', 'React JSX', 'Props', 'Component State'],
    focus: 'Event loop, asynchronous programming with Promises and async/await, HTTP requests, error handling with try/catch, React component foundations, JSX, and unidirectional data flow.',
    deliverable: 'Build an asynchronous React application that consumes a public REST API with loading, success, and error handling states.',
    relatedRoadmap: { title: 'Open JavaScript Roadmap', page: 'js-roadmap' },
    blockIndex: 1
  },
  {
    weekNumber: 3,
    phaseId: 0,
    phaseTitle: 'Phase 1 — Frontend Development',
    phaseSubtitle: 'Modern JavaScript, ES6+, asynchronous programming, and React ecosystem fundamentals.',
    title: 'React Foundations & Application Development',
    technologies: ['React Hooks', 'useState', 'useEffect', 'React Router', 'Controlled Forms'],
    focus: 'Stateful React development, component lifecycle with hooks, controlled inputs, multi-page client routing with React Router, reusable component architecture, and responsive CSS.',
    deliverable: 'Build a multi-page task manager or learning tracker with add, edit, delete, and filter features.',
    relatedRoadmap: { title: 'Open JavaScript Roadmap', page: 'js-roadmap' },
    blockIndex: 2
  },

  // Phase 2 — Java Strengthening (Week 4)
  {
    weekNumber: 4,
    phaseId: 1,
    phaseTitle: 'Phase 2 — Java Strengthening',
    phaseSubtitle: 'Core Java mastery, modern functional features, generics, concurrency, and unit testing.',
    title: 'Java and Development Foundations',
    technologies: ['Java 17+', 'Lambdas', 'Streams API', 'Generics', 'JUnit 5', 'JDBC'],
    focus: 'Core Java revision, lambda expressions, Streams pipeline transformations, generic type parameters, custom exceptions, equals/hashCode contracts, Maven dependency management, and JDBC database access.',
    deliverable: 'Write and test a maintainable Java application that processes collections and reads/writes relational data through JDBC with JUnit test suites.',
    relatedRoadmap: { title: 'Open Spring Framework', page: 'spring-framework' },
    blockIndex: 3
  },

  // Phase 3 — Spring Boot Backend (Weeks 5–9)
  {
    weekNumber: 5,
    phaseId: 2,
    phaseTitle: 'Phase 3 — Spring Boot Backend',
    phaseSubtitle: 'REST APIs, Spring Data JPA, database integration, validation, automated testing, and cloud deployment.',
    title: 'Spring Boot Fundamentals',
    technologies: ['Spring Boot 3', 'Dependency Injection', 'IoC Container', 'REST APIs', 'Spring MVC'],
    focus: 'Spring Boot auto-configuration, application context, @Component, @Service, @Repository, @RestController, request mapping, HTTP methods, and clean controller-service-repository architecture.',
    deliverable: 'Build a production-structured REST API implementing clean controller-service-repository patterns and proper HTTP response design.',
    relatedRoadmap: { title: 'Open Spring Framework', page: 'spring-framework' },
    blockIndex: 4
  },
  {
    weekNumber: 6,
    phaseId: 2,
    phaseTitle: 'Phase 3 — Spring Boot Backend',
    phaseSubtitle: 'REST APIs, Spring Data JPA, database integration, validation, automated testing, and cloud deployment.',
    title: 'Database Integration with Spring Data JPA',
    technologies: ['Spring Data JPA', 'Hibernate ORM', 'PostgreSQL / MySQL', 'Entities', 'Pagination'],
    focus: 'Object-Relational Mapping (ORM), JPA entity lifecycles, primary keys, @OneToMany, @ManyToOne relationships, derived queries, @Query annotations, pagination, and database transactions.',
    deliverable: 'Build a persistent API with related relational database entities, cascade operations, and paginated query endpoints.',
    relatedRoadmap: { title: 'Open Spring Framework', page: 'spring-framework' },
    blockIndex: 5
  },
  {
    weekNumber: 7,
    phaseId: 2,
    phaseTitle: 'Phase 3 — Spring Boot Backend',
    phaseSubtitle: 'REST APIs, Spring Data JPA, database integration, validation, automated testing, and cloud deployment.',
    title: 'Reliable API Design & Validation',
    technologies: ['DTO Pattern', 'Bean Validation', '@RestControllerAdvice', 'Transactions', 'Logging'],
    focus: 'Decoupling entities from API contracts using DTOs, request validation using Jakarta annotations, centralized exception translation with @RestControllerAdvice, transactional consistency, and structured logging.',
    deliverable: 'An API with meaningful validation errors, standardized error responses, and appropriate HTTP status codes.',
    relatedRoadmap: { title: 'Open Spring Framework', page: 'spring-framework' },
    blockIndex: 6
  },
  {
    weekNumber: 8,
    phaseId: 2,
    phaseTitle: 'Phase 3 — Spring Boot Backend',
    phaseSubtitle: 'REST APIs, Spring Data JPA, database integration, validation, automated testing, and cloud deployment.',
    title: 'Automated Testing & Database Performance',
    technologies: ['JUnit 5', 'Mockito', '@SpringBootTest', 'MockMvc', 'SQL Optimization'],
    focus: 'Unit testing business logic with Mockito, integration testing web endpoints with MockMvc, SQL logging and query analysis, eliminating Hibernate N+1 query bottlenecks, and database indexing strategies.',
    deliverable: 'A tested API with reliable critical endpoints and no known avoidable N+1 query issues.',
    relatedRoadmap: { title: 'Open Spring Framework', page: 'spring-framework' },
    blockIndex: 7
  },
  {
    weekNumber: 9,
    phaseId: 2,
    phaseTitle: 'Phase 3 — Spring Boot Backend',
    phaseSubtitle: 'REST APIs, Spring Data JPA, database integration, validation, automated testing, and cloud deployment.',
    title: 'Production Packaging & First Deployment',
    technologies: ['Maven Packaging', 'Spring Profiles', 'Environment Secrets', 'Cloud Hosting'],
    focus: 'Production JAR packaging, multi-environment runtime configuration, externalizing secrets via environment variables, cloud database provisioning, Linux server basics, and reviewing application logs.',
    deliverable: 'A live, publicly deployed backend API with documented endpoints and a comprehensive README.',
    relatedRoadmap: { title: 'Open Spring Framework', page: 'spring-framework' },
    blockIndex: 8
  },

  // Phase 4 — Security and Full-Stack Integration (Weeks 10–12)
  {
    weekNumber: 10,
    phaseId: 3,
    phaseTitle: 'Phase 4 — Security and Full-Stack Integration',
    phaseSubtitle: 'Spring Security, JWT authentication, RBAC, CORS, secure full-stack React integration.',
    title: 'Spring Security & Authentication',
    technologies: ['Spring Security 6', 'BCrypt', 'SecurityFilterChain', 'UserDetailsService'],
    focus: 'Security architecture, servlet filter chain interception, cryptographic password hashing with BCrypt, stateful vs stateless authentication concepts, and login/registration flows.',
    deliverable: 'Implement a secure registration and login system with hashed passwords and protected endpoints.',
    relatedRoadmap: { title: 'Open Network Fundamentals', page: 'network-roadmap' },
    blockIndex: 9
  },
  {
    weekNumber: 11,
    phaseId: 3,
    phaseTitle: 'Phase 4 — Security and Full-Stack Integration',
    phaseSubtitle: 'Spring Security, JWT authentication, RBAC, CORS, secure full-stack React integration.',
    title: 'Authorization & Web Application Security',
    technologies: ['JWT', 'RBAC', '@PreAuthorize', 'CORS', 'OWASP Top 10'],
    focus: 'Stateless token creation and verification, token expiration handling, role-based access control (RBAC), method-level security, CORS configuration, and protecting against common vulnerabilities like SQL injection.',
    deliverable: 'Enforce that users can only access authorized resources based on their validated JWT token roles.',
    relatedRoadmap: { title: 'Open Network Fundamentals', page: 'network-roadmap' },
    blockIndex: 10
  },
  {
    weekNumber: 12,
    phaseId: 3,
    phaseTitle: 'Phase 4 — Security and Full-Stack Integration',
    phaseSubtitle: 'Spring Security, JWT authentication, RBAC, CORS, secure full-stack React integration.',
    title: 'Complete Full-Stack Application Integration',
    technologies: ['React + Spring Boot', 'JWT Interceptors', 'Protected Routes', 'Full-Stack Testing'],
    focus: 'Connecting frontend React applications to Spring Boot REST endpoints, client-side token storage, protected routes, form validation, error handling, and testing critical user journeys.',
    deliverable: 'A deployed full-stack application with authentication, CRUD operations, database persistence, and automated tests.',
    relatedRoadmap: { title: 'Open Projects', page: 'projects' },
    blockIndex: 11
  },

  // Phase 5 — AI Engineering Foundations (Weeks 13–15)
  {
    weekNumber: 13,
    phaseId: 4,
    phaseTitle: 'Phase 5 — AI Engineering Foundations',
    phaseSubtitle: 'LLMs, prompt engineering, embeddings, pgvector, and Retrieval-Augmented Generation (RAG).',
    title: 'LLM Foundations & Prompt Engineering',
    technologies: ['LLM APIs', 'Prompt Design', 'Structured Outputs', 'Function Calling', 'Rate Limits'],
    focus: 'Tokens, context windows, zero-shot and few-shot prompt design, structured JSON output enforcement, Python for AI prototyping, streaming responses, timeouts, and rate limit management.',
    deliverable: 'An AI utility that calls an LLM API and returns structured, validated results for backend consumption.',
    relatedRoadmap: { title: 'Open AI Engineering', page: 'ai-roadmap' },
    blockIndex: 12
  },
  {
    weekNumber: 14,
    phaseId: 4,
    phaseTitle: 'Phase 5 — AI Engineering Foundations',
    phaseSubtitle: 'LLMs, prompt engineering, embeddings, pgvector, and Retrieval-Augmented Generation (RAG).',
    title: 'Embeddings & Semantic Vector Search',
    technologies: ['Vector Embeddings', 'PostgreSQL with pgvector', 'Cosine Similarity', 'Chunking'],
    focus: 'Dense vector representations, semantic similarity calculations, document chunking strategies, configuring PostgreSQL with pgvector, vector indexing (HNSW), and metadata-filtered retrieval.',
    deliverable: 'Search a collection of documents using semantic vector similarity and return relevant passages.',
    relatedRoadmap: { title: 'Open AI Engineering', page: 'ai-roadmap' },
    blockIndex: 13
  },
  {
    weekNumber: 15,
    phaseId: 4,
    phaseTitle: 'Phase 5 — AI Engineering Foundations',
    phaseSubtitle: 'LLMs, prompt engineering, embeddings, pgvector, and Retrieval-Augmented Generation (RAG).',
    title: 'Retrieval-Augmented Generation (RAG) Architecture',
    technologies: ['RAG Pipeline', 'Context Augmentation', 'Hallucination Checks', 'Citations'],
    focus: 'RAG architecture, retrieval and context construction, grounding generated answers strictly in retrieved source context, citation verification, prompt-injection defense, and data privacy.',
    deliverable: 'A document question-answering prototype that grounds answers and displays supporting source citations.',
    relatedRoadmap: { title: 'Open AI Engineering', page: 'ai-roadmap' },
    blockIndex: 14
  },

  // Phase 6 — AI Full-Stack Capstone (Weeks 16–19)
  {
    weekNumber: 16,
    phaseId: 5,
    phaseTitle: 'Phase 6 — AI Full-Stack Capstone',
    phaseSubtitle: 'End-to-end AI document assistant with vector search, authentication, Docker, and CI/CD.',
    title: 'Capstone Architecture & Document Pipeline',
    technologies: ['Spring Boot AI', 'Document Ingestion', 'Async Processing', 'pgvector Indexing'],
    focus: 'System architecture, multi-tenant document storage, asynchronous file processing, chunking with metadata tagging, and vector embedding generation.',
    deliverable: 'Working ingestion and embedding pipeline for multi-format documents with vector database storage.',
    relatedRoadmap: { title: 'Open Projects', page: 'projects' },
    blockIndex: 15
  },
  {
    weekNumber: 17,
    phaseId: 5,
    phaseTitle: 'Phase 6 — AI Full-Stack Capstone',
    phaseSubtitle: 'End-to-end AI document assistant with vector search, authentication, Docker, and CI/CD.',
    title: 'Capstone Full-Stack Integration & AI Interaction',
    technologies: ['React Chat UI', 'SSE Streaming', 'Spring Boot RAG', 'Tool Calling'],
    focus: 'Interactive React conversational interface, Server-Sent Events (SSE) token streaming, semantic context augmentation, conversation history management, and secure tool integration.',
    deliverable: 'A working end-to-end AI document assistant application with streaming answers and citation popovers.',
    relatedRoadmap: { title: 'Open AI Engineering', page: 'ai-roadmap' },
    blockIndex: 15
  },
  {
    weekNumber: 18,
    phaseId: 5,
    phaseTitle: 'Phase 6 — AI Full-Stack Capstone',
    phaseSubtitle: 'End-to-end AI document assistant with vector search, authentication, Docker, and CI/CD.',
    title: 'Containerization & Local Production Setup',
    technologies: ['Docker', 'Multi-Stage Builds', 'Docker Compose', 'Container Health Checks'],
    focus: 'Multi-stage Dockerfiles for React and Spring Boot, Docker Compose multi-container orchestration (App, PostgreSQL + pgvector), persistent volume mappings, and container networking.',
    deliverable: 'A fully containerized multi-container full-stack application that starts with a single docker-compose up command.',
    relatedRoadmap: { title: 'Open Projects', page: 'projects' },
    blockIndex: 16
  },
  {
    weekNumber: 19,
    phaseId: 5,
    phaseTitle: 'Phase 6 — AI Full-Stack Capstone',
    phaseSubtitle: 'End-to-end AI document assistant with vector search, authentication, Docker, and CI/CD.',
    title: 'Production Deployment, CI/CD & Observability',
    technologies: ['GitHub Actions CI/CD', 'Cloud Deployment', 'Spring Actuator', 'Structured Logging'],
    focus: 'Automated CI/CD build and test pipelines, production cloud deployment, environment secret management, Spring Boot Actuator monitoring endpoints, structured logging, and edge-case testing.',
    deliverable: 'A deployed capstone application with a live public URL, automated CI/CD pipeline, and architecture documentation.',
    relatedRoadmap: { title: 'Open Projects', page: 'projects' },
    blockIndex: 16
  },

  // Phase 7 — Interview Preparation (Week 20)
  {
    weekNumber: 20,
    phaseId: 6,
    phaseTitle: 'Phase 7 — Interview Preparation & Job Readiness',
    phaseSubtitle: 'Data structures, algorithms, system design, portfolio presentation, and technical mock interviews.',
    title: 'Job Readiness & Technical Interviews',
    technologies: ['Java Revision', 'SQL & Indexing', 'Networking', 'System Design', 'Portfolio & Mock Interviews'],
    focus: 'Java OOP, collections and concurrency revision, database transactions and query tuning, core networking revision, high-frequency DSA patterns, system design principles, mock interviews, and GitHub portfolio polish.',
    deliverable: 'A polished portfolio, project presentations, and comprehensive revision notes for technical job interviews.',
    relatedRoadmap: { title: 'Open Network Fundamentals', page: 'network-roadmap' },
    blockIndex: 17
  }
];

export interface PhaseGroup {
  id: number;
  title: string;
  subtitle: string;
  weeks: WeeklyJourneyItem[];
}

export const getPhaseGroups = (): PhaseGroup[] => {
  const groups: Record<number, PhaseGroup> = {};

  WEEKLY_JOURNEY.forEach(item => {
    if (!groups[item.phaseId]) {
      groups[item.phaseId] = {
        id: item.phaseId,
        title: item.phaseTitle,
        subtitle: item.phaseSubtitle,
        weeks: []
      };
    }
    groups[item.phaseId].weeks.push(item);
  });

  return Object.values(groups).sort((a, b) => a.id - b.id);
};

export const getWeekStatus = (
  week: WeeklyJourneyItem,
  currentWeek: number,
  state: KairoStateV2
): 'completed' | 'current' | 'upcoming' => {
  // 1. Explicitly recorded completion in state (if user marked it or state tracks it)
  if ((state as any).completedWeeks?.includes(week.weekNumber)) {
    return 'completed';
  }

  // 2. Check if block tasks are 100% completed
  const blockProg = calculateBlockProgress(state, week.blockIndex);
  if (blockProg.total > 0 && blockProg.completed === blockProg.total) {
    return 'completed';
  }

  // 3. Check if weekly review passed
  const review = state.weeklyReviews[week.blockIndex];
  if (review?.selfTestResult === 'passed') {
    return 'completed';
  }

  // 4. If current week
  if (week.weekNumber === currentWeek) {
    return 'current';
  }

  // 5. If past week with high completion
  if (week.weekNumber < currentWeek && blockProg.total > 0 && blockProg.percent >= 80) {
    return 'completed';
  }

  // 6. Otherwise upcoming
  if (week.weekNumber > currentWeek) {
    return 'upcoming';
  }

  // Past week not yet 100% completed
  return 'current';
};
