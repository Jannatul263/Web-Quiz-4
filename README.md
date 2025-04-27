# Task✔️Master - MERN Stack Application

A productivity application built with the MERN stack (MongoDB, Express, React/Next.js, Node.js) with TypeScript support.

## Project Structure

```
task-master/
├── client/          # Next.js frontend (TypeScript)
├── server/          # Express backend (TypeScript)
├── .gitignore
└── README.md
```

## Client (Next.js)

### Available Scripts

```bash
cd client
npm install
```

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run start` - Starts the production server


## Server (Express)

### Available Scripts

```bash
cd server
npm install
```

- `npm run dev` - Runs the server with nodemon (development)
- `npm run build` - Compiles TypeScript to JavaScript
- `npm run start` - Starts the production server

### Environment Variables

Create a `.env` file with:

```
DATABASE_URL = mongodb://localhost:27017/taskmaster
JWT_SECRET = your-secret-key-here
```

## Development Setup

1. Clone the repository
2. Install dependencies in both folders
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. Start both servers in separate terminals:
   ```bash
   # Terminal 1 (server)
   cd server && npm run dev

   # Terminal 2 (client)
   cd client && npm run dev
   ```

4. Access the application at `http://localhost:3000`

## Deployment

For production deployment, build both applications:

```bash
# Build server
cd server && npm run build

# Build client
cd client && npm run build
```

Then start the production server:

```bash
cd server && npm run start
```