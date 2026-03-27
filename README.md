# 🚌 GoBus – Bus Booking Application

A full-stack bus booking web application built with **Spring Boot** (backend) and **React** (frontend).

## ✨ Features

- 🔐 JWT-based authentication with separate **Admin** and **User** roles
- 🛠️ **Admin Dashboard** — add buses, routes, publish schedules; list and delete all resources
- 🔍 **Case-insensitive bus search** by source, destination & travel date
- 🎫 **Seat selection** and ticket booking
- 📋 **Booking history** with cancel and delete options
- 📧 **Real email notifications** for registration, booking confirmation, and cancellation (Gmail SMTP)

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Axios, Lucide Icons |
| Backend | Spring Boot 3.4, Spring Security, Spring Data JPA |
| Database | MySQL |
| Auth | JWT (JSON Web Tokens) |
| Email | JavaMail + Gmail SMTP |

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8+

### 1. Database Setup
```sql
CREATE DATABASE bus_booking;
```
Run `schema.sql` in your MySQL client to create tables.

### 2. Backend Configuration
Create `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bus_booking?useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD

spring.jpa.hibernate.ddl-auto=update
app.jwtSecret=YOUR_JWT_SECRET
app.jwtExpirationMs=86400000

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_GMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com
```

### 3. Run the Backend
```bash
cd backend
./mvnw.cmd spring-boot:run   # Windows
./mvnw spring-boot:run       # Mac/Linux
```
Backend starts on **http://localhost:8080**

### 4. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend starts on **http://localhost:5173**

## 🔑 Default Admin Account
```
Email:    admin@gmail.com
Password: admin@12345
```

## 📁 Project Structure
```
Bus Booking/
├── backend/          # Spring Boot API
│   └── src/main/java/com/busbooking/
│       ├── controller/
│       ├── service/
│       ├── model/
│       ├── repository/
│       ├── dto/
│       └── security/
├── frontend/         # React + Vite SPA
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── services/
│       └── context/
└── schema.sql
```

## 📧 Email Notifications
The app sends automatic emails for:
- ✅ User registration (welcome email)
- ✅ Booking confirmation (with route & date)
- ✅ Booking cancellation

> Requires a Gmail account with 2FA enabled and a [Gmail App Password](https://myaccount.google.com/apppasswords).
