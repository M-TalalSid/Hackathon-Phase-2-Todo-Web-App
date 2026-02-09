# Research: Chat API + Chat UI (Interaction Layer)

**Feature**: 007-chat-interaction-layer  
**Date**: 2026-02-06

## Research Questions Resolved

### R1: Chat UI Component Library Selection

**Decision**: OpenAI ChatKit  
**Rationale**:

- Designed specifically for AI chat interfaces
- Built-in support for user/assistant message differentiation
- Loading indicators and typing states included
- Accessible by default
- Aligned with project constitution (specified in technology stack)

**Alternatives Considered**:

- Custom React components: More work, less polished
- Vercel AI SDK UI: Good but ChatKit more purpose-built

---

### R2: Conversation Persistence Strategy

**Decision**: Database-backed with Neon PostgreSQL  
**Rationale**:

- Constitution mandates Neon Serverless PostgreSQL
- Stateless API requires all context from DB per request
- Survives server restarts
- User isolation enforced at database level

**Alternatives Considered**:

- Redis for session storage: Violates stateless principle
- LocalStorage: Doesn't persist across devices

---

### R3: AI Agent Integration Pattern

**Decision**: Direct function call to `process_message()` from Spec-6  
**Rationale**:

- AI Agent (Spec-6) already implements all reasoning
- Simple async function call with conversation history
- Returns response + tool_calls in structured format
- No HTTP overhead for internal call

**Alternatives Considered**:

- HTTP call to agent service: Unnecessary complexity
- WebSocket: Overkill for request-response pattern

---

### R4: Message Ordering Strategy

**Decision**: Use `created_at` timestamp with database ordering  
**Rationale**:

- Simple and reliable
- Natural ordering matches user expectation
- Index on (conversation_id, created_at) for efficient queries

**Alternatives Considered**:

- Sequence numbers: Additional complexity not needed

---

### R5: Conversation Context Window Management

**Decision**: Load last 50 messages per request  
**Rationale**:

- Balances context quality with token limits
- Sufficient for typical task management conversations
- Can be tuned via environment variable

**Alternatives Considered**:

- Sliding window with summarization: Future enhancement
- Full history: Token limit risks

---

### R6: Error Handling Strategy

**Decision**: Structured error responses with user-safe messages  
**Rationale**:

- No stack traces exposed to users
- Friendly error messages with retry hints
- Error codes for frontend to handle appropriately

**Error Code Mapping**:
| Backend Error | HTTP Status | User Message |
|---------------|-------------|--------------|
| Auth failure | 401 | "Please sign in to continue" |
| Not found | 404 | "Conversation not found" |
| Forbidden | 403 | "You don't have access to this conversation" |
| Agent timeout | 500 | "I'm having trouble responding. Please try again." |
| MCP failure | 500 | "Something went wrong with that action. Please try again." |

---

## Technology Stack Confirmation

| Component | Technology                 | Source       |
| --------- | -------------------------- | ------------ |
| Frontend  | Next.js 16+ (App Router)   | Constitution |
| Chat UI   | OpenAI ChatKit             | Constitution |
| API Layer | FastAPI                    | Constitution |
| AI Agent  | OpenAI Agents SDK (Spec-6) | Spec-6       |
| MCP Tools | MCP SDK (Spec-5)           | Spec-5       |
| Database  | Neon PostgreSQL            | Constitution |
| Auth      | Better Auth (JWT)          | Constitution |
| ORM       | SQLModel                   | Constitution |

---

## Best Practices Applied

### FastAPI Stateless Chat API

- No in-memory session storage
- Load conversation from DB on every request
- Return complete response in single call
- Use dependency injection for DB sessions

### OpenAI ChatKit Integration

- Use `ChatContainer` for layout
- `ChatMessageList` for history rendering
- `ChatInput` with disabled state during loading
- Custom styling via CSS variables

### SQLModel Async Patterns

- Use `async_sessionmaker` for connection pooling
- `selectinload` for eager loading relationships
- Proper transaction handling for message persistence
