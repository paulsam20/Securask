# Securask Frontend - Task Management Dashboard

A modern, feature-rich task management system with a beautiful dark-themed UI, animations, drag-and-drop functionality, and real-time task tracking.

## Features

✨ **UI/UX**
- Dark theme with gradient animated backgrounds
- Smooth animations and transitions using Framer Motion
- Hover effects and text animations
- Responsive design with mobile support
- Beautiful glassmorphism cards

🎯 **Task Management**
- Create, read, update, delete (CRUD) tasks
- Drag-and-drop task management between columns
- Task filtering by search
- Priority levels (Low, Medium, High)
- Task status tracking (Active, In Progress, Completed)
- Due date management
- Overdue task indicators

📊 **Analytics & Tracking**
- Real-time progress charts
- Task statistics dashboard
- Completion rate tracking
- Visual status indicators
- Task count by status

👤 **Authentication**
- User registration and login
- Secure token-based authentication
- JWT tokens stored in localStorage
- Protected routes

🎨 **Design Elements**
- Animated gradient background with moving orbs
- Animated loading skeletons
- Icon-based visual indicators
- Color-coded priority levels
- Smooth page transitions

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Steps

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Create environment file:**
```bash
cp .env.example .env.local
```

3. **Configure API URL** (Edit `.env.local`):
```
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Project Structure

```
src/
├── api/                      # API integration
│   └── axiosInstance.ts      # Axios configuration
├── components/               # Reusable React components
│   ├── Background.tsx        # Animated background
│   ├── KanbanColumn.tsx      # Drag-drop columns
│   ├── Layout.tsx            # Main layout with sidebar
│   ├── ProgressChart.tsx     # Statistics charts
│   └── TaskCard.tsx          # Individual task cards
├── context/                  # React Context API
│   └── AuthContext.tsx       # Authentication state
├── hooks/                    # Custom React hooks
│   └── useTasks.ts           # Task management hook
├── pages/                    # Page components
│   ├── Dashboard.tsx         # Main dashboard
│   ├── LoginPage.tsx         # Login page
│   └── RegisterPage.tsx      # Registration page
├── types/                    # TypeScript types
│   └── task.ts               # Task interface definitions
├── App.tsx                   # Main app component
├── index.css                 # Root styles
└── main.tsx                  # Entry point
```

## Dependencies

### Core Libraries
- **react**: UI library
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing

### UI & Animations
- **framer-motion**: Advanced animations
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework

### State Management & API
- **axios**: HTTP client
- **@tanstack/react-query**: Data fetching

### Drag & Drop
- **@hello-pangea/dnd**: Drag and drop functionality

## Key Features Explained

### Authentication System
- Sign up with email and password validation
- Secure login with JWT tokens
- Automatic token refresh and protected routes
- Logout functionality with token cleanup

### Drag & Drop Tasks
- Intuitive kanban board with three columns
- Drag tasks between columns to change status
- Smooth animations during drag operations
- Visual feedback on drag-over states

### Task Management
- Create tasks with title, description, priority, and due date
- View tasks organized by status (Active, In Progress, Completed)
- Delete tasks with one click
- Search tasks by title or description
- Automatic overdue task flagging

### Progress Tracking
- Real-time statistics dashboard
- Completion rate percentage
- Task count visualizations
- Animated stat cards with emoji indicators

### Responsive Design
- Works on desktop, tablet, and mobile
- Collapsible sidebar navigation
- Mobile-optimized forms and modals
- Touch-friendly drag and drop

## Environment Variables

Create `.env.local` with the following variables:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code (requires prettier)
npm run format
```

## Styling & Customization

The application uses Tailwind CSS with custom configurations for:
- Dark theme colors
- Animated keyframes
- Custom gradients and shadows
- Responsive utilities

Edit `tailwind.config.js` to customize:
- Colors
- Animations
- Breakpoints
- Font families

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Tips & Tricks

1. **Keyboard Shortcuts**: Press `Ctrl+K` to quickly search tasks
2. **Drag & Drop**: Drag and assign tasks quickly for better workflow
3. **Priority Indicators**: Red=High, Yellow=Medium, Blue=Low
4. **Completion Rate**: Check the dashboard for quick productivity insights

## Troubleshooting

**API Connection Error**
- Ensure backend server is running on port 5000
- Check `.env.local` has correct API URL
- Clear browser cache

**Build Errors**
- Delete `node_modules` and run `npm install`
- Clear Vite cache: `rm -rf .vite`
- Check TypeScript errors: `npm run type-check`

## Contributing

We welcome contributions! Feel free to:
- Report bugs
- Request features
- Submit pull requests

## License

MIT License - feel free to use this project

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Framer Motion**

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
