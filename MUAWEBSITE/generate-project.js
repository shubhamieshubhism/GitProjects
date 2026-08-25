const fs = require('fs');
const path = require('path');

// ---------- Configuration ----------
const PROJECT_ROOT = path.join(process.cwd(), 'glamstudio-website');

// ---------- Helper functions ----------
function writeFile(filePath, content) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
}

// ---------- File Contents (all `${...}` escaped as `\${...}` to preserve them) ----------
const files = {
  'package.json': `{
  "name": "glamstudio-website",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "migrate": "prisma migrate dev",
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.17.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "ics": "^3.7.4",
    "lucide-react": "^0.424.0",
    "next": "14.2.5",
    "next-auth": "^4.24.6",
    "next-themes": "^0.3.0",
    "nodemailer": "^6.9.14",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.52.0",
    "react-hot-toast": "^2.4.1",
    "recharts": "^2.12.7",
    "tailwind-merge": "^2.4.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.14.10",
    "@types/nodemailer": "^6.4.15",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "postcss": "^8.4.39",
    "prisma": "^5.17.0",
    "tailwindcss": "^3.4.6",
    "tsx": "^4.16.2",
    "typescript": "^5.5.3"
  }
}`,

  '.env.local': `DATABASE_URL="postgresql://username:password@localhost:5432/glamstudio?schema=public"
NEXTAUTH_SECRET="your-super-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
ADMIN_EMAIL="admin@glamstudio.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
APP_NAME="GlamStudio"`,

  'tailwind.config.ts': `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#D4A5A5",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F5E6D3",
          foreground: "#4A2C2C",
        },
        accent: {
          DEFAULT: "#FDEBD0",
          foreground: "#4A2C2C",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        rose: "#D4A5A5",
        blush: "#F5E6D3",
        cream: "#FDEBD0",
        charcoal: "#2C2C2C",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;`,

  'prisma/schema.prisma': `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  USER
}

enum ServiceType {
  BRIDAL
  PARTY
  AIRBRUSH
  TRIAL
  EDITORIAL
  OTHER
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELED
  RESCHEDULED
}

enum EnquiryStatus {
  NEW
  IN_PROGRESS
  RESOLVED
  ARCHIVED
}

model User {
  id              String        @id @default(cuid())
  name            String
  email           String        @unique
  passwordHash    String
  phone           String?
  role            Role          @default(USER)
  appointments    Appointment[]
  enquiries       Enquiry[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@map("users")
}

model Appointment {
  id          String            @id @default(cuid())
  userId      String
  user        User              @relation(fields: [userId], references: [id], onDelete: CASCADE)
  serviceType ServiceType
  date        DateTime
  timeSlot    String
  status      AppointmentStatus @default(PENDING)
  notes       String?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@map("appointments")
}

model Enquiry {
  id        String          @id @default(cuid())
  name      String
  email     String
  phone     String?
  eventDate DateTime?
  message   String
  status    EnquiryStatus   @default(NEW)
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

  @@map("enquiries")
}

model Service {
  id          String   @id @default(cuid())
  title       String
  description String
  price       Decimal  @db.Decimal(10,2)
  duration    Int
  imageUrl    String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("services")
}

model Availability {
  id        String   @id @default(cuid())
  date      DateTime
  startTime String
  endTime   String
  slots     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("availabilities")
}`,

  'lib/prisma.ts': `import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;`,

  'types/index.ts': `import { User, Appointment, Enquiry, Service, Role, ServiceType, AppointmentStatus, EnquiryStatus } from "@prisma/client";

export type { User, Appointment, Enquiry, Service, Role, ServiceType, AppointmentStatus, EnquiryStatus };

export interface AppointmentWithUser extends Appointment {
  user: Pick<User, "name" | "email" | "phone">;
}

export interface EnquiryWithStatus extends Enquiry {
  // Add any computed fields
}

export interface ServiceWithForm extends Service {
  // For form handling
}`,

  'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "glamstudio.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esmodule",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,

  'components.json': `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "stone",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}`,

  'lib/utils.ts': `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,

  'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 30 33% 98%;
    --foreground: 20 14.3% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 20 14.3% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 20 14.3% 4.1%;
    --primary: 0 30% 68%;
    --primary-foreground: 0 0% 100%;
    --secondary: 30 40% 92%;
    --secondary-foreground: 24 9.8% 10%;
    --muted: 30 20% 95%;
    --muted-foreground: 25 5.3% 44.7%;
    --accent: 30 40% 92%;
    --accent-foreground: 24 9.8% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 20 5.9% 90%;
    --input: 20 5.9% 90%;
    --ring: 0 30% 68%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 10%;
    --foreground: 30 20% 95%;
    --card: 0 0% 14%;
    --card-foreground: 30 20% 95%;
    --popover: 0 0% 14%;
    --popover-foreground: 30 20% 95%;
    --primary: 0 30% 68%;
    --primary-foreground: 0 0% 100%;
    --secondary: 0 15% 20%;
    --secondary-foreground: 30 20% 95%;
    --muted: 0 15% 20%;
    --muted-foreground: 30 10% 70%;
    --accent: 0 15% 20%;
    --accent-foreground: 30 20% 95%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 0 15% 25%;
    --input: 0 15% 25%;
    --ring: 0 30% 68%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-display;
  }
}`,

  // Phase 2: Authentication & Middleware
  'lib/auth.ts': `import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
    };
  }
  interface User {
    role: Role;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as Role;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};`,

  'app/api/auth/[...nextauth]/route.ts': `import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };`,

  'app/middleware.ts': `import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (token) {
      const isAdmin = token.role === "ADMIN";
      const isUser = token.role === "USER";

      if (isUser && path.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/user/dashboard", req.url));
      }
      if (isAdmin && path.startsWith("/user")) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    if (!token) {
      const protectedPaths = ["/admin", "/user", "/dashboard"];
      if (protectedPaths.some((p) => path.startsWith(p))) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/dashboard/:path*",
  ],
};`,

  'app/providers.tsx': `"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--background)",
              color: "var(--foreground)",
            },
          }}
        />
      </NextThemeProvider>
    </SessionProvider>
  );
}`,

  'app/layout.tsx': `import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "GlamStudio - Professional Makeup Artist",
  description:
    "Book professional makeup services for weddings, parties, and events. Contact us today for a transformative experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          playfair.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`,

  'lib/email.ts': `import nodemailer from "nodemailer";
import { format } from "date-fns";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: any[];
}) {
  try {
    const info = await transporter.sendMail({
      from: \`"\${process.env.APP_NAME || "GlamStudio"}" <\${process.env.EMAIL_USER}>\`,
      to,
      subject,
      html,
      text,
      attachments,
    });
    return info;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

export function enquiryNotificationEmail({ name, email, phone, eventDate, message }: any) {
  return \`
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #D4A5A5;">📩 New Enquiry</h2>
        <p><strong>Name:</strong> \${name}</p>
        <p><strong>Email:</strong> <a href="mailto:\${email}">\${email}</a></p>
        <p><strong>Phone:</strong> \${phone || "Not provided"}</p>
        <p><strong>Event Date:</strong> \${eventDate ? format(new Date(eventDate), "MMMM dd, yyyy") : "Not specified"}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f5f5f5; padding: 15px; border-radius: 4px; border-left: 4px solid #D4A5A5;">
          \${message.replace(/\\n/g, "<br>")}
        </blockquote>
        <p style="margin-top: 20px; color: #888; font-size: 0.9em;">This enquiry was submitted via the GlamStudio website.</p>
      </div>
    </body>
    </html>
  \`;
}

export function appointmentConfirmationEmail({
  name,
  serviceType,
  date,
  timeSlot,
  status,
  googleLink,
  icsAttachment,
}: any) {
  const formattedDate = format(new Date(date), "EEEE, MMMM dd, yyyy");
  const serviceLabel = serviceType.toLowerCase().replace(/_/g, " ");

  return \`
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #D4A5A5;">💄 Appointment \${status === "CONFIRMED" ? "Confirmed" : "Booked"}</h2>
          <p style="color: #888;">Hello \${name},</p>
        </div>
        <div style="background: #fafafa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> \${serviceLabel}</p>
          <p><strong>Date:</strong> \${formattedDate}</p>
          <p><strong>Time:</strong> \${timeSlot}</p>
          <p><strong>Status:</strong> <span style="color: \${status === "CONFIRMED" ? "green" : "orange"}; font-weight: bold;">\${status}</span></p>
        </div>
        \${status === "CONFIRMED" ? \`
          <div style="margin: 20px 0;">
            <p><strong>Add to your calendar:</strong></p>
            <a href="\${googleLink}" target="_blank" style="display: inline-block; background: #4285f4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 10px;">Google Calendar</a>
            \${icsAttachment ? '<a href="cid:event.ics" style="display: inline-block; background: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Download .ics</a>' : ""}
          </div>
        \` : \`
          <p style="color: #888;">We'll notify you once your appointment is confirmed.</p>
        \`}
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.9em; color: #888; text-align: center;">
          Need to reschedule? <a href="\${process.env.NEXTAUTH_URL}/user/appointments" style="color: #D4A5A5;">Manage your appointments</a>
        </p>
      </div>
    </body>
    </html>
  \`;
}

export function adminNotificationEmail({
  name,
  email,
  serviceType,
  date,
  timeSlot,
  notes,
}: any) {
  const formattedDate = format(new Date(date), "EEEE, MMMM dd, yyyy");
  return \`
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #D4A5A5;">📅 New Appointment Booking</h2>
        <p><strong>Client:</strong> \${name} (\${email})</p>
        <p><strong>Service:</strong> \${serviceType.toLowerCase().replace(/_/g, " ")}</p>
        <p><strong>Date:</strong> \${formattedDate}</p>
        <p><strong>Time:</strong> \${timeSlot}</p>
        \${notes ? \`<p><strong>Notes:</strong> \${notes}</p>\` : ""}
        <p style="margin-top: 20px; color: #888; font-size: 0.9em;">Log in to the admin dashboard to manage this booking.</p>
      </div>
    </body>
    </html>
  \`;
}`,

  'lib/calendar.ts': `import { createEvent } from "ics";

export function generateICalEvent({
  title,
  startDate,
  endDate,
  location,
  description,
}: {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    createEvent(
      {
        title,
        start: [
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes(),
        ],
        end: [
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate(),
          endDate.getHours(),
          endDate.getMinutes(),
        ],
        location: location || "GlamStudio Studio",
        description: description || "Makeup appointment",
        status: "CONFIRMED",
      },
      (error, value) => {
        if (error) reject(error);
        else resolve(value);
      }
    );
  });
}

export function generateGoogleCalendarLink({
  title,
  startDate,
  endDate,
  location,
  details,
}: {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  details?: string;
}): string {
  const base = "https://www.google.com/calendar/render?action=TEMPLATE";
  const text = encodeURIComponent(title);
  const dates = \`\${formatDateForGoogle(startDate)}/\${formatDateForGoogle(endDate)}\`;
  const loc = location ? encodeURIComponent(location) : "";
  const det = details ? encodeURIComponent(details) : "";
  return \`\${base}&text=\${text}&dates=\${dates}&location=\${loc}&details=\${det}\`;
}

function formatDateForGoogle(date: Date): string {
  return date
    .toISOString()
    .replace(/-|:|\\.\\d+/g, "")
    .slice(0, 15);
}`,

  // Phase 3: UI Components & Public Pages
  'components/ui/button.tsx': `import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };`,

  'components/ui/input.tsx': `import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };`,

  'components/ui/label.tsx': `"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };`,

  'components/ui/textarea.tsx': `import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };`,

  'components/layout/ThemeToggle.tsx': `"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}`,

  'components/layout/Header.tsx': `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Calendar, Mail } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
    { href: "/book", label: "Book Now" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-display font-bold text-primary">
            GlamStudio
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={\`text-sm font-medium transition-colors hover:text-primary \${isActive(link.href) ? "text-primary" : "text-muted-foreground"}\`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">
                  {session.user?.name}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={session.user?.role === "ADMIN" ? "/admin" : "/user/dashboard"}>
                    <Settings className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={session.user?.role === "ADMIN" ? "/admin/appointments" : "/user/appointments"}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Appointments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Enquiries
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}`,

  'components/layout/Footer.tsx': `import Link from "next/link";
import { Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-display font-bold text-primary">
              GlamStudio
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Professional makeup artistry for weddings, parties, and special
              events.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-primary">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-muted-foreground hover:text-primary">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Contact</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:hello@glamstudio.com" className="text-muted-foreground hover:text-primary">
                  hello@glamstudio.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Follow Us</h4>
            <div className="mt-2 flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GlamStudio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}`,

  'components/forms/ContactForm.tsx': `"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  eventDate: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      toast.success("Enquiry sent! We'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" {...register("phone")} />
      </div>

      <div>
        <Label htmlFor="eventDate">Event Date</Label>
        <Input id="eventDate" type="date" {...register("eventDate")} />
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" rows={5} {...register("message")} />
        {errors.message && (
          <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending..." : "Send Enquiry"}
      </Button>
    </form>
  );
}`,

  'components/forms/BookingForm.tsx': `"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Service, ServiceType } from "@prisma/client";

const bookingSchema = z.object({
  serviceType: z.enum(["BRIDAL", "PARTY", "AIRBRUSH", "TRIAL", "EDITORIAL", "OTHER"]),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const selectedDate = watch("date");
  const selectedService = watch("serviceType");

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => toast.error("Failed to load services"));
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetch(\`/api/availability?date=\${selectedDate}&service=\${selectedService}\`)
        .then((res) => res.json())
        .then((data) => setAvailableSlots(data.slots || []))
        .catch(() => setAvailableSlots([]));
    }
  }, [selectedDate, selectedService]);

  const onSubmit = async (data: BookingFormData) => {
    if (!session) {
      toast.error("Please login to book an appointment");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to book");
      toast.success("Appointment booked! Check your email for confirmation.");
      router.push("/user/appointments");
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="serviceType">Select Service *</Label>
        <select
          id="serviceType"
          className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
          {...register("serviceType")}
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.serviceType}>
              {s.title} - \${s.price} ({s.duration} min)
            </option>
          ))}
        </select>
        {errors.serviceType && (
          <p className="text-sm text-destructive mt-1">{errors.serviceType.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          {...register("date")}
        />
        {errors.date && (
          <p className="text-sm text-destructive mt-1">{errors.date.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="timeSlot">Time Slot *</Label>
        <select
          id="timeSlot"
          className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
          {...register("timeSlot")}
          disabled={!availableSlots.length}
        >
          <option value="">Select a time</option>
          {availableSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {errors.timeSlot && (
          <p className="text-sm text-destructive mt-1">{errors.timeSlot.message}</p>
        )}
        {availableSlots.length === 0 && selectedDate && (
          <p className="text-sm text-muted-foreground mt-1">
            No slots available for this date. Please choose another.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="notes">Special Requests (optional)</Label>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Booking..." : "Book Appointment"}
      </Button>
    </form>
  );
}`,

  // Public pages
  'app/(public)/page.tsx': `import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-blush/30 to-cream/30">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground">
              Transform Your Look with GlamStudio
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional makeup artistry for weddings, parties, and every
              special moment.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/book">
                <Button size="lg">Book Now</Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-display text-center mb-12">
              Our Signature Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {servicesPreview.map((service) => (
                <div
                  key={service.title}
                  className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
                >
                  <div className="h-48 bg-gradient-to-r from-rose/20 to-blush/20 flex items-center justify-center">
                    <span className="text-6xl">{service.icon}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display">{service.title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {service.description}
                    </p>
                    <Link href="/book" className="block mt-4">
                      <Button variant="outline" className="w-full">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-display">Ready to Glow?</h2>
            <p className="mt-2 text-lg opacity-90">
              Let's create a look that's uniquely you.
            </p>
            <Link href="/contact" className="mt-6 inline-block">
              <Button variant="secondary" size="lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const servicesPreview = [
  {
    title: "Bridal Makeup",
    description: "Flawless, long-lasting bridal looks tailored to your style.",
    icon: "👰",
  },
  {
    title: "Party Makeup",
    description: "Bold and glamorous looks for weddings, anniversaries, and parties.",
    icon: "💃",
  },
  {
    title: "Airbrush Makeup",
    description: "Lightweight, HD-perfect finish for photos and events.",
    icon: "✨",
  },
];`,

  'app/(public)/services/page.tsx': `import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="py-16">
        <div className="container">
          <h1 className="text-4xl font-display text-center mb-12">Our Services</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-card rounded-lg overflow-hidden shadow-md p-6"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-xl font-display">{service.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {service.description}
                </p>
                <p className="mt-2 font-semibold text-primary">
                  \${service.price} · {service.duration} min
                </p>
                <Link href="/book" className="mt-4 block">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const services = [
  {
    id: "bridal",
    title: "Bridal Makeup",
    description: "Complete bridal look with trial session and touch-up kit.",
    price: 350,
    duration: 120,
    icon: "👰",
  },
  {
    id: "party",
    title: "Party Makeup",
    description: "Glamorous makeup for weddings, proms, and special events.",
    price: 200,
    duration: 60,
    icon: "💃",
  },
  {
    id: "airbrush",
    title: "Airbrush Makeup",
    description: "Flawless, lightweight coverage for photo-perfect skin.",
    price: 250,
    duration: 90,
    icon: "✨",
  },
  {
    id: "trial",
    title: "Trial Session",
    description: "Preview your bridal/party look before the big day.",
    price: 150,
    duration: 60,
    icon: "🎨",
  },
  {
    id: "editorial",
    title: "Editorial Makeup",
    description: "High-fashion, editorial looks for shoots and campaigns.",
    price: 300,
    duration: 120,
    icon: "📸",
  },
  {
    id: "other",
    title: "Custom Package",
    description: "Customized makeup packages for your specific needs.",
    price: 0,
    duration: 0,
    icon: "💄",
  },
];`,

  'app/(public)/gallery/page.tsx': `import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className="py-16">
        <div className="container">
          <h1 className="text-4xl font-display text-center mb-12">Our Gallery</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="aspect-square bg-secondary rounded-lg overflow-hidden flex items-center justify-center"
              >
                <span className="text-6xl">{img.emoji}</span>
                <p className="sr-only">{img.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const galleryImages = [
  { emoji: "💄", label: "Makeup 1" },
  { emoji: "👁️", label: "Makeup 2" },
  { emoji: "💋", label: "Makeup 3" },
  { emoji: "✨", label: "Makeup 4" },
  { emoji: "🌸", label: "Makeup 5" },
  { emoji: "🌟", label: "Makeup 6" },
  { emoji: "💎", label: "Makeup 7" },
  { emoji: "🦋", label: "Makeup 8" },
  { emoji: "🌺", label: "Makeup 9" },
  { emoji: "🌹", label: "Makeup 10" },
  { emoji: "🌷", label: "Makeup 11" },
  { emoji: "🌻", label: "Makeup 12" },
];`,

  'app/(public)/contact/page.tsx': `import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="py-16">
        <div className="container">
          <h1 className="text-4xl font-display text-center mb-12">Get in Touch</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <ContactForm />
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-display mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:hello@glamstudio.com" className="text-muted-foreground hover:text-primary">
                        hello@glamstudio.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">
                        123 Beauty Lane, Suite 101<br />
                        Los Angeles, CA 90001
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Hours</p>
                      <p className="text-muted-foreground">
                        Mon–Sat: 9:00 AM – 8:00 PM<br />
                        Sun: By appointment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-6 bg-secondary rounded-lg">
                <h4 className="font-display text-lg">Let's Create Magic</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Whether you're a bride-to-be or just want to treat yourself,
                  we're here to make you feel beautiful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}`,

  'app/(public)/book/page.tsx': `import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookingForm } from "@/components/forms/BookingForm";

export default function BookPage() {
  return (
    <>
      <Header />
      <main className="py-16">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-display text-center mb-4">Book an Appointment</h1>
          <p className="text-center text-muted-foreground mb-8">
            Fill in the details below to reserve your spot.
          </p>
          <div className="bg-card rounded-xl shadow-lg p-6 md:p-8">
            <BookingForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}`,

  'app/(public)/layout.tsx': `export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}`,

  // Auth pages
  'app/(auth)/login/page.tsx': `"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Login successful!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-display">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-background"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-background"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}`,

  'app/(auth)/register/page.tsx': `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Registration failed");
      } else {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-display">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join GlamStudio today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-background"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-background"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone (optional)</label>
            <input
              type="tel"
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-background"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-background"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}`,

  'app/(auth)/layout.tsx': `export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}`,

  'app/api/register/route.ts': `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashed,
        role: "USER",
      },
    });

    return NextResponse.json(
      { message: "User created", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}`,

  // API routes
  'app/api/enquiries/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, enquiryNotificationEmail } from "@/lib/email";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  eventDate: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = enquirySchema.parse(body);

    const enquiry = await prisma.enquiry.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        eventDate: validated.eventDate ? new Date(validated.eventDate) : undefined,
        message: validated.message,
        status: "NEW",
      },
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: \`New Enquiry from \${validated.name}\`,
      html: enquiryNotificationEmail({
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        eventDate: validated.eventDate,
        message: validated.message,
      }),
    });

    return NextResponse.json({ message: "Enquiry submitted", id: enquiry.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    console.error("Enquiry error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const enquiries = await prisma.enquiry.findMany({
      where: { email: session.user.email },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("User enquiries error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/services/route.ts': `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { title: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Services error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/availability/route.ts': `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

const TIME_SLOTS = [
  "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
  "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const dateParam = url.searchParams.get("date");
    if (!dateParam) {
      return NextResponse.json({ message: "Date is required" }, { status: 400 });
    }

    const date = new Date(dateParam);
    const start = startOfDay(date);
    const end = endOfDay(date);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
        status: { not: "CANCELED" },
      },
    });

    const bookedSlots = appointments.map((a) => a.timeSlot);
    const availableSlots = TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));

    return NextResponse.json({ slots: availableSlots });
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/appointments/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendEmail, appointmentConfirmationEmail, adminNotificationEmail } from "@/lib/email";
import { generateGoogleCalendarLink } from "@/lib/calendar";

