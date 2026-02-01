<div align="center">

# 🎬 MovieKu

### Platform Streaming Film Modern

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📚 Tugas Ujian Akhir Semester (UAS)

### Pemrograman Berbasis Web

|                |             |
| -------------- | ----------- |
| **Nama** | Wida Rahayu |
| **NIM**  | 2307028     |

---

## 📖 Tentang Aplikasi

**MovieKu** adalah aplikasi web streaming film modern yang terintegrasi dengan [TMDB API](https://www.themoviedb.org/). Aplikasi ini memungkinkan pengguna untuk menjelajahi koleksi film, mencari film favorit, dan menyimpan riwayat tontonan.

---

## 🛠 Teknologi Yang Digunakan

### Backend

| Teknologi            | Versi  | Kegunaan                                       |
| -------------------- | ------ | ---------------------------------------------- |
| **Node.js**    | 18+    | Runtime JavaScript untuk menjalankan server    |
| **Express.js** | 5.2.x  | Framework web untuk membuat REST API           |
| **Prisma ORM** | 5.10.x | Object-Relational Mapping untuk database       |
| **MySQL**      | 8.x    | Database relasional untuk menyimpan data       |
| **JWT**        | 9.x    | Autentikasi berbasis token                     |
| **bcrypt**     | 6.x    | Enkripsi password                              |
| **Axios**      | 1.x    | HTTP client untuk mengambil data dari TMDB API |
| **dotenv**     | 17.x   | Mengelola environment variables                |

### Frontend

| Teknologi                 | Versi  | Kegunaan                                    |
| ------------------------- | ------ | ------------------------------------------- |
| **React**           | 19.2.x | Library untuk membangun user interface      |
| **Vite**            | 7.2.x  | Build tool dan development server           |
| **TailwindCSS**     | 4.1.x  | CSS framework utility-first                 |
| **DaisyUI**         | 5.5.x  | Component library berbasis Tailwind         |
| **React Router**    | 7.13.x | Routing untuk navigasi halaman              |
| **Axios**           | 1.x    | HTTP client untuk komunikasi dengan backend |
| **Recharts**        | 3.7.x  | Library untuk visualisasi data (charts)     |
| **React Hot Toast** | 2.6.x  | Notifikasi toast                            |
| **React Icons**     | 5.x    | Library icon                                |

---

## 📦 Cara Instalasi

### Prasyarat

Pastikan sudah terinstall:

- **Node.js** versi 18 atau lebih baru
- **MySQL** versi 8
- **TMDB API Key** (gratis di [themoviedb.org](https://www.themoviedb.org/settings/api))

### Langkah-langkah Instalasi

#### 1. Clone Repository

```bash
git clone https://github.com/username/movieku.git
cd movieku
```

#### 2. Install Dependencies Backend

```bash
cd backend
npm install
```

#### 3. Install Dependencies Frontend

```bash
cd ../frontend
npm install
```

#### 4. Konfigurasi Environment Variables

**Backend** - Buat file `backend/.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/movieku"
JWT_SECRET="your-secret-key"
TMDB_API_KEY="your-tmdb-api-key"
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

**Frontend** - Buat file `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p
```

#### 5. Setup Database

```bash
cd backend

# Jalankan migrasi database
npx prisma migrate dev

# Isi data awal (seed)
npx prisma db seed
```

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Jalankan Backend

```bash
cd backend
npm run dev
```

Backend akan berjalan di: **http://localhost:5000**

### 2. Jalankan Frontend

Buka terminal baru:

```bash
cd frontend
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

### 3. Akses Aplikasi

Buka browser dan akses: **http://localhost:5173**

### Akun Default

| Email             | Password    | Role  |
| ----------------- | ----------- | ----- |
| admin@movieku.com | password123 | Admin |
| user@movieku.com  | password123 | User  |

---

## 📸 Screenshot Aplikasi

### Halaman User

#### Halaman Beranda

![Halaman Beranda](./screenshots/halaman-beranda.png)

#### Halaman User Telah Login

![Halaman User Login](./screenshots/halaman-user-telah-login.png)

#### Halaman Detail Film

![Halaman Detail Film](./screenshots/halaman-detail-film.png)

#### Halaman Masuk (Login)

![Halaman Masuk](./screenshots/halaman-masuk.png)

#### Halaman Daftar (Register)

![Halaman Daftar](./screenshots/halaman-daftar.png)

#### Halaman Tentang

![Halaman Tentang](./screenshots/halaman-tentang.png)

#### Halaman Riwayat Tontonan

![Halaman Riwayat Tontonan](./screenshots/halaman-riwayat-tontonan.png)

---

### Halaman Admin

#### Dashboard Admin

![Dashboard Admin](./screenshots/admin/halaman/halaman-dashboard-admin.png)

#### Kelola Film

![Kelola Film](./screenshots/admin/halaman/halaman-kelola-film-admin.png)

#### Tambah Film dari TMDB

![Tambah Film](./screenshots/admin/halaman/halaman-tambah-film-admin.png)

#### Kelola Pengguna

![Kelola Pengguna](./screenshots/admin/halaman/halaman-kelola-pengguna-admin.png)

---

### Modal Admin

#### Modal Tambah Film

![Modal Tambah Film](./screenshots/admin/modal/modal-tambah-film-admin.png)

#### Modal Edit Film

![Modal Edit Film](./screenshots/admin/modal/modal-edit-film-admin.png)

#### Modal Hapus Film

![Modal Hapus Film](./screenshots/admin/modal/modal-hapus-film-admin.png)

#### Modal Tambah Pengguna

![Modal Tambah Pengguna](./screenshots/admin/modal/modal-tambah-pengguna-admin.png)

#### Modal Edit Pengguna

![Modal Edit Pengguna](./screenshots/admin/modal/modal-edit-pengguna-admin.png)

#### Modal Hapus Pengguna

![Modal Hapus Pengguna](./screenshots/admin/modal/modal-hapus-pengguna-admin.png)

---

## ✨ Fitur Aplikasi

### Fitur User

- 🔐 Login dan Register
- 🎬 Melihat daftar film
- 🔍 Mencari film
- 📄 Melihat detail film (cast, trailer, galeri)
- 📜 Riwayat tontonan

### Fitur Admin

- 📊 Dashboard statistik
- ➕ Tambah film dari TMDB
- ✏️ Edit ketersediaan film
- 🗑️ Hapus film
- 👥 Kelola pengguna

---

## 📁 Struktur Folder

```
movieku/
├── backend/
│   ├── prisma/           # Database schema & migrations
│   ├── src/
│   │   ├── config/       # Konfigurasi database
│   │   ├── controllers/  # Logic handler
│   │   ├── middlewares/  # Auth middleware
│   │   ├── routes/       # API routes
│   │   ├── services/     # TMDB service
│   │   ├── utils/        # Helper functions
│   │   ├── app.js        # Express app
│   │   └── server.js     # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Komponen reusable
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Halaman aplikasi
│   │   ├── services/     # API service
│   │   └── App.jsx       # Root component
│   └── package.json
│
├── screenshots/          # Screenshot aplikasi
└── README.md
```

---

## 🙏 Credits

- Data film dari [TMDB](https://www.themoviedb.org/)
- UI Components dari [DaisyUI](https://daisyui.com/)

---

<div align="center">

**UAS Pemrograman Berbasis Web**

Wida Rahayu - 2307028

</div>
