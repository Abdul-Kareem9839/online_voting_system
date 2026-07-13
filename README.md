# Online Voting System

A secure, scalable, and role-based online voting platform designed for conducting elections in universities, organizations, local communities, municipal bodies, and other institutions. The system supports voter registration, election management, secure authentication, otp verification, face verification, vote casting, and real-time result declaration.

## Overview

This project provides a complete digital election workflow with separate interfaces for:

- Administrators for managing elections, candidates, constituencies, and voters
- Voters for registration, eligibility verification, voting, and viewing election status
- Candidates and election administrators for campaign and result-related operations

The application is built to be flexible enough to support different election structures such as departments, faculties, wards, local bodies, and legislative constituencies. Constituencies are automatically defined according to the election type—for example, legislative constituencies for state assembly elections, wards for municipal elections, and departments or faculties for university elections.

## Key Features

### Admin Features

- Admin login and profile management
- Create, update, and manage elections
- Add and manage candidates and constituencies
- Import voters in bulk using CSV files
- Send invitations and election-related communications by email
- Declare election results and publish results securely
- Monitor voting activity and election status

### Voter Features

- Voter registration flow with identity verification
- OTP-based authentication for secure access
- Eligibility check for specific elections
- Face registration and face verification before voting
- Vote casting with one-vote-per-voter enforcement
- View upcoming, ongoing, and completed elections
- Access personal election and voting history

### Security and Integrity

- Session-based authentication with Passport.js
- Rate limiting for login, OTP, face verification, and voting requests
- Face verification using a dedicated Python-based face service
- Prevents duplicate voting and enforces voter eligibility
- Secure email-based verification and notifications

### Election Management

- Multi-type election support
- Dynamic constituency handling based on election type, including legislative constituencies for state assembly elections, wards for municipal elections, and departments or faculties for university elections
- Real-time election status tracking
- Transparent vote counting and result reporting

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- React Webcam

### Backend

- Node.js
- Express.js
- MySQL
- Passport.js
- Express Session
- Nodemailer
- Multer and CSV parsing

### Face Verification Service

- Python
- Flask
- Face matching and verification endpoints

## Project Structure

```bash
backend/          # Express.js backend and APIs
face-service/     # Python service for face verification
frontend/         # React frontend application
```

## Prerequisites

Make sure the following are installed on your machine:

- Node.js and npm
- Python 3
- MySQL database
- Git

## Installation

1. Clone the repository

```bash
git clone https://github.com/Abdul-Kareem9839/online_voting_system.git
cd online_voting_system
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

4. Install face service dependencies

```bash
cd ../face-service
pip install -r requirements.txt
```

## Environment Configuration

Create a `.env` file inside the backend folder and configure the required values for:

- Database connection details
- Port and environment mode
- Frontend URL
- Email credentials
- Session secret
- JWT secret (`JWT_SECRET`)

If you need to override face-service defaults, create a `.env` file inside `face-service` as well.

Example backend configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=online_voting_system
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
SESSION_SECRET=your_secret_key
JWT_SECRET=your_jwt_secret_key
```

Example face-service configuration:

```env
PORT=5001
FLASK_ENV=development
THRESHOLD=0.70
```

## Running the Application

### Start the backend

```bash
cd backend
npm run dev
```

### Start the face verification service

```bash
cd face-service
python app.py
```

### Start the frontend

```bash
cd frontend
npm run dev
```

Then open your browser at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Face service: http://localhost:5001

## Important Notes

- A MySQL database must be available before starting the backend.
- Face registration must be completed before a voter can verify identity and cast a vote.
- Email credentials are required for OTP and invitation delivery.
- The system is designed for secure and transparent digital elections, but production deployment should include additional hardening such as HTTPS, server-side secrets management, and deployment-level security practices.

## Future Scope

Potential enhancements include:

- Multi-admin role support
- Audit logs and admin activity tracking
- Mobile-friendly enhancements
- Advanced analytics and dashboards
- Blockchain-inspired tamper-evident voting logs

## License

This project is intended for academic and development purposes.
