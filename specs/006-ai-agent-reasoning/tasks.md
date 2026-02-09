# Implementation Tasks: AI Agent Behavior & Tool-Oriented Reasoning

**Feature**: 006-ai-agent-reasoning  
**Branch**: `006-ai-agent-reasoning`  
**Date**: 2026-02-05  
**Status**: ✅ COMPLETE  
**Source**: [plan.md](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/specs/006-ai-agent-reasoning/plan.md) | [spec.md](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/specs/006-ai-agent-reasoning/spec.md)

---

## Phase 1: Setup

**Goal**: Initialize project structure and dependencies

- [x] T001 Create `ai-agent/` directory at repository root
- [x] T002 Create `ai-agent/pyproject.toml` with dependencies (openai-agents, httpx, python-dotenv, pydantic)
- [x] T003 Create `ai-agent/.env.example` with OPENAI_API_KEY, MCP_SERVER_URL, AGENT_MODEL, AGENT_TEMPERATURE
- [x] T004 Create `ai-agent/README.md` with quickstart documentation
- [x] T005 Create `ai-agent/.gitignore` for Python project
- [x] T006 Create `ai-agent/src/__init__.py` package file
- [x] T007 Create `ai-agent/src/prompts/__init__.py` package file
- [x] T008 Create `ai-agent/src/tools/__init__.py` package file
- [x] T009 Create `ai-agent/tests/__init__.py` package file

---

## Phase 2: Foundational

**Goal**: Create system prompt and core agent infrastructure

- [x] T010 Create `ai-agent/src/prompts/system.py` with complete system prompt including:
  - Agent identity and role
  - Intent-to-tool mapping rules (add/create/remember → add_task, show/list → list_tasks, etc.)
  - Response format rules (clear confirmations, no emojis, no internal details)
  - Error handling rules (translate error codes to friendly messages)
  - Ambiguity handling rules (ask clarifying questions, never guess)
  - Security rules (treat user_id as opaque, no SQL generation)
- [x] T011 Create `ai-agent/src/models.py` with AgentRequest and AgentResponse dataclasses per contracts/agent-interface.md
- [x] T012 Create `ai-agent/src/config.py` for environment configuration (API keys, model settings, temperature=0)

---

## Phase 3: User Story 1 - Create Task (P1)

**Goal**: AI creates task from natural language  
**Independent Test**: Send "remind me to call mom tomorrow" → verify add_task invoked → verify confirmation returned

- [x] T013 [US1] Create `ai-agent/src/tools/add_task.py` with @function_tool wrapper that:
  - Accepts user_id, title, description parameters
  - Calls MCP server add_task tool via httpx
  - Returns structured result
  - Has proper docstring for agent
- [x] T014 [P] [US1] Create `ai-agent/tests/test_add_task_intent.py` with test cases:
  - "add a task to buy groceries" → add_task called
  - "remember to call mom" → add_task called
  - "I need to finish the report" → add_task called

---

## Phase 4: User Story 2 - List Tasks (P1)

**Goal**: AI lists user tasks with status filter  
**Independent Test**: Send "show my pending tasks" → verify list_tasks invoked with status="pending" → verify formatted list returned

- [x] T015 [US2] Create `ai-agent/src/tools/list_tasks.py` with @function_tool wrapper that:
  - Accepts user_id, status (optional) parameters
  - Calls MCP server list_tasks tool
  - Returns structured result with task list
- [x] T016 [P] [US2] Create `ai-agent/tests/test_list_tasks_intent.py` with test cases:
  - "show my pending tasks" → list_tasks with status="pending"
  - "what do I have to do?" → list_tasks with status="pending"
  - "show completed tasks" → list_tasks with status="completed"

---

## Phase 5: User Story 3 - Complete Task (P1)

**Goal**: AI marks task as complete  
**Independent Test**: Send "mark task 5 as done" → verify complete_task with task_id=5 → verify confirmation

- [x] T017 [US3] Create `ai-agent/src/tools/complete_task.py` with @function_tool wrapper that:
  - Accepts user_id, task_id parameters
  - Calls MCP server complete_task tool
  - Returns completion result
- [x] T018 [P] [US3] Create `ai-agent/tests/test_complete_task_intent.py` with test cases:
  - "mark task 3 as done" → complete_task with task_id=3
  - "I finished task 1" → complete_task with task_id=1
  - "done with task 7" → complete_task with task_id=7

---

## Phase 6: User Story 4 - Delete Task (P2)

**Goal**: AI deletes task with confirmation  
**Independent Test**: Send "remove task 4" → verify delete_task with task_id=4 → verify confirmation

- [x] T019 [US4] Create `ai-agent/src/tools/delete_task.py` with @function_tool wrapper that:
  - Accepts user_id, task_id parameters
  - Calls MCP server delete_task tool
  - Returns deletion result
- [x] T020 [P] [US4] Create `ai-agent/tests/test_delete_task_intent.py` with test cases:
  - "delete task 2" → delete_task with task_id=2
  - "cancel task 9" → delete_task with task_id=9
  - "remove task 4" → delete_task with task_id=4

---

## Phase 7: User Story 5 - Update Task (P2)

