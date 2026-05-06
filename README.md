# Content Broadcasting System (Frontend)

A full‑featured Next.js (App Router) front‑end for a role‑based content broadcasting platform. It demonstrates clean architecture, shadcn/ui, Tailwind CSS, mock service layer, and professional UI/UX.

---

## 📦 Tech Stack
- **Framework:** Next.js 13 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Form handling:** react‑hook‑form + Zod
- **State & auth:** React Context (AuthContext)
- **Data layer:** Service layer (`src/services/`) with mock `localStorage` backend (easy swap to real API)
- **Performance:** `react-window` virtualized tables, memoized components, next/image optimization
- **Feedback UI:** sonner toasts, skeleton loaders, empty states

---

## 📂 Project Structure
```
src/
├─ app/               # Next.js pages (teacher, principal, public live, login)
├─ components/        # UI primitives, DashboardLayout, VirtualizedTable
├─ context/           # AuthContext
├─ services/          # auth, content, approval services (mock API)
├─ utils/             # apiClient (token injection)
├─ styles/            # Tailwind config & globals
└─ ...
```

---

## 🔧 Setup & Development
1. **Clone the repo**
   ```bash
   git clone <REPO_URL>
   cd <repo-folder>
   ```
2. **Install dependencies**
   ```bash
   npm install   # or yarn, pnpm, bun
   ```
3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
4. **Testing the flows**
   - **Login** – use the test accounts:
     - Principal: `principal@school.com` / `password123`
     - Teacher:   `teacher@school.com`   / `password123`
   - Navigate through teacher & principal portals, upload content, approve/reject, view public live page (`/live/:teacherId`).

---

## 📦 Build for Production
```bash
npm run build   # creates .next/**
```
The output can be served with `next start` or deployed to Vercel.

---

## 🚀 Deployment
- **Vercel (recommended)** – Connect your GitHub repository and click *Deploy*.
- **Deployment URL:** `<DEPLOYMENT_LINK>`  *(replace with the actual Vercel URL after deployment)*

---

## 📚 Documentation
- `Frontend-notes.txt` – detailed notes on architecture, auth flow, routing, API approach, state management, and assumptions.

---

## 📄 License
MIT © 2026 Sondrya Gupta


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
