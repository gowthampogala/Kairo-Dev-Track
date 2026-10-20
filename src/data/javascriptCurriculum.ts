export interface JSLesson {
  id: string; // e.g. 'js-lesson-1'
  number: number;
  title: string;
  category: 'Foundations' | 'Control Flow & Loops' | 'Functions & Execution' | 'OOP & Memory' | 'Arrays & Transformations' | 'Strings' | 'Async, APIs & Web' | 'Advanced DOM & Interview';
  lessonsCount?: number | string; // e.g. 3 or "Not specified"
  estimatedDuration?: string; // e.g. "45 mins" or "Not specified"
  pageCount?: number | string; // e.g. 12 or "Not specified"
  learningObjectives: string[];
  explanation: string;
  codeExamples: Array<{ title: string; code: string; explanation: string }>;
  codeTracing?: { scenario: string; steps: string[] };
  exercises: Array<{ id: string; prompt: string; hint?: string; solution?: string }>;
  interviewQuestions: Array<{ question: string; answer: string }>;
  selfAssessment: string[];
  resourceLinks?: Array<{ title: string; url: string }>;
  isContentPrepared: boolean; // true for first 5 lessons, false for pending progressive content
}

export const JS_CURRICULUM: JSLesson[] = [
  {
    id: 'js-lesson-1',
    number: 1,
    title: 'Introduction to JavaScript',
    category: 'Foundations',
    lessonsCount: 3,
    estimatedDuration: '45 mins',
    pageCount: 'Not specified',
    isContentPrepared: true,
    learningObjectives: [
      'Understand the historical evolution and role of JavaScript in web development.',
      'Distinguish between client-side (browser) and server-side (Node.js) runtime environments.',
      'Understand how the JavaScript Engine (V8, SpiderMonkey) parses and runs code.'
    ],
    explanation: `JavaScript is a high-level, single-threaded, dynamically-typed programming language that serves as the core scripting language of the web. Originally created by Brendan Eich in 1995 for Netscape, it has evolved via ECMAScript (ES6+) into a general-purpose language powering frontend user interfaces, backend servers (Node.js/Bun), mobile applications, and embedded devices.\n\nIn the browser, JavaScript interacts with the Document Object Model (DOM) and Browser Object Model (BOM) to create dynamic, reactive user experiences. Under the hood, modern browsers use just-in-time (JIT) compilation (like Google Chrome's V8 engine) to compile human-readable JavaScript directly into native machine code at runtime.`,
    codeExamples: [
      {
        title: 'Running Your First JavaScript Statements',
        code: `// Outputting to console
console.log("Welcome to JavaScript Mastery!");

// Basic variable declarations
let studentName = "Alex";
const track = "Full Stack AI Engineer";

// Template literals and string interpolation
console.log(\`Student: \${studentName} is enrolled in: \${track}\`);`,
        explanation: 'Variables declared with let can be reassigned, while const creates an immutable binding. Template literals enclosed in backticks allow seamless string interpolation.'
      }
    ],
    codeTracing: {
      scenario: 'Engine Parsing & Execution Flow',
      steps: [
        'Step 1: The browser loads the HTML document and encounters the <script> tag.',
        'Step 2: The JavaScript engine performs lexical analysis (tokenizing the source code).',
        'Step 3: The parser generates an Abstract Syntax Tree (AST).',
        'Step 4: The bytecode generator/interpreter interprets the AST and JIT compiles hot code paths into machine instructions.',
        'Step 5: Statements execute sequentially on the single call stack.'
      ]
    },
    exercises: [
      {
        id: 'ex-1-1',
        prompt: 'Open your browser DevTools Console (F12) and write an expression that calculates the total seconds in a leap year (366 days).',
        hint: 'Multiply days * hours * minutes * seconds: 366 * 24 * 60 * 60',
        solution: '366 * 24 * 60 * 60 // 31622400 seconds'
      },
      {
        id: 'ex-1-2',
        prompt: 'Declare a constant with your target tech stack and print a personalized introduction to the console.',
        hint: 'Use const and backtick template literals.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What is ECMAScript and how does it relate to JavaScript?',
        answer: 'ECMAScript (ES) is the official specification standardized by Ecma International (specifically committee TC39). JavaScript is the actual programming language and implementation adhering to that specification.'
      },
      {
        question: 'Is JavaScript interpreted or compiled?',
        answer: 'Modern JavaScript uses Just-In-Time (JIT) compilation. While traditionally interpreted, engines like V8 parse source code into an Abstract Syntax Tree (AST), convert it to bytecode via an interpreter (Ignition), and optimize frequent "hot" code paths into machine code using an optimizing compiler (TurboFan).'
      }
    ],
    selfAssessment: [
      'I can explain what JavaScript is and where it runs.',
      'I know the difference between ECMAScript and JavaScript engines like V8.',
      'I can run statements in Node.js and the browser DevTools console.'
    ]
  },
  {
    id: 'js-lesson-2',
    number: 2,
    title: 'Programming Basics HLL, MLL, ALL',
    category: 'Foundations',
    lessonsCount: 2,
    estimatedDuration: '40 mins',
    pageCount: 'Not specified',
    isContentPrepared: true,
    learningObjectives: [
      'Understand the abstraction levels of programming languages: High-Level (HLL), Middle-Level (MLL), and Assembly/Low-Level (ALL/LLL).',
      'Learn how human-readable code bridges down to binary machine instructions (0s and 1s).',
      'Identify where JavaScript sits in the language abstraction hierarchy.'
    ],
    explanation: `Computers only understand machine code: streams of binary electrical signals represented as 0s and 1s. To make programming humanly feasible, languages are designed at different tiers of abstraction:\n\n1. Low-Level Languages (LLL/ALL): Assembly languages directly mapping mnemonics (MOV, ADD, JMP) to processor opcodes.\n2. Middle-Level Languages (MLL): Languages like C/C++ that allow direct memory manipulation (pointers, manual memory allocation) while offering structured control flow.\n3. High-Level Languages (HLL): Languages like JavaScript, Python, and Java that completely abstract away CPU architecture, memory addresses, and register management. JavaScript provides automated garbage collection and safety boundaries.`,
    codeExamples: [
      {
        title: 'High-Level Memory Abstraction in JavaScript',
        code: `// In a high-level language, memory allocation and garbage collection are automatic:
let userSession = { id: 1042, active: true };

// Reassigning dereferences the original object:
userSession = null; 
// The JavaScript Garbage Collector (mark-and-sweep) automatically frees the allocated memory!`,
        explanation: 'In C/C++ (MLL), developers must explicitly allocate and free pointers with malloc()/free(). In JavaScript (HLL), the runtime engine manages memory allocation and deallocation safely.'
      }
    ],
    exercises: [
      {
        id: 'ex-2-1',
        prompt: 'List three advantages and two performance trade-offs of developing in a High-Level Language like JavaScript versus C/Assembly.',
        hint: 'Consider developer productivity, cross-platform portability, garbage collection overhead, and raw execution speed.'
      }
    ],
    interviewQuestions: [
      {
        question: 'Why is JavaScript considered a high-level language?',
        answer: 'JavaScript provides high abstraction from hardware specifics. Developers do not manage CPU registers, memory pointers, or physical memory allocation; the engine provides automatic memory management (garbage collection) and a unified cross-platform API.'
      }
    ],
    selfAssessment: [
      'I understand what HLL, MLL, and LLL stand for.',
      'I can explain how human code transforms into machine-executable binary.',
      'I understand how automatic memory management works in high-level languages.'
    ]
  },
  {
    id: 'js-lesson-3',
    number: 3,
    title: 'Compiler VS Interpreter',
    category: 'Foundations',
    lessonsCount: 3,
    estimatedDuration: '50 mins',
    pageCount: 'Not specified',
    isContentPrepared: true,
    learningObjectives: [
      'Differentiate between ahead-of-time (AOT) compilers and traditional line-by-line interpreters.',
      'Understand how modern JavaScript JIT (Just-In-Time) combines both approaches.',
      'Learn what the V8 Ignition interpreter and TurboFan compiler do.'
    ],
    explanation: `A **Compiler** translates the entire source code into native machine code ahead of time (AOT) before program execution (e.g. C++, Rust, Go). Execution is fast, but compilation takes time.\n\nAn **Interpreter** reads and executes code line-by-line or statement-by-statement on the fly (e.g. classical Python/Ruby). Execution starts immediately without waiting for full compilation, but loops and repeated code run slower.\n\n**JavaScript Engine Architecture (JIT):**\nModern JavaScript engines do not use pure interpretation. They use **Just-In-Time (JIT) Compilation**:\n1. The parser creates an AST.\n2. An interpreter (like V8's Ignition) immediately starts executing bytecode so the page renders fast.\n3. A profiler watches which functions run frequently ("hot code").\n4. The optimizing compiler (TurboFan) compiles those hot functions into optimized machine code for peak performance.\n5. If assumptions change (deoptimization), it falls back to bytecode.`,
    codeExamples: [
      {
        title: 'Demonstrating Monomorphic Optimization in JIT',
        code: `// When a function receives objects with the same shape, JIT optimizes it:
function calculateTotal(order) {
  return order.price * order.quantity;
}

// Same object shape (hidden classes in V8):
calculateTotal({ price: 100, quantity: 2 });
calculateTotal({ price: 250, quantity: 4 });
// TurboFan optimizes this function into blazing fast native machine code!`,
        explanation: 'Consistent object shapes allow the JIT compiler to generate direct inline caches and avoid dynamic property lookup overhead.'
      }
    ],
    exercises: [
      {
        id: 'ex-3-1',
        prompt: 'Explain what happens during a de-optimization (bailout) in the V8 engine when a function receives an unexpected data type.',
        hint: 'Think about type feedback vectors and falling back to interpreted bytecode.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What is JIT compilation in JavaScript?',
        answer: 'Just-In-Time (JIT) compilation is a hybrid technique where code is interpreted immediately for fast startup, while frequently executed code paths ("hot code") are compiled into optimized machine instructions during runtime.'
      }
    ],
    selfAssessment: [
      'I can clearly contrast compilers and interpreters.',
      'I understand why V8 uses both an interpreter and an optimizing compiler.',
      'I understand the concept of "hot code" and de-optimization.'
    ]
  },
  {
    id: 'js-lesson-4',
    number: 4,
    title: 'Data Types in JavaScript Explained',
    category: 'Foundations',
    lessonsCount: 4,
    estimatedDuration: '60 mins',
    pageCount: 'Not specified',
    isContentPrepared: true,
    learningObjectives: [
      'Master the primitive data types in JavaScript: number, string, boolean, undefined, null, symbol, and bigint.',
      'Understand how primitive types are stored by value on the stack.',
      'Understand the typeof operator and its famous quirks (e.g. typeof null).'
    ],
    explanation: `JavaScript is dynamically typed: variable types are checked during execution, not compile time. Values belong to one of two main groups:\n\n1. **Primitive Data Types** (Immutable, stored by value):\n   - \`number\`: 64-bit floating point numbers (including NaN and Infinity).\n   - \`string\`: Immutable sequence of UTF-16 characters.\n   - \`boolean\`: true or false.\n   - \`undefined\`: Variable declared but never assigned a value.\n   - \`null\`: Intentional absence of any object value.\n   - \`bigint\`: Arbitrary precision integers (e.g. 9007199254740991n).\n   - \`symbol\`: Unique, immutable identifier.\n\n2. **Reference Type (Objects)**: Stored on the memory heap and accessed via reference (Arrays, Objects, Functions).`,
    codeExamples: [
      {
        title: 'Inspecting Primitive Types with typeof',
        code: `console.log(typeof 42);             // "number"
console.log(typeof 3.14159);        // "number"
console.log(typeof "Kairo");        // "string"
console.log(typeof true);           // "boolean"
console.log(typeof undefined);      // "undefined"
console.log(typeof 100n);           // "bigint"
console.log(typeof Symbol("key"));  // "symbol"

// JavaScript historical quirk:
console.log(typeof null);           // "object" (legacy bug from JS 1995)
console.log(null === null);         // true`,
        explanation: 'typeof null returning "object" is an unfixable legacy bug in JavaScript (changing it would break millions of older websites). To check for null specifically, always use strict equality (value === null).'
      }
    ],
    exercises: [
      {
        id: 'ex-4-1',
        prompt: 'Create variables for each of the 7 primitive types in JavaScript, log their values, and assert their types using typeof.',
        hint: 'Use let or const for number, string, boolean, undefined, null, bigint, symbol.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between null and undefined in JavaScript?',
        answer: 'undefined means a variable has been declared but has not yet been assigned a value. null is an intentional assignment representing the explicit absence of any object or value. In non-strict equality, null == undefined is true, but in strict equality null === undefined is false.'
      },
      {
        question: 'Why does typeof null return "object"?',
        answer: 'In the original 1995 implementation of JavaScript, values were represented with a type tag and a value. The object type tag was 000, and null was represented as the NULL pointer (0x00), so typeof misclassified it as an object.'
      }
    ],
    selfAssessment: [
      'I can list all 7 primitive data types from memory.',
      'I understand why typeof null returns "object".',
      'I can explain the difference between null and undefined.'
    ]
  },
  {
    id: 'js-lesson-5',
    number: 5,
    title: 'Data Types in JavaScript Explained pt.2',
    category: 'Foundations',
    lessonsCount: 3,
    estimatedDuration: '55 mins',
    pageCount: 'Not specified',
    isContentPrepared: true,
    learningObjectives: [
      'Understand reference types (Objects, Arrays, Functions) and the memory heap.',
      'Master the distinction between primitive storage (Stack) vs reference storage (Heap).',
      'Understand NaN (Not a Number), Number.isNaN(), and BigInt operations.'
    ],
    explanation: `In Part 2 of Data Types, we examine how non-primitive values differ in memory architecture:\n\n**Stack vs Heap Memory:**\n- **Stack Memory:** Fast, contiguous memory used to store primitives and execution context frames. When you copy a primitive, the value itself is copied.\n- **Heap Memory:** Dynamic, unstructured memory used for objects and arrays. When you copy an object variable, only the memory reference (pointer) is copied, not the underlying object!\n\n**Special Values:**\n- \`NaN\`: Represents computational errors (e.g. 0 / 0 or "hello" * 2). Quirky rule: \`NaN !== NaN\`. Always check with \`Number.isNaN(val)\`.\n- \`BigInt\`: Allows integers beyond \`Number.MAX_SAFE_INTEGER\` (2^53 - 1). You cannot mix BigInt and Number without explicit type conversion.`,
    codeExamples: [
      {
        title: 'Stack Copy vs Heap Reference Copy',
        code: `// 1. Primitive copy (Stack):
let scoreA = 100;
let scoreB = scoreA; // Copies the value 100
scoreB = 200;
console.log(scoreA); // 100 (Unchanged!)

// 2. Reference copy (Heap):
let userA = { name: "Aarav", role: "Dev" };
let userB = userA;   // Copies the memory pointer!
userB.role = "Lead";
console.log(userA.role); // "Lead" (Mutated because both point to the same heap object!)`,
        explanation: 'Primitives are independent value copies. Objects share references until deep copied.'
      }
    ],
    exercises: [
      {
        id: 'ex-5-1',
        prompt: 'Demonstrate why NaN !== NaN in code, and write a helper function that reliably checks if a value is NaN.',
        hint: 'Use Number.isNaN() or compare val !== val (since NaN is the only value in JS not equal to itself).'
      }
    ],
    interviewQuestions: [
      {
        question: 'Why is NaN === NaN false in JavaScript?',
        answer: 'Per the IEEE 754 floating-point specification, NaN (Not a Number) represents any undefined or unrepresentable mathematical result (like 0/0 or square root of -1). Because two separate undefined computations are not guaranteed to be equivalent, IEEE 754 mandates that NaN is never equal to anything, including another NaN.'
      }
    ],
    selfAssessment: [
      'I can diagram how stack memory and heap memory work in JavaScript.',
      'I understand how reference copying leads to shared object mutations.',
      'I know how to safely detect NaN using Number.isNaN().'
    ]
  },
  // Lessons 6 to 41: Structured placeholders ready for progressive expansion
  { id: 'js-lesson-6', number: 6, title: 'Type Conversion in JavaScript', category: 'Foundations', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Explicit vs implicit coercion', 'Truthy and falsy values', 'Coercion rules for +, -, and =='], explanation: 'Detailed lesson notes will be added progressively. Covers explicit type casting (String, Number, Boolean) and implicit type coercion.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-7', number: 7, title: 'Comparison Operators', category: 'Foundations', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Strict (===) vs loose (==) equality', 'Relational operators (<, >, <=, >=)', 'Object comparison semantics'], explanation: 'Covers comparison operators, abstract equality comparison algorithm, and strict identity checks.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-8', number: 8, title: 'If-Else in JavaScript', category: 'Foundations', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Conditional branching logic', 'Nested if-else statements', 'Ternary operator syntax'], explanation: 'Covers decision-making structures, truthy/falsy evaluation in conditions, and concise ternary operators.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-9', number: 9, title: 'Switch Statements in JavaScript', category: 'Foundations', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Multi-branch switch syntax', 'Break and fallthrough behavior', 'Default case handling'], explanation: 'Covers switch statements, strict matching under the hood, and practical use cases over long if-else chains.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-10', number: 10, title: 'Loops For, While, Do-while', category: 'Control Flow & Loops', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['for loops', 'while loops', 'do-while loops', 'break and continue statements'], explanation: 'Covers iterative programming, loop invariants, termination conditions, and performance considerations.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-11', number: 11, title: 'Mastering Loops Through Pattern', category: 'Control Flow & Loops', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Nested loops', 'Star patterns and numeric matrices', 'Building spatial algorithmic thinking'], explanation: 'Covers pattern programming to develop deep intuition for row-column nested loop coordinate mechanics.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-12', number: 12, title: 'Mastering Loops Through Pattern Programming', category: 'Control Flow & Loops', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Complex pyramid patterns', 'Inverted patterns', 'Two-pointer loop techniques'], explanation: 'Part 2 of pattern programming focusing on symmetrical designs, boundary conditions, and algorithmic loops.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-13', number: 13, title: 'Functions in JavaScript Basics', category: 'Functions & Execution', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Function declarations', 'Parameters vs arguments', 'Return values and early returns'], explanation: 'Covers the building blocks of reusable modular code in JavaScript using functions.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-14', number: 14, title: 'Writing Your First JavaScript Function', category: 'Functions & Execution', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Hands-on function construction', 'Pure functions concept', 'Input validation in functions'], explanation: 'Practical walkthrough constructing functions that take inputs, transform data, and return predictable results.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-15', number: 15, title: 'Why do we need functions in Javascript', category: 'Functions & Execution', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['DRY (Don\'t Repeat Yourself) principle', 'Code abstraction and reusability', 'Encapsulation of logic'], explanation: 'Deconstructs procedural repetition and demonstrates how functions bring maintainability and abstraction.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-16', number: 16, title: 'Types of Functions in JavaScript', category: 'Functions & Execution', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Function expressions', 'Arrow functions () => {}', 'Anonymous functions and IIFE'], explanation: 'Deep dive into different function syntaxes, lexical this binding in arrow functions, and invocation patterns.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-17', number: 17, title: 'Understanding Hoisting in JavaScript', category: 'Functions & Execution', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Variable hoisting (var vs let/const)', 'Temporal Dead Zone (TDZ)', 'Function declaration hoisting'], explanation: 'Explains how the JavaScript engine creates execution contexts and scans for declarations during the creation phase.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-18', number: 18, title: 'Types of scope in JavaScript', category: 'Functions & Execution', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Global scope', 'Function / local scope', 'Block scope (let & const)', 'Module scope'], explanation: 'Detailed exploration of variable visibility, lexical scoping rules, and scope boundary protection.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-19', number: 19, title: 'Introduction to Object Oriented Programming', category: 'OOP & Memory', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Objects as key-value stores', 'Methods and this keyword', 'Object literals vs constructors'], explanation: 'Introduction to object-oriented paradigms in JavaScript, properties, methods, and fundamental object models.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-20', number: 20, title: 'Pass by Value and Pass by Reference', category: 'OOP & Memory', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Primitive parameter passing', 'Object pointer passing', 'Preventing unintended side-effects'], explanation: 'Explains how arguments are passed into functions in JavaScript (call-by-sharing / call-by-value of reference).', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-21', number: 21, title: 'Functions as objects', category: 'OOP & Memory', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['First-class citizens concept', 'Function properties (name, length)', 'call, apply, and bind methods'], explanation: 'Demonstrates why functions in JavaScript are first-class callable objects with prototype chains.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-22', number: 22, title: 'Understanding the Scope Chain', category: 'Functions & Execution', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Lexical environment resolution', 'Outer environment references', 'Variable shadowing'], explanation: 'Traces how the engine traverses outward through nested execution contexts to resolve identifier lookups.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-23', number: 23, title: 'Closures in JavaScript', category: 'Functions & Execution', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Definition of a closure', 'State preservation across invocations', 'Data privacy and factory functions'], explanation: 'Crucial concept: how inner functions retain lexical access to outer variables even after the outer function has returned.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-24', number: 24, title: 'Callback Function in JavaScript', category: 'Functions & Execution', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Higher-order functions', 'Synchronous vs asynchronous callbacks', 'Handling event listeners with callbacks'], explanation: 'Covers passing functions as arguments to execute upon completion of tasks or user interactions.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-25', number: 25, title: 'Arrays in JavaScript', category: 'Arrays & Transformations', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Array initialization and indexing', 'Length property dynamics', 'push, pop, shift, unshift'], explanation: 'Introduction to JavaScript arrays, zero-indexed access, dynamic sizing, and basic queue/stack mutations.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-26', number: 26, title: 'Generative AI Explained: How It Creates...', category: 'Foundations', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Foundations of AI generation', 'Tokenization and embeddings overview', 'How LLMs generate contextual code'], explanation: 'Preserved exactly from curriculum: conceptual bridge into modern AI engineering and generative models.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-27', number: 27, title: 'JavaScript Array Methods', category: 'Arrays & Transformations', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['slice vs splice', 'concat, join, reverse', 'indexOf, includes, find, findIndex'], explanation: 'Comprehensive guide to mutating vs non-mutating array operations.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-28', number: 28, title: 'JavaScript Array Methods: Map, Filter, ...', category: 'Arrays & Transformations', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Array.prototype.map()', 'Array.prototype.filter()', 'Array.prototype.reduce()', 'Method chaining'], explanation: 'Functional array transformations essential for modern React, state mapping, and data pipelines.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-29', number: 29, title: 'Introduction to Multidimensional Arrays', category: 'Arrays & Transformations', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['2D arrays / matrices', 'Nested indexing (arr[i][j])', 'Iterating through grid structures'], explanation: 'Working with arrays of arrays, useful for coordinate systems, matrix algorithms, and tables.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-30', number: 30, title: 'Shallow Copy and Deep Copy', category: 'OOP & Memory', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Spread operator (...) shallow copy', 'structuredClone() native API', 'JSON.parse(JSON.stringify()) limits'], explanation: 'Explains nested reference mutation pitfalls and reliable techniques for cloning data structures safely.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-31', number: 31, title: 'Introduction to Strings', category: 'Strings', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['String literals and escape characters', 'Accessing characters by index', 'String length and concatenation'], explanation: 'Covers textual representation, character encoding foundations, and string primitives in JavaScript.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-32', number: 32, title: 'Immutable Strings', category: 'Strings', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Immutability concept', 'Memory allocation on string concatenation', 'Performance considerations'], explanation: 'Explains why strings cannot be modified in place and how new string instances are created in memory.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-33', number: 33, title: 'JavaScript String Methods & Operations', category: 'Strings', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['toLowerCase, toUpperCase, trim', 'substring, slice, replace, replaceAll', 'split and regex searching'], explanation: 'Preserved entry 33 per instructions: core string manipulation methods, search functions, and transformations.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-34', number: 34, title: 'Synchronous JavaScript', category: 'Async, APIs & Web', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Single-threaded execution', 'Call stack mechanics', 'Blocking I/O and UI freezes'], explanation: 'Explains JavaScript single-threaded call stack execution and why blocking operations freeze the browser UI.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-35', number: 35, title: 'Asynchronous JavaScript', category: 'Async, APIs & Web', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['The Event Loop', 'Web APIs (setTimeout, DOM events)', 'Task Queue & Microtask Queue priority'], explanation: 'The definitive architectural model of how JavaScript manages concurrency without multi-threading.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-36', number: 36, title: 'Promises in JavaScript', category: 'Async, APIs & Web', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Promise states: pending, fulfilled, rejected', '.then(), .catch(), .finally()', 'async/await syntactic sugar'], explanation: 'Modern asynchronous flow control replacing callback hell with clean composable promise chains.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-37', number: 37, title: 'JSON', category: 'Async, APIs & Web', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['JSON syntax rules vs JS object literals', 'JSON.stringify() serialization', 'JSON.parse() deserialization and error handling'], explanation: 'The standard data interchange format used in all modern web APIs, HTTP requests, and persistence layers.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-38', number: 38, title: 'Fetch API', category: 'Async, APIs & Web', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['fetch() syntax and options', 'Handling HTTP response codes and headers', 'Error handling with try/catch and async/await'], explanation: 'Connecting front-end applications to REST endpoints and handling JSON payloads.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-39', number: 39, title: 'Object Orientation Part - 2', category: 'Advanced DOM & Interview', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Prototypal inheritance (__proto__ and prototype)', 'ES6 class syntax and extends', 'Static methods and private fields (#)'], explanation: 'Deep prototypal inheritance mechanics, constructor prototypes, and modern ES6 class hierarchies.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-40', number: 40, title: 'JS - DOM & EVENTS', category: 'Advanced DOM & Interview', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['DOM tree query selectors', 'Event listeners and event propagation', 'Event bubbling, capturing, and delegation'], explanation: 'Manipulating HTML elements, managing form submissions, handling keyboard/mouse events, and event delegation patterns.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] },
  { id: 'js-lesson-41', number: 41, title: 'INTERVIEW PREPARATION', category: 'Advanced DOM & Interview', lessonsCount: 'Not specified', estimatedDuration: 'Not specified', pageCount: 'Not specified', isContentPrepared: false, learningObjectives: ['Core JS output questions', 'Closure, this, and hoisting drills', 'Coding challenges and live problem solving'], explanation: 'Comprehensive review of essential technical interview topics, output prediction questions, and live coding tips.', codeExamples: [], exercises: [], interviewQuestions: [], selfAssessment: [] }
];
