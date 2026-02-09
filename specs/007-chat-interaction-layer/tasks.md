# Implementation Tasks: Chat API + Chat UI (Interaction Layer)

**Feature**: 007-chat-interaction-layer  
**Branch**: `007-chat-interaction-layer`  
**Date**: 2026-02-06  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Task Summary

| Phase     | Description                 | Tasks  | Status              |
| --------- | --------------------------- | ------ | ------------------- |
| 1         | Setup                       | 6      | ✅ Complete         |
| 2         | Foundational (Database)     | 5      | ✅ Complete         |
| 3         | US1: Start New Conversation | 6      | ✅ Complete         |
| 4         | US2: Continue Conversation  | 4      | ✅ Complete         |
| 5         | US3: Manage Tasks via NL    | 4      | ✅ Complete         |
| 6         | US4: Chat UI Experience     | 8      | ✅ Complete         |
| 7         | US5+6: Security & Errors    | 6      | ✅ Complete         |
| 8         | Polish & Validation         | 5      | ✅ Complete         |
| **Total** |                             | **44** | **✅ All Complete** |

---

## Phase 1: Setup ✅

Project initialization and environment setup.

- [x] T001 Create backend/src/models/chat.py with empty module
- [x] T002 [P] Create backend/src/repositories/chat.py with empty module
- [x] T003 [P] Create backend/src/services/chat.py with empty module
- [x] T004 [P] Create backend/src/api/chat.py with empty module
- [x] T005 [P] Create frontend/src/app/chat/page.tsx placeholder
- [x] T006 Create frontend/src/components/chat/ directory structure

---

## Phase 2: Foundational (Database & Models) ✅

Database models and migrations required by all user stories.

- [x] T007 Implement Conversation SQLModel class in backend/src/models/chat.py per data-model.md
- [x] T008 [P] Implement Message SQLModel class in backend/src/models/chat.py per data-model.md
- [x] T009 Create Alembic migration for conversations table in backend/alembic/versions/
- [x] T010 [P] Create Alembic migration for messages table in backend/alembic/versions/
- [x] T011 Run migrations and verify tables created in Neon PostgreSQL

---

## Phase 3: User Story 1 - Start New Conversation (P1) ✅

- [x] T012 [US1] Implement create_conversation(user_id) in backend/src/repositories/chat.py
- [x] T013 [P] [US1] Implement save_message(conversation_id, role, content, tool_calls) in backend/src/repositories/chat.py
- [x] T014 [US1] Implement ChatService.start_conversation() in backend/src/services/chat.py
- [x] T015 [US1] Create POST /api/{user_id}/chat endpoint skeleton in backend/src/api/chat.py
- [x] T016 [P] [US1] Add JWT authentication dependency to chat endpoint in backend/src/api/chat.py
- [x] T017 [US1] Implement new conversation flow (no conversation_id case) in backend/src/api/chat.py

---

## Phase 4: User Story 2 - Continue Existing Conversation (P1) ✅

- [x] T018 [US2] Implement get_conversation(conversation_id, user_id) in backend/src/repositories/chat.py
- [x] T019 [P] [US2] Implement get_messages(conversation_id, limit=50) in backend/src/repositories/chat.py
- [x] T020 [US2] Implement ChatService.continue_conversation() with history loading in backend/src/services/chat.py
- [x] T021 [P] [US2] Add conversation_id handling to POST /api/{user_id}/chat in backend/src/api/chat.py

---

## Phase 5: User Story 3 - Manage Tasks via Natural Language (P1) ✅

- [x] T022 [US3] Import process_message from ai-agent (Spec-6) in backend/src/services/chat.py
- [x] T023 [P] [US3] Implement format_conversation_history() helper in backend/src/services/chat.py
- [x] T024 [US3] Integrate AI Agent invocation in ChatService.process_user_message() in backend/src/services/chat.py
- [x] T025 [P] [US3] Handle and persist tool_calls in assistant response in backend/src/services/chat.py

---

## Phase 6: User Story 4 - Chat UI Experience (P1) ✅

- [x] T026 [US4] Create ChatContainer component in frontend/src/components/chat/ChatContainer.tsx
- [x] T027 [P] [US4] Create ChatBubble component (user/assistant variants) in frontend/src/components/chat/ChatBubble.tsx
- [x] T028 [P] [US4] Create ChatInput component with send button in frontend/src/components/chat/ChatInput.tsx
- [x] T029 [P] [US4] Create TypingIndicator component in frontend/src/components/chat/TypingIndicator.tsx
- [x] T030 [US4] Create ChatMessageList component with auto-scroll in frontend/src/components/chat/ChatMessageList.tsx
- [x] T031 [P] [US4] Create chatApi service in frontend/src/services/chatApi.ts
- [x] T032 [US4] Implement /chat page with auth protection in frontend/src/app/chat/page.tsx
- [x] T033 [US4] Add loading state management and input disabling during requests in frontend/src/app/chat/page.tsx

---

## Phase 7: User Stories 5 & 6 - Security & Error Handling (P2) ✅

- [x] T034 [US5] Implement user ownership validation (user_id in path matches JWT) in backend/src/api/chat.py
- [x] T035 [P] [US5] Add cross-user conversation access check (403) in backend/src/api/chat.py
- [x] T036 [P] [US5] Implement input sanitization for user messages in backend/src/services/chat.py
- [x] T037 [US6] Implement structured error responses with user-safe messages in backend/src/api/chat.py
- [x] T038 [P] [US6] Add agent timeout handling with retry suggestion in backend/src/services/chat.py
- [x] T039 [US6] Create ErrorBanner component with retry in frontend/src/components/chat/ErrorBanner.tsx

---

## Phase 8: Polish & Validation ✅

- [x] T040 Add ARIA labels and keyboard navigation to all chat components in frontend/src/components/chat/
- [x] T041 [P] Add mobile responsive styles (sticky input, safe spacing) to ChatContainer in frontend/src/components/chat/ChatContainer.tsx
- [x] T042 Add tool_calls badge display to ChatBubble for assistant messages in frontend/src/components/chat/ChatBubble.tsx
- [x] T043 [P] Add empty state with usage hints to /chat page in frontend/src/app/chat/page.tsx
- [x] T044 Run end-to-end validation: create conversation, send messages, verify persistence, check mobile layout

---

## Implementation Complete ✅

All 44 tasks completed. Feature ready for verification.
