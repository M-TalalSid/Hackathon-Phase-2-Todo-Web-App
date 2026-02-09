# Research: AI Agent Behavior & Tool-Oriented Reasoning

**Feature**: 006-ai-agent-reasoning  
**Date**: 2026-02-05  
**Purpose**: Resolve technical unknowns before implementation

---

## Research Topic 1: OpenAI Agents SDK Integration

**Question**: How to implement a stateless, deterministic agent using OpenAI Agents SDK?

**Decision**: Use OpenAI Agents SDK with strict configuration for determinism

**Rationale**:

- OpenAI Agents SDK provides native tool binding with schema validation
- Supports system instructions for behavior rules
- Temperature=0 ensures deterministic responses
- Built-in tool result handling for confirmations

**Key Configuration**:

```python
from agents import Agent, Runner

agent = Agent(
    name="TaskAgent",
    model="gpt-4o-mini",  # Cost-effective, fast
    instructions=SYSTEM_PROMPT,
    tools=[add_task, list_tasks, complete_task, update_task, delete_task],
)

# Deterministic settings
runner = Runner(
    agent=agent,
    model_settings={"temperature": 0, "max_tokens": 500}
)
```

**Alternatives Considered**:

- LangChain: More complex, overkill for single-agent use case
- Raw OpenAI API: Lacks built-in tool handling
- Custom framework: Not suitable for hackathon timeline

---

## Research Topic 2: MCP Tool Integration

**Question**: How to bind MCP tools from Spec-005 to the OpenAI Agent?

**Decision**: Create thin wrapper functions that call MCP tool endpoints

**Rationale**:

- MCP tools are already implemented in `mcp-server/`
- Agent needs Python functions that invoke MCP operations
- Wrappers translate agent parameters to MCP tool calls
- Keeps agent layer separate from MCP implementation

**Implementation Pattern**:

```python
from agents import function_tool

@function_tool
async def add_task(user_id: str, title: str, description: str = None) -> dict:
    """Add a new task for the authenticated user."""
    # Call MCP server tool
    result = await mcp_client.call_tool("add_task", {
        "user_id": user_id,
        "title": title,
        "description": description
    })
    return result
```

**Alternatives Considered**:

- Direct database access: Violates constitution (layer separation)
- Inline tool logic: Violates statelessness requirement
- HTTP calls to separate server: Added complexity for hackathon

---

## Research Topic 3: Statelessness Architecture

**Question**: How to ensure agent remains stateless between requests?

**Decision**: Agent receives complete context per request, no session storage

**Rationale**:

- Each request includes full conversation history from Chat API
- Agent instance created fresh per request (or runner reused with no state)
- All task data comes from MCP tools, not agent memory
- Identical inputs always produce identical outputs

**Implementation Pattern**:

```python
async def process_message(user_id: str, message: str, history: list[dict]) -> str:
    """Process a user message with full conversation context."""
    # Build messages from history
    messages = [{"role": msg["role"], "content": msg["content"]} for msg in history]
    messages.append({"role": "user", "content": message})

    # Run agent with complete context
    result = await runner.run(messages, context={"user_id": user_id})
    return result.final_output
```

**Context Resolution**:

- References like "that task" or "task 3" resolved from conversation history
- History injected by Chat API layer (Spec-007)
- Agent never stores history internally

---

## Research Topic 4: Intent Classification Strategy

**Question**: How to reliably classify user intent without hardcoded rules?

**Decision**: Use system prompt with explicit intent-to-tool mapping guidance

**Rationale**:

- LLM-based classification is more robust than keyword matching
- System prompt defines clear mapping rules
- Agent reasons about intent before selecting tool
- Handles natural language variations gracefully

**System Prompt Structure**:

```text
You are a Task Management Assistant. You help users manage their tasks.

INTENT MAPPING:
- "add", "create", "remember", "note", "remind me" → add_task
- "show", "list", "what are", "do I have", "pending" → list_tasks
- "done", "complete", "finished", "mark as done" → complete_task
- "delete", "remove", "cancel" → delete_task
- "update", "change", "rename", "edit" → update_task

RULES:
- Always use a tool for task operations - never fabricate data
- If task reference is unclear, ask for clarification
- Confirm actions after tool completion
- Never expose internal errors or tool schemas
```

---

## Research Topic 5: Error Handling Strategy

**Question**: How to handle MCP tool errors gracefully?

**Decision**: Translate error codes to user-friendly messages in agent instructions

**Rationale**:

- MCP tools return structured errors (AUTH_REQUIRED, NOT_FOUND, etc.)
- Agent instructions specify how to handle each error type
- User never sees technical error codes
- Agent provides actionable guidance

**Error Translation Rules**:

```text
ERROR HANDLING:
- NOT_FOUND → "I couldn't find that task. Would you like to see your task list?"
- AUTH_REQUIRED → "There was an authentication issue. Please try again."
- VALIDATION_ERROR → "I need more information. [Ask for missing details]"
- SERVICE_UNAVAILABLE → "I'm having trouble connecting. Please try again."
```

---

## Research Topic 6: Determinism Configuration

**Question**: How to guarantee identical behavior for identical inputs?

**Decision**: Use temperature=0, fixed model, structured output format

**Rationale**:

- Temperature=0 eliminates sampling randomness
- Fixed model version prevents behavior drift
- Structured confirmations ensure consistent output format
- Seed parameter can be used for additional determinism

**Configuration**:

```python
model_settings = {
    "temperature": 0,      # Deterministic
    "max_tokens": 500,     # Consistent output length
    "top_p": 1.0,          # No nucleus sampling
}
```

---

## Research Topic 7: Project Structure

**Question**: Where should the AI Agent code live in the repository?

**Decision**: Create `ai-agent/` directory at repository root

**Rationale**:

- Separate from `mcp-server/` (different layer in architecture)
- Contains agent definition, tool wrappers, and system prompt
- Python package with its own dependencies
- Follows same pattern as MCP server

**Structure**:

```text
ai-agent/
├── pyproject.toml
├── README.md
├── .env.example
├── src/
│   ├── __init__.py
│   ├── agent.py          # Agent definition
│   ├── tools/            # Tool wrappers for MCP
│   │   ├── __init__.py
│   │   ├── add_task.py
│   │   ├── list_tasks.py
│   │   ├── complete_task.py
│   │   ├── update_task.py
│   │   └── delete_task.py
│   ├── prompts/          # System instructions
│   │   └── system.py
│   └── runner.py         # Execution entry point
└── tests/
    └── test_intents.py   # Intent classification tests
```

---

## Summary of Decisions

| Topic                 | Decision                        | Justification                            |
| --------------------- | ------------------------------- | ---------------------------------------- |
| SDK                   | OpenAI Agents SDK               | Native tool binding, determinism support |
| MCP Integration       | Thin wrapper functions          | Layer separation, reuse existing tools   |
| Statelessness         | Fresh context per request       | No session storage, deterministic        |
| Intent Classification | LLM-based with prompt guidance  | Robust, handles variations               |
| Error Handling        | Translate in agent instructions | User-friendly, no tech exposure          |
| Determinism           | temperature=0, fixed model      | Identical outputs guaranteed             |
| Structure             | `ai-agent/` directory           | Separate from MCP server layer           |
