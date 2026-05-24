# myNotes-api

Simple personal blog REST API built with Express.js and MongoDB.

Designed for:
- solo admin
- markdown content
- anonymous comments
- local image upload
- minimal authentication
- simple architecture (no overengineering)

---

# Features

- Express.js REST API
- MongoDB + Mongoose
- Cookie-based admin session
- Markdown-ready content
- Anonymous comments
- Local image upload
- Category filter
- Tag filter
- Draft & publish system

---

# Categories

Available categories:

- essay
- poem
- story

---

# Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- Cookie Parser

---

# Installation

## Clone project

```bash
git clone https://github.com/yourname/myNotes-api.git

cd myNotes-api
```

---

## Install dependencies

```bash
npm install
```

---

## Create `.env`

```env
PORT=3000

MONGO_URI=mongodb://localhost:27017/blog

ADMIN_PASSWORD=superrahasia
```

---

## Start development server

```bash
npm run dev
```

---

# Project Structure

```txt
myNotes-api/
├── uploads/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
├── .env
├── package.json
└── README.md
```

---

# Authentication

Admin authentication uses:
- simple password login
- httpOnly cookie session

No JWT or user database required.

---

# API Endpoints

## Public

### Get all posts

```http
GET /posts
```

---

### Get single post

```http
GET /posts/:slug
```

---

### Get posts by category

```http
GET /posts/category/:category
```

Example:

```txt
/posts/category/poem
```

---

### Get posts by tag

```http
GET /posts/tag/:tag
```

Example:

```txt
/posts/tag/night
```

---

### Create comment

```http
POST /comments
```

Body:

```json
{
  "postId": "POST_ID",
  "name": "anon",
  "content": "nice post"
}
```

---

# Admin

## Login

```http
POST /admin/login
```

Body:

```json
{
  "password": "superrahasia"
}
```

---

## Create post

```http
POST /admin/posts
```

Body:

```json
{
  "title": "Sunset",
  "slug": "sunset",
  "content": "# Hello Markdown",
  "category": "poem",
  "tags": ["sad", "night"],
  "isPublished": true
}
```

---

## Delete post

```http
DELETE /admin/posts/:id
```

---

## Upload image

```http
POST /admin/upload
```

Form-data:

| key | type |
|---|---|
| image | File |

---

# Markdown

Content supports Markdown.

Example:

```md
# Hello

this is **bold**

![image](/uploads/example.png)
```

Markdown rendering should be handled on the frontend.

---

# Draft System

Draft posts:

```json
{
  "isPublished": false
}
```

Published posts:

```json
{
  "isPublished": true
}
```

Public endpoints only return published posts.

---

# Uploads

Uploaded images are stored locally:

```txt
/uploads
```

Images are served statically via:

```txt
/uploads/filename.png
```

---

# Notes

This project intentionally avoids:
- JWT auth
- user system
- role system
- refresh tokens
- heavy architecture

Goal:
simple and maintainable personal writing platform.

---

# License

MIT