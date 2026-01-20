# AI-Enhanced SEO Content Recommendation Tool

## Project Overview

This is a full-stack web application that helps content creators write better SEO-optimized content. The platform uses AI to analyze drafts, extract keywords, and provide actionable suggestions for improvement. Users can track their progress through revision history and see how their content improves over time.

## What I Built

I created a complete content management system with the following features:

**User Features:**
- User registration and login system
- Personal dashboard showing all your drafts
- Rich text editor for writing content
- AI-powered SEO analysis
- Revision history with score tracking
- Search functionality to find your drafts

**Technical Implementation:**
- React frontend with modern UI
- Node.js/Express backend
- MongoDB database for storing users and drafts
- JWT authentication for security
- OpenRouter API integration for AI analysis
- Draft.js for rich text editing
- Recharts for data visualization

## Technologies Used

**Frontend:**
- React.js 18.2.0
- Draft.js (rich text editor)
- Recharts (charts and graphs)
- React Router (navigation)
- Axios (API calls)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

**AI:**
- OpenRouter API
- GPT-3.5-turbo model

## How to Run This Project

### Step 1: Install Dependencies

First, install the backend dependencies:
```bash
npm install
```

Then install frontend dependencies:
```bash
cd client
npm install
cd ..
```

### Step 2: Set Up Environment Variables

The `.env` file is already included with the project. It contains:
- MongoDB connection string
- OpenRouter API key
- JWT secret
- Port configuration

### Step 3: Start the Application

Run this command to start both backend and frontend:
```bash
npm run dev
```

The backend will run on `http://localhost:5000` and frontend on `http://localhost:3000`.

### Step 4: Test the Application

1. Open `http://localhost:3000` in your browser
2. Register a new account
3. Login with your credentials
4. Create a new draft
5. Write some content and click "Analyze SEO"
6. See the AI suggestions and improve your content

## Project Structure

```
project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Auth.js           # Login/Register page
│   │   │   ├── Dashboard.js      # Main dashboard
│   │   │   ├── Editor.js         # Content editor
│   │   │   ├── SEOPanel.js       # Shows SEO analysis
│   │   │   └── RevisionHistory.js # Score tracking
│   │   └── App.js         # Main app component
│   └── package.json
├── server/
│   ├── models/            # Database schemas
│   │   ├── User.js       # User model
│   │   └── Draft.js      # Draft model
│   ├── routes/           # API endpoints
│   │   ├── auth.js       # Login/register routes
│   │   ├── drafts.js     # Draft CRUD operations
│   │   └── seo.js        # AI analysis endpoint
│   ├── middleware/
│   │   └── auth.js       # JWT verification
│   └── index.js          # Server entry point
├── .env                  # Environment variables (included)
├── package.json
└── README.md
```

## Key Features Explained

### 1. User Authentication

I implemented a secure authentication system where:
- Passwords are hashed using bcrypt before storing
- JWT tokens are used for session management
- Each user can only see their own content
- Tokens expire after 7 days

### 2. AI SEO Analysis

The AI analyzes content based on:
- How well the content matches the title (40% weight)
- Keyword usage and density (30% weight)
- Content structure and organization (20% weight)
- Overall readability (10% weight)

The AI extracts keywords only from the content body, not from the title. This ensures the keywords represent what's actually written.

### 3. Revision Tracking

Every time you analyze your content, the system saves a revision. You can see:
- Previous SEO scores
- How your score improved over time
- A chart showing the progression
- All past suggestions

## Sample Content and Results

I tested the system with real content to show how it works.

### Test 1: Nike E-commerce SEO

**Title:** Nike SEO Strategy

**Content I Wrote:**
```
Since Nike is a brand and a successful ecommerce store, their SEO focuses on 
getting people to their website to find and purchase their products by practicing 
SEO best practices for product pages. That means they must integrate keywords 
effectively on their product pages to compete with other, similar brands.

For example, they use clear descriptions to outline each of their products and 
fit keywords related into the page.
```

**What the AI Found:**

SEO Score: **85/100** (Excellent)

Keywords Extracted:
- SEO best practices
- product pages
- keywords
- clear descriptions
- ecommerce store

Suggestions Given:
1. Integrate long-tail keywords in addition to primary keywords for better targeting
2. Optimize meta tags and alt text with relevant keywords for improved search visibility
3. Enhance internal linking structure to boost SEO value of product pages

### Test 2: Canva Programmatic SEO

**Title:** Canva's Programmatic SEO Approach

**Content I Wrote:**
```
Programmatic SEO is a powerful tool for search engine optimization efforts, but 
requires care. Canva provides one example of how businesses can use programmatic 
SEO in their strategies.
```

**What the AI Found:**

SEO Score: **85/100** (Excellent)

Keywords Extracted:
- programmatic SEO
- search engine optimization
- Canva
- businesses
- strategies

Suggestions Given:
1. Include more examples of how businesses can leverage programmatic SEO
2. Add subheadings to break down the content for better readability
3. Consider explaining the benefits of using Canva specifically for programmatic SEO
4. Incorporate statistics or case studies to support the effectiveness of programmatic SEO
5. Ensure the content provides actionable takeaways for implementing programmatic SEO strategies

## How the Scoring Works

The AI gives scores from 0 to 100:

- **0-39 (Needs Work)**: Content needs major improvements
- **40-59 (Fair)**: Basic content but could be better
- **60-79 (Good)**: Solid content with minor improvements needed
- **80-100 (Excellent)**: Well-optimized content ready to publish

Both my test samples scored 85/100, which shows the AI can recognize good content while still providing useful suggestions for improvement.


## API Endpoints

**Authentication:**
- POST `/api/auth/register` - Create new account
- POST `/api/auth/login` - Login to account

**Drafts (requires authentication):**
- GET `/api/drafts` - Get all your drafts
- GET `/api/drafts/:id` - Get one draft
- POST `/api/drafts` - Create new draft
- PUT `/api/drafts/:id` - Update draft
- DELETE `/api/drafts/:id` - Delete draft

**SEO Analysis:**
- POST `/api/seo/analyze` - Analyze content with AI

## Database Schema

**User Model:**
- name (string)
- email (string, unique)
- password (hashed string)
- createdAt (date)

**Draft Model:**
- userId (reference to User)
- title (string)
- content (string)
- currentSeoScore (number)
- keywords (array of strings)
- suggestions (array of strings)
- revisions (array of past versions)
- createdAt (date)
- updatedAt (date)

## Security Features

I implemented several security measures:

1. Passwords are never stored in plain text
2. JWT tokens are required for all draft operations
3. Users can only access their own drafts
4. Tokens expire automatically
5. API routes are protected with middleware


## Testing the Application

To verify everything works:

1. Register a new user account
2. Create a draft with a title and some content
3. Click "Analyze SEO" button
4. Check that you get a score, keywords, and suggestions
5. Make changes based on suggestions
6. Analyze again to see score improvement
7. Check the revision history chart
8. Try the search feature
9. Logout and login again to verify authentication
10. Create another user to verify data isolation

## Conclusion

This project demonstrates a complete full-stack application with AI integration. It shows how modern web technologies can be combined to create a useful tool for content creators. The application is fully functional and ready to use.


**Note:** All credentials are included in the `.env` file for easy testing.