**Goal**: AI updates task properties  
**Independent Test**: Send "rename task 3 to 'Buy milk'" → verify update_task with task_id=3 and title="Buy milk"

- [x] T021 [US5] Create `ai-agent/src/tools/update_task.py` with @function_tool wrapper that:
  - Accepts user_id, task_id, title (optional), description (optional) parameters
  - Calls MCP server update_task tool
  - Returns update result
- [x] T022 [P] [US5] Create `ai-agent/tests/test_update_task_intent.py` with test cases:
  - "change task 1 to call mom" → update_task with title
  - "update task 5 description to include deadline" → update_task with description
  - "edit task 2 to say urgent" → update_task with title

---

## Phase 8: User Story 6 - Ambiguity Handling (P2)

**Goal**: AI asks clarifying questions when intent is unclear  
**Independent Test**: Send "delete the meeting task" (no ID) → verify NO tool called → verify clarifying question returned

- [x] T023 [US6] Update `ai-agent/src/prompts/system.py` to add explicit ambiguity detection rules:
  - No task ID for complete/delete/update → ask for clarification
  - Multiple possible matches → list options and ask which one
  - Unclear intent → ask targeted clarifying question
- [x] T024 [P] [US6] Create `ai-agent/tests/test_ambiguity_handling.py` with test cases:
  - "delete the meeting task" → no tool, clarifying question
  - "complete that task" (no context) → no tool, clarifying question
  - "do something with task 3" → no tool, clarifying question

---

## Phase 9: User Story 7 - Error Handling (P2)

**Goal**: AI translates tool errors to friendly messages  
**Independent Test**: Complete non-existent task → verify NOT_FOUND error → verify friendly message returned

- [x] T025 [US7] Update `ai-agent/src/prompts/system.py` to add error translation rules:
  - NOT_FOUND → "I couldn't find that task. Would you like to see your task list?"
  - AUTH_REQUIRED → "There was an authentication issue. Please try again."
  - VALIDATION_ERROR → "I need more information. [Ask for details]"
  - SERVICE_UNAVAILABLE → "I'm having trouble connecting. Please try again."
- [x] T026 [P] [US7] Create `ai-agent/tests/test_error_handling.py` with test cases:
  - NOT_FOUND error → friendly message
  - AUTH_REQUIRED error → friendly message
  - SERVICE_UNAVAILABLE error → friendly message

---

## Phase 10: Agent Definition & Runner

**Goal**: Create agent with tools bound and entry point

- [x] T027 Create `ai-agent/src/agent.py` with Agent class:
  - Import all 5 tool wrappers
  - Create Agent with name="TaskAgent", model from config
  - Load system prompt from prompts/system.py
  - Register all tools
  - Configure determinism settings (temperature=0, max_tokens=500)
- [x] T028 Create `ai-agent/src/runner.py` with `process_message` function:
  - Accept user_id, message, conversation_history, request_id
  - Build messages from history
  - Run agent with complete context
  - Return AgentResponse with message, success, tool_calls, request_id
- [x] T029 [P] Create `ai-agent/tests/conftest.py` with test fixtures:
  - Mock MCP server responses
  - Sample conversation histories
  - Test user IDs

---

## Phase 11: Integration Testing

**Goal**: Validate complete agent behavior

- [x] T030 Create `ai-agent/tests/test_agent_integration.py` with end-to-end tests:
  - Create → List → Complete → Delete flow
  - Context reference resolution ("that task")
  - Mixed intent handling
  - Determinism verification (identical inputs → identical outputs)
- [x] T031 [P] Create `ai-agent/tests/test_determinism.py` with replay tests:
  - Run same input 3 times
  - Verify identical tool calls each time
  - Verify identical responses each time

---

## Phase 12: Polish

**Goal**: Final improvements and documentation

- [x] T032 Add structured logging to `ai-agent/src/runner.py`:
  - Log request_id, user_id (masked), intent, tool_calls
  - Log response time
  - Log errors with context
- [x] T033 Update `ai-agent/README.md` with:
  - Complete API documentation
  - Environment variables
  - Example usage
  - Troubleshooting guide
- [x] T034 Run full test suite and verify ≥95% intent classification accuracy
- [x] T035 Verify MCP integration works with running MCP server

---

## Summary

| Category              | Count | Status      |
| --------------------- | ----- | ----------- |
| Total Tasks           | 35    | ✅ 35/35    |
| Setup Tasks           | 9     | ✅ Complete |
| Foundational Tasks    | 3     | ✅ Complete |
| US1 (Create) Tasks    | 2     | ✅ Complete |
| US2 (List) Tasks      | 2     | ✅ Complete |
| US3 (Complete) Tasks  | 2     | ✅ Complete |
| US4 (Delete) Tasks    | 2     | ✅ Complete |
| US5 (Update) Tasks    | 2     | ✅ Complete |
| US6 (Ambiguity) Tasks | 2     | ✅ Complete |
| US7 (Errors) Tasks    | 2     | ✅ Complete |
| Agent/Runner Tasks    | 3     | ✅ Complete |
| Integration Tasks     | 2     | ✅ Complete |
| Polish Tasks          | 4     | ✅ Complete |
| Tests Passing         | 71    | ✅ 100%     |
