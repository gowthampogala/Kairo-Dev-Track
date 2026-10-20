export interface SpringBootLesson {
  id: string; // e.g. 'sb-m1-l1'
  globalIndex: number; // 1..115
  moduleNumber: number; // 1..12
  lessonIndex: number; // 1..N
  title: string;
  category: string;
  estimatedDuration: string; // e.g. '30 mins'
  durationMinutes: number;
  description: string;
  keyConcepts: string[];
}

export interface SpringBootModule {
  id: string; // e.g. 'sb-mod-1'
  moduleNumber: number;
  title: string;
  subtitle: string;
  category: string;
  estimatedDuration: string;
  totalMinutes: number;
  lessons: SpringBootLesson[];
}

export interface SpringBootProjectDef {
  id: string; // e.g. 'sb-proj-1'
  number: number;
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  checklist: string[];
  defaultGithub?: string;
  defaultLive?: string;
}

export const SPRING_BOOT_PROJECTS: SpringBootProjectDef[] = [
  {
    id: 'sb-proj-1',
    number: 1,
    title: 'Employee Management REST API',
    tagline: 'Production-structured CRUD backend with layered architecture and relational persistence',
    description: 'Design and build a complete enterprise REST API from scratch using Spring Boot, Hibernate/Spring Data JPA, and PostgreSQL/MySQL. Follow the Controller-Service-Repository pattern, implement DTOs with strict Bean Validation, build centralized exception handling, and deliver comprehensive automated unit/integration tests with Swagger documentation.',
    technologies: ['Java 17+', 'Spring Boot 3', 'Spring Data JPA', 'PostgreSQL / MySQL', 'Hibernate', 'JUnit 5', 'Mockito', 'OpenAPI / Swagger'],
    checklist: [
      'Build CRUD endpoints for Employee and Department entities',
      'Use a layered architecture (Controller, Service, Repository, DTO, Entity)',
      'Integrate a relational database (MySQL or PostgreSQL) with Hibernate ORM',
      'Implement request/response DTOs and Bean Validation (@Valid, @NotNull, @Email)',
      'Add global exception handling with @ControllerAdvice and standardized API responses',
      'Write comprehensive unit tests with JUnit 5 & Mockito and controller tests with MockMvc',
      'Document and deploy the API with OpenAPI/Swagger UI and production profile'
    ]
  },
  {
    id: 'sb-proj-2',
    number: 2,
    title: 'Secure Task Management API',
    tagline: 'Stateless JWT authentication, role-based access control, and tenant-scoped task management',
    description: 'Construct a secure multi-user task management API backed by Spring Security 6. Implement user registration with BCrypt hashing, JWT access & refresh token issuance, stateless filter chains, role-based access control (USER/ADMIN), and strict data-layer security ensuring users can only read, update, or delete their own tasks.',
    technologies: ['Java 17+', 'Spring Boot 3', 'Spring Security 6', 'JSON Web Tokens (JWT)', 'BCrypt', 'Spring Data JPA', 'PostgreSQL', 'Docker'],
    checklist: [
      'User registration and login with input validation and uniqueness constraints',
      'Secure password storage using BCryptPasswordEncoder with high work-factor',
      'Authentication and authorization filter chain configuration with SecurityFilterChain',
      'JWT-based API protection with header extraction, token validation, and expiration handling',
      'Task CRUD operations with status workflow (TODO, IN_PROGRESS, DONE) and priorities',
      'User-specific data access preventing unauthorized horizontal privilege escalation',
      'Validation, global error handling, and automated security integration tests'
    ]
  },
  {
    id: 'sb-proj-3',
    number: 3,
    title: 'Production-Ready Spring Boot Application',
    tagline: 'End-to-end containerized microservice with migrations, health metrics, and cloud CI/CD',
    description: 'Architect a full-fledged, deployment-ready Spring Boot microservice. Features database versioning with Flyway, Spring Boot Actuator telemetry, structured JSON logging, containerization via multi-stage Docker builds, Docker Compose orchestration for app + DB services, and automated CI/CD pipeline deployment with health verification.',
    technologies: ['Java 17+', 'Spring Boot 3', 'Docker', 'Docker Compose', 'Flyway Migrations', 'Actuator', 'Prometheus', 'GitHub Actions', 'Cloud Hosting'],
    checklist: [
      'Production-grade REST API and database integration with connection pooling (HikariCP)',
      'Security hardening, environment variables, and secrets management without hardcoded credentials',
      'Automated test suite (unit, integration, and MockMvc slice tests) achieving high coverage',
      'Interactive API documentation with OpenAPI/Swagger and clean request/response schemas',
      'Docker multi-stage container build optimized for minimal image size and fast startup',
      'Docker Compose orchestration linking application container with database and health checks',
      'Deployment to a hosting platform with CI/CD pipeline automation',
      'Structured logging, Actuator health endpoints, metrics, and database migrations via Flyway'
    ]
  }
];

