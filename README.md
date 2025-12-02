[![CI - PR Tests](https://github.com/kevinccbsg/apogee-prompting-kata/actions/workflows/ci.yml/badge.svg)](https://github.com/kevinccbsg/apogee-prompting-kata/actions/workflows/ci.yml)

# apogee-prompting-kata

## Requirements

- **Node.js v22 or higher** is required to run this application.

## Getting Started

### 1. Install Dependencies

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
npm run install:backend
```

Or install both at once:
```bash
npm install && npm run install:backend
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend-service` folder with your OpenAI API key:

```bash
cd backend-service
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

**Note:** The backend service requires an OpenAI API key to function. We will share before kata starts.

### 3. Run the Application

You can run the frontend and backend separately, or together:

**Run both frontend and backend together:**
```bash
npm run dev:all
```

The kata app will be available at `http://localhost:5173`.

> **Note:** Ports 5173 and 3000 must be free to run the application.

## Testing

This project uses [TWD (Test While Developing)](https://brikev.github.io/twd/) for frontend testing. The TWD test setup is currently commented out in `src/main.tsx` but can be enabled for development.

To enable TWD tests, uncomment the test initialization code in `src/main.tsx`. The tests are located in the `src/twd-tests/` directory and will appear in a sidebar when running the development server.

For more information about TWD, visit the [official documentation](https://brikev.github.io/twd/).

## What's This About?

For information about Apogee and the kata challenge, visit the landing page when you run the application. The landing page contains all the details about:
- What Apogee is
- What the kata is about
- What tools are available
- Example data structures

## Scripts

- `npm run dev` - Start the frontend development server
- `npm run backend:dev` - Start the backend development server
- `npm run dev:all` - Start both frontend and backend in parallel
- `npm run build` - Build the frontend for production
- `npm run lint` - Run ESLint
- `npm run install:backend` - Install backend-service dependencies
