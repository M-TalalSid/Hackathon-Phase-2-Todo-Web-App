# Implementation Plan: AI Agent Behavior & Tool-Oriented Reasoning

**Branch**: `006-ai-agent-reasoning` | **Date**: 2026-02-05 | **Spec**: [spec.md](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/specs/006-ai-agent-reasoning/spec.md)  
**Input**: Feature specification from `/specs/006-ai-agent-reasoning/spec.md`

---

## Summary

Implement a deterministic, stateless AI agent using OpenAI Agents SDK that interprets natural language task requests, invokes MCP tools (from Spec-005), and generates user-friendly confirmations. The agent acts as a reasoning layer only - all task mutations flow through MCP tools.

---

## Technical Context

**Language/Version**: Python 3.11+  
**Primary Dependencies**: OpenAI Agents SDK, httpx (for MCP calls)  
**Storage**: None (stateless - uses MCP layer for persistence)  
**Testing**: pytest, pytest-asyncio  
**Target Platform**: Linux/Windows server  
**Project Type**: Backend service integrated with Chat API  
**Performance Goals**: <2s response time for agent reasoning  
**Constraints**: Deterministic (temperature=0), stateless, tool-only mutations  
**Scale/Scope**: Single-agent, 5 tools, hackathon demo

---

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                          | Status | Evidence                                |
| ---------------------------------- | ------ | --------------------------------------- |
| I. Spec-Driven Development         | ✅     | Plan derived from Spec-006              |
| II. Security-First Design          | ✅     | user_id from JWT, no direct DB access   |
| III. Deterministic Reproducibility | ✅     | temperature=0, fixed model, stateless   |
| IV. Separation of Concerns         | ✅     | AI Agent layer separate from MCP/UI     |
| V. Hackathon Reviewability         | ✅     | Clear artifacts, test suite             |
| VI. Agentic Workflow               | ✅     | Agent uses tools, not direct access     |
| VII. AI & Agent Standards          | ✅     | Deterministic, auditable, tool-bound    |
| VIII. MCP Standards                | ✅     | All mutations via MCP tools             |
| IX. Statelessness                  | ✅     | No session storage, context per request |

---

## Project Structure

### Documentation (this feature)

```text
specs/006-ai-agent-reasoning/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: Technical decisions
├── data-model.md        # Phase 1: Request/response models
├── quickstart.md        # Phase 1: Setup guide
├── contracts/           # Phase 1: Interface contracts
│   ├── README.md
│   └── agent-interface.md
└── tasks.md             # Phase 2: Implementation tasks
```

### Source Code (repository root)

```text
ai-agent/
├── pyproject.toml          # Dependencies
├── README.md               # Documentation
├── .env.example            # Environment template
├── src/
│   ├── __init__.py
│   ├── agent.py            # Agent definition with tools
│   ├── runner.py           # Execution entry point
│   ├── tools/              # MCP tool wrappers
│   │   ├── __init__.py
│   │   ├── add_task.py
│   │   ├── list_tasks.py
│   │   ├── complete_task.py
│   │   ├── update_task.py
│   │   └── delete_task.py
│   └── prompts/
│       └── system.py       # System instructions
└── tests/
    ├── __init__.py
    ├── conftest.py
    ├── test_intents.py     # Intent classification tests
    └── test_agent.py       # Integration tests
```

**Structure Decision**: New `ai-agent/` directory at repository root, following same pattern as `mcp-server/`. Separate package with own dependencies.

---

## Execution Phases

### Phase 1: Agent Foundation & SDK Setup

**Goals**: Establish clean AI agent foundation aligned with constitution

**Tasks**:

- T001: Create `ai-agent/` directory structure
- T002: Create `pyproject.toml` with dependencies
- T003: Create `.env.example` with required variables
- T004: Create `README.md` with quickstart
- T005: Create `src/__init__.py` package

**Acceptance**:

- [ ] Agent directory structure created
- [ ] Dependencies defined (agents SDK, httpx)
- [ ] Environment template ready

---

### Phase 2: System Prompt & Behavior Rules

**Goals**: Define agent behavior through system instructions

**Tasks**:

- T006: Create `src/prompts/__init__.py`
- T007: Create `src/prompts/system.py` with full system prompt
- T008: Define intent-to-tool mapping rules
- T009: Define response format rules
- T010: Define error handling rules

**Acceptance**:

- [ ] System prompt covers all 5 intents
- [ ] Behavior rules prevent hallucination
- [ ] Clarification rules defined

---

### Phase 3: MCP Tool Wrappers

**Goals**: Create tool functions that invoke MCP server

**Tasks**:

- T011: Create `src/tools/__init__.py`
- T012: Implement `add_task.py` wrapper
- T013: Implement `list_tasks.py` wrapper
- T014: Implement `complete_task.py` wrapper
- T015: Implement `update_task.py` wrapper
- T016: Implement `delete_task.py` wrapper

**Acceptance**:

- [ ] All 5 tools wrapped as agent functions
- [ ] Tools have proper schema annotations
- [ ] Tools call MCP server correctly

---

### Phase 4: Agent Definition

**Goals**: Create the agent with tools bound

**Tasks**:

- T017: Create `src/agent.py` with Agent class
- T018: Register all 5 tools with agent
- T019: Configure determinism settings (temperature=0)
- T020: Add tool call logging for auditability

**Acceptance**:

- [ ] Agent initializes without errors
- [ ] All tools registered
- [ ] Settings enforce determinism

---

### Phase 5: Entry Point & Runner

**Goals**: Create execution interface for Chat API integration

**Tasks**:

- T021: Create `src/runner.py` with `process_message` function
- T022: Implement conversation history handling
- T023: Implement response formatting
- T024: Add request ID tracking

**Acceptance**:

- [ ] Entry point matches contract
- [ ] History properly injected
- [ ] Responses match format spec

---

### Phase 6: Testing

**Goals**: Validate agent behavior

**Tasks**:

- T025: Create `tests/__init__.py` and `conftest.py`
- T026: Create `tests/test_intents.py` for intent classification
- T027: Create `tests/test_agent.py` for integration
- T028: Add ambiguity handling tests
- T029: Add error handling tests

**Acceptance**:

- [ ] ≥95% intent classification accuracy
- [ ] All error cases covered
- [ ] Ambiguity triggers clarification

---

### Phase 7: Polish

**Goals**: Final improvements and documentation

**Tasks**:

- T030: Add structured logging
- T031: Update README with full documentation
- T032: Verify determinism with replay tests
- T033: Run quickstart validation

**Acceptance**:

- [ ] Logging enabled for auditing
- [ ] Documentation complete
- [ ] Determinism verified

---

## Decisions Log

| Decision        | Choice               | Rationale                        |
| --------------- | -------------------- | -------------------------------- |
| SDK             | OpenAI Agents SDK    | Native tool binding, determinism |
| Model           | gpt-4o-mini          | Cost-effective, fast, capable    |
| Determinism     | temperature=0        | Identical outputs guaranteed     |
| MCP Integration | Thin wrappers        | Layer separation                 |
| History         | Injected per request | Stateless design                 |

---

## Completion Criteria

Spec-006 is complete when:

- [ ] Agent correctly interprets all 5 supported intents
- [ ] All task actions occur only through MCP tools
- [ ] Agent remains stateless and deterministic
- [ ] Errors are handled gracefully
- [ ] AI behavior is auditable via tool call logs
- [ ] ≥95% intent classification accuracy in tests
