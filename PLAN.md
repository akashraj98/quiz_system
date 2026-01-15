\# Quiz Management System - Plan  
    
  ## Assumptions  
  - Simple authentication (or none for MVP)  
  - Admin creates quizzes via API/basic UI  
  - Public users access via shareable link  
  - No user accounts for quiz takers  
    
  ## Scope  
  ### In Scope  
  - Admin: Create quiz with title and questions (MCQ, True/False)  
  - Public: Take quiz and see results  
  - Database: Store quizzes and responses  
    
  ### Out of Scope (for 2 hours)  
  - User authentication  
  - Question images  
  - Timer functionality  
  - Quiz editing after creation  
    
  ## Architecture  
  \[Add your architecture here\]  
\`\`\`

2\. \*\*Ask Kiro to generate:\*\*  
\`\`\`  
  "Create a Django project structure with:  
  - Quiz model (title, questions as JSON)  
  - Question types: MCQ, True/False, Short Text  
  - REST API endpoints using Django REST Framework  
  - PostgreSQL database configuration  
    
  Also create React frontend structure with:  
  - Admin page for quiz creation  
  - Public quiz taking page  
  - Results display component"  
\`\`\`

3\. \*\*First Commit\*\* (at ~15 min): "Initial project structure and planning"

\### \*\*Phase 2: Backend Development (15-45 minutes)\*\*

\*\*Kiro Prompts:\*\*

1\. \*\*Database Models:\*\*  
\`\`\`  
  "Create Django models for:  
  - Quiz model with title and created\_at  
  - Question model with question\_text, question\_type, options (JSON), correct\_answer  
  - QuizAttempt model to store user submissions  
    
  Include proper relationships and make it production-ready with indexes"  
\`\`\`

2\. \*\*API Endpoints:\*\*  
\`\`\`  
  "Create Django REST Framework serializers and viewsets for:  
  - POST /api/quizzes/ (create quiz)  
  - GET /api/quizzes/:id/ (retrieve quiz for taking)  
  - POST /api/quizzes/:id/submit/ (submit answers and get score)  
    
  Include validation and error handling"  
\`\`\`

3\. \*\*Database Setup:\*\*  
  - Use Neon DB connection string  
  - Ask Kiro to generate migration commands

4\. \*\*Second Commit\*\* (at ~45 min): "Backend API complete with models and endpoints"

\### \*\*Phase 3: Frontend Development (45-90 minutes)\*\*

\*\*Kiro Prompts:\*\*

1\. \*\*Admin Panel:\*\*  
\`\`\`  
  "Create React component for quiz creation:  
  - Form with quiz title input  
  - Dynamic question addition (add/remove questions)  
  - Question type selector (MCQ, True/False)  
  - For MCQ: multiple option inputs with correct answer selection  
  - Submit button to POST to backend API  
    
  Use Tailwind CSS for styling"  
\`\`\`

2\. \*\*Public Quiz Page:\*\*  
\`\`\`  
  "Create React component for taking quiz:  
  - Fetch quiz by ID from API  
  - Display questions one by one or all at once  
  - Collect user answers  
  - Submit answers and display results (score and correct answers)  
    
  Use Tailwind CSS"  
\`\`\`

3\. \*\*API Integration:\*\*  
\`\`\`  
  "Create axios/fetch API service layer for:  
  - Creating quizzes  
  - Fetching quiz data  
  - Submitting quiz answers  
    
  Include error handling and loading states"  
\`\`\`

4\. \*\*Third Commit\*\* (at ~75 min): "Frontend components and API integration"

\### \*\*Phase 4: Integration & Testing (90-110 minutes)\*\*

\*\*Kiro Prompts:\*\*

1\. \*\*Bug Fixes:\*\*  
\`\`\`  
  "Help debug \[specific issue\]. Here's the error: \[paste error\]  
  Check both frontend and backend code"  
\`\`\`

2\. \*\*Basic Validation:\*\*  
\`\`\`  
  "Add validation to ensure:  
  - Quiz title is required  
  - At least one question exists  
  - MCQ has at least 2 options  
  - Correct answer is specified"  
\`\`\`

3\. \*\*Fourth Commit\*\* (at ~105 min): "Bug fixes and validation"

\### \*\*Phase 5: Demo Prep (110-120 minutes)\*\*

1\. \*\*Create demo data\*\* via admin panel  
2\. \*\*Test complete flow:\*\*  
  - Create quiz  
  - Take quiz  
  - View results  
3\. \*\*Update PLAN.md\*\* with:  
  - Any scope changes made  
  - Reflection on what you'd do next  
4\. \*\*Final commit\*\*: "Demo ready - added reflection to PLAN.md"

\## 🎮 Kiro Usage Best Practices

\### \*\*DO:\*\*  
\- ✅ Review generated code before accepting  
\- ✅ Ask Kiro to explain complex sections  
\- ✅ Use Kiro for boilerplate (models, API routes, form components)  
\- ✅ Verify database migrations work  
\- ✅ Ask for specific features: "Add CORS configuration for Django"

\### \*\*DON'T:\*\*  
\- ❌ Accept all suggestions blindly  
\- ❌ Try to build everything at once  
\- ❌ Spend more than 5 minutes debugging one issue (ask Kiro!)  
\- ❌ Forget to commit every 30 minutes

\## 📊 Minimal Viable Scope (Core Features Only)

\*\*Backend:\*\*  
\- 3 API endpoints (create quiz, get quiz, submit quiz)  
\- 2-3 Django models  
\- Basic validation

\*\*Frontend:\*\*  
\- Admin form (1 page)  
\- Quiz taking interface (1 page)  
\- Results display (can be same page)

\*\*Database:\*\*  
\- Simple schema with relationships

\## 💡 Smart Trade-offs for 2 Hours

\*\*Skip:\*\*  
\- Authentication/authorization  
\- Quiz editing functionality  
\- Complex question types (stick to MCQ and True/False)  
\- Detailed styling (basic Tailwind is enough)  
\- Deployment configuration (mention in PLAN.md reflection)

\*\*Keep:\*\*  
\- Working end-to-end flow  
\- Data persistence  
\- Clean, readable code  
\- Error handling for common cases

\## 🚀 Quick Start Commands for Kiro

\*\*First prompt to Kiro:\*\*  
\`\`\`  
"I need to build a Quiz Management System in 2 hours with Django backend, React frontend, and PostgreSQL.

Backend requirements:  
\- Django + DRF  
\- Models: Quiz, Question, QuizAttempt  
\- 3 REST endpoints: create quiz, get quiz, submit answers  
\- SqliteDB

Frontend requirements:  
\- React with Tailwind and material UI  
\- Admin page to create quizzes  
\- Public page to take quizzes  
\- Results display 

Create the initial project structure with all configuration files. Start with PLAN.md outlining the architecture and database schema."