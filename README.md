# Members Only Club

An exclusive clubhouse where members can write anonymous posts. Inside the clubhouse, members can see who the author of a post is, but outside they can only see the story and wonder who wrote it.

## Features

- User authentication (signup/login/logout)
- Anonymous message viewing for non-members
- Club membership with secret passcode
- Admin privileges for message moderation
- Full CRUD operations for messages
- Session-based authentication

#### ADMIN VIEW
![Admin view of messages](admin.png)

#### MEMBER VIEW
![Member view of messages](member.png)

#### GUEST VIEW
![Guest view of messages](not-member.png)

#### VIEW WHEN NOT LOGED IN
![Anonymous view of messages](member-home.png)

## Technologies

- Node.js & Express.js
- PostgreSQL
- Passport.js (Local Strategy)
- EJS templating
- bcryptjs for password hashing

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anwangari/Members-Only
   cd Members-Only
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/members_only
   SESSION_SECRET=your-super-secret-session-key
   CLUB_PASSCODE=secret123
   ADMIN_PASSCODE=admin123
   PORT=3000
   ```

4. **Create PostgreSQL database**
   ```bash
   createdb members_only
   ```

5. **Populate the database**
   ```bash
   npm run seed
   ```

## Usage

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Visit `http://localhost:3000/messages`

## Test Accounts

After running `npm run seed`, you'll have these test accounts:

- **alice@example.com** / password123 (Regular user)
- **bob@example.com** / password123 (Club member)
- **charlie@example.com** / password123 (Admin)

**Passcodes:**
- Club membership: `secret123`
- Admin access: `admin123`

## Project Structure

```
Members-Only/
├── bin/
│   └── www                 # Server entry point
├── config/
│   ├── db.js              # Database connection
│   └── passportConfig.js  # Passport authentication
├── controllers/
│   ├── authController.js
│   ├── memberController.js
│   └── messageController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── user.js
│   └── message.js
├── public/
│   └── css/
│       └── style.css
├── routes/
│   ├── auth.js
│   ├── member.js
│   └── message.js
├── scripts/
│   ├── populateDb.js      # Database seeding
│   └── testDatabase.js    # Connection test
├── views/
│   ├── layout.ejs
│   ├── index.ejs
│   ├── signup.ejs
│   ├── login.ejs
│   ├── new_message.ejs
│   ├── join_club.ejs
│   ├── admin.ejs
│   └── error.ejs
├── .env.example
├── .gitignore
├── app.js
└── package.json
```

## License

ISC