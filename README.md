# 🎓 CourseHub - Online Learning Platform

**🚀 Live Demo:** https://course-hub-frontend-phi.vercel.app/

## 📚 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend API Documentation](#backend-api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Frontend Architecture](#frontend-architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

## 🎯 Overview

CourseHub is a full-stack online learning platform that enables instructors to create and sell courses, and students to enroll and learn. The platform includes features like video uploads, payment processing, course management, and video compression capabilities.
Course Hub Built earlier in my learning journey; later projects improve backend security and auth models.

### ✨ Key Features
- 🔐 **User Authentication**: Google OAuth integration
- 📝 **Course Management**: Create, update, publish, and manage courses
- 🎥 **Video Upload & Processing**: Support for video uploads with compression
- 💳 **Payment Integration**: Stripe payment processing
- 📚 **Enrollment System**: Students can enroll in courses
- 🗜️ **Video Compression**: Built-in video compression to reduce file sizes
- ☁️ **Cloud Storage**: Cloudinary integration for media storage

---

## 🛠️ Technical Note: Media Processing & Resource Management

> [!IMPORTANT]  
> **Note on Video Compression & Production Environment**
>
> This project implements a sophisticated **FFmpeg pipeline** designed to compress video uploads before they reach the cloud. This ensures optimal storage usage on Cloudinary and faster streaming for users.
>
> * **The Implementation:** The backend includes logic to process video buffers through FFmpeg, reducing file sizes significantly while maintaining visual fidelity.
> * **Environment Constraints:** While the code is fully functional and tested in local development, the **Render Free Tier** used for the live demo has a 512MB RAM limit. Heavy video encoding is a CPU/RAM-intensive process that exceeds these hardware limits, causing the free-tier server to restart.
> * **Engineering Insight:** To maintain 100% uptime for the live demo, the heavy compression task is limited in production. However, the source code demonstrates a production-ready media pipeline that would scale seamlessly on a dedicated VPS or AWS EC2 instance.

---

## 🛠️ Tech Stack

### 🔙 Backend (Node.js/TypeScript)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Prisma ORM)
- **Authentication**: Google OAuth (NextAuth.js on frontend)
- **File Storage**: Cloudinary
- **Payment**: Stripe
- **Video Processing**: FFmpeg
- **File Upload**: Multer

### 🔜 Frontend (Next.js)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + custom components
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **HTTP Client**: Axios

### 🗄️ Database (MongoDB)
- **ORM**: Prisma
- **Database**: MongoDB

### 🌐 External Services
- **Cloudinary**: Image and video storage
- **Stripe**: Payment processing
- **Google APIs**: OAuth authentication
- **FFmpeg**: Video compression

## 📁 Project Structure

```
CourseHubFinale/
├── 📦 CourseHub_backend/          # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── routes/            # API routes
│   │   ├── libs/              # Utility functions
│   │   └── app.ts             # Main server file
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── package.json
└── 🎨 CourseHub_Frontend/         # Next.js frontend
    ├── app/                   # Next.js app directory
    │   ├── api/               # API routes
    │   ├── courses/           # Course pages
    │   ├── dashboard/         # Dashboard pages
    │   └── login/             # Authentication
    ├── components/            # React components
    ├── lib/                   # Utilities
    └── package.json
```

## 🔌 Backend API Documentation

### 🌐 Base URL
```
http://localhost:8000
```

### 🔐 Authentication
The backend doesn't handle authentication directly. Authentication is managed by the frontend using NextAuth.js, and user information is passed to the backend via request headers/body.

### 📋 API Endpoints

#### 👤 User Routes (`/user`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/register` | Register a new user | `{ name, email, imageUrl }` | User object |
| GET | `/` | Get all users | - | Array of users |
| GET | `/:id` | Get user by ID | - | User object with compressed videos |
| POST | `/update` | Update user with profile picture | FormData: `{ id, name, file }` | Updated user |
| POST | `/update/withoutfile` | Update user without picture | `{ id, name }` | Updated user |

#### 📚 Course Routes (`/course`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/create` | Create a new course | FormData: `{ title, description, userId, price, file }` | Course object |
| GET | `/get-all` | Get all published courses | - | Array of courses |
| GET | `/:id` | Get course by ID | Query: `user_id` | Course with videos and enrollment status |
| GET | `/user/:userId` | Get courses by user ID | - | User's courses with videos |
| POST | `/publish/:id` | Publish a course | `{ userId }` | Updated course |
| POST | `/inactive/:id` | Make course inactive | `{ userId }` | Updated course |
| POST | `/delete/:id` | Delete a course | `{ userId }` | Deleted course |
| POST | `/update/:id` | Update course with image | FormData: `{ userId, title, description, price, file }` | Updated course |
| POST | `/update-without-file/:id` | Update course without image | `{ userId, title, description, price }` | Updated course |

