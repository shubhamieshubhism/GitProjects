# GlamStudio - Professional Makeup Artist Website

## Overview
Full-stack web application for a professional makeup artist with booking, enquiries, admin dashboard, and dark mode.

## Features
- 🌙 Dark/Light mode toggle
- 👤 Role-based access (Admin & User)
- 📅 Appointment booking with time slot management
- 📧 Enquiry form with email notifications
- 📱 Responsive design
- 📊 Admin dashboard with analytics
- 📨 Email confirmation with calendar invites (.ics)
- 🔐 Secure authentication (NextAuth.js)

## Tech Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui
- **Auth:** NextAuth.js (Credentials provider)
- **Database:** PostgreSQL (Prisma ORM)
- **Email:** Nodemailer
- **Calendar:** ICS library + Google Calendar links

## Setup Instructions

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local` (see example below).

3. Set up the database:
```bash
npx prisma migrate dev --name init
npm run seed
```

4. Run the development server:
```bash
npm run dev
```

## Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
ADMIN_EMAIL="admin@glamstudio.com"
APP_NAME="GlamStudio"
```

## Default Admin Credentials (after seeding)
- Email: admin@glamstudio.com
- Password: Admin123!

## Deployment
Deploy to Vercel:
```bash
vercel
```

Make sure all environment variables are set in production.

## License
MIT