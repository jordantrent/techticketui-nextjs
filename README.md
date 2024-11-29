# TechTicket Frontend

This repository contains the **frontend** for the TechTicket project, a job management and ticketing application designed for maintenance companies.

The frontend is built with **Next.js**, styled with **ShadCN**. It connects to the backend APIs to manage customers, tickets and employee details.

---

## Features

- **Modern UI**: Minimalist and responsive design using ShadCN components.
- **Customer Management**: View and manage customer information.
- **Ticket Management**: Interact with tickets and employee assignments
- **Employee Details**: View and edit employee data.
- **Google Maps API**: (Planned) Providing routing for employees.
- **Employee App**: (Planned) Employee app for consuming tickets.

---

## Tech Stack

- **Framework**: Next.js (React-based)
- **UI Library**: ShadCN
- **Table Management**: TanStack Table
- **Backend Integration**: API calls to the Spring Boot backend

---

## Installation & Setup

### Prerequisites

- Node.js 18+
- Access to the TechTicket backend API (See [TechTicket Backend](https://github.com/jordantrent/techticket-api))

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/jordantrent/techticketui-nextjs.git
   cd techticketui-nextjs

2. Install dependencies:
   ```bash
   npm install

3. Create an .env.local for environment variables:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8080/api

4. Start the development server:
   ```bash
   npm run dev

5. Open the app in your browser: http://locahost:3000

