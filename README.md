# Securask - Task Management System

A modern, full-stack task management system with a beautiful dark-themed UI, real-time animations, drag-and-drop functionality, user authentication, and comprehensive task tracking.

**Organize better. Work safer.**

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation (5 minutes)

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
App opens at: `http://localhost:5173`

That's it! You can now:
- Register a new account
- Create and manage tasks
- Drag and drop tasks between columns
- View real-time progress charts

## ✨ Features

### 🎨 User Interface
- **Dark Theme**: Beautiful dark interface with animated gradient backgrounds
- **Smooth Animations**: Framer Motion animations for all interactions
- **Drag & Drop**: Intuitive kanban board for task management
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Instant feedback on all actions

### 🎯 Task Management
- **Create Tasks**: Add tasks with title, description
- **Organize**: Drag tasks between Active, In Progress, and Completed columns
- **Search**: Filter tasks by keyword instantly
- **Delete**: Remove completed or unwanted tasks

### 📊 Analytics & Tracking
- **Progress Dashboard**: Real-time statistics of all tasks
- **Completion Rate**: See percentage of completed tasks
- **Task Breakdown**: View tasks by status at a glance
- **Animated Charts**: Beautiful visualizations of your progress

### 👤 Authentication
- **Secure Registration**: Create account with email validation
- **Secure Login**: JWT token-based authentication
- **Profile**: View logged-in user information
- **Logout**: Secure logout with token cleanup

## 📁 Project Structure

```
Securask/
│
├── backend/                    # Express.js + TypeScript backend
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   ├── models/             # Database schemas (User, Task)
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Authentication, validation
│   │   ├── config/             # Database configuration
│   │   ├── app.ts              # Express application
│   │   └── server.ts           # Server startup
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── Background.tsx       # Animated gradient background
│   │   │   ├── KanbanColumn.tsx     # Drag-drop task columns
│   │   │   ├── Layout.tsx           # Main layout with sidebar
│   │   │   ├── ProgressChart.tsx    # Statistics visualization
│   │   │   └── TaskCard.tsx         # Individual task cards
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.tsx        # Main dashboard
│   │   │   ├── LoginPage.tsx        # Login form
│   │   │   └── RegisterPage.tsx     # Registration form
│   │   ├── context/            # React Context
│   │   │   └── AuthContext.tsx      # Authentication state
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useTasks.ts         # Task management hook
│   │   ├── api/                # API integration
│   │   │   └── axiosInstance.ts    # Axios configuration
│   │   ├── types/              # TypeScript definitions
│   │   │   └── task.ts              # Task interfaces
│   │   ├── App.tsx             # Main app router
│   │   ├── index.css           # Global styles
│   │   └── main.tsx            # React entry point
│   ├── public/                 # Static assets
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── vite.config.ts          # Vite bundler config
│   └── README.md
│
└── README.md                   # This file
```

## 🛠 Available Commands

### Backend
```bash
cd backend

# Start development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

### Frontend
```bash
cd frontend

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## 🔧 Configuration

### Backend Environment (.env)
Create `backend/.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/securask
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRATION=7d
```

### Frontend Environment (.env.local)
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast bundler
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router DOM** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Corslet** - CORS handling
- **Nodemon** - Development tool

## 🔐 API Routes

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login and get token
GET    /api/auth/me          - Get current user (requires token)
```

### Tasks
```
GET    /api/tasks            - Get all user tasks
POST   /api/tasks            - Create new task
GET    /api/tasks/:id        - Get specific task
PUT    /api/tasks/:id        - Update task
DELETE /api/tasks/:id        - Delete task
```

## 🎓 Usage Guide

### Creating an Account
1. Click "Create an account" on the login page
2. Enter name, email, and password
3. Click "Create Account"
4. You'll be logged in automatically

### Creating a Task
1. Click the "New Task" button in dashboard
2. Fill in task details:
   - **Title**: Task name
   - **Description**: Task details
   - **Priority**: Low, Medium, High
   - **Status**: Active, In Progress, Completed
   - **Due Date**: When task is due
3. Click "Create Task"

### Managing Tasks
1. **Drag & Drop**: Drag tasks between columns to change status
2. **Delete**: Hover over task card and click trash icon
3. **Search**: Use search bar to find tasks by title or description

### Viewing Progress
- Check the top dashboard for:
  - Active tasks count
  - In-progress tasks count
  - Completed tasks count
  - Completion percentage

## 🎨 Design Features

### Color Scheme
- **Primary (Blue)**: Actions and highlights
- **Secondary (Purple)**: Accents and gradients
- **Success (Green)**: Completed tasks
- **Warning (Amber)**: Active tasks
- **Danger (Red)**: High priority and errors

### Animations
- Gradient background with moving orbs
- Smooth card hover effects
- Task drag and drop effects
- Button click animations
- Page transition effects
- Real-time stat card animations

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux

# Kill process on port 5000
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### Frontend can't connect to backend
1. Ensure backend is running on `http://localhost:5000`
2. Check `.env.local` has correct `VITE_API_URL`
3. Clear browser cache: `Ctrl+Shift+Delete`
4. Clear localStorage: Open DevTools → Application → Storage → Clear All

### MongoDB connection error
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Update MONGODB_URI in backend `.env`
4. Default connection: `mongodb://localhost:27017/securask`

### Hot reload not working
```bash
# Kill running dev server
# Clear caches
rm -rf node_modules/.vite  # Frontend
npm run dev                 # Restart
```

## 📈 Performance Tips

1. **Search Efficiently**: Use keywords to narrow down tasks
2. **Organize Early**: Assign tasks to correct status immediately
3. **Set Due Dates**: Prioritize overdue tasks
4. **Regular Cleanup**: Delete completed tasks periodically

## 🔒 Security Features

✅ JWT token-based authentication
✅ Password hashing with bcrypt
✅ CORS protection
✅ Input validation on both client and server
✅ Environment variables for secrets
✅ Protected API routes

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build
# Creates optimized build in 'dist/' folder
# Deploy this folder to Vercel, Netlify, etc.
```

### Backend
```bash
cd backend
npm run build
npm run start
# Deploy to Heroku, Railway, DigitalOcean, AWS, etc.
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest improvements
- Submit pull requests

## 📄 License

MIT License - Feel free to use this project for any purpose

## 💬 Support

For questions, issues, or feature requests:
1. Check the [Frontend README](./frontend/README.md)
2. Check the [Backend README](./backend/README.md)
3. Review existing issues
4. Create a detailed issue with steps to reproduce

## 🎉 Next Steps

- Add more task features (tags, labels, categories)
- Implement subtasks
- Add task collaboration
- Team workspaces
- Mobile app version
- Calendar view
- Recurring tasks
- Task templates

---

**Built with ❤️ using React, Node.js, Express, MongoDB, TypeScript, Tailwind CSS, and Framer Motion**

**Happy Task Managing! 🚀**

Made with passion for productivity. 
