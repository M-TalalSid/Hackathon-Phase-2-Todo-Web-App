# Quickstart: AI Agent

**Feature**: 006-ai-agent-reasoning  
**Prerequisite**: MCP Server running (Spec-005)

---

## 1. Setup

```bash
# Navigate to ai-agent directory
cd ai-agent

# Install dependencies with uv
uv sync --all-extras

# Copy environment template
cp .env.example .env
```

## 2. Configure Environment

Edit `.env`:

```bash
# OpenAI API Key (required)
OPENAI_API_KEY=sk-...

# MCP Server URL (if running separately)
MCP_SERVER_URL=http://localhost:8000

# Agent Settings
AGENT_MODEL=gpt-4o-mini
AGENT_TEMPERATURE=0
```

## 3. Run Agent

### Interactive Mode

```bash
uv run python -m src.runner --user-id "test_user" --interactive
```

### Single Request

```bash
uv run python -m src.runner \
  --user-id "test_user" \
  --message "Add a task to buy groceries"
```

## 4. Test Intent Classification

```bash
# Run intent tests
uv run pytest tests/test_intents.py -v
```

## 5. Example Session

```
> Add a task to buy groceries
Task 'Buy groceries' has been added to your list.

> Show my pending tasks
Here are your pending tasks:
1. Buy groceries

> Mark task 1 as done
Task 'Buy groceries' has been marked as complete.

> Delete task 1
Task 'Buy groceries' has been deleted.
```

## 6. Integration with Chat API

```python
from ai_agent import process_message

# Called by Chat API (Spec-007)
response = await process_message(
    user_id="authenticated_user_id",
    message="Show my tasks",
    conversation_history=[
        {"role": "user", "content": "Add a task to call mom"},
        {"role": "assistant", "content": "Task 'Call mom' has been added."}
    ]
)

print(response.message)
```

---

## Troubleshooting

| Issue                 | Solution                          |
| --------------------- | --------------------------------- |
| OpenAI API error      | Check `OPENAI_API_KEY` is set     |
| MCP connection failed | Ensure MCP server is running      |
| Tool not found        | Verify MCP tools are registered   |
| Empty response        | Check conversation history format |
