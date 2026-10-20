import { AITopic } from '../types';
export type { AITopic };

export interface AIPhaseGroup {
  id: string;
  name: string;
  phaseNumber: number;
  description: string;
  topicIds: string[];
}

export const AI_CURRICULUM: AITopic[] = [
  {
    id: 'ai-topic-1',
    number: 1,
    title: 'GenAI Fundamentals',
    phase: 'Phase 1',
    phaseNumber: 1,
    type: 'Concept',
    description: 'Foundations of generative models: probability distributions, generative vs discriminative models, autoregressive decoding, and the evolution of modern foundational models.',
    learningObjectives: [
      'Understand the mathematical distinction between discriminative P(Y|X) and generative P(X, Y) models',
      'Learn how autoregressive language models predict the next token via conditional probability distributions',
      'Explore temperature, top-k, and top-p (nucleus) sampling techniques for probabilistic decoding',
      'Understand model scaling laws (compute, dataset size, parameters) and emergent capabilities'
    ],
    keyConcepts: [
      'Autoregressive generation: P(w_1, ..., w_n) = ∏ P(w_i | w_1, ..., w_{i-1})',
      'Sampling strategies: Greedy search vs beam search vs nucleus sampling',
      'Context windows and attention spans across model architectures',
      'Latent space representations and generative priors'
    ],
    resources: [
      { title: 'Andrej Karpathy — Intro to Large Language Models', url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g', type: 'guide' },
      { title: 'OpenAI — Text Generation Guide', url: 'https://platform.openai.com/docs/guides/text-generation', type: 'docs' },
      { title: 'Anthropic — How LLMs Work', url: 'https://docs.anthropic.com/en/docs/initial-setup', type: 'docs' }
    ],
    practiceExercises: [
      'Experiment with temperature (0.0 to 1.5) and top_p values in a playground to observe determinism vs hallucination',
      'Trace probability distributions for next-token predictions given ambiguous prompt prefixes'
    ]
  },
  {
    id: 'ai-topic-2',
    number: 2,
    title: 'LLM Fundamentals',
    phase: 'Phase 1',
    phaseNumber: 1,
    type: 'Concept',
    description: 'Deep dive into large language model architectures, pre-training objectives, instruction tuning (SFT), and RLHF (Reinforcement Learning from Human Feedback).',
    learningObjectives: [
      'Understand the 3-stage LLM lifecycle: pre-training on raw web text, supervised instruction fine-tuning, and alignment',
      'Examine causal language modeling (CLM) loss functions and gradient descent on trillions of tokens',
      'Differentiate between base completion models and aligned chat models',
      'Learn the mechanics of RLHF, DPO (Direct Preference Optimization), and constitutional AI'
    ],
    keyConcepts: [
      'Pre-training compute budgets, flops, and datasets (Common Crawl, The Stack, FineWeb)',
      'Chat template formats (ChatML, Llama-3 format, system/user/assistant roles)',
      'Alignment trade-offs: helpfulness vs harmlessness vs sycophancy',
      'Context window limitations and quadratic attention scaling'
    ],
    resources: [
      { title: 'Hugging Face — NLP Course: Large Language Models', url: 'https://huggingface.co/learn/nlp-course', type: 'docs' },
      { title: 'InstructGPT Paper — Training language models to follow instructions', url: 'https://arxiv.org/abs/2203.02155', type: 'paper' },
      { title: 'DPO Paper — Direct Preference Optimization', url: 'https://arxiv.org/abs/2305.18290', type: 'paper' }
    ],
    practiceExercises: [
      'Compare raw output from a base model vs an instruction-tuned model on the same instruction prompt',
      'Inspect chat formatting tokens (<|im_start|>, <|im_end|>) in raw token streams'
    ]
  },
  {
    id: 'ai-topic-3',
    number: 3,
    title: 'Tokens & Tokenization',
    phase: 'Phase 1',
    phaseNumber: 1,
    type: 'Concept',
    description: 'Subword tokenization algorithms, Byte-Pair Encoding (BPE), vocabulary sizes, token economics, and token-level edge cases in numbers and non-Latin scripts.',
    learningObjectives: [
      'Master Byte-Pair Encoding (BPE), WordPiece, and SentencePiece tokenization mechanics',
      'Understand how tokenization affects model pricing, throughput, and context window limits',
      'Analyze why LLMs struggle with character-level tasks (e.g. counting letters in "strawberry") due to tokenization boundaries',
      'Learn tokenizer libraries: tiktoken (OpenAI), tokenizers (Hugging Face)'
    ],
    keyConcepts: [
      'Vocabulary size trade-offs: compression ratio vs parameter size of embedding matrix',
      'Byte-level BPE handling of Unicode characters and arbitrary binary data',
      'Token-to-word heuristics: ~1 token ≈ 0.75 English words',
      'Whitespace and punctuation sensitivity in subword segmentation'
    ],
    resources: [
      { title: 'OpenAI Tiktokenizer Interactive Visualizer', url: 'https://tiktokenizer.vercel.app/', type: 'guide' },
      { title: 'Andrej Karpathy — Let\'s build the GPT Tokenizer', url: 'https://www.youtube.com/watch?v=zduSFxRajkE', type: 'guide' },
      { title: 'Hugging Face Tokenizers Documentation', url: 'https://huggingface.co/docs/tokenizers', type: 'docs' }
    ],
    practiceExercises: [
      'Tokenize code snippets and multilingual text using `tiktoken` in Python or JavaScript and count exact tokens',
      'Identify token splits for numbers, variable names (camelCase vs snake_case), and punctuation'
    ]
  },
  {
    id: 'ai-topic-4',
    number: 4,
    title: 'Embeddings',
    phase: 'Phase 2',
    phaseNumber: 2,
    type: 'Concept',
    description: 'Vector representations of meaning, semantic spaces, high-dimensional geometry, similarity metrics (cosine, dot product, euclidean), and dense retrieval.',
    learningObjectives: [
      'Understand high-dimensional dense vector embeddings as geometric semantic representations',
      'Compare similarity metrics: Cosine Similarity, Dot Product, and L2 Euclidean Distance',
      'Evaluate embedding models: text-embedding-3-small/large, BAAI/bge, nomic-embed-text',
      'Understand MTEB (Massive Text Embedding Benchmark) evaluation metrics (NDCG@k, MRR)'
    ],
    keyConcepts: [
      'Semantic distance: angle between vectors vs magnitude',
      'Dimensionality reduction and embedding normalization',
      'Asymmetric retrieval embeddings (query vs passage prompts e.g. "search_query:" vs "search_document:")',
      'Embedding clustering and semantic density visualization (t-SNE / UMAP)'
    ],
    resources: [
      { title: 'OpenAI Embeddings Guide', url: 'https://platform.openai.com/docs/guides/embeddings', type: 'docs' },
      { title: 'MTEB Leaderboard (Hugging Face)', url: 'https://huggingface.co/spaces/mteb/leaderboard', type: 'docs' },
      { title: 'Pinecone — What are Vector Embeddings?', url: 'https://www.pinecone.io/learn/vector-embeddings/', type: 'guide' }
    ],
    practiceExercises: [
      'Generate embeddings for 10 sentences across 3 different topics and compute pairwise cosine similarity matrix',
      'Implement cosine similarity function from scratch in TypeScript/Python and verify against library implementations'
    ]
  },
  {
    id: 'ai-topic-5',
    number: 5,
    title: 'Transformers',
    phase: 'Phase 2',
    phaseNumber: 2,
    type: 'Concept',
    description: 'Deep dive into the Transformer architecture: Scaled Dot-Product Attention, Multi-Head Attention, Positional Encodings (RoPE), Feed-Forward Networks, and KV Caching.',
    learningObjectives: [
      'Dissect the Attention mechanism: Query, Key, Value matrices and Scaled Dot-Product formula',
      'Understand Multi-Head Attention (MHA), Multi-Query Attention (MQA), and Grouped-Query Attention (GQA)',
      'Learn how Rotary Position Embeddings (RoPE) encode token distance and order',
      'Understand KV (Key-Value) caching in autoregressive inference and GPU memory requirements'
    ],
    keyConcepts: [
      'Attention formula: Attention(Q, K, V) = softmax(Q·K^T / √d_k) · V',
      'Quadratic time complexity O(N^2) of full self-attention vs linear FlashAttention hardware optimization',
      'LayerNorm, RMSNorm, residual connections, and SwiGLU activation functions',
      'Encoder-only (BERT), Decoder-only (GPT/Llama), and Encoder-Decoder (T5) architectures'
    ],
    resources: [
      { title: 'Attention Is All You Need (Vaswani et al. 2017)', url: 'https://arxiv.org/abs/1706.03762', type: 'paper' },
      { title: 'The Illustrated Transformer (Jay Alammar)', url: 'https://jalammar.github.io/illustrated-transformer/', type: 'guide' },
      { title: 'FlashAttention Paper & Mechanics', url: 'https://arxiv.org/abs/2205.14135', type: 'paper' }
    ],
    practiceExercises: [
      'Compute manual attention weights for a 3-token toy sequence with pen and paper or spreadsheet',
      'Calculate KV cache memory usage for 4k context across 32 layers, 32 heads, and FP16 weights'
    ]
  },
  {
    id: 'ai-topic-6',
    number: 6,
    title: 'Prompt Engineering',
    phase: 'Phase 3',
    phaseNumber: 3,
    type: 'Practice',
    description: 'Systematic prompt design patterns, few-shot in-context learning, Chain-of-Thought (CoT), self-consistency, directional stimulus, and jailbreak mitigation.',
    learningObjectives: [
      'Master prompt structuring: Persona, Context, Detailed Constraints, Examples, and Delimiters',
      'Implement Few-Shot prompting with balanced, high-variance exemplars',
      'Apply Chain-of-Thought (CoT) and Least-to-Most prompting to complex multi-step reasoning problems',
      'Implement prompt evaluation harnesses to measure accuracy across test cases systematically'
    ],
    keyConcepts: [
      'Zero-shot vs few-shot in-context learning',
      'Explicit scratchpads and <thinking> tags for reasoning separation',
      'Delimiter hygiene (XML tags, Markdown triple-backticks) to prevent prompt injection',
      'Negative constraints vs positive instruction patterns'
    ],
    resources: [
      { title: 'Anthropic — Prompt Engineering Interactive Tutorial', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview', type: 'guide' },
      { title: 'OpenAI Prompt Engineering Best Practices', url: 'https://platform.openai.com/docs/guides/prompt-engineering', type: 'docs' },
      { title: 'DAIR.AI Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', type: 'guide' }
    ],
    practiceExercises: [
      'Refactor a fragile conversational prompt into a production-grade XML-delimited prompt with 3 few-shot edge cases',
      'Benchmark zero-shot vs few-shot Chain-of-Thought on a set of 10 logical deduction riddles'
    ]
  },
  {
    id: 'ai-topic-7',
    number: 7,
    title: 'LLM APIs',
    phase: 'Phase 4',
    phaseNumber: 4,
    type: 'Code',
    description: 'Working with leading provider SDKs (OpenAI, Anthropic Claude, Google Gemini), token streaming (SSE), rate limit handling, retry policies, and cost tracking.',
    learningObjectives: [
      'Integrate OpenAI, Anthropic, and Gemini SDKs in Node.js/TypeScript and Python',
      'Implement Server-Sent Events (SSE) streaming for real-time typewriter user experiences',
      'Handle API errors: rate limits (429), timeouts (504), context length exceeded, and transient errors',
      'Implement exponential backoff with jitter and circuit-breaker patterns for resilient API consumers'
    ],
    keyConcepts: [
      'Streaming vs non-streaming HTTP chunking protocols',
      'Tiered rate limits: Requests Per Minute (RPM) vs Tokens Per Minute (TPM)',
      'Prompt caching (Anthropic cache_control, OpenAI automatic prefix caching) for 50-80% cost savings',
      'Token usage accounting and per-user cost tracking middleware'
    ],
    resources: [
      { title: 'OpenAI Node.js SDK Reference', url: 'https://github.com/openai/openai-node', type: 'repo' },
      { title: 'Anthropic TypeScript SDK', url: 'https://github.com/anthropics/anthropic-sdk-typescript', type: 'repo' },
      { title: 'Vercel AI SDK Core Documentation', url: 'https://sdk.vercel.ai/docs', type: 'docs' }
    ],
    practiceExercises: [
      'Build a lightweight Node.js/TypeScript script that streams completion chunks to stdout in real-time',
      'Implement an exponential backoff wrapper around an LLM API call that retries on 429 status codes'
    ]
  },
  {
    id: 'ai-topic-8',
    number: 8,
    title: 'Structured Outputs',
    phase: 'Phase 4',
    phaseNumber: 4,
    type: 'Code',
    description: 'Guaranteed JSON Schema adherence, constrained decoding, Zod/Pydantic validation, instructor patterns, and type-safe downstream integration.',
    learningObjectives: [
      'Master OpenAI Strict Mode Structured Outputs (constrained grammar decoding guarantees)',
      'Use Zod (TypeScript) and Pydantic (Python) to define contracts for model generation',
      'Understand how CFG (Context-Free Grammar) and JSON schema masks guide token logits at inference time',
      'Handle schema validation errors and automatic retry/correction loops'
    ],
    keyConcepts: [
      'Constrained decoding: masking invalid next-tokens using schema finite state automata',
      'Zod-to-JSON-Schema serialization: `zod-to-json-schema` library',
      'Schema recursion and union limitations in strict decoding modes',
      'Instructor pattern: extracting strongly typed entities from unstructured text'
    ],
    resources: [
      { title: 'OpenAI Structured Outputs Guide', url: 'https://platform.openai.com/docs/guides/structured-outputs', type: 'docs' },
      { title: 'Zod Documentation', url: 'https://zod.dev/', type: 'docs' },
      { title: 'Outlines — Guided Generation for LLMs', url: 'https://github.com/dottxt-ai/outlines', type: 'repo' }
    ],
    practiceExercises: [
      'Define a nested Zod schema for an invoice parser and call an LLM with strict mode enabled',
      'Build a fallback self-repair loop that feeds JSON validation errors back into the prompt if parsing fails'
    ]
  },
  {
    id: 'ai-topic-9',
    number: 9,
    title: 'Function / Tool Calling',
    phase: 'Phase 4',
    phaseNumber: 4,
    type: 'Code',
    description: 'Equipping LLMs with external capabilities: tool definitions, argument generation, dispatching client execution, returning tool messages, and multi-turn loops.',
    learningObjectives: [
      'Define JSON schema tool specifications with descriptive parameter documentation',
      'Implement the complete tool loop: User prompt -> Model tool_call -> Client execution -> Tool response -> Final answer',
      'Support parallel tool calling (invoking multiple tools in a single inference step)',
      'Implement safety confirmations for destructive actions (e.g. database writes, API mutations)'
    ],
    keyConcepts: [
      'Tool schemas in system context: model acts as a planner/dispatcher, not the executor',
      'The `role: "tool"` / `role: "function"` message type and `tool_call_id` linkage',
      'Parallel tool calls: batching weather, database, or calculator lookups',
      'Forced tool choice: `tool_choice: "required"` vs `tool_choice: "auto"`'
    ],
    resources: [
      { title: 'OpenAI Function Calling Guide', url: 'https://platform.openai.com/docs/guides/function-calling', type: 'docs' },
      { title: 'Anthropic Tool Use Documentation', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', type: 'docs' }
    ],
    practiceExercises: [
      'Build a local CLI assistant with 2 registered tools: `fetch_weather(city)` and `calculate_math(expression)`',
      'Test model behavior when a tool returns an error payload and verify the model explains the error gracefully'
    ]
  },
  {
    id: 'ai-topic-10',
    number: 10,
    title: 'Vector Databases',
    phase: 'Phase 5',
    phaseNumber: 5,
    type: 'Code',
    description: 'Approximate Nearest Neighbor (ANN) search, vector indexing (HNSW, IVFFlat), metadata filtering, and embedding storage in Pinecone, Qdrant, Chroma, and pgvector.',
    learningObjectives: [
      'Understand Approximate Nearest Neighbor (ANN) search trade-offs: speed, recall, and memory',
      'Master the Hierarchical Navigable Small World (HNSW) graph indexing algorithm',
      'Set up and query vector databases: Qdrant, Pinecone, ChromaDB, and PostgreSQL pgvector',
      'Implement filtered vector search: pre-filtering vs post-filtering on metadata fields'
    ],
    keyConcepts: [
      'Index types: Flat (exact brute force) vs HNSW (graph-based) vs IVF (inverted file)',
      'Vector dimensions and distance metrics configuration (Cosine, DotProduct, Euclidean)',
      'Payload / Metadata indexing for multi-tenant tenancy separation (e.g. `userId == ...`)',
      'Vector quantization: Scalar Quantization (SQ) and Product Quantization (PQ) for RAM reduction'
    ],
    resources: [
      { title: 'Pinecone — Nearest Neighbor Indexes Explained', url: 'https://www.pinecone.io/learn/series/faiss/vector-indexes/', type: 'guide' },
      { title: 'Qdrant Vector Database Documentation', url: 'https://qdrant.tech/documentation/', type: 'docs' },
      { title: 'pgvector Extension for PostgreSQL', url: 'https://github.com/pgvector/pgvector', type: 'repo' }
    ],
    practiceExercises: [
      'Deploy a local ChromaDB or Qdrant instance via Docker and insert 50 documents with dense embeddings',
      'Execute a combined query with semantic vector search and a strict metadata category filter'
    ]
  },
  {
    id: 'ai-topic-11',
    number: 11,
    title: 'RAG',
    phase: 'Phase 6',
    phaseNumber: 6,
    type: 'Project',
    description: 'Retrieval-Augmented Generation baseline: document ingestion pipeline, chunking strategies (fixed size, recursive, semantic), vector retrieval, and augmented answer synthesis.',
    learningObjectives: [
      'Build an end-to-end RAG pipeline: Ingest -> Parse -> Chunk -> Embed -> Index -> Retrieve -> Synthesize',
      'Implement chunking strategies: character, recursive text splitter, and semantic boundary chunking',
      'Construct grounded synthesis prompts that cite source chunks and refuse to speculate when info is missing',
      'Benchmark chunk size and chunk overlap parameters on question-answering accuracy'
    ],
    keyConcepts: [
      'The "Lost in the Middle" phenomenon in LLM context windows',
      'Chunk overlap (e.g. 500 characters chunk, 100 characters overlap) to preserve boundary context',
      'Citation extraction and attribution modeling',
      'Groundedness and faithfulness metrics in RAG answers'
    ],
    resources: [
      { title: 'LangChain — RAG From Scratch Series', url: 'https://www.youtube.com/playlist?list=PLfaIDFEXuae2LXbO1EQRRF9nSCqyQqrRe', type: 'guide' },
      { title: 'LlamaIndex Core Documentation', url: 'https://docs.llamaindex.ai/en/stable/', type: 'docs' },
      { title: 'Lost in the Middle: How Language Models Use Long Contexts', url: 'https://arxiv.org/abs/2307.03172', type: 'paper' }
    ],
    practiceExercises: [
      'Build a working CLI that loads a Markdown/PDF document, chunks it, and answers questions with direct citations',
      'Test edge cases where the question has no answer in the documents and verify the model states it does not know'
    ]
  },
  {
    id: 'ai-topic-12',
    number: 12,
    title: 'Advanced RAG',
    phase: 'Phase 8',
    phaseNumber: 8,
    type: 'Project',
    description: 'Production retrieval upgrades: Hybrid Search (BM25 keyword + dense vectors), Cross-Encoder Re-ranking, Contextual Retrieval, Multi-Query Expansion, and HyDE.',
    learningObjectives: [
      'Implement Hybrid Search combining dense semantic embeddings with sparse lexical BM25 via Reciprocal Rank Fusion (RRF)',
      'Integrate Cross-Encoder re-rankers (Cohere Rerank, BAAI/bge-reranker) to re-order top-k retrieved chunks',
      'Implement Hypothetical Document Embeddings (HyDE) and Query Rewriting / Sub-question decomposition',
      'Apply Anthropic Contextual Retrieval pattern (prepending document-level summaries to individual chunks)'
    ],
    keyConcepts: [
      'Bi-Encoder (fast retrieval) vs Cross-Encoder (accurate full-attention re-ranking)',
      'Reciprocal Rank Fusion (RRF) formula: RRF_score(d) = ∑ 1 / (60 + rank(d))',
      'Query expansion: generating 3 semantic variants to broaden recall',
      'Parent-Child and Small-to-Big chunk retrieval architectures'
    ],
    resources: [
      { title: 'Anthropic — Introducing Contextual Retrieval', url: 'https://www.anthropic.com/news/contextual-retrieval', type: 'guide' },
      { title: 'Cohere — Rerank Overview', url: 'https://docs.cohere.com/docs/rerank-overview', type: 'docs' },
      { title: 'Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE)', url: 'https://arxiv.org/abs/2212.10496', type: 'paper' }
    ],
    practiceExercises: [
      'Implement Reciprocal Rank Fusion in TypeScript to combine results from a keyword search and vector search',
      'Compare top-5 precision of naive RAG vs RAG + re-ranking on 10 challenging domain-specific questions'
    ]
  },
  {
    id: 'ai-topic-13',
    number: 13,
    title: 'AI Agents',
    phase: 'Phase 7',
    phaseNumber: 7,
    type: 'Project',
    description: 'Autonomous reasoning architectures: ReAct (Reasoning + Acting) loops, Plan-and-Solve, state persistence, memory systems (short-term vs episodic), and human-in-the-loop controls.',
    learningObjectives: [
      'Master the ReAct loop: Thought -> Action -> Action Input -> Observation -> Thought -> Final Answer',
      'Implement deterministic execution loops with max-step guards, timeouts, and state machines',
      'Design agent memory architectures: working scratchpad, conversation buffer, and episodic memory retrieval',
      'Build multi-step agents that solve complex goals using filesystem, web search, and calculation tools'
    ],
    keyConcepts: [
      'ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al.)',
      'Infinite loop traps and cyclic error recovery strategies',
      'Human-in-the-loop (HITL) approval gates for sensitive tool calls',
      'Stateful workflow graphs (LangGraph, AutoGen, CrewAI)'
    ],
    resources: [
      { title: 'ReAct Paper (Yao et al. 2022)', url: 'https://arxiv.org/abs/2210.03629', type: 'paper' },
      { title: 'LangGraph Conceptual Documentation', url: 'https://langchain-ai.github.io/langgraph/', type: 'docs' },
      { title: 'Anthropic — Building Effective Agents', url: 'https://www.anthropic.com/research/building-effective-agents', type: 'guide' }
    ],
    practiceExercises: [
      'Build a minimal ReAct agent from scratch in ~100 lines of code without heavy third-party framework magic',
      'Add a step budget limit (max 5 iterations) and implement graceful degradation when an agent gets stuck in a loop'
    ]
  },
  {
    id: 'ai-topic-14',
    number: 14,
    title: 'Agentic RAG',
    phase: 'Phase 7',
    phaseNumber: 7,
    type: 'Project',
    description: 'Autonomous retrieval systems: Self-RAG, corrective retrieval (CRAG), dynamic routing across multiple knowledge bases, query planning, and hallucination self-correction.',
    learningObjectives: [
      'Build an agentic router that dynamically chooses between multiple data sources, web search, or direct answering',
      'Implement Self-RAG: the model critiques whether retrieval is needed and grades retrieved passage relevance',
      'Implement Corrective RAG (CRAG): if retrieved passages fail relevance grading, trigger a web search fallback',
      'Implement hallucination evaluation check before returning the final answer to the user'
    ],
    keyConcepts: [
      'Self-reflective tokens and relevance grading gates',
      'Query plan decomposition for multi-hop questions requiring disparate documents',
      'Active retrieval vs static one-shot retrieval',
      'Looping graph structures for retrieval retry and prompt reformulations'
    ],
    resources: [
      { title: 'Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection', url: 'https://arxiv.org/abs/2310.11511', type: 'paper' },
      { title: 'Corrective Retrieval Augmented Generation (CRAG)', url: 'https://arxiv.org/abs/2401.15884', type: 'paper' },
      { title: 'LangChain — Agentic RAG Tutorial', url: 'https://github.com/langchain-ai/langgraph/blob/main/examples/rag/langgraph_agentic_rag.ipynb', type: 'repo' }
    ],
    practiceExercises: [
      'Construct a 3-node agentic RAG graph: 1. Grade chunks, 2. Rewrite query if irrelevant, 3. Generate grounded answer',
      'Test the agent with questions requiring 2 hops of information across 2 distinct documents'
    ]
  },
  {
    id: 'ai-topic-15',
    number: 15,
    title: 'Fine-tuning',
    phase: 'Phase 8',
    phaseNumber: 8,
    type: 'Advanced',
    description: 'Adapting model weights: LoRA (Low-Rank Adaptation), QLoRA, dataset curation, loss curves, hyperparameter tuning (learning rate, rank, alpha), and catastrophic forgetting.',
    learningObjectives: [
      'Understand when to use Prompt Engineering / RAG vs when Fine-Tuning is strictly required',
      'Master Parameter-Efficient Fine-Tuning (PEFT) and LoRA math: W_new = W_0 + (B · A) · (α / r)',
      'Learn QLoRA 4-bit NormalFloat (NF4) quantization and double quantization to train 7B+ models on consumer GPUs',
      'Prepare, clean, and format high-quality instruction datasets (JSONL, conversational turns)'
    ],
    keyConcepts: [
      'Rank (r) and Alpha (α) hyperparameters in LoRA adapter layers',
      'Catastrophic forgetting and regularization datasets',
      'Training loss vs validation loss curves: detecting overfitting',
      'Merging LoRA weights back into the base model checkpoint for zero-latency inference'
    ],
    resources: [
      { title: 'LoRA Paper — Low-Rank Adaptation of Large Language Models', url: 'https://arxiv.org/abs/2106.09685', type: 'paper' },
      { title: 'QLoRA Paper — Efficient Finetuning of Quantized LLMs', url: 'https://arxiv.org/abs/2305.14314', type: 'paper' },
      { title: 'Hugging Face PEFT Library Documentation', url: 'https://huggingface.co/docs/peft', type: 'docs' }
    ],
    practiceExercises: [
      'Format an instruction dataset of 50 custom domain examples into ChatML / OpenAI JSONL schema',
      'Calculate trainable parameter percentage for a Llama-3-8B model with LoRA rank 16 applied to all linear layers'
    ]
  },
  {
    id: 'ai-topic-16',
    number: 16,
    title: 'Open-source LLMs',
    phase: 'Phase 8',
    phaseNumber: 8,
    type: 'Advanced',
    description: 'Running and serving local weights: Llama 3, Mistral, DeepSeek, Qwen; quantization formats (GGUF, AWQ, EXL2), and local runtimes (Ollama, vLLM, llama.cpp).',
    learningObjectives: [
      'Navigate the open-weight landscape: Meta Llama 3, Mistral, Qwen 2.5, DeepSeek',
      'Understand weight quantization schemes: INT8, INT4, GGUF, AWQ, and GPTQ',
      'Run models locally using Ollama and llama.cpp on CPU/Apple Silicon/consumer GPUs',
      'Serve high-throughput OpenAI-compatible endpoints using vLLM with continuous batching and PagedAttention'
    ],
    keyConcepts: [
      'VRAM calculation rule of thumb: ~2 bytes per parameter in FP16, ~0.6-0.8 bytes in 4-bit quantized',
      'PagedAttention: managing KV cache fragmentation in GPU high-concurrency environments',
      'Continuous batching vs static batching for multi-tenant inference throughput',
      'GGUF file format and unified CPU/GPU offloading'
    ],
    resources: [
      { title: 'vLLM — High-throughput and memory-efficient inference engine', url: 'https://docs.vllm.ai/', type: 'docs' },
      { title: 'Ollama — Get up and running with large language models locally', url: 'https://ollama.com/', type: 'docs' },
      { title: 'llama.cpp GitHub Repository', url: 'https://github.com/ggerganov/llama.cpp', type: 'repo' }
    ],
    practiceExercises: [
      'Install Ollama and run a quantized 8B model locally; query its REST endpoint via curl or fetch',
      'Compare time-to-first-token (TTFT) and tokens-per-second between FP16 and INT4 quantized versions'
    ]
  },
  {
    id: 'ai-topic-17',
    number: 17,
    title: 'LLM Evaluation',
    phase: 'Phase 9',
    phaseNumber: 9,
    type: 'Production',
    description: 'Rigorous assessment of generative systems: LLM-as-a-judge, RAG triad (Faithfulness, Answer Relevance, Context Precision), Ragas, DeepEval, and golden benchmark datasets.',
    learningObjectives: [
      'Build automated golden test datasets covering core use cases, edge cases, and adversarial questions',
      'Implement LLM-as-a-judge with deterministic rubrics, pairwise comparisons, and position bias mitigation',
      'Measure RAG-specific metrics: Faithfulness (hallucination rate), Answer Relevance, and Context Recall',
      'Integrate automated evaluation into CI/CD pipelines to block regressions during prompt or model changes'
    ],
    keyConcepts: [
      'RAG Triad: Context Relevance -> Groundedness -> Answer Relevance',
      'Position bias, verbosity bias, and self-enhancement bias in judge models',
      'Deterministic metrics: Exact Match, BLEU, ROUGE, and BERTScore',
      'Continuous evaluation of production traces vs offline test sets'
    ],
    resources: [
      { title: 'Ragas — Supercharge Your LLM Application Evaluations', url: 'https://docs.ragas.io/', type: 'docs' },
      { title: 'DeepEval — The LLM Evaluation Framework', url: 'https://github.com/confident-ai/deepeval', type: 'repo' },
      { title: 'OpenAI Evals Framework', url: 'https://github.com/openai/evals', type: 'repo' }
    ],
    practiceExercises: [
      'Write an LLM-as-a-Judge evaluation prompt that scores answer groundedness on a 1-5 scale with justification',
      'Construct a 10-question evaluation dataset and run automated scoring before and after modifying a system prompt'
    ]
  },
  {
    id: 'ai-topic-18',
    number: 18,
    title: 'AI Security',
    phase: 'Phase 9',
    phaseNumber: 9,
    type: 'Production',
    description: 'Defending GenAI systems: Direct & indirect prompt injection, jailbreaking, data leakage, PII redaction, sandboxed execution, and OWASP Top 10 for LLMs.',
    learningObjectives: [
      'Master the OWASP Top 10 for Large Language Model Applications',
      'Understand Direct Prompt Injection (jailbreaking) vs Indirect Prompt Injection (malicious retrieved text)',
      'Implement input sanitization, dual-LLM pattern, and delimiter guards',
      'Implement PII detection and redaction pipelines (Microsoft Presidio) before sending data to external APIs'
    ],
    keyConcepts: [
      'Indirect prompt injection: hiding malicious instructions inside web pages or ingested PDFs',
      'Sandboxed tool execution: preventing arbitrary shell or SQL execution from model-generated tool calls',
      'System prompt extraction defenses and Canary tokens',
      'Defense in depth: structural isolation of untrusted data from instruction channels'
    ],
    resources: [
      { title: 'OWASP Top 10 for LLM Applications', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', type: 'docs' },
      { title: 'Microsoft Presidio — Data Protection and De-identification', url: 'https://microsoft.github.io/presidio/', type: 'docs' },
      { title: 'Simon Willison — Prompt Injection Explanations & Articles', url: 'https://simonwillison.net/series/prompt-injection/', type: 'guide' }
    ],
    practiceExercises: [
      'Test 3 classic prompt injection payloads against an extraction prompt and apply delimiter defense to neutralize them',
      'Implement a regex-based or Presidio PII anonymizer that masks emails, phone numbers, and SSNs before LLM dispatch'
    ]
  },
  {
    id: 'ai-topic-19',
    number: 19,
    title: 'LLMOps',
    phase: 'Phase 9',
    phaseNumber: 9,
    type: 'Production',
    description: 'Operationalizing GenAI: Tracing and observability (Langfuse, LangSmith, OpenTelemetry), prompt versioning, semantic caching, fallback routing, and latency profiling.',
    learningObjectives: [
      'Instrument LLM calls with OpenTelemetry / Langfuse for full end-to-end trace tracking and token breakdown',
      'Implement Semantic Caching (GPTCache, Redis) to return instant responses for semantically identical queries',
      'Manage prompt lifecycle: versioning, environment tagging (dev/staging/prod), and A/B rollout',
      'Build fallback cascades: if primary model throttles or fails, seamlessly fall back to secondary provider'
    ],
    keyConcepts: [
      'Traces, spans, and generation steps in multi-turn agent execution',
      'Semantic cache similarity threshold tuning (avoiding false cache hits)',
      'Cost analytics per tenant, per feature, and per prompt template',
      'Time to First Token (TTFT) and End-to-End latency metrics'
    ],
    resources: [
      { title: 'Langfuse — Open Source LLM Engineering Platform', url: 'https://langfuse.com/', type: 'docs' },
      { title: 'LangSmith — Platform for Building Production-Grade LLM Apps', url: 'https://docs.smith.langchain.com/', type: 'docs' },
      { title: 'OpenLLMetry — OpenTelemetry Extensions for LLMs', url: 'https://github.com/traceloop/openllmetry', type: 'repo' }
    ],
    practiceExercises: [
      'Set up Langfuse SDK in a TypeScript project and capture a multi-step trace with input/output tokens and cost',
      'Implement a fallback wrapper that catches model timeout errors and automatically routes to a secondary model'
    ]
  },
  {
    id: 'ai-topic-20',
    number: 20,
    title: 'Production GenAI',
    phase: 'Phase 9',
    phaseNumber: 9,
    type: 'Production',
    description: 'Architecting enterprise GenAI applications: Architecture design, end-to-end integration, high-availability, scalability, latency optimization, and governance.',
    learningObjectives: [
      'Synthesize all prior 19 modules into a complete, enterprise-grade production GenAI architecture',
      'Implement streaming architectures with WebSocket or SSE and optimistic UI updates',
      'Design graceful degradation strategies when AI models encounter partial outages',
      'Establish governance frameworks: compliance, data residency, copyright liability, and user feedback collection'
    ],
    keyConcepts: [
      'Enterprise GenAI reference architecture: Ingestion -> Retrieval -> Guardrails -> Orchestration -> Evaluation',
      'End-to-end latency budget breakdown (Network + Embedding + Vector Search + TTFT + Generation)',
      'Feedback loops: thumbs up/down, user edits, and active learning data collection',
      'Multi-region redundancy and provider-agnostic abstraction layers'
    ],
    resources: [
      { title: 'Chip Huyen — Designing Machine Learning Systems (Building LLM Apps)', url: 'https://huyenchip.com/blog/', type: 'guide' },
      { title: 'AWS Generative AI Architecture Center', url: 'https://aws.amazon.com/generative-ai/architecture/', type: 'docs' },
      { title: 'Google Cloud Generative AI Reference Architectures', url: 'https://cloud.google.com/architecture', type: 'docs' }
    ],
    practiceExercises: [
      'Draft a comprehensive architecture diagram detailing the end-to-end flow of an enterprise RAG assistant',
      'Define a production readiness checklist covering security, rate limits, monitoring, and fallback policies'
    ]
  }
];

export const AI_PHASES: AIPhaseGroup[] = [
  {
    id: 'phase-1',
    name: 'Phase 1: Foundations',
    phaseNumber: 1,
    description: 'GenAI & LLM core mechanics and tokenization basics',
    topicIds: ['ai-topic-1', 'ai-topic-2', 'ai-topic-3']
  },
  {
    id: 'phase-2',
    name: 'Phase 2: Representation & Architecture',
    phaseNumber: 2,
    description: 'High-dimensional semantic spaces and the Transformer architecture',
    topicIds: ['ai-topic-4', 'ai-topic-5']
  },
  {
    id: 'phase-3',
    name: 'Phase 3: Prompting & In-Context Learning',
    phaseNumber: 3,
    description: 'Structured prompting patterns, reasoning, and few-shot calibration',
    topicIds: ['ai-topic-6']
  },
  {
    id: 'phase-4',
    name: 'Phase 4: API Integration & Programmatic Control',
    phaseNumber: 4,
    description: 'Provider SDKs, streaming, structured outputs, and tool calling',
    topicIds: ['ai-topic-7', 'ai-topic-8', 'ai-topic-9']
  },
  {
    id: 'phase-5',
    name: 'Phase 5: Vector Search & Storage',
    phaseNumber: 5,
    description: 'Vector databases, ANN algorithms, and metadata filtering',
    topicIds: ['ai-topic-10']
  },
  {
    id: 'phase-6',
    name: 'Phase 6: Retrieval-Augmented Generation',
    phaseNumber: 6,
    description: 'End-to-end baseline RAG pipelines and chunking strategies',
    topicIds: ['ai-topic-11']
  },
  {
    id: 'phase-7',
    name: 'Phase 7: Autonomous Agents & Agentic Workflows',
    phaseNumber: 7,
    description: 'Reasoning loops, multi-agent systems, and self-correcting RAG',
    topicIds: ['ai-topic-13', 'ai-topic-14']
  },
  {
    id: 'phase-8',
    name: 'Phase 8: Advanced Retrieval & Model Adaptation',
    phaseNumber: 8,
    description: 'Hybrid search, re-ranking, LoRA fine-tuning, and open-source models',
    topicIds: ['ai-topic-12', 'ai-topic-15', 'ai-topic-16']
  },
  {
    id: 'phase-9',
    name: 'Phase 9: Production Engineering & Governance',
    phaseNumber: 9,
    description: 'Evaluation, AI security, LLMOps observability, and production scale',
    topicIds: ['ai-topic-17', 'ai-topic-18', 'ai-topic-19', 'ai-topic-20']
  }
];

export const TOTAL_AI_TOPICS = AI_CURRICULUM.length;
