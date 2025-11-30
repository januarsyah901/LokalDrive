# 🖥️ LokalDrive - LAN File Sharing System

LokalDrive adalah aplikasi web file-sharing lokal yang berjalan di laptop/PC host. Memungkinkan pengguna dalam satu jaringan WiFi/LAN untuk berbagi file dengan cepat tanpa koneksi internet.

## 🌟 Fitur Utama

*   **Drag & Drop Upload**: Upload file dengan mudah antar perangkat.
*   **Kecepatan LAN**: Transfer file secepat kecepatan router WiFi (tanpa limit internet).
*   **Tanpa Login**: Akses langsung via IP Address host.
*   **AI Analysis**: Integrasi Google Gemini untuk auto-tagging dan deskripsi file.
*   **Dark Mode**: Antarmuka modern yang nyaman di mata.
*   **Local Network Access**: Akses dari device manapun di jaringan WiFi yang sama.

---

## 🛠️ Instalasi & Cara Menjalankan

Pastikan Anda telah menginstal **Node.js** di komputer Anda.

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Gemini API Key

Buat file `.env` di root folder:

```env
VITE_API_KEY=your_gemini_api_key_here
```

Dapatkan API key dari: https://aistudio.google.com/app/apikey

### 3. Jalankan Server

Jalankan backend dan frontend sekaligus:

```bash
npm start
```

Atau jalankan terpisah:

```bash
# Terminal 1 - Backend Server (Port 3001)
npm run server

# Terminal 2 - Frontend (Port 3000)
npm run dev
```

---

## 📱 Akses dari Device Lain

Setelah server berjalan, Anda akan melihat output seperti:

```
🚀 LokalDrive Server is running!

Access from this device:
   http://localhost:3000

Access from other devices on your network:
   http://192.168.1.100:3000
   http://10.0.0.5:3000
```

### Cara Akses dari HP/Laptop/Tablet Lain:

1. **Pastikan device terhubung ke WiFi yang sama** dengan host
2. **Buka browser** di device tersebut
3. **Ketik salah satu IP address** yang ditampilkan (contoh: `http://192.168.1.100:3000`)
4. **Upload dan download file** seperti biasa!

### Tips:
- Gunakan **Chrome/Safari/Firefox** untuk kompatibilitas terbaik
- **Bookmark** IP address untuk akses cepat
- **Share IP address** via WhatsApp/Telegram ke teman yang ingin akses

---

## 🔧 Troubleshooting

### Tidak bisa akses dari device lain?

1. **Cek WiFi**: Pastikan semua device di jaringan WiFi yang sama
2. **Firewall**: Nonaktifkan firewall sementara atau allow port 3000 dan 3001
3. **VPN**: Matikan VPN jika aktif
4. **Restart Server**: Stop server (Ctrl+C) lalu jalankan `npm start` lagi

### AI Analysis tidak berfungsi?

1. Pastikan `VITE_API_KEY` sudah diisi di file `.env`
2. Restart dev server setelah menambahkan API key
3. Cek koneksi internet (Gemini API memerlukan internet)

### Upload tidak berfungsi?

1. Cek apakah backend server berjalan (port 3001)
2. Lihat console browser untuk error
3. Pastikan folder `uploads/` bisa di-write

---

## 📁 File Storage

- File yang di-upload disimpan di folder **`uploads/`**
- Metadata file disimpan di **`files-metadata.json`**
- Kedua folder/file ini sudah ada di `.gitignore`

---

## 🛡️ Security Notes

⚠️ **PENTING**: LokalDrive dirancang untuk penggunaan **jaringan lokal pribadi** (WiFi rumah/kantor).

- Jangan expose ke internet publik
- Tidak ada autentikasi/authorization
- Semua orang di jaringan WiFi yang sama bisa akses
- Cocok untuk sharing file sementara di lingkungan terpercaya

---

## 🚀 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **AI**: Google Gemini API
- **Storage**: File System (Local)
- **UI**: TailwindCSS + Lucide Icons
- **Charts**: Recharts

---

## 📝 Development

```bash
# Development mode (frontend only)
npm run dev

# Backend server only
npm run server

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 🙏 Credits

Built with ❤️ using React, Express, and Google Gemini AI.