#### ⬆️ Upload Routes (`/upload`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/image` | Upload image file | FormData: `{ file }` | `{ public_id, secure_url }` |
| POST | `/video` | Upload video file | FormData: `{ title, courseId, userId, file }` | Video object with URL |
| POST | `/video-compressing` | Upload and compress video | FormData: `{ userId, file }` | Compressed video object |

#### 🎓 Enrollment Routes (`/enrolled`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/:userId` | Get enrolled courses for user | - | Array of enrolled courses |
| POST | `/` | Enroll in a course | `{ userId, courseId }` | Stripe checkout session |
| GET | `/course/:courseId` | Get course details for enrolled user | - | Course with videos |
| GET | `/:courseId/videos/:videoId` | Get specific video for enrolled user | - | Video object |

#### 💰 Payment Routes (`/verify-payment`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/` | Verify Stripe payment | Query: `session_id` | `{ success: boolean }` |

### 📝 Request/Response Examples

#### ➕ Create Course
```json
// Request (FormData)
{
  "title": "React Fundamentals",
  "description": "Learn React from scratch",
  "userId": "user123",
  "price": 99,
  "file": <image_file>
}

// Response
{
  "id": "course123",
  "title": "React Fundamentals",
  "description": "Learn React from scratch",
  "imageUrl": "https://cloudinary.com/image.jpg",
  "userId": "user123",
  "price": 99,
  "status": "INACTIVE",
  "publicId": "coursehub/images/abc123"
}
```

#### 🎯 Enroll in Course
```json
// Request
{
  "userId": "user123",
  "courseId": "course456"
}

// Response
{
  "sessionId": "cs_test_123",
  "url": "https://checkout.stripe.com/pay/..."
}
```

## 🗄️ Database Schema

### 📊 Models

#### 👤 User
```prisma
model User {
  id              String            @id @default(auto()) @map("_id") @db.ObjectId
  name            String
  imageUrl        String
  imagePublicId   String?
  email           String            @unique
  role            Role              @default(STUDENT)
  courses         Course[]
  enrollments     Enrollment[]
  compressedVideos CompressedVideo[]
  accountBalance  Int               @default(0)
  isPro           Boolean           @default(false)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}
```

#### 📚 Course
```prisma
model Course {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  imageUrl    String
  publicId    String
  description String
  userId      String        @db.ObjectId
  user        User          @relation(fields: [userId], references: [id])
  videos      Video[]
  enrollments Enrollment[]
  price       Int
  status      CourseStatus  @default(INACTIVE)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}
```

