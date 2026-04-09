# LMS API - Learning Management System

REST API untuk platform Learning Management System (LMS) yang dibangun menggunakan Node.js dan Express.js dengan database MySQL.

---

Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MySQL menggunakan Docker
- Library: mysql2, dotenv, nodemon
- Caching: redis, node-cache
- Authentication bycript, jsonwebtoken

## Struktur Project

## Struktur Project

lms_app/
├── config/
│   ├── db.js
│   ├── cache.js
│   └── redis.js
├── controllers/
│   ├── auth.js
│   ├── category.js
│   ├── course.js
│   ├── enrollment.js
│   └── user.js
├── middleware/
│   ├── errorHandler.js
│   ├── validateAuth.js
│   ├── validateCategory.js
│   ├── validateCourse.js
│   ├── validateEnrollment.js
│   └── validateUser.js
├── models/
│   ├── category.js
│   ├── course.js
│   ├── enrollment.js
│   └── user.js
├── routes/
│   ├── auth.js
│   ├── category.js
│   ├── course.js
│   ├── enrollment.js
│   └── user.js
├── utils/
│   └── AppError.js
├── .env
├── .gitignore
├── docker-compose.yml
├── schema.sql
├── app.js
└── package.json

## Cara Menjalankan Project

1. Clone Repository**

Buka terminal dan jalankan perintah berikut:

    git clone <url-repository>
    cd lms_app

2. Install Dependencies**

    npm install

3. Setup Environment Variable**

Buat file .env di root folder dan isi dengan konfigurasi berikut:

    # Database
    DB_HOST=localhost
    DB_USER=lmsuser
    DB_PASS=lmspassword
    DB_NAME=lms_db
    DB_PORT=3306

    # Server
    PORT=3000
    MODE=Development

    # JWT
    JWT_SECRET_KEY=your_secret_key_here
    JWT_EXPIRES_IN=1d

    # Redis
    REDIS_URL=redis://localhost:6379

> Jangan lupa ganti JWT_SECRET_KEY dengan string acak yang panjang dan unik.

4. Jalankan Database dengan Docker**

Pastikan Docker Desktop sudah berjalan, lalu jalankan perintah berikut:

    docker-compose up -d

MySQL dan Redis akan otomatis berjalan di background. Tabel database akan dibuat secara otomatis dari file schema.sql.

5. Jalankan Server

    npm run dev

Server berjalan di http://localhost:3000

3. Setup environment variable
Buat file .env di root folder:
env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=lms_db
DB_PORT=3306
PORT=3000


4. Setup database
Buat database dan jalankan query berikut di MySQL:

CREATE DATABASE lms_db;
USE lms_db;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('student', 'instructor') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  category_id INT,
  instructor_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (instructor_id) REFERENCES users(id)
);

CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  course_id INT,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

5. MiddleWare Yang digunakan

- Autentikasi dengan validasi token
- Validasi input data untuk setiap feature

6. Jalankan server

# Development (auto-restart)
npm run dev

# Production
npm start


Server berjalan di http://localhost:3000


## Daftar Endpoint API

1. Categories
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /categories | Tampilkan semua kategori |
| GET | /categories/:id | Tampilkan kategori berdasarkan ID |
| POST | /categories | Tambah kategori baru |
| PUT | /categories/:id | Update kategori |
| DELETE | /categories/:id | Hapus kategori |
| GET | /categories/course-count | Jumlah course per kategori (JOIN) |

2. Users
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /users | Tampilkan semua user |
| GET | /users/:id | Tampilkan user berdasarkan ID |
| POST | /users | Tambah user baru |
| PUT | /users/:id | Update user |
| DELETE | /users/:id | Hapus user |
| GET | /users/enrolls-count | Jumlah enrollment per student (JOIN) |

3. Courses
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /courses | Tampilkan semua course |
| GET | /courses/:id | Tampilkan course berdasarkan ID |
| POST | /courses | Tambah course baru |
| PUT | /courses/:id | Update course |
| DELETE | /courses/:id | Hapus course |
| GET | /courses/students-count | Jumlah student per course (JOIN) |
| GET | /courses/show-category | Tampilkan course beserta nama kategori (JOIN) |

4. Enrollments
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /enrollments | Tampilkan semua enrollment |
| GET | /enrollments/:id | Tampilkan enrollment berdasarkan ID |
| POST | /enrollments | Tambah enrollment baru |
| PUT | /enrollments/:id | Update enrollment |
| DELETE | /enrollments/:id | Hapus enrollment |
| GET | /enrollments/detail | Detail enrollment dengan nama student & course (JOIN) |

---

## Contoh Request & Response

1. POST /categories
- Request Body (JSON):

{
  "name": "Programming"
}

Response:
{
  "message": "Sukses menambahkan data",
  "data": {
    "id": 1,
    "name": "Programming"
  }
}


2. POST /enrollments
Request Body (JSON):
{
  "user_id": 3,
  "course_id": 1
}

Response:
{
  "message": "Sukses menambahkan data",
  "data": {
    "id": 5,
    "user_id": 3,
    "course_id": 1
  }
}