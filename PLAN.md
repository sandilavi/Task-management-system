-- BE Choice Justifation --
BE Choice - Next.js with server actions
Reason - Use Next.js for both FE and BE ensures seamless commnication between FE and BE whcih allows for a rapid development.

-- Architecture Overview --
FE - Next.js + Tailwind CSS
BE - Next.js with Server Actions
Authentication - JWT Based Auth
DB - MongoDB
Deployment - Vercel

-- Security Consideration --
Password Hashing - Use bcrypt to hash password before storage.
Middleware Setup - Setting up middleware file to prevent unauthorized access.
Authorization Logic - Ensured the routes are protected where users can do CRUD operations for their own tasks.

-- DB Schema --
User - id(string), name(string), email(string), password(string)
Tasks - id(string), name(string), userId(string), createdAt(date)
