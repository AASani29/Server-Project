# **MediaHub API**  
A multimedia management system providing authentication, media uploads, multi-level commenting, reporting, and a chat system.

## **Table of Contents**  
- [Project Overview](#project-overview)  
- [Features](#features)  
- [Backend Implementations](#backend-implementations)  
- [Technologies Used](#technologies-used)  
- [API Endpoints](#api-endpoints)  
- [Installation Guide](#installation-guide)  
- [Environment Variables](#environment-variables)  

---

## **Project Overview**  
**MediaHub API** is a backend-powered web application that allows users to upload, manage, and interact with multimedia content. It includes features such as authentication, media file management, commenting, reporting, and real-time chat functionality. The backend handles security, access control, and API functionalities to ensure a seamless user experience.

---

## **Features**  

### **1. User Authentication**  
- Implements three authentication methods:  
  - **Basic Authentication** (Username & Password)  
  - **OAuth2 (GitHub Login)**  
  - **JWT-based token authentication**  

### **2. Media File Management**  
- **Upload Media** (Images, videos, and audio files)  
- **Retrieve Media** (Fetch media by categories)  
- **Delete Media** (Only the uploader can delete their files)  

### **3. Multi-Level Commenting**  
- Users can **comment on media**  
- Nested **replies to comments**  
- Fetch **hierarchical comment threads**  

### **4. Reporting System**  
- Users can **report media files or comments**  
- Generate reports based on:  
  - **Category** (Images, Videos, Audio)  
  - **Time frame** (Recent reports, past month, etc.)  

### **5. Real-Time Chat System**  
- **Send and receive messages** between users  
- **Fetch chat history** for private conversations  

### **6. Security Features**  
- **Role-based Access Control (RBAC)** (Admin, User)  
- **Rate Limiting** (Prevents excessive API requests)  
- **Input Validation & Sanitization** (Prevents XSS, SQL injection)  

### **7. Analytics & Reporting**  
- **Track most commented or reported media**  
- **Count total uploads per user**  
- **Filter media based on categories, tags, or upload date**  

---

## **Backend Implementations**  

This project focuses heavily on backend functionalities, implementing:  

### **Authentication & Security**  
✅ **JWT Authentication** for user sessions  
✅ **OAuth2 Integration** for GitHub Login  
✅ **Role-based Access Control** to manage different user permissions  
✅ **Rate Limiting** to prevent excessive API requests  
✅ **Input Validation & Data Sanitization** (Preventing SQL Injection & XSS)  

### **Database Management**  
✅ **MongoDB** (NoSQL database) for storing users, media, comments, and reports  
✅ **Cloudinary Integration** for handling media storage securely  
✅ **Firebase** for additional authentication support  

### **API Design & Implementation**  
✅ **RESTful API** with clear HTTP methods  
✅ **Efficient Querying** (Pagination, Filtering, Sorting)  
✅ **WebSocket Implementation** for real-time messaging  

### **File Handling & Optimization**  
✅ **Cloudinary Storage** for secure media uploads  
✅ **File Type Validation** (Ensuring proper image/video/audio formats)  
✅ **Efficient Media Retrieval** (Indexed queries for faster response)  

### **Logging & Monitoring**  
✅ **API Request Logging** for debugging and analytics  
✅ **Error Handling Middleware** to handle all API errors uniformly  

---

## **Technologies Used**  

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB, Firebase (for authentication support)  
- **Authentication**: JWT, OAuth2 (GitHub Login)  
- **File Storage**: Cloudinary  
- **API Testing**: Postman  
- **Security**: Bcrypt (Password Hashing), Helmet (HTTP Security), Rate Limiting  
- **Real-time Features**: WebSocket for chat functionality  

---

## **API Endpoints**  

### **Authentication**  
- `POST /register` → User registration  
- `POST /login` → User login with JWT  
- `GET /auth/github` → GitHub OAuth2 login  

### **Media Management**  
- `GET /media` → List all media files  
- `POST /media/upload` → Upload a media file  
- `DELETE /media/:id` → Delete a media file  

### **Comment System**  
- `POST /comments` → Add a comment to a media file  
- `GET /comments/:mediaId` → Retrieve comments  

### **Reporting System**  
- `POST /reports` → Report media or comments  
- `GET /reports` → Get reports based on category/time filters  

### **Chat System**  
- `POST /chat` → Send a private message  
- `GET /chat/:userId` → Fetch chat history  

---

## **Installation Guide**  

### **1. Clone the Repository**  
```bash
git clone https://github.com/your-repo/MediaHub-API.git
cd MediaHub-API

## **2. Install Dependencies**  

### **In the Root Directory**  
```bash
npm install

cd client
npm install

Environment Variables
.env in the Root Directory:

MONGO = 'mongodb+srv://your_mongodb_url'
JWT_SECRET = 'your_jwt_secret'
GITHUB_CLIENT_ID = 'your_github_client_id'
GITHUB_CLIENT_SECRET = 'your_github_client_secret'

CLOUDINARY_CLOUD_NAME = 'your_cloudinary_name'
CLOUDINARY_API_KEY = 'your_cloudinary_api_key'
CLOUDINARY_API_SECRET = 'your_cloudinary_api_secret'

.env in the Client Directory:
VITE_FIREBASE_API_KEY = "your_firebase_api_key"
4. Start the Server

npm start
5. Start the Client
cd client
npm run dev

Contributing
Contributions are welcome! If you'd like to contribute:

Fork the repository
Create a new feature branch (git checkout -b feature-name)
Commit changes (git commit -m "Added new feature")
Push to your branch (git push origin feature-name)
Open a pull request

License
This project is open-source and available under the MIT License.

