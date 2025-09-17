# Capstone Project: Planning with AI Intentionally

## 🔖 Project Title & Description

**Project Name:** TaskFlow AI - Intelligent Task Management System

**What I'm building:** A modern, AI-enhanced task management application that helps users organize their work more efficiently with smart suggestions and automated task organization.

**Who it's for:** Professionals, students, and anyone looking to improve their productivity with an intelligent task management system.

**Why it matters:** Traditional task managers require manual organization and prioritization. TaskFlow AI will use AI to automatically categorize tasks, suggest priorities based on deadlines and content, and provide intelligent insights about work patterns.

## 🛠️ Tech Stack

- **Frontend:** React.js with TypeScript, Tailwind CSS for styling
- **Backend:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Testing:** Jest (unit tests), Supertest (integration tests)
- **Development Tools:** Cursor IDE, GitHub Copilot, Git
- **Deployment:** Vercel (frontend), Railway (backend), MongoDB Atlas (database)

## 🧠 AI Integration Strategy

### Code Generation
I will use AI tools (primarily Cursor IDE with GPT-4 integration) to:
- Scaffold React components with TypeScript interfaces
- Generate Express.js route handlers and middleware
- Create MongoDB schema models with Mongoose
- Develop utility functions for task prioritization algorithms

Example prompt: "Generate a React component with TypeScript for a task item that displays task title, description, due date, and priority status. Include props interface and basic styling with Tailwind CSS."

### Testing
I will employ AI to:
- Generate comprehensive test suites for React components using Jest and React Testing Library
- Create integration tests for API endpoints using Supertest
- Develop unit tests for utility functions and algorithms

Example prompt: "Generate unit tests for a function that categorizes tasks based on keywords in the title and description. Use Jest testing framework with mock data for different task types."

### Documentation
AI will assist with:
- Writing detailed JSDoc comments for functions and components
- Generating comprehensive README documentation
- Creating API documentation with examples
- Maintaining consistent documentation standards across the project

Example prompt: "Generate JSDoc comments for this Express.js middleware function that validates JWT tokens, including parameter descriptions and return values."

### Context-Aware Techniques
I will implement:
- API-aware generation by providing OpenAPI specifications to the AI for accurate endpoint creation
- Schema-aware development by sharing MongoDB schema definitions before requesting database-related code
- File tree context by keeping the AI aware of the project structure through Cursor IDE's workspace awareness
- Diff-based assistance by sharing code changes when requesting refactoring suggestions or bug fixes

Example prompt: "Based on this MongoDB Task schema with fields for title, description, dueDate, priority, and category, generate a Mongoose model with validation rules and a service layer function to find overdue tasks."

### In-Editor/PR Review Tooling
- **Primary Tool:** Cursor IDE with built-in AI capabilities
- **Support Functions:**
  - Real-time code suggestions and completions
  - PR review assistance by analyzing code changes and suggesting improvements
  - Commit message generation based on code changes
  - Bug detection and fix suggestions before committing code

### Sample Prompts
1. "Generate a test suite for the task authentication middleware that verifies JWT tokens are properly validated and appropriate status codes are returned for valid and invalid tokens."

2. "Create a React hook for managing task state that includes functions to add, edit, delete, and toggle task completion status. Use TypeScript with proper type definitions and include error handling."

## Repository Link
https://github.com/danielmuthama23/ALX-AI-Agents-Capstone-Project.git