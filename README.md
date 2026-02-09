Hackathon Todo Project

A comprehensive todo management system built for the **GIAIC Q4 Hackathon (Project 2)**. This repository contains two applications:

1. **Todo Console App** - A terminal-based todo application with a rich, interactive TUI built using Python's Textual framework
2. **Todo Web App** - A full-stack AI-powered web application with Next.js 16, FastAPI, and an intelligent chatbot assistant

---

🌟 Project Overview

Todo Web Application (Primary)

The web application is an **AI-powered task management system** featuring:

- 🤖 AI Chatbot: Natural language task management via ChatKit + LiteLLM (Gemini/Groq)
- 📋 Smart Task Management: Create, update, delete, and filter tasks with a beautiful UI
- 🔐 Secure Authentication: Better Auth with JWT and PostgreSQL session storage
- 🎨 Modern UI/UX: Lightswind components, Framer Motion animations
- 📱 Responsive Design: Desktop sidebar + mobile bottom navigation
- 🚀 Production Ready: Docker support and Kubernetes deployment (Helm/Minikube)

---

🛠 Technology Stack

Web Application

| Layer          | Technologies |
|-------         |--------------|
| Frontend       | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend        | FastAPI, SQLModel, asyncpg, Alembic, Pydantic |
| Authentication | Better Auth, JWT, PostgreSQL sessions |
| AI/Chat        | OpenAI ChatKit, LiteLLM (Gemini/Groq), Agents SDK, MCP Tools |
| Database       | Neon PostgreSQL (production), SQLite (testing) |
| DevOps         | Docker, Kubernetes, Helm, Minikube |

Console Application

| Layer     | Technologies |
|-------    |--------------|
| Framework | Python 3.12+ |
| Data      | Pydantic, JSON persistence |
| Testing   | pytest |

---

🧪 Development

Project Philosophy

This project follows Spec-Driven Development (SDD) with:

1. Feature Specifications First: All features documented before implementation
2. Test-Driven Development: Red → Green → Refactor cycle
3. Type Safety: TypeScript (frontend) and Pydantic (backend)
4. Modular Architecture: Clean separation of concerns
5. AI-Assisted Development: Gemini/Claude integration for coding support

---

📄 License

This project is developed as part of the GIAIC Q4 Hackathon.

---

👨‍💻 Author

*M. TALAL SHOAIB*
