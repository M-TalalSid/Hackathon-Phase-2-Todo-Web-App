# Quickstart: Chat API + Chat UI

**Feature**: 007-chat-interaction-layer  
**Time to Complete**: ~2-3 hours

## Prerequisites

- [ ] Backend server running (FastAPI)
- [ ] Neon PostgreSQL database configured
- [ ] Better Auth JWT authentication working
- [ ] AI Agent (Spec-6) implemented and tested
- [ ] MCP Server (Spec-5) running and accessible
- [ ] Frontend Next.js app running

## Quick Setup

### 1. Run Database Migrations

```bash
cd backend
alembic upgrade head
```

### 2. Verify Dependencies

```bash
# Backend
pip install sqlmodel httpx

# Frontend (if using ChatKit)
npm install @openai/chatkit
```

### 3. Environment Configuration

Add to `.env`:

```env
# Already configured from previous specs
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret
OPENAI_API_KEY=your-key
MCP_SERVER_URL=http://localhost:8000
```

## API Test Commands

### Create New Conversation

```bash
curl -X POST http://localhost:8000/api/user_123/chat \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a task to buy groceries"}'
```

### Continue Conversation

```bash
curl -X POST http://localhost:8000/api/user_123/chat \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"conversation_id": 1, "message": "Show my tasks"}'
```

## Implementation Order

1. **Database Models** (30 min)
   - Create `Conversation` and `Message` SQLModel classes
   - Run database migration

2. **Repository Layer** (30 min)
   - `create_conversation()`
   - `get_conversation()`
   - `get_messages()`
   - `save_message()`

3. **Chat API Endpoint** (45 min)
   - POST /api/{user_id}/chat
   - JWT middleware
   - Request validation
   - AI Agent integration

4. **Chat UI Page** (45 min)
   - Protected /chat route
   - ChatKit components
   - Message send/receive flow

5. **Polish & Testing** (30 min)
   - Error handling
   - Loading states
   - Mobile responsiveness

## Verification Checklist

- [ ] New conversation creates DB record
- [ ] Messages persist across page reloads
- [ ] AI agent returns tool_calls
- [ ] MCP tools execute correctly
- [ ] Error messages are user-friendly
- [ ] Mobile layout works
- [ ] Loading indicator shows during processing
