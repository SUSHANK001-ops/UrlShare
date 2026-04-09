# UrlShare

Share any file instantly with just a URL. Upload files, get a short link and QR code, and let anyone download — no sign-up required.

**Live:** [urlshare.sushanka.com.np](https://urlshare.sushanka.com.np)

---

## Features

- **Multi-file upload** — Upload multiple files at once (up to 100 MB per share)
- **Short share links** — Get an 8-character short code URL for easy sharing
- **QR code** — Scannable QR code generated for every share link
- **Auto-delete** — Choose when files expire: 10 min, 30 min, 1 hour, 6 hours, 12 hours, or 24 hours
- **Direct download page** — Recipients see all shared files and can download individually or all at once
- **Copy to clipboard** — One-click link copying
- **Responsive UI** — Works on desktop, tablet, and mobile
- **Cloud storage** — Files stored on Cloudinary

---

## Tech Stack

| Layer    | Technology                                       |
| -------- | ------------------------------------------------ |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend  | Express 5, Node.js                               |
| Database | PostgreSQL (Sequelize ORM)                        |
| Storage  | Cloudinary                                        |
| Icons    | Lucide React                                      |
| QR Code  | qrcode.react                                      |

---

## Project Structure

```
UrlShare/
├── client/                     # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── d/[shortCode]/
│   │       └── page.tsx        # Download page (via short link)
│   ├── Components/
│   │   ├── Home.tsx            # Tab navigation + footer
│   │   ├── Uploder.tsx         # Upload UI, QR code, share result
│   │   └── Downloader.tsx      # Download UI with code/URL input
│   └── services/
│       ├── api.ts              # Axios client
│       ├── uploadService.ts    # Upload API call
│       └── downloadService.ts  # Download API calls
│
└── Server/                     # Express backend
    ├── server.js               # Entry point
    └── src/
        ├── config/
        │   ├── db.js           # Sequelize + PostgreSQL connection
        │   └── cloudinary.js   # Cloudinary SDK config
        ├── controller/
        │   ├── uploadController.js
        │   └── downloadController.js
        ├── middleware/
        │   └── uploadMulter.js # Multer file handling
        ├── models/
        │   ├── shareModel.js   # Share + ShareFile models
        │   └── fileModel.js    # Legacy file model
        └── routes/
            ├── uploadRoute.js
            └── downloadRouter.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (e.g., Neon)
- Cloudinary account

### 1. Clone the repo

```bash
git clone https://github.com/your-username/UrlShare.git
cd UrlShare
```

### 2. Setup the server

```bash
cd Server
npm install
```

Create a `.env` file in `Server/` and paste the Neon connection string from your project dashboard:

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB_NAME?sslmode=require
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

Start the server:

```bash
npm start
```

### 3. Setup the client

```bash
cd client
npm install
```

Create a `.env.local` file in `client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

| Method | Endpoint                             | Description                        |
| ------ | ------------------------------------ | ---------------------------------- |
| POST   | `/api/upload`                        | Upload files and create a share    |
| GET    | `/api/download/:shortCode`           | Get share info (file list, stats)  |
| GET    | `/api/download/:shortCode/file/:id`  | Download a specific file           |
| GET    | `/d/:shortCode`                      | Redirect to client download page   |

---

## How It Works

1. **Upload** — Select files, choose an expiry time, and hit upload
2. **Share** — Copy the generated short link or scan the QR code
3. **Download** — Open the link, see all files, and download individually or all at once
4. Files are automatically deleted from the database after the chosen expiry time

---

## License

MIT

---

Made by [Sushank](https://sushanka.com.np)
