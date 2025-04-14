# rest-express: Tower of Hanoi Web Application

A full-stack web application featuring an interactive Tower of Hanoi puzzle, built with React, Express, TypeScript, and Drizzle ORM.

## Features

*   Interactive Tower of Hanoi puzzle visualization.
*   Generates optimal move sequences for a given number of disks.
*   Stores and retrieves past puzzle solutions (including completion time).
*   Basic user account creation.
*   User preferences for default disk count and animation speed.
*   RESTful API for managing puzzle logic, history, and user data.
*   Modern frontend built with Vite, React, TypeScript, and shadcn/ui.
*   Robust backend powered by Node.js, Express, and TypeScript.
*   Database interaction managed by Drizzle ORM (likely with PostgreSQL).

## Technology Stack

*   **Frontend:**
    *   React
    *   Vite
    *   TypeScript
    *   Tailwind CSS
    *   shadcn/ui (Radix UI components)
    *   Wouter (Routing)
    *   TanStack Query (Data Fetching/State Management)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   TypeScript
    *   Drizzle ORM
    *   Zod (Validation)
*   **Database:** PostgreSQL (Likely via Neon DB based on dependencies)
*   **Development:** tsx, esbuild

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn
*   Access to a PostgreSQL database (e.g., a local instance or a cloud provider like Neon).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd rest-express
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Configuration

1.  **Environment Variables:**
    Create a `.env` file in the project root directory. This file will store sensitive information like your database connection string. Add the following variable:

    ```dotenv
    DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
    # Replace with your actual PostgreSQL connection string.
    # The specific format might vary slightly based on your setup (e.g., Neon).
    ```

    *Important:* Add `.env` to your `.gitignore` file to prevent accidentally committing secrets.

    ```gitignore
    # .gitignore
    node_modules
    dist
    .env
    .DS_Store
    *.log
    ```
    *(Ensure `.env` is present in your `.gitignore`)*

2.  **Database Setup:**
    Apply the database schema using Drizzle Kit:
    ```bash
    npm run db:push
    ```
    This command reads your schema definitions (likely in `shared/schema.ts` or similar) and updates the database structure accordingly.

### Running the Application

1.  **Development Mode:**
    Starts the backend server and the Vite development server for the frontend with hot module replacement (HMR).
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5000` (as indicated in `server/index.ts`).

2.  **Production Mode:**
    First, build the frontend and backend:
    ```bash
    npm run build
    ```
    Then, start the optimized production server:
    ```bash
    npm run start
    ```

## Available Scripts

*   `npm run dev`: Starts the development server (backend + frontend).
*   `npm run build`: Builds the frontend and backend for production.
*   `npm run start`: Starts the production server (requires running `build` first).
*   `npm run check`: Runs TypeScript type checking.
*   `npm run db:push`: Applies database schema changes using Drizzle Kit.

## API Endpoints (Brief Overview)

The backend exposes the following RESTful API endpoints under the `/api` prefix:

*   `GET /api/hanoi/:diskCount`: Get the optimal moves for the Tower of Hanoi with `:diskCount` disks. Caches results.
*   `POST /api/hanoi/history`: Save a completed Tower of Hanoi solution (disk count, moves, time taken).
*   `POST /api/users`: Create a new user account.
*   `GET /api/preferences/:userId`: Get preferences for a specific user.
*   `POST /api/preferences`: Create new preferences for a user.
*   `PUT /api/preferences/:id`: Update existing user preferences.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request. *(You can add more specific contribution guidelines here)*

## License

This project is licensed under the MIT License. See the `LICENSE` file for details. *(Ensure you have a LICENSE file if you mention it)* 