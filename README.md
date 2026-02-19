# Securask – Secure + Task Management Dashboard  

A modern, **Secure Task Management Dashboard** designed to improve productivity, organization, and workflow efficiency through a clear dark/light-based UI, smooth animations, and real-time task tracking.

> **Secure your workflow. Organize your tasks. Boost productivity.**

---

## Dashboard Overview:

Securask provides a clean and structured interface divided into four main sections for maximum productivity and usability.

---

## Right Panel – Sticky Notes

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

## Left Panel – Insights

- View real-time counts of:
  - Active tasks  
  - In Progress tasks  
  - Completed tasks  
- Instant productivity overview  
- Secure logout option  
- Calender for active reminders   

---

## Calender - Insights

- Add reminders directly to the calendar  
- Select specific dates for task reminders  
- View scheduled reminders in a structured monthly layout  
- Helps users plan workload efficiently  
- Integrated with dashboard workflow for better productivity tracking  

---

## Calendar Page – Reminder Management

- Dedicated calendar page for managing reminders  
- Add, edit, and delete reminders  
- Date-based task planning  
- Clean and minimal UI design  
- Helps in organizing future priorities effectively  

---

## Key Features:

- Secure user authentication  
- JWT-based session management  
- Password hashing using bcrypt  
- Sticky notes integration  
- Real-time task tracking  
- Calendar-based reminder system  
- Responsive dark/light theme  
- Smooth UI animations using Framer Motion  
- Protected routes and secure API access  

---

## Tech Stack

### Frontend:
- React.js (User Interface)
- Axios (API communication)
- CSS (Styling)
- SessionStorage (Authentication handling)
- Framer Motion (UI animations)

### Backend:
- Node.js
- Express.js
- MongoDB Atlas (Cloud Database)
- JWT (Secure authentication)
- bcrypt (Password encryption)

---

## 📦 Third-Party Packages Used & Why

### Frontend Packages

**Axios**  
Used for handling HTTP requests between frontend and backend efficiently. It simplifies API communication and error handling.

**Framer Motion**  
Used to implement smooth animations and transitions within the dashboard, enhancing user experience without compromising performance.

---

### Backend Packages

**Express.js**  
Lightweight backend framework used to build REST APIs efficiently.

**jsonwebtoken (JWT)**  
Used for secure authentication and maintaining user sessions.

**bcrypt**  
Used to securely hash passwords before storing them in the database, ensuring user credential protection.

**mongoose**  
Used as an ODM (Object Data Modeling) library to interact with MongoDB in a structured and scalable way.

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
- Hover over texts to see the magic 
- Create and manage tasks  
- Drag tasks across workflow columns  
- Use sticky notes for reminders  
- Add and manage calendar-based reminders  
- Monitor task counts in real time  
- Logout securely  

---

## 🚀 If I Had More Time – Future Improvements

- Email & push notification reminders  
- Role-based dashboards (Admin / Team Member)  
- Team collaboration with shared task boards  
- File attachment support for tasks  
- Advanced analytics with productivity graphs  
- Two-factor authentication (2FA) for enhanced security  
- Offline support using service workers  
- Mobile app version using React Native  

---

**Built with ❤️ for secure productivity and efficient workflow management.**
