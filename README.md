# NestJS Chat App Backend

A real-time chat application backend built with **NestJS**, **TypeORM**, **PostgreSQL**, and **Socket.IO**.

## Tech Stack

| Layer          | Technology                                          |
| -------------- | --------------------------------------------------- |
| Framework      | [NestJS](https://nestjs.com/) 11                    |
| Language       | TypeScript 5                                        |
| Database       | PostgreSQL (via `pg`)                               |
| ORM            | TypeORM 0.3                                         |
| Authentication | JWT + Passport (Google OAuth)                       |
| Real-time      | Socket.IO (`@nestjs/websockets`)                    |
| File Upload    | Multer + Cloudinary                                 |
| Validation     | class-validator + class-transformer                 |

## Features

- [x] User registration & login (JWT)
- [x] Google OAuth login
- [x] User management (CRUD)
- [x] Conversations (private, group, channel)
- [x] Conversation members with roles (admin/member)
- [x] Messages with file attachments
- [x] Threaded replies (parent message)
- [x] Message reactions
- [x] Message mentions (@user)
- [x] Real-time WebSocket gateway (online users, live messaging)
- [ ] Calls

## Database Schema

```
Users ──┬── Conversations (creator)
        ├── ConversationMembers (user ↔ conversation, role)
        ├── Messages (sender, conversation, parentMessage)
        ├── MessageReactions (user ↔ message, reaction)
        └── MessageMentions (user ↔ message)
```

### Entities

| Entity                | Key Fields                                              |
| --------------------- | ------------------------------------------------------- |
| **User**              | id, name, email, password, profileImage                 |
| **Conversation**      | id, title, description, image, type (private/group/channel), creatorId |
| **ConversationMember**| id, role (admin/member), userId, conversationId         |
| **Message**           | id, content, files, seen, senderId, conversationId, parentMessageId |
| **MessageReaction**   | id, reaction, messageId, userId                         |
| **MessageMention**    | id, messageId, userId                                   |

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | `/login`             | Login with email/password |
| POST   | `/register`          | Register a new user       |
| GET    | `/google`            | Google OAuth login        |
| GET    | `/google/callback`   | Google OAuth callback     |

### Users — `/api/v1/users` *(Auth required)*

| Method | Endpoint | Description            |
| ------ | -------- | ---------------------- |
| GET    | `/`      | List all users (paginated) |
| GET    | `/me`    | Get current user       |
| GET    | `/:id`   | Get user by ID         |
| PATCH  | `/:id`   | Update user            |
| DELETE | `/:id`   | Delete user            |

### Conversations — `/api/v1/conversations` *(Auth required)*

| Method | Endpoint | Description                        |
| ------ | -------- | ---------------------------------- |
| POST   | `/`      | Create conversation                |
| GET    | `/`      | List user's conversations          |
| GET    | `/:id`   | Get conversation by ID             |
| PATCH  | `/:id`   | Update conversation *(Admin only)* |
| DELETE | `/:id`   | Delete conversation *(Admin only)* |

### Conversation Members — `/api/v1/conversation-members` *(Auth required)*

| Method | Endpoint | Description                           |
| ------ | -------- | ------------------------------------- |
| POST   | `/:id`   | Add member to conversation *(Admin)*  |
| GET    | `/:id`   | List members of conversation          |
| PATCH  | `/:id`   | Update member role *(Admin)*          |
| DELETE | `/:id`   | Remove member *(Admin)*               |

### Messages — `/api/v1/messages` *(Auth required)*

| Method | Endpoint                      | Description                |
| ------ | ----------------------------- | -------------------------- |
| POST   | `/`                           | Send message (with files)  |
| GET    | `/conversation/:conversationId` | Get messages in conversation |
| GET    | `/:id`                        | Get message by ID          |
| PATCH  | `/:id`                        | Update message             |
| DELETE | `/:id`                        | Delete message             |

### Message Mentions — `/message-mentions`

| Method | Endpoint | Description          |
| ------ | -------- | -------------------- |
| POST   | `/`      | Create mention       |
| DELETE | `/:id`   | Delete mention       |

### Message Reactions — `/message-reactions`

| Method | Endpoint | Description          |
| ------ | -------- | -------------------- |
| POST   | `/`      | Create reaction      |
| DELETE | `/:id`   | Delete reaction      |

## WebSocket Events

Connect to the WebSocket server with an `Authorization: Bearer <token>` header.

| Event            | Direction       | Description                        |
| ---------------- | --------------- | ---------------------------------- |
| `onlineUsers`    | Server → Client | Broadcasts list of online user IDs |
| `message`        | Bidirectional   | Send/receive messages              |
| `messageUpdated` | Server → Client | Message was updated                |
| `messageDeleted` | Server → Client | Message was deleted                |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL
- Cloudinary account (for file uploads)
- Google OAuth credentials (optional, for Google login)

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
API_VERSION=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=chat

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER_NAME=chat

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### Installation

```bash
npm install
```

### Database Setup

```bash
# Run migrations
npm run migration
```

### Running the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Migrations

```bash
# Generate a new migration after entity changes
npm run generate

# Run pending migrations
npm run migration

# Revert last migration
npm run revert
```

## Project Structure

```
src/
├── auth/                      # Authentication (login, register, Google OAuth)
├── chat/                      # WebSocket gateway (real-time events)
├── common/
│   ├── filters/               # Global exception filter
│   ├── guards/                # Auth, Admin, Role, Google guards
│   └── strategy/              # Passport Google strategy
├── config/                    # Database & Cloudinary config
├── conversations/             # Conversations CRUD
├── conversation-members/      # Conversation membership & roles
├── helpers/                   # Pagination utility
├── messages/                  # Messages CRUD with file support
├── message-mentions/          # @mentions on messages
├── message-reactions/         # Reactions on messages
├── migrations/                # TypeORM migrations
├── users/                     # Users CRUD
├── app.module.ts              # Root module
└── main.ts                    # Application bootstrap
```