const appointmentSchema = z.object({
  serviceType: z.enum(["BRIDAL", "PARTY", "AIRBRUSH", "TRIAL", "EDITORIAL", "OTHER"]),
  date: z.string().min(1),
  timeSlot: z.string().min(1),
  notes: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Appointments error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Please login to book" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = appointmentSchema.parse(body);

    const date = new Date(validated.date);

    const existing = await prisma.appointment.findFirst({
      where: {
        date,
        timeSlot: validated.timeSlot,
        status: { not: "CANCELED" },
      },
    });
    if (existing) {
      return NextResponse.json({ message: "Slot already taken" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        serviceType: validated.serviceType,
        date,
        timeSlot: validated.timeSlot,
        notes: validated.notes,
        status: "PENDING",
      },
    });

    const googleLink = generateGoogleCalendarLink({
      title: \`\${validated.serviceType.toLowerCase().replace(/_/g, " ")} at GlamStudio\`,
      startDate: date,
      endDate: new Date(date.getTime() + 60 * 60 * 1000),
      details: \`Booking for \${validated.serviceType}\\nNotes: \${validated.notes || "None"}\`,
    });

    await sendEmail({
      to: session.user.email,
      subject: "Appointment Booking Received – GlamStudio",
      html: appointmentConfirmationEmail({
        name: session.user.name,
        serviceType: validated.serviceType,
        date,
        timeSlot: validated.timeSlot,
        status: "PENDING",
        googleLink,
        icsAttachment: false,
      }),
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: \`New Appointment from \${session.user.name}\`,
      html: adminNotificationEmail({
        name: session.user.name,
        email: session.user.email,
        serviceType: validated.serviceType,
        date,
        timeSlot: validated.timeSlot,
        notes: validated.notes,
      }),
    });

    return NextResponse.json({ appointment, message: "Appointment created" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    console.error("Book appointment error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/appointments/[id]/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  date: z.string().optional(),
  timeSlot: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELED", "RESCHEDULED"]).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: { user: { select: { name: true, email: true, phone: true } } },
    });
    if (!appointment) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && appointment.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Get appointment error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = updateSchema.parse(body);

    const existing = await prisma.appointment.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    const isAdmin = session.user.role === "ADMIN";
    if (!isAdmin && existing.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!isAdmin) {
      if (validated.status && !["CANCELED", "RESCHEDULED"].includes(validated.status)) {
        return NextResponse.json({ message: "Invalid status change" }, { status: 400 });
      }
    }

    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    console.error("Update appointment error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await prisma.appointment.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    const isAdmin = session.user.role === "ADMIN";
    if (!isAdmin && existing.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.appointment.update({
      where: { id: params.id },
      data: { status: "CANCELED" },
    });

    return NextResponse.json({ message: "Appointment canceled" });
  } catch (error) {
    console.error("Delete appointment error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/users/me/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = updateProfileSchema.parse(body);

    const updateData: any = {};
    if (validated.name) updateData.name = validated.name;
    if (validated.phone !== undefined) updateData.phone = validated.phone;
    if (validated.password) {
      updateData.passwordHash = await bcrypt.hash(validated.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    console.error("Update user error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/calendar/generate/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateICalEvent, generateGoogleCalendarLink } from "@/lib/calendar";
import { z } from "zod";

const calendarSchema = z.object({
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = calendarSchema.parse(body);

    const start = new Date(validated.startDate);
    const end = new Date(validated.endDate);

    const icsData = await generateICalEvent({
      title: validated.title,
      startDate: start,
      endDate: end,
      location: validated.location,
      description: validated.description,
    });

    const googleLink = generateGoogleCalendarLink({
      title: validated.title,
      startDate: start,
      endDate: end,
      location: validated.location,
      details: validated.description,
    });

    return NextResponse.json({
      ics: icsData,
      googleLink,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    console.error("Calendar error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  // Admin API routes
  'app/api/admin/users/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: { appointments: true, enquiries: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/admin/users/[id]/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    if (params.id === session.user.id) {
      return NextResponse.json({ message: "Cannot delete yourself" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/admin/appointments/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Admin appointments error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/admin/appointments/[id]/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendEmail, appointmentConfirmationEmail } from "@/lib/email";
import { generateGoogleCalendarLink, generateICalEvent } from "@/lib/calendar";

const statusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELED", "RESCHEDULED"]),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { status } = statusSchema.parse(body);

    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: { status },
      include: { user: true },
    });

    if (status === "CONFIRMED") {
      const serviceTitle = updated.serviceType.toLowerCase().replace(/_/g, " ");
      const googleLink = generateGoogleCalendarLink({
        title: \`\${serviceTitle} at GlamStudio\`,
        startDate: updated.date,
        endDate: new Date(updated.date.getTime() + 60 * 60 * 1000),
        details: \`Booking for \${updated.serviceType}\\nNotes: \${updated.notes || "None"}\`,
      });

      const icsContent = await generateICalEvent({
        title: \`\${serviceTitle} at GlamStudio\`,
        startDate: updated.date,
        endDate: new Date(updated.date.getTime() + 60 * 60 * 1000),
        location: "GlamStudio Studio",
        description: \`Booking for \${serviceTitle}\\nNotes: \${updated.notes || "None"}\`,
      });

      await sendEmail({
        to: updated.user.email,
        subject: "Appointment Confirmed – GlamStudio",
        html: appointmentConfirmationEmail({
          name: updated.user.name,
          serviceType: updated.serviceType,
          date: updated.date,
          timeSlot: updated.timeSlot,
          status: "CONFIRMED",
          googleLink,
          icsAttachment: true,
        }),
        attachments: [
          {
            filename: "appointment.ics",
            content: icsContent,
            contentType: "text/calendar",
            cid: "event.ics",
          },
        ],
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    console.error("Admin update appointment error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/admin/enquiries/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("Admin enquiries error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/admin/enquiries/[id]/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { status } = statusSchema.parse(body);

    const updated = await prisma.enquiry.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    console.error("Admin update enquiry error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/admin/services/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const services = await prisma.service.findMany({
      orderBy: { title: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Admin services error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

const serviceSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  duration: z.number().int().positive(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = serviceSchema.parse(body);

    const service = await prisma.service.create({
      data: {
        title: validated.title,
        description: validated.description,
        price: validated.price,
        duration: validated.duration,
        imageUrl: validated.imageUrl,
        isActive: validated.isActive ?? true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    console.error("Create service error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/admin/services/[id]/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateServiceSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  duration: z.number().int().positive().optional(),
  imageUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = updateServiceSchema.parse(body);

    const updated = await prisma.service.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    console.error("Update service error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.service.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Service deleted" });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  'app/api/admin/stats/route.ts': `import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const [totalUsers, totalAppointments, pendingEnquiries, appointmentsThisMonth, confirmedAppointments] =
      await prisma.$transaction([
        prisma.user.count(),
        prisma.appointment.count(),
        prisma.enquiry.count({ where: { status: "NEW" } }),
        prisma.appointment.count({
          where: {
            date: { gte: monthStart, lte: monthEnd },
            status: { not: "CANCELED" },
          },
        }),
        prisma.appointment.count({
          where: { status: "CONFIRMED" },
        }),
      ]);

    return NextResponse.json({
      totalUsers,
      totalAppointments,
      pendingEnquiries,
      appointmentsThisMonth,
      confirmedAppointments,
      revenue: 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}`,

  // Dashboard Layout
  'components/dashboard/DashboardLayout.tsx': `"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  Inbox,
  Users,
  Sparkles,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  Calendar,
  Inbox,
  Users,
  Sparkles,
  User,
};

interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof iconMap;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  basePath: string;
}

export function DashboardLayout({ children, navItems, basePath }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full bg-card shadow-md"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b">
            <Link href="/" className="text-xl font-display font-bold text-primary">
              GlamStudio
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t space-y-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 min-h-screen">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}`,

  'components/shared/LoadingSpinner.tsx': `export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}`,

  // Admin Dashboard pages
  'app/(dashboard)/admin/page.tsx': `"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, Calendar, Mail, CheckCircle, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface Stats {
  totalUsers: number;
  totalAppointments: number;
  pendingEnquiries: number;
  appointmentsThisMonth: number;
  confirmedAppointments: number;
  revenue: number;
}

export default function AdminOverview() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/user/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user?.role === "ADMIN") {
      fetchStats();
    }
  }, [session]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  const chartData = [
    { name: "Mon", appointments: 4 },
    { name: "Tue", appointments: 7 },
    { name: "Wed", appointments: 5 },
    { name: "Thu", appointments: 9 },
    { name: "Fri", appointments: 6 },
    { name: "Sat", appointments: 3 },
    { name: "Sun", appointments: 2 },
  ];

  const COLORS = ["#D4A5A5", "#F5E6D3", "#FDEBD0", "#2C2C2C"];

  const pieData = [
    { name: "Pending", value: stats.totalAppointments - stats.confirmedAppointments || 1 },
    { name: "Confirmed", value: stats.confirmedAppointments || 1 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session?.user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} trend="+12%" />
        <StatCard title="Total Appointments" value={stats.totalAppointments} icon={Calendar} trend="+8%" />
        <StatCard title="Pending Enquiries" value={stats.pendingEnquiries} icon={Mail} trend="New" />
        <StatCard title="This Month" value={stats.appointmentsThisMonth} icon={CheckCircle} trend="Ongoing" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="text-lg font-display mb-4">Weekly Appointments</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appointments" fill="#D4A5A5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="text-lg font-display mb-4">Appointment Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => \`\${name} \${(percent * 100).toFixed(0)}%\`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow">
        <h3 className="text-lg font-display mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <QuickAction href="/admin/appointments" label="View Appointments" icon={Calendar} />
          <QuickAction href="/admin/enquiries" label="Check Enquiries" icon={Mail} />
          <QuickAction href="/admin/services" label="Manage Services" icon={Sparkles} />
          <QuickAction href="/admin/users" label="Manage Users" icon={Users} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: any) {
  return (
    <div className="bg-card p-6 rounded-lg shadow flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
      </div>
      <div className="p-3 bg-primary/10 rounded-full">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
  );
}

function QuickAction({ href, label, icon: Icon }: any) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition"
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </a>
  );
}`,

  'app/(dashboard)/admin/appointments/page.tsx': `"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";

interface AppointmentWithUser {
  id: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  status: string;
  notes: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  CANCELED: "bg-red-100 text-red-800",
  RESCHEDULED: "bg-purple-100 text-purple-800",
};

export default function AdminAppointments() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/user/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/admin/appointments");
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user?.role === "ADMIN") {
      fetchAppointments();
    }
  }, [session]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(\`/api/admin/appointments/\${id}\`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        toast.success("Status updated");
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display">Appointments</h1>
        <p className="text-muted-foreground">Manage all bookings</p>
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No appointments yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-secondary/50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{apt.user.name}</div>
                      <div className="text-xs text-muted-foreground">{apt.user.email}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{apt.serviceType.toLowerCase().replace(/_/g, " ")}</td>
                    <td className="px-4 py-3">
                      <div>{format(new Date(apt.date), "MMM dd, yyyy")}</div>
                      <div className="text-sm text-muted-foreground">{apt.timeSlot}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={\`px-2 py-1 rounded-full text-xs font-medium \${statusColors[apt.status as keyof typeof statusColors]}\`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {apt.status !== "CONFIRMED" && apt.status !== "CANCELED" && apt.status !== "COMPLETED" && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "CONFIRMED")} disabled={updating === apt.id}>
                            Confirm
                          </Button>
                        )}
                        {apt.status !== "CANCELED" && apt.status !== "COMPLETED" && (
                          <Button size="sm" variant="destructive" onClick={() => updateStatus(apt.id, "CANCELED")} disabled={updating === apt.id}>
                            Cancel
                          </Button>
                        )}
                        {apt.status === "CONFIRMED" && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "COMPLETED")} disabled={updating === apt.id}>
                            Complete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}`,

  'app/(dashboard)/admin/enquiries/page.tsx': `"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string | null;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";
  createdAt: string;
}

const statusColors = {
  NEW: "bg-red-100 text-red-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  RESOLVED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-gray-100 text-gray-800",
};

export default function AdminEnquiries() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/user/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchEnquiries() {
      try {
        const res = await fetch("/api/admin/enquiries");
        if (res.ok) {
          const data = await res.json();
          setEnquiries(data);
        }
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user?.role === "ADMIN") {
      fetchEnquiries();
    }
  }, [session]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(\`/api/admin/enquiries/\${id}\`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus as Enquiry["status"] } : e))
        );
        toast.success("Status updated");
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display">Enquiries</h1>
        <p className="text-muted-foreground">Manage all customer enquiries</p>
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        {enquiries.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No enquiries yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">From</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Message</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-secondary/50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{enq.name}</div>
                      <div className="text-xs text-muted-foreground">{enq.email}</div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm line-clamp-2">{enq.message}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {format(new Date(enq.createdAt), "MMM dd, yyyy HH:mm")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={\`px-2 py-1 rounded-full text-xs font-medium \${statusColors[enq.status]}\`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {enq.status === "NEW" && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(enq.id, "IN_PROGRESS")} disabled={updating === enq.id}>
                            Start
                          </Button>
                        )}
                        {enq.status === "IN_PROGRESS" && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(enq.id, "RESOLVED")} disabled={updating === enq.id}>
                            Resolve
                          </Button>
                        )}
                        {enq.status !== "ARCHIVED" && (
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(enq.id, "ARCHIVED")} disabled={updating === enq.id}>
                            Archive
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}`,

  'app/(dashboard)/admin/users/page.tsx': `"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: {
    appointments: number;
    enquiries: number;
  };
}

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/user/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user?.role === "ADMIN") {
      fetchUsers();
    }
  }, [session]);

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeleting(id);
    try {
      const res = await fetch(\`/api/admin/users/\${id}\`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("User deleted");
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display">Users</h1>
        <p className="text-muted-foreground">Manage all registered users</p>
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        {users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No users registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Bookings</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/50">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={\`px-2 py-1 rounded-full text-xs font-medium \${user.role === "ADMIN" ? "bg-primary/20 text-primary" : "bg-secondary"}\`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{user._count.appointments}</td>
                    <td className="px-4 py-3 text-sm">{format(new Date(user.createdAt), "MMM dd, yyyy")}</td>
                    <td className="px-4 py-3">
                      {user.id !== session?.user?.id && (
                        <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)} disabled={deleting === user.id}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}`,

  'app/(dashboard)/admin/services/page.tsx': `"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string | null;
  isActive: boolean;
}

export default function AdminServices() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/user/dashboard");
    }
  }, [status, session, router]);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchServices();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(\`/api/admin/services/\${id}\`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        toast.success("Service deleted");
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <Button onClick={() => { setEditing(null); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-card rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-display">{service.title}</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(service); setIsModalOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">$ {service.price}</span>
              <span className="flex items-center gap-1">{service.duration} min</span>
            </div>
            <div className="mt-2">
              <span className={\`text-xs px-2 py-1 rounded-full \${service.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}\`}>
                {service.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ServiceModal
          service={editing}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false);
            fetchServices();
          }}
        />
      )}
    </div>
  );
}

function ServiceModal({ service, onClose, onSave }: any) {
  const [form, setForm] = useState({
    title: service?.title || "",
    description: service?.description || "",
    price: service?.price?.toString() || "",
    duration: service?.duration?.toString() || "",
    imageUrl: service?.imageUrl || "",
    isActive: service?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = service ? \`/api/admin/services/\${service.id}\` : "/api/admin/services";
      const method = service ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          duration: parseInt(form.duration),
        }),
      });
      if (res.ok) {
        toast.success(service ? "Service updated" : "Service created");
        onSave();
      } else {
        toast.error("Operation failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-display mb-4">{service ? "Edit Service" : "Add Service"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} />
          </div>
          <div>
            <Label htmlFor="price">Price ($) *</Label>
            <Input id="price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <Input id="duration" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input id="imageUrl" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : service ? "Update" : "Create"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}`,

  // User Dashboard pages
  'app/(dashboard)/user/dashboard/page.tsx': `"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Inbox, User, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface Appointment {
  id: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  status: string;
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/appointments");
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user?.role === "USER") {
      fetchAppointments();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  const upcoming = appointments.filter(a => a.status !== "CANCELED" && a.status !== "COMPLETED");
  const past = appointments.filter(a => a.status === "COMPLETED" || a.status === "CANCELED");

  const statusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "PENDING": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "CANCELED": return <XCircle className="h-4 w-4 text-red-600" />;
      case "COMPLETED": return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display">Welcome, {session?.user?.name}</h1>
        <p className="text-muted-foreground">Manage your appointments and profile</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/user/appointments" className="bg-card p-6 rounded-lg shadow hover:shadow-md transition flex items-center gap-4">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium">My Appointments</p>
            <p className="text-sm text-muted-foreground">{appointments.length} total</p>
          </div>
        </Link>
        <Link href="/user/enquiries" className="bg-card p-6 rounded-lg shadow hover:shadow-md transition flex items-center gap-4">
          <Inbox className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium">My Enquiries</p>
            <p className="text-sm text-muted-foreground">View history</p>
          </div>
        </Link>
        <Link href="/user/profile" className="bg-card p-6 rounded-lg shadow hover:shadow-md transition flex items-center gap-4">
          <User className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium">My Profile</p>
            <p className="text-sm text-muted-foreground">Update your details</p>
          </div>
        </Link>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-display mb-4">Upcoming Appointments</h2>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground">No upcoming appointments.</p>
        ) : (
          <div className="divide-y">
            {upcoming.map((apt) => (
              <div key={apt.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {statusIcon(apt.status)}
                  <div>
                    <p className="font-medium capitalize">{apt.serviceType.toLowerCase().replace(/_/g, " ")}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(apt.date), "MMM dd, yyyy")} at {apt.timeSlot}
                    </p>
                  </div>
                </div>
                <span className={\`text-xs px-2 py-1 rounded-full \${apt.status === "CONFIRMED" ? "bg-green-100 text-green-800" : apt.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}\`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-display mb-4">Past Appointments</h2>
          <div className="divide-y">
            {past.slice(0, 3).map((apt) => (
              <div key={apt.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {statusIcon(apt.status)}
                  <div>
                    <p className="font-medium capitalize">{apt.serviceType.toLowerCase().replace(/_/g, " ")}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(apt.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <span className={\`text-xs px-2 py-1 rounded-full \${apt.status === "COMPLETED" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}\`}>
                  {apt.status}
                </span>
              </div>
            ))}
            {past.length > 3 && (
              <Link href="/user/appointments" className="block text-center text-sm text-primary mt-2">
                View all
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}`,

  'app/(dashboard)/user/appointments/page.tsx': `"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";

interface Appointment {
  id: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  status: string;
  notes: string;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  CANCELED: "bg-red-100 text-red-800",
  RESCHEDULED: "bg-purple-100 text-purple-800",
};

export default function UserAppointments() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/appointments");
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user?.role === "USER") {
      fetchAppointments();
    }
  }, [session]);

  const cancelAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancelling(id);
    try {
      const res = await fetch(\`/api/appointments/\${id}\`, { method: "DELETE" });
      if (res.ok) {
        setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "CANCELED" } : a)));
        toast.success("Appointment canceled");
      } else {
        toast.error("Failed to cancel");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display">My Appointments</h1>
        <p className="text-muted-foreground">View and manage your bookings</p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-8 text-center text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p>You have no appointments yet.</p>
          <Button asChild className="mt-4"><a href="/book">Book Now</a></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-card rounded-lg shadow p-4 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-display capitalize">{apt.serviceType.toLowerCase().replace(/_/g, " ")}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{format(new Date(apt.date), "EEEE, MMMM dd, yyyy")}</span>
                    <span>{apt.timeSlot}</span>
                  </div>
                  {apt.notes && <p className="text-sm text-muted-foreground mt-2">Notes: {apt.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={\`px-2 py-1 rounded-full text-xs font-medium \${statusColors[apt.status as keyof typeof statusColors]}\`}>
                    {apt.status}
                  </span>
                  {apt.status !== "CANCELED" && apt.status !== "COMPLETED" && (
                    <Button size="sm" variant="destructive" onClick={() => cancelAppointment(apt.id)} disabled={cancelling === apt.id}>
                      <XCircle className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,

  'app/(dashboard)/user/profile/page.tsx': `"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          reset({ name: data.name, phone: data.phone || "" });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user?.role === "USER") {
      fetchProfile();
    }
  }, [session, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const payload: any = { name: data.name, phone: data.phone };
      if (data.password) payload.password = data.password;
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("Profile updated");
        reset({ name: data.name, phone: data.phone, password: "" });
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-display">My Profile</h1>
        <p className="text-muted-foreground">Update your personal information</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg shadow">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" {...register("phone")} placeholder="Optional" />
        </div>
        <div>
          <Label htmlFor="password">New Password (leave blank to keep current)</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
        </div>
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Update Profile"}</Button>
      </form>
    </div>
  );
}`,

  'app/(dashboard)/user/enquiries/page.tsx': `"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Inbox, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  eventDate: string | null;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";
  createdAt: string;
}

