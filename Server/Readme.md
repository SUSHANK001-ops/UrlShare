server/
├─ src/
│  ├─ config/
│  │  ├─ db.js           ← Sequelize + Supabase creds
│  │  └─ cloudinary.js   ← sdk config
│  ├─ models/
│  │  └─ FileMeta.js
│  ├─ routes/
│  │  ├─ upload.js
│  │  └─ download.js
│  ├─ controllers/
│  │  ├─ uploadController.js
│  │  └─ downloadController.js
│  ├─ middleware/
│  │  └─ errorHandler.js
│  └─ app.js
├─ .env.example
├─ package.json
└─ server.js             ← entry point (one-liner: app.listen)