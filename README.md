# Jobzee - Jobseeking Web Application

Jobzee is a full-stack jobseeking platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js), designed to connect skilled laborers with customers seeking services. The platform aims to organize the unstructured service market, offering a digital ecosystem where workers and service seekers can collaborate efficiently and securely.

---

## 🌐 Features

### 👷‍♂️ For Labourers/Employees
- Register and create professional profiles
- Upload ID documents (Cloudinary integration)
- Showcase skill sets and availability
- Apply to service/job postings
- Real-time communication with clients
- Receive ratings and feedback

### 🧑‍💼 For Customers
- Post service requirements/jobs
- Browse skilled labour profiles by category
- View reviews, skillsets, and availability
- Hire and chat with workers in real-time

### 🔐 Authentication & Security
- JWT-based secure login/signup
- Role-based access control (Admin, Labourer, Customer)
- Cloudinary for secure document storage and verification

### 🛠️ Admin Panel
- User and job post moderation
- Dispute management
- View platform-wide analytics
- Block or verify users

### 🧩 Other Key Features
- Mutual rating and review system
- Responsive dashboards for all users
- Light and dark mode UI
- Real-time updates using Socket.IO
- Search and filter jobs by skills/location

---

## 💻 Tech Stack

| Technology     | Purpose                          |
|----------------|----------------------------------|
| **MongoDB**    | Database for storing users, jobs, reviews |
| **Express.js** | Backend server framework         |
| **React.js**   | Frontend UI                      |
| **Node.js**    | Backend runtime                  |
| **Cloudinary** | Cloud document/image storage     |
| **Socket.IO**  | Real-time communication          |
| **JWT**        | Secure user authentication       |
| **CSS**        | Custom styling (Light/Dark Modes) |

---

## 🛠️ Installation

### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/jobzee.git
cd jobzee 
```

### Setup backend:

```bash
cd backend
npm install
```

## Create a .env file with:

MONGO_URI=your_mongo_db_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

## Start backend server:

```bash
Edit
npm start
```

## Setup frontend:

```bash
cd ../frontend
npm install
npm start
```

## folder structure

jobzee/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── App.js