const statusColors = {
  NEW: "bg-red-100 text-red-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  RESOLVED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-gray-100 text-gray-800",
};

export default function UserEnquiries() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchEnquiries() {
      try {
        const res = await fetch("/api/enquiries");
        if (res.ok) {
          const data = await res.json();
          setEnquiries(data);
        }
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user?.role === "USER") {
      fetchEnquiries();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display">My Enquiries</h1>
        <p className="text-muted-foreground">View your past enquiries and their status</p>
      </div>

      {enquiries.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-8 text-center text-muted-foreground">
          <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p>You haven't sent any enquiries yet.</p>
          <Button asChild className="mt-4"><a href="/contact">Contact Us</a></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div key={enq.id} className="bg-card rounded-lg shadow p-4 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(enq.createdAt), "MMM dd, yyyy HH:mm")}
                    </span>
                  </div>
                  <p className="mt-2">{enq.message}</p>
                  {enq.eventDate && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Event Date: {format(new Date(enq.eventDate), "MMM dd, yyyy")}
                    </p>
                  )}
                </div>
                <span className={\`px-2 py-1 rounded-full text-xs font-medium \${statusColors[enq.status]}\`}>
                  {enq.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,

  // Dashboard Layout wrapper
  'app/(dashboard)/layout.tsx': `"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isAdmin = session.user?.role === "ADMIN";
  const basePath = isAdmin ? "/admin" : "/user";

  const navItems = isAdmin
    ? [
        { href: "/admin", label: "Overview", icon: "LayoutDashboard" },
        { href: "/admin/appointments", label: "Appointments", icon: "Calendar" },
        { href: "/admin/enquiries", label: "Enquiries", icon: "Inbox" },
        { href: "/admin/users", label: "Users", icon: "Users" },
        { href: "/admin/services", label: "Services", icon: "Sparkles" },
      ]
    : [
        { href: "/user/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
        { href: "/user/appointments", label: "My Appointments", icon: "Calendar" },
        { href: "/user/enquiries", label: "My Enquiries", icon: "Inbox" },
        { href: "/user/profile", label: "Profile", icon: "User" },
      ];

  return (
    <DashboardLayout navItems={navItems} basePath={basePath}>
      {children}
    </DashboardLayout>
  );
}`,

  // Seed script
  'prisma/seed.ts': `import { PrismaClient, Role, ServiceType, AppointmentStatus, EnquiryStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminEmail = "admin@glamstudio.com";
  const adminPassword = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      phone: "+1234567890",
    },
  });
  console.log(\`✅ Admin user created: \${adminEmail}\`);

  const services = [
    { title: "Bridal Makeup", description: "Complete bridal look with trial session and touch-up kit. Includes skin prep, foundation, eyes, lips, and setting spray.", price: 350, duration: 120, imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400", isActive: true },
    { title: "Party Makeup", description: "Glamorous makeup for weddings, proms, and special events. Customized to your outfit and style.", price: 200, duration: 60, imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400", isActive: true },
    { title: "Airbrush Makeup", description: "Flawless, lightweight coverage for photo-perfect skin. Lasts all day and feels like second skin.", price: 250, duration: 90, imageUrl: "https://images.unsplash.com/photo-1519368358672-25b03afee3bf?w=400", isActive: true },
    { title: "Trial Session", description: "Preview your bridal or party look before the big day. Test different styles and find what suits you.", price: 150, duration: 60, imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400", isActive: true },
    { title: "Editorial Makeup", description: "High-fashion, editorial looks for photoshoots, campaigns, and fashion shows. Creative and bold.", price: 300, duration: 120, imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400", isActive: true },
    { title: "Custom Package", description: "Create a personalized makeup package for your unique needs. Contact us for a custom quote.", price: 0, duration: 0, imageUrl: null, isActive: true },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: \`temp_\${service.title}\` },
      update: service,
      create: service,
    });
  }
  console.log(\`✅ \${services.length} services seeded\`);

  const userEmail = "user@example.com";
  const userPassword = await bcrypt.hash("User123!", 10);
  const sampleUser = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: "Sample User",
      passwordHash: userPassword,
      role: Role.USER,
      phone: "+1234567890",
    },
  });
  console.log(\`✅ Sample user created: \${sampleUser.email}\`);

  await prisma.enquiry.upsert({
    where: { id: "sample-enquiry" },
    update: {},
    create: {
      id: "sample-enquiry",
      name: "Sample Client",
      email: "client@example.com",
      phone: "+1234567890",
      eventDate: new Date("2026-01-15"),
      message: "Hello, I'm interested in bridal makeup for my wedding in January. Can you share availability?",
      status: EnquiryStatus.NEW,
    },
  });
  console.log("✅ Sample enquiry created");

  await prisma.appointment.upsert({
    where: { id: "sample-appointment" },
    update: {},
    create: {
      id: "sample-appointment",
      userId: sampleUser.id,
      serviceType: ServiceType.BRIDAL,
      date: new Date("2026-02-14"),
      timeSlot: "10:00-11:00",
      status: AppointmentStatus.PENDING,
      notes: "Bring trial photos for reference",
    },
  });
  console.log("✅ Sample appointment created");

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });`,

  // README
  'README.md': `# GlamStudio - Professional Makeup Artist Website

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
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables in \`.env.local\` (see example below).

3. Set up the database:
\`\`\`bash
npx prisma migrate dev --name init
npm run seed
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

## Environment Variables
\`\`\`env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
ADMIN_EMAIL="admin@glamstudio.com"
APP_NAME="GlamStudio"
\`\`\`

## Default Admin Credentials (after seeding)
- Email: admin@glamstudio.com
- Password: Admin123!

## Deployment
Deploy to Vercel:
\`\`\`bash
vercel
\`\`\`

Make sure all environment variables are set in production.

## License
MIT`,
};

// -------- Write all files ----------
console.log('🚀 Generating GlamStudio project...');

for (const [filePath, content] of Object.entries(files)) {
  writeFile(filePath, content);
  console.log(`  ✅ ${filePath}`);
}

console.log(`✅ Project generated successfully at: ${PROJECT_ROOT}`);
console.log('📦 Next steps:');
console.log('  cd glamstudio-website');
console.log('  npm install');
console.log('  npx prisma migrate dev --name init');
console.log('  npm run seed');
console.log('  npm run dev');