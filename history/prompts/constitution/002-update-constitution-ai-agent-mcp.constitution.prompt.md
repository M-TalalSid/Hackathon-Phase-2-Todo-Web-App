---
id: 002
title: Update Constitution for AI Agent MCP Architecture
stage: constitution
date: 2026-02-03
surface: agent
model: claude-sonnet-4
feature: none
branch: main
user: TALAL
command: /sp.constitution
labels: ["constitution", "ai-agent", "mcp", "architecture", "major-update"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A (constitution update)
---

## Prompt

/sp.constitution ( Update )

Project: AI-Augmented Multi-User Todo Platform (Spec-Driven, Agentic Architecture)

Objective:
Evolve a secure, multi-user todo web application into an AI-augmented system that supports both traditional UI-based task management and natural-language interaction via deterministic AI agents and MCP tools — built entirely using a spec-driven, agentic development workflow.

Core Principles:

- Spec-driven development (spec → plan → tasks → implementation)
- Zero manual coding (all code generated via Claude Code)
- Deterministic, reproducible system behavior
- Clear separation of concerns across all layers
- AI agents must operate strictly through declared tools
- Stateless server architecture with persistent storage
- Security-first design at every layer

Non-Negotiable Rules:

- No feature may be implemented without an approved spec and plan
- No AI agent may access the database directly
- No hidden logic outside specs and plans
- No manual code edits post-generation
- All state must be persisted in the database, not memory
- All agent actions must be explainable via tool calls

[Full prompt included new sections for: Architectural Separation of Concerns (5-layer model), AI & Agent Standards, MCP Standards, Conversation & Statelessness Standards, Security Standards, Technology Constraints, API & Tooling Standards, Quality & Reliability Constraints, Process Constraints, and Success Criteria]

## Response snapshot

Updated constitution from v1.0.0 to v2.0.0 (MAJOR version bump).

**Key Changes:**

1. Added 3 new NON-NEGOTIABLE principles:
   - VII. AI & Agent Standards (agents use OpenAI Agents SDK, operate only via MCP tools)
   - VIII. MCP Standards (Official MCP SDK, stateless tools, user ownership enforcement)
   - IX. Conversation & Statelessness Standards (database-backed context reconstruction)

2. Defined explicit 5-layer architecture model:
   - Frontend UI Layer (Next.js, OpenAI ChatKit)
   - API Layer (FastAPI REST/chat endpoints)
   - AI Agent Layer (OpenAI Agents SDK)
   - MCP Tool Layer (Official MCP SDK)
   - Data Persistence Layer (SQLModel + PostgreSQL)

3. Expanded Technology Stack table with AI SDK, MCP SDK, ChatKit

4. Added 6 new success criteria for AI chatbot functionality

5. Added Non-Negotiable Rules Summary section in Governance

## Outcome

- ✅ Impact: Major constitution update enabling AI-augmented todo platform architecture
- 🧪 Tests: N/A (constitution document)
- 📁 Files: Updated `.specify/memory/constitution.md`
- 🔁 Next prompts: `/sp.specify` for AI chatbot feature, MCP server implementation spec
- 🧠 Reflection: Constitution now provides clear architectural boundaries for AI agent development with strict tool-based operation model

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All placeholders filled, version bump justified
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Validate specs align with new principles during next feature development
