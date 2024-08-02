# Cron Job Email Reminder

This project is a full-stack application that allows users to set email reminders. The frontend is built using Next.js, React, and Redux, while the backend is built using Node.js, Express, and Cassandra. Email reminders are sent at the specified time using a cron job.

## Table of Contents
- [Cron Job Email Reminder](#cron-job-email-reminder)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Set Up Cassandra](#2-set-up-cassandra)
    - [3. Create Keyspace and Tables](#3-create-keyspace-and-tables)
    - [4. Install Node.js Dependencies](#4-install-nodejs-dependencies)
      - [Backend Setup](#backend-setup)
      - [Frontend Setup](#frontend-setup)
  - [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
  - [Usage](#usage)
    - [Start the Application](#start-the-application)
    - [Access the Application](#access-the-application)
  - [API Documentation](#api-documentation)
    - [Auth Endpoints](#auth-endpoints)
    - [Reminder Endpoints](#reminder-endpoints)
  - [Contribution Guidelines](#contribution-guidelines)

## Features
- User registration and authentication
- Set email reminders
- Scheduled email sending using cron jobs
- Data persistence using Cassandra
- Login/Signup page with cookie-based session management

## Prerequisites
- Docker
- Node.js (v14 or higher)
- npm
- Nodemailer
- Cassandra

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/AmitSahoo45/email-reminder.git
cd email-reminder
```

### 2. Set Up Cassandra
Make sure you have Docker installed. If not, you can download it from [here](https://www.docker.com/products/docker-desktop).

```bash
# Pull the Cassandra Docker image
docker pull cassandra:latest

# Run Cassandra container
docker run --name email_reminder -d -p 9042:9042 cassandra:latest

# In case you have already created the email_reminder container and want to re-run it
docker start email_reminder

# Check the status of the Cassandra container
docker ps -a

# Connect to the Cassandra container
docker exec -it email_reminder cqlsh
```

### 3. Create Keyspace and Tables
```sql
-- Inside cqlsh
CREATE KEYSPACE email_reminder WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE email_reminder;

CREATE TABLE e_users (
    userid UUID PRIMARY KEY,
    name VARCHAR,
    email VARCHAR,
    password TEXT,
    is_verified BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE e_otp (
    e_userid uuid,
    created_at timestamp,
    otpid uuid,
    is_verified boolean,
    otp text,
    PRIMARY KEY (e_userid, created_at, otpid)
) WITH CLUSTERING ORDER BY (created_at DESC, otpid ASC);

CREATE TABLE e_reminders (
    remid UUID PRIMARY KEY,
    e_userid UUID,
    title TEXT,
    message TEXT,
    datetime TIMESTAMP
);
```

### 4. Install Node.js Dependencies

#### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file in the `backend` directory and add the following environment variables:

```bash
PORT=5000
CASSANDRA_CONTACT_POINTS=127.0.0.1
CASSANDRA_LOCAL_DATA_CENTER=datacenter1
CASSANDRA_KEYSPACE=email_reminder
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

4. Start the backend server:

```bash
npm run start
```

#### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file in the `frontend` directory and add the following environment variables:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the frontend server:

```bash
npm run dev
```

## Configuration

### Environment Variables
Create a `.env` file in both the `backend` and `frontend` directories and add the following environment variables accordingly.

**Backend `.env` File**:
```env
PORT=5000
CASSANDRA_CONTACT_POINTS=127.0.0.1
CASSANDRA_LOCAL_DATA_CENTER=datacenter1
CASSANDRA_KEYSPACE=email_reminder
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

**Frontend `.env` File**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Usage

### Start the Application

1. Start the backend server:

```bash
cd backend
npm run start
```

2. Start the frontend server:

```bash
cd ../frontend
npm run dev
```

### Access the Application
The server will be running at `http://localhost:3000`.

## API Documentation

### Auth Endpoints

- **Register a new user**

  **Endpoint:** `POST /auth/register`

  **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

  **Response:**
  ```json
  {
    "id": "string",
    "name": "string",
    "ecode": "USER_CREATED"
  }
  ```

- **Login a user**

  **Endpoint:** `POST /auth/login`

  **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

  **Response:**
  ```json
  {
    "userid": "string",
    "name": "string"
  }
  ```

- **Logout a user**

  **Endpoint:** `POST /auth/logout`

  **Response:**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

- **Send OTP**

  **Endpoint:** `POST /auth/otp/send`

  **Response:**
  ```json
  {
    "message": "OTP sent successfully"
  }
  ```

- **Verify OTP**

  **Endpoint:** `PATCH /auth/otp/verify`

  **Request Body:**
  ```json
  {
    "otp": "string"
  }
  ```

  **Response:**
  ```json
  {
    "message": "OTP verified successfully"
  }
  ```

### Reminder Endpoints

- **Add a reminder**

  **Endpoint:** `POST /reminder/add`

  **Request Body:**
  ```json
  {
    "title": "string",
    "message": "string",
    "datetime": "string"
  }
  ```

  **Response:**
  ```json
  {
    "remid": "string"
  }
  ```

- **Get all reminders by user**

  **Endpoint:** `GET /reminder/read`

  **Response:**
  ```json
  [
    {
      "remid": "string",
      "title": "string",
      "message": "string",
      "datetime": "string"
    }
  ]
  ```

- **Delete a reminder**

  **Endpoint:** `DELETE /reminder/delete/:id`

  **Response:**
  ```json
  {
    "message": "Reminder deleted successfully"
  }
  ```

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.