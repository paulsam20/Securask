# Securask – Secure + Task Management Dashboard  

A modern, **Secure Task Management Dashboard** designed to improve productivity, organization, and workflow efficiency through a clear dark/light-based UI, smooth animations, and real-time task tracking.

> **Secure your workflow. Organize your tasks. Boost productivity.**

---

## Dashboard Overview:

Securask provides a clean and structured interface divided into three main sections for maximum productivity and usability.

---

## Left Panel – Sticky Notes

- Create quick reminder notes  
- Capture ideas instantly  
- Lightweight and always accessible  
- Designed to support productivity without interrupting workflow  

---

## Center – Task Management Board

- Create, edit, and delete tasks  
- Assign task status:
  - Active  
  - In Progress  
  - Completed  
- Drag-and-drop functionality for smooth workflow transitions  
- Real-time task updates  
- Clean dark/light themed UI with smooth animations  

---

## Right Panel – Insights

- View real-time counts of:
  - Active tasks  
  - In Progress tasks  
  - Completed tasks  
- Instant productivity overview  
- Secure logout option  

---

## Key Features:

- Secure user authentication  
- JWT-based session management  
- Password hashing using bcrypt  
- Sticky notes integration  
- Real-time task tracking  
- Responsive dark/light theme  
- Smooth UI animations  
- Protected routes and secure API access  

---

## Tech Stack

### Frontend:
- React.js (User Interface)
- Axios (API communication)
- CSS (Styling)
- SessionStorage (Authentication handling)

### Backend:
- Node.js
- Express.js
- MongoDB Atlas (Cloud Database)
- JWT (Secure authentication)
- bcrypt (Password encryption)

---

# Installation & Setup

Follow the steps below to run the project locally.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/paulsam20/Securask.git
cd Securask
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 4️⃣ Configure Environment Variables

Create a file:

### backend/.env

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_super_secret_key_here

```

---

## 5️⃣ Run the Application

Open two separate terminals.

---

### Terminal 1 – Start Backend

```bash
cd backend
npm run dev
```

Backend runs on:
```
http://localhost:5000
```

---

### Terminal 2 – Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:
```
http://localhost:5174
```

---

## You're Ready!

You can now:

- Register and login securely  
- Create and manage tasks  
- Drag tasks across workflow columns  
- Use sticky notes for reminders  
- Monitor task counts in real time  
- Logout securely  

---

**Built with ❤️ for secure productivity and efficient workflow management.**
