# 🚀 Quick Start - Backend Setup (5 minutes)

## What's Needed

1. **Your OpenWeatherMap API Key**
   - Get free from: https://openweathermap.org/api
   - Takes 2 minutes to register

2. **Node.js** (if not already installed)
   - Download from: https://nodejs.org/

---

## Setup Steps

### Step 1: Prepare API Key

1. Visit: https://openweathermap.org/api
2. Sign up (free account)
3. Go to "API keys" tab
4. Copy your API key (looks like: `35102437e50d37262084332662179159`)

### Step 2: Create `.env` File

In folder `e:\weather dashboard`, create a file named `.env` with:

```
OPENWEATHER_API_KEY=your_key_here
PORT=3000
NODE_ENV=development
```

Replace `your_key_here` with your actual key from Step 1.

### Step 3: Install Dependencies

Open PowerShell in the project folder and run:

```powershell
npm install
```

Wait for completion (takes 1-2 minutes).

### Step 4: Start Backend Server

```powershell
npm start
```

You should see:
```
✅ Server running on http://localhost:3000
```

### Step 5: Open the App

In a NEW PowerShell window:

```powershell
start .\index.html
```

---

## ✅ That's it!

Your weather app should now:
- ✅ Load without errors
- ✅ Show weather data correctly
- ✅ Have API key protected
- ✅ Have proper rate limiting

---

## 🆘 If Something Goes Wrong

### Error: "OPENWEATHER_API_KEY not found"
- Make sure `.env` file exists in the project folder
- Check the format is correct (no quotes around key)

### Error: "npm: command not found"
- Install Node.js: https://nodejs.org/

### Error: "Port 3000 already in use"
- Edit `.env` and change: `PORT=3001`

### Error: "Failed to fetch weather data"
- Check backend is running
- Verify API key is correct
- Restart both backend and frontend

---

## 📖 For More Details

See `BACKEND_SETUP.md` for complete documentation.

---

**Questions? Check the console for error messages! 🔍**