#### 🎥 Video
```prisma
model Video {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  courseId      String   @db.ObjectId
  title         String
  course        Course   @relation(fields: [courseId], references: [id])
  videoUrl      String
  videoDuration String
  userId        String   @db.ObjectId
  videoSize     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### 🎓 Enrollment
```prisma
model Enrollment {
  id                  String   @id @default(auto()) @map("_id") @db.ObjectId
  userId              String   @db.ObjectId
  courseId            String   @db.ObjectId
  course              Course   @relation(fields: [courseId], references: [id])
  user                User     @relation(fields: [userId], references: [id])
  courseName          String
  courseImageUrl      String
  courseDescription   String
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

#### 🗜️ CompressedVideo
```prisma
model CompressedVideo {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  videoUrl        String
  videoDuration   String
  videoSize       String
  originalSize    String
  compressionRate String
  date            String
  userId          String   @db.ObjectId
  user            User     @relation(fields: [userId], references: [id])
}
```

### 🏷️ Enums
```prisma
enum Role {
  STUDENT
  INSTRUCTOR
  ADMIN
}

enum CourseStatus {
  PUBLISHED
  INACTIVE
}
```

## 🔐 Authentication

### 🔄 Authentication Flow

1. **Frontend Authentication**:
   - Uses NextAuth.js with Google Provider
   - Google OAuth credentials are configured
   - Session management handled by NextAuth.js

2. **User Registration**:
   - When a user signs in with Google for the first time, the app automatically creates a user record in the database
   - Subsequent logins update the session with user information from the database

3. **Backend Communication**:
   - The backend expects user ID/email in request bodies for user-specific operations
   - No JWT tokens or session management on the backend
   - Backend trusts the frontend to provide valid user information

### ⚙️ NextAuth Configuration
```typescript
// Key features:
- Google OAuth provider
- Automatic user creation on first sign-in
- Session callback to enrich session with user data
- Database integration via Prisma
```

## 🎨 Frontend Architecture

### 📂 App Router Structure
```
app/
├── api/auth/[...nextauth]/    # NextAuth.js API route
├── courses/                   # Course-related pages
│   ├── [id]/                 # Individual course page
│   └── create/               # Create course page
├── dashboard/                 # User dashboard
├── compress-video/           # Video compression tool
├── compressed-videos/        # View compressed videos
├── login/                    # Login page
├── payment/                  # Payment success/cancel pages
├── layout.tsx                # Root layout
└── page.tsx                  # Homepage
```

### 🧩 Key Components

#### 🏗️ Layout Components
- `Navbar`: Top navigation with authentication status
- `Sidebar`: Mobile-friendly navigation menu
- `Footer`: Site footer
- `SessionWrapper`: NextAuth session provider

#### 📄 Page Components
- `HomeComponent`: Landing page with course showcase
- `Dashboard`: User dashboard for managing courses/enrollments
- `CourseCreate`: Course creation form
- `CourseView`: Individual course viewing page
- `VideoCompression`: Video compression utility

#### 🎛️ UI Components (Radix UI + Custom)
- Button variants with Tailwind CSS
- Modal dialogs
- Progress indicators
- Form controls
- Tabs and navigation elements

### 🧠 State Management
- Uses Zustand for client-side state management
- NextAuth for authentication state
- React hooks for local component state

### 🎨 Styling
- Tailwind CSS for utility-first styling
- Custom component library with `class-variance-authority`
- Responsive design with mobile-first approach
- Dark/light mode support (via Tailwind)

## ✨ Features

### 👨‍🎓 For Students
- 📖 Browse published courses
- 💰 Enroll in courses via Stripe payment
- 🎥 Access enrolled course content
- 📺 Watch course videos
- 📊 View course progress

### 👨‍🏫 For Instructors
- ➕ Create and manage courses
- ⬆️ Upload course images and videos
- 📤 Publish/unpublish courses
- ✏️ Edit course details
- 📈 Track enrollments
- 🗜️ Use video compression to reduce file sizes

### 👥 For All Users
- 🔐 Google OAuth authentication
- 👤 Profile management
- 📊 Dashboard for courses and enrollments
- 🗜️ Video compression utility (saves to user's account)

### 🗜️ Video Compression Feature
- 🔧 Built-in FFmpeg compression
- 📉 Reduces video file sizes by up to 90%
- 🎯 Maintains reasonable video quality
- 💾 Saves compressed videos to user's account
- 📊 Shows compression statistics (original size, compressed size, compression rate)

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Cloudinary account
- Stripe account
- Google OAuth credentials

### ⚙️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/sarwanazhar/CourseHub
cd CourseHubFinale
```

2. **Install backend dependencies**
```bash
cd CourseHub_backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../CourseHub_Frontend
npm install
# or if using pnpm
pnpm install
```

4. **Set up environment variables** (see Environment Variables section)

5. **Set up database**
```bash
cd ../CourseHub_backend
npx prisma generate
npx prisma db push
```

6. **Start the backend server**
```bash
npm run dev
```

7. **Start the frontend development server** (in a new terminal)
```bash
cd ../CourseHub_Frontend
npm run dev
```

8. **Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## 🔧 Environment Variables

### 🔙 Backend (CourseHub_backend/.env)
```env
# Database
DATABASE_URL="mongodb://localhost:27017/coursehub"

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# Frontend URL (for Stripe redirects)
FRONTEND_URL=http://localhost:3000
```

### 🔜 Frontend (CourseHub_Frontend/.env.local)
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
API_URL=your_backend_url

# Database (for Prisma)
DATABASE_URL="mongodb://localhost:27017/coursehub"
```

## 💡 API Usage Examples

### ➕ Creating a Course (cURL)
```bash
curl -X POST http://localhost:8000/course/create \
  -F "title=React Fundamentals" \
  -F "description=Learn React from scratch" \
  -F "userId=user123" \
  -F "price=99" \
  -F "file=@course-image.jpg"
```

### 🎯 Enrolling in a Course (JavaScript)
```javascript
const response = await fetch('http://localhost:8000/enrolled', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    courseId: 'course456'
  })
});

const { sessionId, url } = await response.json();
// Redirect user to Stripe checkout URL
window.location.href = url;
```

### ⬆️ Uploading a Video (JavaScript)
```javascript
const formData = new FormData();
formData.append('file', videoFile);
formData.append('title', 'Introduction to React');
formData.append('courseId', 'course123');
formData.append('userId', 'user123');

const response = await fetch('http://localhost:8000/upload/video', {
  method: 'POST',
  body: formData
});

const videoData = await response.json();
```

## 🚢 Deployment

### 🔙 Backend Deployment
The backend includes a Dockerfile for containerized deployment:
```bash
cd CourseHub_backend
docker build -t coursehub-backend .
docker run -p 8000:8000 coursehub-backend
```

### 🔜 Frontend Deployment
The frontend is configured for Vercel deployment and is currently live at:
https://course-hub-frontend-phi.vercel.app/

For manual deployment:
```bash
cd CourseHub_Frontend
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For support or questions, please open an issue on the GitHub repository.

---

**💡 Note**: This is a comprehensive documentation of the CourseHub project. The live demo is available at https://course-hub-frontend-phi.vercel.app/ for testing the application's features.

**👨‍💻 Developed and Managed by [Sarwan Azhar](https://github.com/sarwanazhar)**

**🔗 GitHub Repository**: https://github.com/sarwanazhar/CourseHub
