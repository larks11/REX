# Todolist MERN App

## 1. Run the Frontend (Easy Mode)
The frontend is built to run immediately using a simple static server.

1. Install the **"Live Server"** extension in VS Code.
2. Open `index.html`.
3. Right-click anywhere in the code and select **"Open with Live Server"**.
4. The app will open at `http://127.0.0.1:5500`.

*Note: By default, the app uses LocalStorage (Demo Mode). It does not need the backend to work initially.*

## 2. Run the Backend (Full Stack Mode)
To save data to a real database:

1. Open a terminal in VS Code (`Ctrl + ~`).
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Update the `.env` file with your MongoDB Connection String (from MongoDB Atlas).
5. Start the server:
   ```bash
   npm start
   ```
   (Server runs on port 5000).

## 3. Connect Frontend to Backend
1. Go to `services/todoService.ts`.
2. Change line 11 to `true`:
   ```typescript
   const USE_BACKEND = true;
   ```
3. Refresh your browser.
