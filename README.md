# Ibadullah Portfolio

React/Vite portfolio that keeps the existing portfolio design, with a public blog at `/blog` and an admin dashboard at `/admin`.

## Run locally

1. Install dependencies with `npm install`.
2. Use the included `.env.local` for the supplied service keys. It is ignored by Git.
3. Add a Firebase service account JSON to `FIREBASE_SERVICE_ACCOUNT` in `.env.local` (Firebase Console ? Project settings ? Service accounts). This is required for blog data in Firestore.
4. Start with `npm run dev`.

## Vercel

Set the environment variables from `.env.local` in the Vercel project settings. Keep `FIREBASE_SERVICE_ACCOUNT`, `CLOUDINARY_API_SECRET`, `RESEND_API_KEY`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` server-only; do not add a `VITE_` prefix to them. Set the public `VITE_FIREBASE_*` values for the Firebase web app. Deploy using the Vite build (`npm run build`).

Firestore stores blog entries in the `posts` collection. The API uses Firebase Admin on the server, a signed HTTP-only admin session, Resend for contact mail, and server-generated Cloudinary upload signatures.
