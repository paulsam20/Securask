# Securask – Secure + Task Management Dashboard  

A modern, **Secure Task Management Dashboard** designed to improve productivity, organization, and workflow efficiency through a clear dark/light-based UI, smooth animations, and real-time task tracking.

> **Secure your workflow. Organize your tasks. Boost productivity.**

---

## Dashboard Overview:

Securask provides a clean and structured interface divided into four main sections for maximum productivity and usability, featuring a seamless Dark/Light mode toggle for a comfortable and personalized user experience.

---
## Screenshots
---
Register Page:

<img width="1366" height="604" alt="image" src="https://github.com/user-attachments/assets/7072f8c2-5e6a-40af-bb34-66fd07c01867" />

Login Page:

<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/78d84d72-4cba-4d0c-b7b2-1521f1b675b6" />

Dashboard Page: 

<img width="1366" height="606" alt="image" src="https://github.com/user-attachments/assets/d07b1f45-8f40-4d0b-9bfa-27687a87ee37" />

Focus Mode:

<img width="1365" height="597" alt="image" src="https://github.com/user-attachments/assets/b8b05185-6a2d-47a7-b2f3-626496e559f9" />

Pomodoro Timer (Focus Mode):

<img width="1366" height="591" alt="image" src="https://github.com/user-attachments/assets/f466284c-47ad-484c-99a1-6e73639566e0" />

Sticky Notes (right side panel):

<img width="1366" height="596" alt="image" src="https://github.com/user-attachments/assets/c41d8cd4-475f-493c-8ad3-76f1a9959229" />

Overview of right side panel:

<img width="1361" height="591" alt="image" src="https://github.com/user-attachments/assets/bb3b5ff7-5654-447a-b6c1-bc1ce0b13393" />

Calender Page:

<img width="1366" height="604" alt="image" src="https://github.com/user-attachments/assets/76944951-a2a4-4dbe-b6b4-c5f764df1e21" />

Active Task Page:

<img width="1365" height="651" alt="image" src="https://github.com/user-attachments/assets/08966e33-e71a-429f-a28a-5d11dc2883cb" />

In Progress Task Page:

<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/614b3062-8147-4019-8044-6db0d7ff9aac" />

Completed Task Page:

<img width="1366" height="603" alt="image" src="https://github.com/user-attachments/assets/95ae42ec-f917-4d4d-aa30-7560ae3f22ee" />

---
## Right Panel – Sticky Notes

- Create quick reminder notes  
- Capture ideas instantly  
- Lightweight and always accessible  
- Designed to support productivity without interrupting workflow  

---

## Center – Task Management Board

- Create, edit, and delete tasks
- A focus mode has been created to increase productivity and to reduce distractions. 
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
- Focus mode to reduce the distractions
- Calendar-based reminder system  
- Responsive dark/light theme  
- Smooth UI animations using Framer Motion  
- Protected routes and secure API access  

---

## Tech Stack

### Frontend:
- React.js (User Interface)
- Custom API communication
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

## Third-Party Packages Used & Why

### Frontend Packages

**Custom API**  
A centralized custom API service layer is used to efficiently handle frontend–backend communication with structured request management and consistent error handling.

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

## Swagger API Documentation:
The application includes fully interactive API documentation powered by Swagger UI for real-time endpoint testing. 
Link: https://securask.onrender.com/api-docs/

Authentication & Task:

<img width="1350" height="499" alt="image" src="https://github.com/user-attachments/assets/d5e928b4-4748-47b9-8f5a-964b2661b14f" />

Sticky Notes & Calender Tasks:

<img width="1347" height="589" alt="image" src="https://github.com/user-attachments/assets/5547f12d-05db-40be-88e1-dc2dba1d0573" />

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
- Use a uppercase, lowercase, special character and a number for password creation
- Explore micro-interactions by hovering over text, icons, and cards for smooth animated feedback
- Create, manage an delete tasks
- Activate Focus Mode using the circular target icon to improve concentration and productivity
- Drag tasks across workflow columns  
- Use sticky notes for reminders
- Add and manage calendar-based reminders  
- Monitor task counts in real time
- Stay updated with the real-time date and time at the top, and monitor your progress seamlessly through the interactive progress bar
- Logout securely  

---

## Sample User
User:
Email: test@example.com
Password: Password123!

---

## If I Had More Time – Future Improvements

- Email & push notification reminders
- Integrate Firebase Authentication for real-time email-based login
- Role-based dashboards (Admin / Team Member)  
- Team collaboration with shared task boards  
- File attachment support for tasks  
- Advanced analytics with productivity graphs  
- Two-factor authentication (2FA) for enhanced security  
- Offline support using service workers
- Usage of axios for production ready app
- Mobile app version using React Native 

---

**Engineered for focus. Secured by design. Optimized for productivity. 🛡️**