export const SPRING_BOOT_CURRICULUM: SpringBootModule[] = [
  {
    id: 'sb-mod-1',
    moduleNumber: 1,
    title: 'Spring Framework Introduction',
    subtitle: 'Core philosophy, enterprise challenges solved, and Spring vs Spring Boot differences',
    category: 'Architecture & Foundations',
    estimatedDuration: '3 hrs 30 mins',
    totalMinutes: 210,
    lessons: [
      {
        id: 'sb-m1-l1',
        globalIndex: 1,
        moduleNumber: 1,
        lessonIndex: 1,
        title: 'What is the Spring Framework?',
        category: 'Architecture & Foundations',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Understand the origin, philosophy, and ecosystem of the Spring Framework as an open-source lightweight inversion-of-control container for modern enterprise Java.',
        keyConcepts: [
          'Enterprise Java history and J2EE complexity',
          'Lightweight POJO-based programming model',
          'Non-invasive architecture and testability'
        ]
      },
      {
        id: 'sb-m1-l2',
        globalIndex: 2,
        moduleNumber: 1,
        lessonIndex: 2,
        title: 'Why Spring is used in Java applications',
        category: 'Architecture & Foundations',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Explore why Spring is the industry standard for backend development, microservices, and large-scale distributed systems.',
        keyConcepts: [
          'Rapid application development and boilerplate elimination',
          'Unified programming model across persistence, messaging, and web',
          'Massive community, long-term support, and enterprise tooling'
        ]
      },
      {
        id: 'sb-m1-l3',
        globalIndex: 3,
        moduleNumber: 1,
        lessonIndex: 3,
        title: 'Problems Spring solves',
        category: 'Architecture & Foundations',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Analyze tight coupling, complex plumbing, transaction management nightmares, and testability bottlenecks that Spring eliminates.',
        keyConcepts: [
          'Tightly coupled classes and hardcoded dependencies',
          'Cross-cutting concerns (logging, security, transaction management)',
          'Declarative programming over programmatic boilerplate'
        ]
      },
      {
        id: 'sb-m1-l4',
        globalIndex: 4,
        moduleNumber: 1,
        lessonIndex: 4,
        title: 'Spring Framework architecture and modules',
        category: 'Architecture & Foundations',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Deconstruct the modular architecture: Core Container (Beans, Core, Context, SpEL), AOP, Data Access/Integration (JDBC, ORM, Transactions), and Web (MVC).',
        keyConcepts: [
          'Core Container and BeanFactory',
          'Aspect-Oriented Programming (AOP) module',
          'Data access abstraction layers and Web MVC module'
        ]
      },
      {
        id: 'sb-m1-l5',
        globalIndex: 5,
        moduleNumber: 1,
        lessonIndex: 5,
        title: 'Spring vs Spring Boot',
        category: 'Architecture & Foundations',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Differentiate between the underlying Spring Framework foundation and Spring Boot opinionated convention-over-configuration rapid deployment engine.',
        keyConcepts: [
          'Spring Framework requires manual XML/Java configuration and external web server (Tomcat/Jetty)',
          'Spring Boot provides auto-configuration, starter POMs, and embedded servlet containers',
          'How Spring Boot builds directly on top of Spring Framework'
        ]
      },
      {
        id: 'sb-m1-l6',
        globalIndex: 6,
        moduleNumber: 1,
        lessonIndex: 6,
        title: 'Spring Boot advantages and use cases',
        category: 'Architecture & Foundations',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Study embedded servers, production-ready metrics, microservices suitability, and modern cloud deployment advantages.',
        keyConcepts: [
          'Stand-alone runnable JARs with embedded Tomcat/Undertow',
          'Opinionated starter dependencies avoiding version conflicts',
          'Microservice architecture fit and containerization ease'
        ]
      }
    ]
  },
  {
    id: 'sb-mod-2',
    moduleNumber: 2,
    title: 'Inversion of Control (IoC)',
    subtitle: 'Decoupling object creation, container-managed lifecycle, and IoC container architecture',
    category: 'Core Container',
    estimatedDuration: '3 hrs 45 mins',
    totalMinutes: 225,
    lessons: [
      {
        id: 'sb-m2-l1',
        globalIndex: 7,
        moduleNumber: 2,
        lessonIndex: 1,
        title: 'Understanding tightly coupled and loosely coupled code',
        category: 'Core Container',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Compare rigid dependencies created with the "new" keyword against decoupled, interface-driven programming.',
        keyConcepts: [
          'Direct instantiation issues and brittleness in refactoring',
          'Design against interfaces rather than concrete implementations',
          'Mocking and unit testing advantages of loose coupling'
        ]
      },
      {
        id: 'sb-m2-l2',
        globalIndex: 8,
        moduleNumber: 2,
        lessonIndex: 2,
        title: 'Inversion of Control explained',
        category: 'Core Container',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Understand the Hollywood Principle ("Don\'t call us, we\'ll call you") and how control over execution and object lifecycle is inverted.',
        keyConcepts: [
          'The Hollywood Principle in software design',
          'Flow of control: traditional program vs framework-driven program',
          'Separation of concerns between business logic and infrastructure creation'
        ]
      },
      {
        id: 'sb-m2-l3',
        globalIndex: 9,
        moduleNumber: 2,
        lessonIndex: 3,
        title: 'Traditional object creation vs container-managed objects',
        category: 'Core Container',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Evaluate memory management, dependency passing, and lifecycle control when managed by developer code vs an IoC container.',
        keyConcepts: [
          'Who calls constructor and when objects are destroyed',
          'Centralized object registry and lookup mechanisms',
          'Reusability and single responsibility preservation'
        ]
      },
      {
        id: 'sb-m2-l4',
        globalIndex: 10,
        moduleNumber: 2,
        lessonIndex: 4,
        title: 'Spring IoC container',
        category: 'Core Container',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Learn how the Spring IoC container instantiates, configures, and assembles application objects (Spring beans).',
        keyConcepts: [
          'The IoC container as the heart of Spring applications',
          'Reading configuration metadata (annotations, Java config, XML)',
          'Instantiating beans, resolving dependencies, and injecting them'
        ]
      },
      {
        id: 'sb-m2-l5',
        globalIndex: 11,
        moduleNumber: 2,
        lessonIndex: 5,
        title: 'ApplicationContext and BeanFactory',
        category: 'Core Container',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Compare the root BeanFactory interface with the enterprise ApplicationContext interface and examine context implementations.',
        keyConcepts: [
          'BeanFactory provides basic configuration mechanism and lazy bean loading',
          'ApplicationContext adds AOP integration, message resource handling, and event publication',
          'AnnotationConfigApplicationContext and ClassPathXmlApplicationContext'
        ]
      },
      {
        id: 'sb-m2-l6',
        globalIndex: 12,
        moduleNumber: 2,
        lessonIndex: 6,
        title: 'Dependency management and object lifecycle overview',
        category: 'Core Container',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Trace the high-level roadmap of how dependencies are registered, resolved, injected, and managed until container shutdown.',
        keyConcepts: [
          'Dependency graphs and topological resolution order',
          'Circular dependency pitfalls and resolution strategies',
          'Container shutdown hooks and graceful resource cleanup'
        ]
      }
    ]
  },
  {
    id: 'sb-mod-3',
    moduleNumber: 3,
    title: 'Dependency Injection (DI)',
    subtitle: 'Constructor, setter, and field injection patterns with @Autowired, @Qualifier, and @Primary',
    category: 'Core Container',
    estimatedDuration: '5 hrs',
    totalMinutes: 300,
    lessons: [
      {
        id: 'sb-m3-l1',
        globalIndex: 13,
        moduleNumber: 3,
        lessonIndex: 1,
        title: 'What is Dependency Injection?',
        category: 'Core Container',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Master Dependency Injection as a specific subtype of Inversion of Control where objects receive their collaborators externally.',
        keyConcepts: [
          'Client, Service, and Injector roles in DI',
          'Immutability and testability benefits',
          'Separating configuration from use'
        ]
      },
      {
        id: 'sb-m3-l2',
        globalIndex: 14,
        moduleNumber: 3,
        lessonIndex: 2,
        title: 'Constructor injection',
        category: 'Core Container',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Understand why constructor injection is the official industry best practice in modern Spring Boot applications.',
        keyConcepts: [
          'Guarantees non-null dependencies and immutability (final fields)',
          'Simplifies POJO unit testing without Spring container overhead',
          'Single constructor automatic @Autowired feature since Spring 4.3'
        ]
      },
      {
        id: 'sb-m3-l3',
        globalIndex: 15,
        moduleNumber: 3,
        lessonIndex: 3,
        title: 'Setter injection',
        category: 'Core Container',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Learn when to use setter injection for optional dependencies or post-construction reconfiguration.',
        keyConcepts: [
          'Injecting dependencies via JavaBean setter methods',
          'Handling optional or reconfigurable dependencies gracefully',
          'Risk of partial initialization or NullPointerExceptions'
        ]
      },
      {
        id: 'sb-m3-l4',
        globalIndex: 16,
        moduleNumber: 3,
        lessonIndex: 4,
        title: 'Field injection and its drawbacks',
        category: 'Core Container',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Examine field injection with @Autowired on private fields and why it is discouraged in production-quality codebases.',
        keyConcepts: [
          'Violates encapsulation by relying on reflection',
          'Hides dependencies and makes unit testing without container difficult',
          'Encourages violation of Single Responsibility Principle (God classes)'
        ]
      },
      {
        id: 'sb-m3-l5',
        globalIndex: 17,
        moduleNumber: 3,
        lessonIndex: 5,
        title: '@Component',
        category: 'Core Container',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Discover how @Component marks any Java class as a candidate for Spring auto-detection and container registration.',
        keyConcepts: [
          'Stereotype annotation hierarchy base',
          'Class-level declaration and automatic naming conventions',
          'Explicit bean naming via @Component("customName")'
        ]
      },
      {
        id: 'sb-m3-l6',
        globalIndex: 18,
        moduleNumber: 3,
        lessonIndex: 6,
        title: '@Autowired',
        category: 'Core Container',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Study how Spring resolves and injects dependencies by type, including required vs optional wiring.',
        keyConcepts: [
          'Autowiring by type (byType matching)',
          'required attribute: @Autowired(required = false)',
          'Wiring collections, lists, and maps of beans'
        ]
      },
      {
        id: 'sb-m3-l7',
        globalIndex: 19,
        moduleNumber: 3,
        lessonIndex: 7,
        title: '@Qualifier',
        category: 'Core Container',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Resolve NoUniqueBeanDefinitionException when multiple beans implement the same interface using @Qualifier.',
        keyConcepts: [
          'Disambiguating multiple bean candidates',
          'Using @Qualifier on constructor parameters and fields',
          'Custom qualifier annotations for domain clarity'
        ]
      },
      {
        id: 'sb-m3-l8',
        globalIndex: 20,
        moduleNumber: 3,
        lessonIndex: 8,
        title: '@Primary',
        category: 'Core Container',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Designate a default primary candidate bean when multiple beans of the same type exist without requiring qualifiers everywhere.',
        keyConcepts: [
          'Default bean precedence with @Primary',
          'Combining @Primary with fallbacks and profiles',
          'Qualifier precedence over @Primary'
        ]
      },
      {
        id: 'sb-m3-l9',
        globalIndex: 21,
        moduleNumber: 3,
        lessonIndex: 9,
        title: 'Practical dependency injection examples',
        category: 'Core Container',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Implement a hands-on payment processor and notification service switching between Stripe, PayPal, and mock implementations.',
        keyConcepts: [
          'Interface-driven architecture implementation',
          'Switching implementations via qualifiers and profiles',
          'Writing pure unit tests with constructor injection and Mockito mocks'
        ]
      }
    ]
  },
  {
    id: 'sb-mod-4',
    moduleNumber: 4,
    title: 'Spring Beans and Bean Lifecycle',
    subtitle: 'Stereotype annotations, configuration classes, scopes, lifecycle hooks, and error debugging',
    category: 'Bean Lifecycle',
    estimatedDuration: '5 hrs 15 mins',
    totalMinutes: 315,
    lessons: [
      {
        id: 'sb-m4-l1',
        globalIndex: 22,
        moduleNumber: 4,
        lessonIndex: 1,
        title: 'What is a Spring Bean?',
        category: 'Bean Lifecycle',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Define what constitutes a Spring Bean: an object instantiated, assembled, and managed by the Spring IoC container.',
        keyConcepts: [
          'Plain Old Java Objects (POJO) managed by Spring',
          'Bean definition metadata (class, scope, dependencies, init/destroy)',
          'Differences between a plain Java object and a Spring bean'
        ]
      },
      {
        id: 'sb-m4-l2',
        globalIndex: 23,
        moduleNumber: 4,
        lessonIndex: 2,
        title: '@Component, @Service, @Repository, and @Controller',
        category: 'Bean Lifecycle',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Understand the semantic specializations of the @Component stereotype across architectural layers.',
        keyConcepts: [
          '@Service for business logic and transactions',
          '@Repository for persistence with automatic DataAccessException translation',
          '@Controller / @RestController for HTTP web routing',
          'Architectural clarity and readability benefits'
        ]
      },
      {
        id: 'sb-m4-l3',
        globalIndex: 24,
        moduleNumber: 4,
        lessonIndex: 3,
        title: '@Configuration and @Bean',
        category: 'Bean Lifecycle',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Create Java-based configuration classes and declare beans for 3rd-party libraries where source code cannot be annotated.',
        keyConcepts: [
          '@Configuration classes as sources of bean definitions',
          '@Bean method declarations and inter-bean dependencies',
          'CGLIB proxying ensuring singleton semantics across method calls'
        ]
      },
      {
        id: 'sb-m4-l4',
        globalIndex: 25,
        moduleNumber: 4,
        lessonIndex: 4,
        title: 'Component scanning',
        category: 'Bean Lifecycle',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Learn how Spring scans packages to detect annotated classes and registers them into the ApplicationContext.',
        keyConcepts: [
          'Base packages configuration and defaults',
          'Inclusion and exclusion filters',
          'Performance implications of overly broad component scans'
        ]
      },
      {
        id: 'sb-m4-l5',
        globalIndex: 26,
        moduleNumber: 4,
        lessonIndex: 5,
        title: 'Bean scopes',
        category: 'Bean Lifecycle',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Explore bean scoping models in Spring: singleton, prototype, request, session, application, and websocket.',
        keyConcepts: [
          'Default singleton scope vs prototype scope',
          'Web-aware scopes (request, session, application)',
          '@Scope annotation usage and thread-safety considerations'
        ]
      },
      {
        id: 'sb-m4-l6',
        globalIndex: 27,
        moduleNumber: 4,
        lessonIndex: 6,
        title: 'Singleton and prototype scopes',
        category: 'Bean Lifecycle',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Analyze singleton caching vs fresh prototype instantiation and solve the scoped bean injection problem.',
        keyConcepts: [
          'Singleton instances shared across all injection points',
          'Injecting a prototype bean into a singleton bean (Method Injection / ObjectFactory / @Lookup)',
          'Garbage collection differences for prototype beans'
        ]
      },
      {
        id: 'sb-m4-l7',
        globalIndex: 28,
        moduleNumber: 4,
        lessonIndex: 7,
        title: 'Bean lifecycle',
        category: 'Bean Lifecycle',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Trace the complete lifecycle phases: instantiation, populate properties, Aware interfaces, BeanPostProcessors, init, and destroy.',
        keyConcepts: [
          'BeanNameAware, BeanFactoryAware, ApplicationContextAware',
          'postProcessBeforeInitialization and postProcessAfterInitialization',
          'When AOP proxies are created around beans'
        ]
      },
      {
        id: 'sb-m4-l8',
        globalIndex: 29,
        moduleNumber: 4,
        lessonIndex: 8,
        title: 'Initialization and destruction callbacks',
        category: 'Bean Lifecycle',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Implement initialization logic and cleanup code using InitializingBean, DisposableBean, and custom methods.',
        keyConcepts: [
          'InitializingBean.afterPropertiesSet() and DisposableBean.destroy()',
          '@Bean(initMethod = "...", destroyMethod = "...")',
          'Standardizing cleanup for thread pools, DB connections, and network sockets'
        ]
      },
      {
        id: 'sb-m4-l9',
        globalIndex: 30,
        moduleNumber: 4,
        lessonIndex: 9,
        title: '@PostConstruct and @PreDestroy',
        category: 'Bean Lifecycle',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Use JSR-250 standard annotations @PostConstruct and @PreDestroy for decoupled lifecycle hooks.',
        keyConcepts: [
          '@PostConstruct runs once dependencies are fully injected',
          '@PreDestroy triggers right before bean destruction upon context close',
          'Best practices for cache warm-up and state teardown'
        ]
      },
      {
        id: 'sb-m4-l10',
        globalIndex: 31,
        moduleNumber: 4,
        lessonIndex: 10,
        title: 'Common bean creation and dependency errors',
        category: 'Bean Lifecycle',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Diagnose and fix NoSuchBeanDefinitionException, NoUniqueBeanDefinitionException, CircularDependencyException, and BeanCreationException.',
        keyConcepts: [
          'Reading Spring startup stack traces effectively',
          'Circular dependencies and using @Lazy or refactoring design',
          'Unmet dependency resolution in @Configuration classes'
        ]
      }
    ]
  },
  {
    id: 'sb-mod-5',
    moduleNumber: 5,
    title: 'Spring Boot Fundamentals',
    subtitle: 'Auto-configuration internals, Starters, Initializr, YAML properties, and environment profiles',
    category: 'Spring Boot Core',
    estimatedDuration: '5 hrs 30 mins',
    totalMinutes: 330,
    lessons: [
      {
        id: 'sb-m5-l1',
        globalIndex: 32,
        moduleNumber: 5,
        lessonIndex: 1,
        title: 'Spring Boot architecture',
        category: 'Spring Boot Core',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Explore the internal components of Spring Boot: SpringApplication bootstrap, Environment abstraction, and ApplicationEvent model.',
        keyConcepts: [
          'SpringApplication bootstrap lifecycle',
          'ApplicationEnvironmentPreparedEvent and ApplicationReadyEvent',
          'Fail-fast mechanisms and custom Banner configurations'
        ]
      },
      {
        id: 'sb-m5-l2',
        globalIndex: 33,
        moduleNumber: 5,
        lessonIndex: 2,
        title: 'Spring Boot starters',
        category: 'Spring Boot Core',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Understand starter dependencies like spring-boot-starter-web, spring-boot-starter-data-jpa, and dependency convergence.',
        keyConcepts: [
          'Starter dependency descriptors aggregating transitive libraries',
          'Bill of Materials (BOM) managing version alignment',
          'Choosing starters for web, security, database, and validation'
        ]
      },
      {
        id: 'sb-m5-l3',
        globalIndex: 34,
        moduleNumber: 5,
        lessonIndex: 3,
        title: 'Spring Boot auto-configuration',
        category: 'Spring Boot Core',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Deep dive into @EnableAutoConfiguration, spring.factories / AutoConfiguration.imports, and conditional annotations (@ConditionalOnClass, @ConditionalOnMissingBean).',
        keyConcepts: [
          'How Spring Boot automatically configures beans based on classpath JARs',
          '@ConditionalOnProperty, @ConditionalOnClass, @ConditionalOnMissingBean',
          'Inspecting auto-configuration report with --debug'
        ]
      },
      {
        id: 'sb-m5-l4',
        globalIndex: 35,
        moduleNumber: 5,
        lessonIndex: 4,
        title: '@SpringBootApplication',
        category: 'Spring Boot Core',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Break down the meta-annotation combining @SpringBootConfiguration, @EnableAutoConfiguration, and @ComponentScan.',
        keyConcepts: [
          'The three core annotations encapsulated in @SpringBootApplication',
          'Base package scanning defaults rooted at the main class',
          'Excluding specific auto-configurations: @SpringBootApplication(exclude = {...})'
        ]
      },
      {
        id: 'sb-m5-l5',
        globalIndex: 36,
        moduleNumber: 5,
        lessonIndex: 5,
        title: 'Main application class',
        category: 'Spring Boot Core',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Understand the public static void main method, SpringApplication.run(), and CommandLineRunner / ApplicationRunner hooks.',
        keyConcepts: [
          'SpringApplication.run(Application.class, args)',
          'CommandLineRunner and ApplicationRunner for post-startup execution',
          'Programmatic customization of the application builder'
        ]
      },
      {
        id: 'sb-m5-l6',
        globalIndex: 37,
        moduleNumber: 5,
        lessonIndex: 6,
        title: 'Project creation using Spring Initializr',
        category: 'Spring Boot Core',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Bootstrap clean projects using start.spring.io, selecting build tools (Maven), packaging (JAR), and Java versions (17/21).',
        keyConcepts: [
          'start.spring.io interface, CLI, and IDE integration',
          'Selecting Java version, project metadata, and dependencies',
          'Directory layout conventions (src/main/java, src/main/resources)'
        ]
      },
      {
        id: 'sb-m5-l7',
        globalIndex: 38,
        moduleNumber: 5,
        lessonIndex: 7,
        title: 'Maven and pom.xml',
        category: 'Spring Boot Core',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Understand spring-boot-starter-parent, plugin configurations, packaging executable JARs, and dependency exclusions.',
        keyConcepts: [
          'spring-boot-starter-parent provides plugin defaults and resource filtering',
          'spring-boot-maven-plugin packages executable uber-JARs',
          'Managing dependencies and resolving version conflicts'
        ]
      },
      {
        id: 'sb-m5-l8',
        globalIndex: 39,
        moduleNumber: 5,
        lessonIndex: 8,
        title: 'Application properties and YAML',
        category: 'Spring Boot Core',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Configure applications using application.properties and application.yml, comparing syntax, nested hierarchies, and lists.',
        keyConcepts: [
          'Properties vs YAML syntax and indentation rules',
          'Standard keys (server.port, spring.datasource.*, logging.level.*)',
          'Custom key definitions and placeholder resolution'
        ]
      },
      {
        id: 'sb-m5-l9',
        globalIndex: 40,
        moduleNumber: 5,
        lessonIndex: 9,
        title: 'Profiles and environment-specific configuration',
        category: 'Spring Boot Core',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Manage distinct environments (dev, test, prod) with application-{profile}.yml and spring.profiles.active.',
        keyConcepts: [
          'Profile naming conventions and loading hierarchy',
          'Activating profiles via JVM args (-Dspring.profiles.active=prod) or env variables',
          '@Profile annotation on beans and configuration classes'
        ]
      },
      {
        id: 'sb-m5-l10',
        globalIndex: 41,
        moduleNumber: 5,
        lessonIndex: 10,
        title: 'Running and debugging a Spring Boot application',
        category: 'Spring Boot Core',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Execute apps via IDE, Maven CLI (mvn spring-boot:run), JAR execution (java -jar), attach remote debuggers, and use DevTools.',
        keyConcepts: [
          'mvn spring-boot:run and java -jar target/app.jar',
          'Remote JVM debugging with -agentlib:jdwp',
          'Spring Boot DevTools for automatic restart and LiveReload'
        ]
      }
    ]
  },
  {
    id: 'sb-mod-6',
    moduleNumber: 6,
    title: 'Annotations and Configuration',
    subtitle: 'Core annotation mechanics, @ConfigurationProperties, @Value, @Lazy, and property precedence',
    category: 'Configuration',
    estimatedDuration: '4 hrs 45 mins',
    totalMinutes: 285,
    lessons: [
      {
        id: 'sb-m6-l1',
        globalIndex: 42,
        moduleNumber: 6,
        lessonIndex: 1,
        title: 'Important Spring core annotations',
        category: 'Configuration',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Review the master catalog of Spring annotations and their classifications: stereotype, lifecycle, configuration, and injection.',
        keyConcepts: [
          'Stereotype vs configuration annotations',
          'Meta-annotations and composed annotations',
          'Annotation processing and reflection in Spring'
        ]
      },
      {
        id: 'sb-m6-l2',
        globalIndex: 43,
        moduleNumber: 6,
        lessonIndex: 2,
        title: '@Configuration and @Bean',
        category: 'Configuration',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Master programmatic bean definitions, factory methods, and proxyBeanMethods attribute (Full vs Lite mode).',
        keyConcepts: [
          'proxyBeanMethods = true (Full mode via CGLIB) vs false (Lite mode)',
          'Factory methods with arguments resolving autowired beans',
          'Configuring external clients (RestClient, WebClient, ObjectMapper)'
        ]
      },
      {
        id: 'sb-m6-l3',
        globalIndex: 44,
        moduleNumber: 6,
        lessonIndex: 3,
        title: '@ComponentScan',
        category: 'Configuration',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Explicitly configure component scanning packages, custom filters, and multi-module package architectures.',
        keyConcepts: [
          'basePackages and basePackageClasses attributes',
          'Regex and AspectJ component scan filters',
          'Scanning multi-module Gradle/Maven project structures'
        ]
      },
      {
        id: 'sb-m6-l4',
        globalIndex: 45,
        moduleNumber: 6,
        lessonIndex: 4,
        title: '@Value',
        category: 'Configuration',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Inject external property values, system properties, and SpEL expressions into fields and constructor parameters.',
        keyConcepts: [
          'Property placeholder syntax: @Value("${app.timeout:5000}")',
          'Spring Expression Language (SpEL) syntax: @Value("#{systemProperties[\'user.home\']}")',
          'Default fallback values handling missing configurations'
        ]
      },
      {
        id: 'sb-m6-l5',
        globalIndex: 46,
        moduleNumber: 6,
        lessonIndex: 5,
        title: '@PropertySource',
        category: 'Configuration',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Load custom properties files into the Spring Environment alongside the default application properties.',
        keyConcepts: [
          '@PropertySource("classpath:custom.properties")',
          'Multiple sources and ignoreResourceNotFound handling',
          'Limitations with YAML files in standard @PropertySource'
        ]
      },
      {
        id: 'sb-m6-l6',
        globalIndex: 47,
        moduleNumber: 6,
        lessonIndex: 6,
        title: '@Profile',
        category: 'Configuration',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Conditionally register beans and configuration classes based on active environment profiles.',
        keyConcepts: [
          '@Profile("dev"), @Profile("!prod"), @Profile("dev & cloud")',
          'Profile-specific DataSource and mail sender implementations',
          'Testing with @ActiveProfiles("test")'
        ]
      },
      {
        id: 'sb-m6-l7',
        globalIndex: 48,
        moduleNumber: 6,
        lessonIndex: 7,
        title: '@Lazy',
        category: 'Configuration',
        estimatedDuration: '25 mins',
        durationMinutes: 25,
        description: 'Defer bean initialization until first access to accelerate application startup and mitigate circular dependencies.',
        keyConcepts: [
          'Eager (default) vs lazy initialization',
          '@Lazy on @Bean, @Component, and @Autowired injection points',
          'Trade-offs: startup speed vs delayed failure detection'
        ]
      },
      {
        id: 'sb-m6-l8',
        globalIndex: 49,
        moduleNumber: 6,
        lessonIndex: 8,
        title: '@Scope',
        category: 'Configuration',
        estimatedDuration: '25 mins',
        durationMinutes: 25,
        description: 'Configure prototype, singleton, and web request scopes with proxyMode (ScopedProxyMode.TARGET_CLASS).',
        keyConcepts: [
          'Configuring scopes on @Component and @Bean methods',
          'ScopedProxyMode solving prototype injection into singletons',
          'Thread safety responsibilities in non-singleton beans'
        ]
      },
      {
        id: 'sb-m6-l9',
        globalIndex: 50,
        moduleNumber: 6,
        lessonIndex: 9,
        title: 'Configuration precedence',
        category: 'Configuration',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Understand the exact 17-level property resolution hierarchy (Command line args > Env vars > application.yml).',
        keyConcepts: [
          'Command-line arguments override everything',
          'SPRING_APPLICATION_JSON and OS environment variables',
          'Profile-specific properties override general properties'
        ]
      },
      {
        id: 'sb-m6-l10',
        globalIndex: 51,
        moduleNumber: 6,
        lessonIndex: 10,
        title: 'Practical annotation exercises',
        category: 'Configuration',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Build a strongly-typed configuration module using @ConfigurationProperties with validation and nested classes.',
        keyConcepts: [
          'Type-safe @ConfigurationProperties vs @Value',
          '@Validated on configuration classes',
          'IDE autocompletion via spring-boot-configuration-processor'
        ]
      }
    ]
  },
  {
    id: 'sb-mod-7',
    moduleNumber: 7,
    title: 'Building REST APIs',
    subtitle: 'HTTP principles, REST controllers, DTOs, Jackson serialization, and Controller-Service-Repository pattern',
    category: 'Web & REST APIs',
    estimatedDuration: '6 hrs',
    totalMinutes: 360,
    lessons: [
      {
        id: 'sb-m7-l1',
        globalIndex: 52,
        moduleNumber: 7,
        lessonIndex: 1,
        title: 'Client-server architecture and HTTP fundamentals',
        category: 'Web & REST APIs',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Review stateless client-server communication, request-response cycle, headers, query strings, and payloads.',
        keyConcepts: [
          'HTTP request headers, body, and method verbs',
          'HTTP response structure, status codes, and content types',
          'Stateless interaction model'
        ]
      },
      {
        id: 'sb-m7-l2',
        globalIndex: 53,
        moduleNumber: 7,
        lessonIndex: 2,
        title: 'REST principles',
        category: 'Web & REST APIs',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Understand Roy Fielding\'s REST architectural constraints: statelessness, resource identification, representation, and uniform interface.',
        keyConcepts: [
          'Resources identified by URIs (nouns, not verbs)',
          'Representation formats (JSON/XML)',
          'Idempotent vs safe HTTP operations'
        ]
      },
      {
        id: 'sb-m7-l3',
        globalIndex: 54,
        moduleNumber: 7,
        lessonIndex: 3,
        title: 'HTTP methods and status codes',
        category: 'Web & REST APIs',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Master GET, POST, PUT, PATCH, DELETE and standard status codes (200, 201, 204, 400, 401, 403, 404, 409, 500).',
        keyConcepts: [
          'PUT (full replacement) vs PATCH (partial update)',
          '201 Created with Location header, 204 No Content for deletion',
          '4xx client error vs 5xx server error semantics'
        ]
      },
      {
        id: 'sb-m7-l4',
        globalIndex: 55,
        moduleNumber: 7,
        lessonIndex: 4,
        title: '@RestController',
        category: 'Web & REST APIs',
        estimatedDuration: '25 mins',
        durationMinutes: 25,
        description: 'Understand how @RestController combines @Controller and @ResponseBody to write JSON directly to the HTTP response.',
        keyConcepts: [
          '@Controller (returns view names) vs @RestController (returns domain data)',
          '@ResponseBody automatically activates HTTP message converters',
          'Thread handling per request via servlet container thread pool'
        ]
      },
      {
        id: 'sb-m7-l5',
        globalIndex: 56,
        moduleNumber: 7,
        lessonIndex: 5,
        title: '@RequestMapping',
        category: 'Web & REST APIs',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Map web requests to controller classes and methods using paths, methods, headers, and media types.',
        keyConcepts: [
          'Class-level prefix routing (@RequestMapping("/api/v1/users"))',
          'produces and consumes attributes for MIME type negotiation',
          'Ant-style and URI template path matching'
        ]
      },
      {
        id: 'sb-m7-l6',
        globalIndex: 57,
        moduleNumber: 7,
        lessonIndex: 6,
        title: '@GetMapping, @PostMapping, @PutMapping, and @DeleteMapping',
        category: 'Web & REST APIs',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Use specialized composed HTTP method annotations for clean, readable REST endpoint declarations.',
        keyConcepts: [
          'Shortcut annotations introduced in Spring 4.3',
          '@PatchMapping for partial record updates',
          'Clean method signatures and semantic routing'
        ]
      },
      {
        id: 'sb-m7-l7',
        globalIndex: 58,
        moduleNumber: 7,
        lessonIndex: 7,
        title: '@PathVariable and @RequestParam',
        category: 'Web & REST APIs',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Extract dynamic URI path parameters (/users/{id}) and query parameters (/users?search=john&page=1).',
        keyConcepts: [
          'URI template extraction with @PathVariable("id") UUID id',
          'Query string parsing with @RequestParam(required = false, defaultValue = "0")',
          'Automatic type conversion for primitives, Enums, and dates'
        ]
      },
      {
        id: 'sb-m7-l8',
        globalIndex: 59,
        moduleNumber: 7,
        lessonIndex: 8,
        title: '@RequestBody',
        category: 'Web & REST APIs',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Deserialize incoming JSON HTTP request payloads into strongly typed Java DTO objects using HttpMessageConverter.',
        keyConcepts: [
          'Mapping JSON request body to Java classes',
          'HttpMessageNotReadableException on malformed payloads',
          'Combining @RequestBody with validation annotations (@Valid)'
        ]
      },
      {
        id: 'sb-m7-l9',
        globalIndex: 60,
        moduleNumber: 7,
        lessonIndex: 9,
        title: 'ResponseEntity',
        category: 'Web & REST APIs',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Control complete HTTP responses including status code, custom headers, and body using the ResponseEntity builder pattern.',
        keyConcepts: [
          'ResponseEntity.ok(body), ResponseEntity.created(uri).body(...)',
          'ResponseEntity.noContent().build(), ResponseEntity.status(404).body(...)',
          'Adding custom security and caching headers to HTTP responses'
        ]
      },
      {
        id: 'sb-m7-l10',
        globalIndex: 61,
        moduleNumber: 7,
        lessonIndex: 10,
        title: 'Request and response DTOs',
        category: 'Web & REST APIs',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Decouple internal JPA database entities from public API contracts using Data Transfer Objects and Java Records.',
        keyConcepts: [
          'Preventing over-posting and accidental sensitive data exposure (password hashes)',
          'Using modern Java Records for immutable DTOs',
          'Mapping layers with MapStruct or manual conversion methods'
        ]
      },
      {
        id: 'sb-m7-l11',
        globalIndex: 62,
        moduleNumber: 7,
        lessonIndex: 11,
        title: 'JSON serialization and deserialization',
        category: 'Web & REST APIs',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Customize Jackson object mapping with @JsonProperty, @JsonIgnore, @JsonFormat, and global ObjectMapper settings.',
        keyConcepts: [
          '@JsonIgnore preventing circular reference loops during serialization',
          '@JsonFormat for ISO-8601 date-time representations',
          'Naming strategies: Snake_case vs CamelCase'
        ]
      },
      {
        id: 'sb-m7-l12',
        globalIndex: 63,
        moduleNumber: 7,
        lessonIndex: 12,
        title: 'CRUD API implementation using a clear controller-service-repository structure',
        category: 'Web & REST APIs',
        estimatedDuration: '45 mins',
        durationMinutes: 45,
        description: 'Build a production-grade Product Catalog REST API with end-to-end Controller -> Service -> Repository flow.',
        keyConcepts: [
          'Controllers manage HTTP requests, status codes, and input validation',
          'Services manage domain logic, orchestration, and business rules',
          'Repositories manage database queries and persistence operations'
        ]
      }
    ]
  },
  {
    id: 'sb-mod-8',
    moduleNumber: 8,
    title: 'Database Integration with Spring Boot',
    subtitle: 'Spring Data JPA, Hibernate, relational mapping, transactions, derived queries, and N+1 optimization',
    category: 'Persistence & JPA',
    estimatedDuration: '7 hrs 30 mins',
    totalMinutes: 450,
    lessons: [
      {
        id: 'sb-m8-l1',
        globalIndex: 64,
        moduleNumber: 8,
        lessonIndex: 1,
        title: 'JDBC fundamentals and Spring Data JPA',
        category: 'Persistence & JPA',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Trace the evolution from raw JDBC Connection/PreparedStatement boilerplate to Spring JdbcTemplate and Spring Data JPA.',
        keyConcepts: [
          'Low-level JDBC overhead and resource leak dangers',
          'JdbcTemplate eliminates Connection handling but requires manual SQL mapping',
          'Spring Data JPA provides complete automated repository implementations'
        ]
      },
      {
        id: 'sb-m8-l2',
        globalIndex: 65,
        moduleNumber: 8,
        lessonIndex: 2,
        title: 'ORM and Hibernate basics',
        category: 'Persistence & JPA',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Understand Object-Relational Mapping (ORM) and Hibernate as the default JPA standard implementation in Spring Boot.',
        keyConcepts: [
          'The impedance mismatch between OOP objects and relational database tables',
          'JPA as the standard Java specification and Hibernate as the implementation',
          'Entity states: Transient, Managed (Persistent), Detached, and Removed'
        ]
      },
      {
        id: 'sb-m8-l3',
        globalIndex: 66,
        moduleNumber: 8,
        lessonIndex: 3,
        title: 'Configure MySQL or PostgreSQL',
        category: 'Persistence & JPA',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Set up database drivers, HikariCP connection pool properties, and ddl-auto settings in application.yml.',
        keyConcepts: [
          'Configuring spring.datasource.url, username, password, and driver-class-name',
          'spring.jpa.hibernate.ddl-auto (validate, update, create-drop, none)',
          'HikariCP connection pool tuning (maximum-pool-size, connection-timeout)'
        ]
      },
      {
        id: 'sb-m8-l4',
        globalIndex: 67,
        moduleNumber: 8,
        lessonIndex: 4,
        title: 'Entity mapping and @Entity',
        category: 'Persistence & JPA',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Map Java domain classes to relational tables using @Entity, @Table, @Column, and understand no-arg constructor rules.',
        keyConcepts: [
          '@Entity requirement for persistence management',
          '@Table(name = "customers") for custom table naming',
          '@Column(nullable = false, length = 100, unique = true) definitions'
        ]
      },
      {
        id: 'sb-m8-l5',
        globalIndex: 68,
        moduleNumber: 8,
        lessonIndex: 5,
        title: 'Primary keys and @Id',
        category: 'Persistence & JPA',
        estimatedDuration: '25 mins',
        durationMinutes: 25,
        description: 'Define entity identity with @Id, composite primary keys with @EmbeddedId, and UUID keys.',
        keyConcepts: [
          'Single field primary keys with @Id',
          'Composite keys with @IdClass or @EmbeddedId',
          'Choosing between Long surrogate keys and UUID primary keys'
        ]
      },
      {
        id: 'sb-m8-l6',
        globalIndex: 69,
        moduleNumber: 8,
        lessonIndex: 6,
        title: '@GeneratedValue',
        category: 'Persistence & JPA',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Explore primary key generation strategies: IDENTITY, SEQUENCE, TABLE, and AUTO.',
        keyConcepts: [
          'GenerationType.IDENTITY (DB auto-increment, disables JDBC batch inserts in Hibernate)',
          'GenerationType.SEQUENCE (high performance, pre-allocates IDs, standard in PostgreSQL)',
          'UUID generation via standard Hibernate generator'
        ]
      },
      {
        id: 'sb-m8-l7',
        globalIndex: 70,
        moduleNumber: 8,
        lessonIndex: 7,
        title: 'Repository interfaces',
        category: 'Persistence & JPA',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Explore the repository interface hierarchy: Repository, CrudRepository, PagingAndSortingRepository, and JpaRepository.',
        keyConcepts: [
          'Marker Repository interface to JpaRepository',
          'CrudRepository basic operations (save, findById, existsById, delete)',
          'PagingAndSortingRepository for large dataset retrieval'
        ]
      },
      {
        id: 'sb-m8-l8',
        globalIndex: 71,
        moduleNumber: 8,
        lessonIndex: 8,
        title: 'JpaRepository and derived query methods',
        category: 'Persistence & JPA',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Generate queries automatically using method naming conventions (findByEmail, findByStatusAndCreatedDateAfter, etc.).',
        keyConcepts: [
          'Query creation from method names (findBy, countBy, existsBy, deleteBy)',
          'Combining conditions with And, Or, Between, LessThan, GreaterThan, Like',
          'Using @Query with JPQL and native SQL queries'
        ]
      },
      {
        id: 'sb-m8-l9',
        globalIndex: 72,
        moduleNumber: 8,
        lessonIndex: 9,
        title: 'One-to-one, one-to-many, and many-to-many relationships',
        category: 'Persistence & JPA',
        estimatedDuration: '45 mins',
        durationMinutes: 45,
        description: 'Model relational associations with @OneToOne, @OneToMany, @ManyToOne, and @ManyToMany with join tables and mappedBy.',
        keyConcepts: [
          'Owning side of relationship vs inverse side (mappedBy)',
          '@JoinColumn specifying the foreign key column',
          'CascadeType (PERSIST, MERGE, REMOVE) and orphanRemoval = true'
        ]
      },
      {
        id: 'sb-m8-l10',
        globalIndex: 73,
        moduleNumber: 8,
        lessonIndex: 10,
        title: 'CRUD operations',
        category: 'Persistence & JPA',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Implement end-to-end Create, Read, Update, and Delete operations with Optional handling and proper business checks.',
        keyConcepts: [
          'Handling Optional<T> with orElseThrow()',
          'Save method behavior for new entities vs existing entities (merge)',
          'Soft deletes using @SQLDelete and @Where / @SQLRestriction'
        ]
      },
      {
        id: 'sb-m8-l11',
        globalIndex: 74,
        moduleNumber: 8,
        lessonIndex: 11,
        title: 'Pagination and sorting',
        category: 'Persistence & JPA',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Retrieve large data volumes efficiently using Pageable, PageRequest, Sort, and Page<T> return types.',
        keyConcepts: [
          'Pageable parameters: PageRequest.of(page, size, Sort.by("createdAt").descending())',
          'Page<T> vs Slice<T> (Slice avoids total count query overhead)',
          'Mapping Spring Pageable directly from @RequestParam in REST controllers'
        ]
      },
      {
        id: 'sb-m8-l12',
        globalIndex: 75,
        moduleNumber: 8,
        lessonIndex: 12,
        title: 'Transactions and @Transactional',
        category: 'Persistence & JPA',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Manage ACID transactions, propagation levels (REQUIRED, REQUIRES_NEW), isolation levels, and rollback rules.',
        keyConcepts: [
          'ACID properties and declarative transaction management with @Transactional',
          'Propagation behaviors: Propagation.REQUIRED vs REQUIRES_NEW',
          'Rollback rules: rollbackFor = Exception.class for checked exceptions'
        ]
      },
      {
        id: 'sb-m8-l13',
        globalIndex: 76,
        moduleNumber: 8,
        lessonIndex: 13,
        title: 'SQL joins, indexes, and query performance',
        category: 'Persistence & JPA',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Optimize queries with database indexing, composite indexes, EXPLAIN ANALYZE inspection, and JPQL joins.',
        keyConcepts: [
          '@Table(indexes = {@Index(name = "idx_email", columnList = "email")})',
          'INNER JOIN, LEFT JOIN, and FETCH JOIN in JPQL',
          'Inspecting generated SQL queries with show-sql and format_sql'
        ]
      },
      {
        id: 'sb-m8-l14',
        globalIndex: 77,
        moduleNumber: 8,
        lessonIndex: 14,
        title: 'N+1 query problem and solutions',
        category: 'Persistence & JPA',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Diagnose the notorious N+1 SELECT query problem and resolve it using JOIN FETCH, @EntityGraph, and DTO projections.',
        keyConcepts: [
          'How lazy loading causes 1 parent query + N child queries',
          'Fixing with JOIN FETCH in JPQL queries',
          'Fixing with @EntityGraph(attributePaths = {"orders", "orders.items"})'
        ]
      }
    ]
  },
  {
    id: 'sb-mod-9',
    moduleNumber: 9,
    title: 'Validation and Exception Handling',
    subtitle: 'Hibernate Validator, Bean Validation API, custom constraints, @ControllerAdvice, and uniform error schemas',
    category: 'Validation & Errors',
    estimatedDuration: '5 hrs',
    totalMinutes: 300,
    lessons: [
      {
        id: 'sb-m9-l1',
        globalIndex: 78,
        moduleNumber: 9,
        lessonIndex: 1,
        title: 'Bean Validation',
        category: 'Validation & Errors',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Understand the Jakarta Bean Validation standard (JSR 380) and Hibernate Validator implementation in Spring Boot.',
        keyConcepts: [
          'spring-boot-starter-validation dependency',
          'Validation at controller layer before service execution',
          'Declaring constraints on DTO fields rather than DB entities'
        ]
      },
      {
        id: 'sb-m9-l2',
        globalIndex: 79,
        moduleNumber: 9,
        lessonIndex: 2,
        title: '@Valid and @NotBlank',
        category: 'Validation & Errors',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Enforce validation triggers using @Valid on controller arguments and prevent empty strings with @NotBlank.',
        keyConcepts: [
          '@Valid triggers validation engine on @RequestBody',
          '@NotBlank ensures string is not null and trimmed length > 0',
          'Differences between @NotNull, @NotEmpty, and @NotBlank'
        ]
      },
      {
        id: 'sb-m9-l3',
        globalIndex: 80,
        moduleNumber: 9,
        lessonIndex: 3,
        title: '@NotNull, @Size, and @Email',
        category: 'Validation & Errors',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Apply numeric ranges, collection bounds, string length restrictions, and email format verifications.',
        keyConcepts: [
          '@Size(min = 2, max = 50, message = "Title must be between 2 and 50 characters")',
          '@Min, @Max, @Positive, and @DecimalMin for numbers',
          '@Email for RFC-compliant email address validation'
        ]
      },
      {
        id: 'sb-m9-l4',
        globalIndex: 81,
        moduleNumber: 9,
        lessonIndex: 4,
        title: 'Custom validation',
        category: 'Validation & Errors',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Create custom validation annotations and ConstraintValidator implementations for domain-specific checks (e.g. valid phone or tax ID).',
        keyConcepts: [
          'Creating custom annotation with @Constraint(validatedBy = ...)',
          'Implementing ConstraintValidator<CustomAnnotation, TargetType>',
          'Injecting Spring beans inside ConstraintValidator'
        ]
      },
      {
        id: 'sb-m9-l5',
        globalIndex: 82,
        moduleNumber: 9,
        lessonIndex: 5,
        title: 'Handling invalid requests',
        category: 'Validation & Errors',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Intercept MethodArgumentNotValidException to parse field errors, error codes, and rejected values.',
        keyConcepts: [
          'MethodArgumentNotValidException raised when @Valid fails',
          'Extracting BindingResult and FieldError objects',
          'Transforming errors into a user-friendly field-by-field map'
        ]
      },
      {
        id: 'sb-m9-l6',
        globalIndex: 83,
        moduleNumber: 9,
        lessonIndex: 6,
        title: 'Custom exceptions',
        category: 'Validation & Errors',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Design a clean hierarchy of unchecked runtime business exceptions (ResourceNotFoundException, DuplicateResourceException, UnauthorizedException).',
        keyConcepts: [
          'Inheriting from RuntimeException for unchecked semantics',
          'Carrying context data (entityName, fieldName, fieldValue)',
          'Clear separation between client errors (4xx) and system errors (5xx)'
        ]
      },
      {
        id: 'sb-m9-l7',
        globalIndex: 84,
        moduleNumber: 9,
        lessonIndex: 7,
        title: '@ControllerAdvice',
        category: 'Validation & Errors',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Implement a centralized global error interceptor across all controllers using @RestControllerAdvice.',
        keyConcepts: [
          '@RestControllerAdvice combines @ControllerAdvice and @ResponseBody',
          'Eliminating repetitive try-catch blocks across controllers',
          'Targeting specific packages, classes, or annotations'
        ]
      },
      {
        id: 'sb-m9-l8',
        globalIndex: 85,
        moduleNumber: 9,
        lessonIndex: 8,
        title: '@ExceptionHandler',
        category: 'Validation & Errors',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Map specific exception classes to designated handler methods returning calibrated HTTP status codes.',
        keyConcepts: [
          '@ExceptionHandler(ResourceNotFoundException.class)',
          '@ExceptionHandler(MethodArgumentNotValidException.class)',
          'Catch-all @ExceptionHandler(Exception.class) for unhandled errors'
        ]
      },
      {
        id: 'sb-m9-l9',
        globalIndex: 86,
        moduleNumber: 9,
        lessonIndex: 9,
        title: 'Consistent API error responses',
        category: 'Validation & Errors',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Design and return standard API error payloads (RFC 7807 / ProblemDetail or custom ErrorResponse record).',
        keyConcepts: [
          'Standard schema: timestamp, status, error, message, path, validationErrors',
          'Spring 6+ ProblemDetail implementation (RFC 7807)',
          'Preventing sensitive stack trace leakage to API clients'
        ]
      },
      {
        id: 'sb-m9-l10',
        globalIndex: 87,
        moduleNumber: 9,
        lessonIndex: 10,
        title: 'Logging and debugging',
        category: 'Validation & Errors',
        estimatedDuration: '25 mins',
        durationMinutes: 25,
        description: 'Configure SLF4J and Logback logging levels, parameterized logging statements, and correlation IDs.',
        keyConcepts: [
          'SLF4J Logger with Lombok @Slf4j',
          'Logging levels: TRACE, DEBUG, INFO, WARN, ERROR',
          'MDC (Mapped Diagnostic Context) for request correlation IDs'
        ]
      }
    ]
  },
  {
    id: 'sb-mod-10',
    moduleNumber: 10,
    title: 'Testing Spring Boot Applications',
    subtitle: 'JUnit 5, Mockito mocking, service tests, slice testing with MockMvc, and integration test coverage',
    category: 'Testing & Quality',
    estimatedDuration: '5 hrs 45 mins',
    totalMinutes: 345,
    lessons: [
      {
        id: 'sb-m10-l1',
        globalIndex: 88,
        moduleNumber: 10,
        lessonIndex: 1,
        title: 'Unit testing fundamentals',
        category: 'Testing & Quality',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Understand the testing pyramid: unit tests, slice tests, integration tests, and end-to-end tests.',
        keyConcepts: [
          'The testing pyramid and cost vs confidence trade-offs',
          'AAA pattern: Arrange, Act, Assert',
          'Testing isolated components without starting the Spring container'
        ]
      },
      {
        id: 'sb-m10-l2',
        globalIndex: 89,
        moduleNumber: 10,
        lessonIndex: 2,
        title: 'JUnit 5',
        category: 'Testing & Quality',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Master Jupiter annotations: @Test, @BeforeEach, @AfterEach, @DisplayName, @ParameterizedTest, and Assertions.',
        keyConcepts: [
          '@Test and @DisplayName for readable test suites',
          'Assertions.assertEquals, assertThrows, assertNotNull',
          'Parameterized tests with @ValueSource and @CsvSource'
        ]
      },
      {
        id: 'sb-m10-l3',
        globalIndex: 90,
        moduleNumber: 10,
        lessonIndex: 3,
        title: 'Mockito',
        category: 'Testing & Quality',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Use Mockito to simulate dependencies, control method return values, and verify interactions.',
        keyConcepts: [
          'Mockito.mock(), @Mock, and @InjectMocks annotations',
          'when(mock.method()).thenReturn(value)',
          'verify(mock, times(1)).method(any())'
        ]
      },
      {
        id: 'sb-m10-l4',
        globalIndex: 91,
        moduleNumber: 10,
        lessonIndex: 4,
        title: 'Mocking dependencies',
        category: 'Testing & Quality',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Master argument matchers (any(), eq()), doThrow() for exceptions, and ArgumentCaptor for inspecting passed arguments.',
        keyConcepts: [
          'Argument matchers and avoiding NullPointer in mocks',
          'doThrow(CustomException.class).when(mock).method()',
          'ArgumentCaptor capturing internal parameters for deep assertions'
        ]
      },
      {
        id: 'sb-m10-l5',
        globalIndex: 92,
        moduleNumber: 10,
        lessonIndex: 5,
        title: 'Service-layer tests',
        category: 'Testing & Quality',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Write ultra-fast pure unit tests for business logic in the service layer using @ExtendWith(MockitoExtension.class).',
        keyConcepts: [
          '@ExtendWith(MockitoExtension.class) without Spring Context overhead',
          'Testing business edge cases, calculations, and exception branches',
          'Verifying repository saves and mapper transformations'
        ]
      },
      {
        id: 'sb-m10-l6',
        globalIndex: 93,
        moduleNumber: 10,
        lessonIndex: 6,
        title: 'Controller tests',
        category: 'Testing & Quality',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Test web controllers in isolation using the @WebMvcTest slice annotation and @MockBean for service collaborators.',
        keyConcepts: [
          '@WebMvcTest(EmployeeController.class) loads only web MVC layer',
          '@MockBean mocks services in the ApplicationContext',
          'Testing HTTP method routing, status codes, and serialization'
        ]
      },
      {
        id: 'sb-m10-l7',
        globalIndex: 94,
        moduleNumber: 10,
        lessonIndex: 7,
        title: '@SpringBootTest',
        category: 'Testing & Quality',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Configure full integration tests that bootstrap the complete ApplicationContext with webEnvironment options.',
        keyConcepts: [
          '@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)',
          'TestRestTemplate and WebTestClient for full HTTP roundtrip calls',
          'Context caching across multiple test classes'
        ]
      },
      {
        id: 'sb-m10-l8',
        globalIndex: 95,
        moduleNumber: 10,
        lessonIndex: 8,
        title: 'MockMvc',
        category: 'Testing & Quality',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Perform simulated HTTP requests and assert JSON response bodies with jsonPath (mockMvc.perform(get(...)).andExpect(status().isOk())).',
        keyConcepts: [
          'mockMvc.perform(post("/api/items").contentType(APPLICATION_JSON)...)',
          '.andExpect(status().isCreated()) and .andExpect(jsonPath("$.id").exists())',
          'print() results to console for fast test debugging'
        ]
      },
      {
        id: 'sb-m10-l9',
        globalIndex: 96,
        moduleNumber: 10,
        lessonIndex: 9,
        title: 'Repository integration tests',
        category: 'Testing & Quality',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Test Spring Data JPA repositories using @DataJpaTest with an in-memory database (H2) or Testcontainers.',
        keyConcepts: [
          '@DataJpaTest configures JPA entities, repositories, and TestEntityManager',
          'Automatic transaction rollback after each test method',
          'Verifying custom derived queries and native SQL accuracy'
        ]
      },
      {
        id: 'sb-m10-l10',
        globalIndex: 97,
        moduleNumber: 10,
        lessonIndex: 10,
        title: 'Testing validation and exception handling',
        category: 'Testing & Quality',
        estimatedDuration: '25 mins',
        durationMinutes: 25,
        description: 'Write dedicated test assertions ensuring invalid JSON payloads trigger 400 Bad Request with expected validation error maps.',
        keyConcepts: [
          'Submitting missing required fields via MockMvc',
          'Asserting jsonPath("$.errors.email").value("must be a valid email")',
          'Ensuring @ControllerAdvice translates exceptions into correct HTTP codes'
        ]
      },
      {
        id: 'sb-m10-l11',
        globalIndex: 98,
        moduleNumber: 10,
        lessonIndex: 11,
        title: 'Test coverage and meaningful assertions',
        category: 'Testing & Quality',
        estimatedDuration: '25 mins',
        durationMinutes: 25,
        description: 'Measure code coverage with JaCoCo and replace brittle tests with resilient, meaningful behavioral assertions.',
        keyConcepts: [
          'Configuring JaCoCo Maven plugin for coverage reporting',
          'Testing behavior over implementation details',
          'Preventing false positive tests and flaky assertions'
        ]
      }
    ]
  },
  {
    id: 'sb-mod-11',
    moduleNumber: 11,
    title: 'Spring Security and Authentication',
    subtitle: 'Security filter chain, BCrypt hashing, JWT tokens, RBAC permissions, and CORS/CSRF protection',
    category: 'Security & Auth',
    estimatedDuration: '7 hrs 30 mins',
    totalMinutes: 450,
    lessons: [
      {
        id: 'sb-m11-l1',
        globalIndex: 99,
        moduleNumber: 11,
        lessonIndex: 1,
        title: 'Authentication vs authorization',
        category: 'Security & Auth',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Clarify the core security distinction: verifying identity (Authentication - "Who are you?") vs verifying permissions (Authorization - "What can you do?").',
        keyConcepts: [
          'Authentication (401 Unauthorized)',
          'Authorization (403 Forbidden)',
          'SecurityContext and Authentication token representation'
        ]
      },
      {
        id: 'sb-m11-l2',
        globalIndex: 100,
        moduleNumber: 11,
        lessonIndex: 2,
        title: 'Spring Security architecture',
        category: 'Security & Auth',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Study the core architecture: DelegatingFilterProxy, FilterChainProxy, SecurityFilterChain, and SecurityContextHolder.',
        keyConcepts: [
          'DelegatingFilterProxy bridging servlet filters to Spring beans',
          'FilterChainProxy routing requests through security filters',
          'SecurityContextHolder and ThreadLocal security context storage'
        ]
      },
      {
        id: 'sb-m11-l3',
        globalIndex: 101,
        moduleNumber: 11,
        lessonIndex: 3,
        title: 'Security filter chain',
        category: 'Security & Auth',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Configure SecurityFilterChain bean in Spring Security 6+ using lambda DSL (authorizeHttpRequests, csrf, sessionManagement).',
        keyConcepts: [
          '@Bean SecurityFilterChain filterChain(HttpSecurity http)',
          'authorizeHttpRequests with requestMatchers and permitAll / authenticated',
          'Migrating from deprecated WebSecurityConfigurerAdapter'
        ]
      },
      {
        id: 'sb-m11-l4',
        globalIndex: 102,
        moduleNumber: 11,
        lessonIndex: 4,
        title: 'Password hashing using BCrypt',
        category: 'Security & Auth',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Implement secure, salted, slow password hashing with BCryptPasswordEncoder to defend against rainbow table attacks.',
        keyConcepts: [
          'Why plaintext and MD5/SHA256 are dangerous for passwords',
          'BCrypt salt generation and adaptive work factor cost',
          'PasswordEncoder bean: encode() and matches(raw, encoded)'
        ]
      },
      {
        id: 'sb-m11-l5',
        globalIndex: 103,
        moduleNumber: 11,
        lessonIndex: 5,
        title: 'User registration and login',
        category: 'Security & Auth',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Build registration and login REST endpoints, verifying credentials with AuthenticationManager and custom UserDetailsService.',
        keyConcepts: [
          'Custom UserDetails and UserDetailsService implementation',
          'AuthenticationManager.authenticate(new UsernamePasswordAuthenticationToken(...))',
          'Handling BadCredentialsException cleanly'
        ]
      },
      {
        id: 'sb-m11-l6',
        globalIndex: 104,
        moduleNumber: 11,
        lessonIndex: 6,
        title: 'Roles and authorities',
        category: 'Security & Auth',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Distinguish between GrantedAuthority (specific permission e.g. "READ_ORDER") and Role (coarse role with "ROLE_" prefix e.g. "ROLE_ADMIN").',
        keyConcepts: [
          'hasRole("ADMIN") automatically checks "ROLE_ADMIN"',
          'hasAuthority("customer:delete") fine-grained permissions',
          'Assigning roles to users in relational tables (User <-> Role)'
        ]
      },
      {
        id: 'sb-m11-l7',
        globalIndex: 105,
        moduleNumber: 11,
        lessonIndex: 7,
        title: 'Session-based authentication',
        category: 'Security & Auth',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Understand traditional stateful HTTP session authentication, JSESSIONID cookies, and why stateless APIs diverge from it.',
        keyConcepts: [
          'Server-side session storage and JSESSIONID cookie transmission',
          'Horizontal scaling challenges with sticky sessions vs distributed Redis sessions',
          'When session-based auth is appropriate vs stateless tokens'
        ]
      },
      {
        id: 'sb-m11-l8',
        globalIndex: 106,
        moduleNumber: 11,
        lessonIndex: 8,
        title: 'JWT fundamentals',
        category: 'Security & Auth',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Deconstruct JSON Web Tokens: Header (algorithm), Payload (claims, subject, expiration), and Cryptographic Signature.',
        keyConcepts: [
          'Stateless token benefits for microservices and mobile clients',
          'Standard claims (sub, iat, exp, iss) and custom claims (roles, userId)',
          'Symmetric HMAC (HS256) vs Asymmetric RSA/ECDSA (RS256) signing'
        ]
      },
      {
        id: 'sb-m11-l9',
        globalIndex: 107,
        moduleNumber: 11,
        lessonIndex: 9,
        title: 'Access-token validation and expiration',
        category: 'Security & Auth',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Implement a OncePerRequestFilter (JwtAuthenticationFilter) to extract Bearer tokens, validate signature and expiry, and set SecurityContext.',
        keyConcepts: [
          'Extracting "Authorization: Bearer <token>" header',
          'Verifying signature and checking Claims.getExpiration()',
          'Populating SecurityContextHolder.getContext().setAuthentication(...)'
        ]
      },
      {
        id: 'sb-m11-l10',
        globalIndex: 108,
        moduleNumber: 11,
        lessonIndex: 10,
        title: 'Refresh-token concepts and safe handling',
        category: 'Security & Auth',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Design a secure refresh token strategy: short-lived access tokens (15m), long-lived refresh tokens, rotation, and revocation.',
        keyConcepts: [
          'Mitigating token theft with short-lived access tokens',
          'Refresh token rotation and family invalidation on breach detection',
          'Storing refresh tokens in HttpOnly, Secure, SameSite cookies'
        ]
      },
      {
        id: 'sb-m11-l11',
        globalIndex: 109,
        moduleNumber: 11,
        lessonIndex: 11,
        title: 'Method-level security',
        category: 'Security & Auth',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Enforce fine-grained authorization directly on service methods using @EnableMethodSecurity and @PreAuthorize.',
        keyConcepts: [
          '@EnableMethodSecurity(prePostEnabled = true)',
          '@PreAuthorize("hasRole(\'ADMIN\') or #userId == authentication.principal.id")',
          '@PostAuthorize and @Secured annotations'
        ]
      },
      {
        id: 'sb-m11-l12',
        globalIndex: 110,
        moduleNumber: 11,
        lessonIndex: 12,
        title: 'CORS and CSRF',
        category: 'Security & Auth',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Understand Cross-Origin Resource Sharing (CORS) preflight OPTIONS and Cross-Site Request Forgery (CSRF) in stateless APIs.',
        keyConcepts: [
          'Configuring CorsConfigurationSource allowing specific origins, methods, and headers',
          'Why csrf.disable() is safe for stateless token-based REST APIs',
          'CSRF protection requirements when tokens are stored in automatic browser cookies'
        ]
      },
      {
        id: 'sb-m11-l13',
        globalIndex: 111,
        moduleNumber: 11,
        lessonIndex: 13,
        title: 'Protecting REST endpoints',
        category: 'Security & Auth',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Assemble complete endpoint authorization rules combining public registration, authenticated user routes, and restricted admin panels.',
        keyConcepts: [
          'Ordering request matchers from most specific to least specific',
          'Configuring custom AuthenticationEntryPoint for 401 JSON responses',
          'Configuring AccessDeniedHandler for 403 JSON responses'
        ]
      },
      {
        id: 'sb-m11-l14',
        globalIndex: 112,
        moduleNumber: 11,
        lessonIndex: 14,
        title: 'Security testing and common vulnerabilities',
        category: 'Security & Auth',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Test security with @WithMockUser, MockMvc, and defend against OWASP Top 10 vulnerabilities (SQLi, broken auth, sensitive data exposure).',
        keyConcepts: [
          '@WithMockUser(username = "admin", roles = {"ADMIN"}) in MockMvc tests',
          'Testing 401 Unauthorized on unauthenticated requests',
          'Testing 403 Forbidden on role-restricted endpoints'
        ]
      }
    ]
  },
  {
    id: 'sb-mod-12',
    moduleNumber: 12,
    title: 'Production Readiness and Deployment',
    subtitle: 'Actuator metrics, OpenAPI docs, Docker containerization, CI/CD, Flyway migrations, and cloud hosting',
    category: 'DevOps & Production',
    estimatedDuration: '7 hrs',
    totalMinutes: 420,
    lessons: [
      {
        id: 'sb-m12-l1',
        globalIndex: 113,
        moduleNumber: 12,
        lessonIndex: 1,
        title: 'Logging and debugging',
        category: 'DevOps & Production',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Configure production logback-spring.xml, rolling file appenders, structured JSON output, and external log aggregation.',
        keyConcepts: [
          'RollingFileAppender with size and time-based triggering policies',
          'Structured JSON logs for Elasticsearch/Loki consumption',
          'Hiding passwords and sensitive tokens from log files'
        ]
      },
      {
        id: 'sb-m12-l2',
        globalIndex: 114,
        moduleNumber: 12,
        lessonIndex: 2,
        title: 'Environment variables and secrets management',
        category: 'DevOps & Production',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Externalize sensitive configuration (DB passwords, JWT signing keys, 3rd party API keys) without checking secrets into Git.',
        keyConcepts: [
          'Relaxed binding: SPRING_DATASOURCE_PASSWORD maps to spring.datasource.password',
          '.env files and local developer configurations (.gitignore)',
          'Cloud secrets managers (AWS Secrets Manager, HashiCorp Vault)'
        ]
      },
      {
        id: 'sb-m12-l3',
        globalIndex: 115,
        moduleNumber: 12,
        lessonIndex: 3,
        title: 'Spring profiles',
        category: 'DevOps & Production',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Structure production profile configurations with strict pool sizes, disabled debug endpoints, and production SSL settings.',
        keyConcepts: [
          'application-prod.yml conventions and overrides',
          'Disabling ddl-auto and enabling Flyway in production',
          'Enforcing HTTPS and secure cookies'
        ]
      },
      {
        id: 'sb-m12-l4',
        globalIndex: 116,
        moduleNumber: 12,
        lessonIndex: 4,
        title: 'Actuator and health checks',
        category: 'DevOps & Production',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Expose operational endpoints (/actuator/health, /actuator/metrics, /actuator/info) for Kubernetes and uptime monitors.',
        keyConcepts: [
          'management.endpoints.web.exposure.include = health,info,metrics',
          'Liveness and Readiness probes for container orchestrators',
          'Custom HealthIndicator implementations checking 3rd-party services'
        ]
      },
      {
        id: 'sb-m12-l5',
        globalIndex: 117,
        moduleNumber: 12,
        lessonIndex: 5,
        title: 'API documentation with OpenAPI/Swagger',
        category: 'DevOps & Production',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Generate interactive API documentation and Swagger UI automatically using springdoc-openapi-starter-webmvc-ui.',
        keyConcepts: [
          'springdoc-openapi dependency and /swagger-ui/index.html access',
          '@Operation, @ApiResponse, and @Schema annotations',
          'Configuring JWT Bearer authentication within Swagger UI'
        ]
      },
      {
        id: 'sb-m12-l6',
        globalIndex: 118,
        moduleNumber: 12,
        lessonIndex: 6,
        title: 'Docker fundamentals',
        category: 'DevOps & Production',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Understand containerization, Docker images, layers, caching, and why containers eliminate "it works on my machine".',
        keyConcepts: [
          'Containers vs virtual machines',
          'Docker image layering and layer caching efficiency',
          'Docker CLI essentials (docker build, docker run, docker logs)'
        ]
      },
      {
        id: 'sb-m12-l7',
        globalIndex: 119,
        moduleNumber: 12,
        lessonIndex: 7,
        title: 'Containerizing a Spring Boot application',
        category: 'DevOps & Production',
        estimatedDuration: '40 mins',
        durationMinutes: 40,
        description: 'Author an optimized multi-stage Dockerfile leveraging lightweight Eclipse Temurin Alpine JRE images and non-root users.',
        keyConcepts: [
          'Multi-stage build separating Maven compilation from runtime JRE',
          'Eclipse Temurin JRE Alpine for tiny container size (< 150MB)',
          'Running as non-root user (USER spring:spring) for security'
        ]
      },
      {
        id: 'sb-m12-l8',
        globalIndex: 120,
        moduleNumber: 12,
        lessonIndex: 8,
        title: 'Docker Compose with a database',
        category: 'DevOps & Production',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Orchestrate application container, PostgreSQL database container, and persistent volumes in a single docker-compose.yml.',
        keyConcepts: [
          'Defining services, environment variables, networks, and persistent volumes',
          'depends_on with healthcheck condition ensuring DB starts before app',
          'Local full-stack development environment spin-up with docker compose up'
        ]
      },
      {
        id: 'sb-m12-l9',
        globalIndex: 121,
        moduleNumber: 12,
        lessonIndex: 9,
        title: 'Deployment to a suitable hosting platform',
        category: 'DevOps & Production',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Deploy containerized Spring Boot applications to cloud platforms (Render, Railway, AWS ECS, or DigitalOcean App Platform).',
        keyConcepts: [
          'Deploying via container registry (Docker Hub / GitHub Packages)',
          'Configuring production PORT environment variables',
          'Setting up managed cloud database instances (PostgreSQL / MySQL)'
        ]
      },
      {
        id: 'sb-m12-l10',
        globalIndex: 122,
        moduleNumber: 12,
        lessonIndex: 10,
        title: 'CI/CD fundamentals',
        category: 'DevOps & Production',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Construct a GitHub Actions automated pipeline to compile code, run JUnit tests, build Docker images, and deploy on push to main.',
        keyConcepts: [
          'GitHub Actions workflow YAML syntax (.github/workflows/deploy.yml)',
          'Caching Maven dependencies (~/.m2) to speed up builds',
          'Automated gatekeeper: refusing deployment if any unit test fails'
        ]
      },
      {
        id: 'sb-m12-l11',
        globalIndex: 123,
        moduleNumber: 12,
        lessonIndex: 11,
        title: 'Database migrations using Flyway or Liquibase',
        category: 'DevOps & Production',
        estimatedDuration: '35 mins',
        durationMinutes: 35,
        description: 'Implement version-controlled database schema changes with Flyway (V1__init.sql, V2__add_index.sql) instead of dangerous ddl-auto=update.',
        keyConcepts: [
          'Why hibernate.ddl-auto is forbidden in production',
          'Flyway migration naming conventions (V1__create_tables.sql)',
          'flyway_schema_history table tracking applied migrations'
        ]
      },
      {
        id: 'sb-m12-l12',
        globalIndex: 124,
        moduleNumber: 12,
        lessonIndex: 12,
        title: 'Monitoring, error handling, and production configuration',
        category: 'DevOps & Production',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Integrate Prometheus metrics, uptime alerts, JVM heap memory tuning (-Xms, -Xmx), and production error handling.',
        keyConcepts: [
          'Micrometer Prometheus exporter integration',
          'Container JVM memory ergonomics and -XX:+UseContainerSupport',
          'Setting up uptime alerts and synthetic health pings'
        ]
      },
      {
        id: 'sb-m12-l13',
        globalIndex: 125,
        moduleNumber: 12,
        lessonIndex: 13,
        title: 'Final README and architecture documentation',
        category: 'DevOps & Production',
        estimatedDuration: '30 mins',
        durationMinutes: 30,
        description: 'Write professional portfolio documentation including architecture diagrams, API specs, local setup instructions, and deployment links.',
        keyConcepts: [
          'Writing comprehensive developer READMEs that impress hiring managers',
          'Documenting architecture diagrams (C4 model or flowcharts)',
          'Providing cURL examples and demo credentials for live reviewers'
        ]
      }
    ]
  }
];

// Flat list of all lessons for fast lookups
export const ALL_SPRING_BOOT_LESSONS: SpringBootLesson[] = SPRING_BOOT_CURRICULUM.flatMap(m => m.lessons);

// Total stats helpers
export const TOTAL_SPRING_BOOT_MODULES = SPRING_BOOT_CURRICULUM.length;
export const TOTAL_SPRING_BOOT_LESSONS = ALL_SPRING_BOOT_LESSONS.length;
export const TOTAL_SPRING_BOOT_HOURS = Math.round(
  SPRING_BOOT_CURRICULUM.reduce((acc, m) => acc + m.totalMinutes, 0) / 60
);
