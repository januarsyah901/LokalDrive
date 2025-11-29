# 🖥️ LokalDrive - LAN File Sharing System

LokalDrive adalah aplikasi web file-sharing lokal yang berjalan di laptop/PC host. Memungkinkan pengguna dalam satu jaringan WiFi/LAN untuk berbagi file dengan cepat tanpa koneksi internet.

![LokalDrive UI](https://via.placeholder.com/800x400?text=LokalDrive+Preview)

## 🌟 Fitur Utama

*   **Drag & Drop Upload**: Upload file dengan mudah antar perangkat.
*   **Kecepatan LAN**: Transfer file secepat kecepatan router WiFi (tanpa limit internet).
*   **Tanpa Login**: Akses langsung via IP Address host.
*   **AI Analysis**: Integrasi Google Gemini untuk auto-tagging dan deskripsi file.
*   **Dark Mode**: Antarmuka modern yang nyaman di mata.

---

## 🛠️ Instalasi & Cara Menjalankan

Pastikan Anda telah menginstal **Node.js** di komputer Anda.

### 1. Clone Repository

Salin kode sumber ke komputer Anda:

```bash
git clone https://github.com/username/lokaldrive.git
cd lokaldrive
```

### 2. Install Dependencies

Install paket-paket yang diperlukan:

```bash
npm install
```

### 3. Konfigurasi API Key (Opsional)

Untuk mengaktifkan fitur analisis file otomatis menggunakan AI, Anda memerlukan API Key dari Google Gemini.

1.  Buat file `.env` di direktori utama.
2.  Tambahkan baris berikut:

```env
API_KEY=paste_kunci_api_gemini_anda_disini
```

*Jika tidak diisi, fitur upload tetap berjalan, namun tombol "Analyze" akan menggunakan data simulasi.*

### 4. Jalankan Server

Jalankan aplikasi dalam mode development:

```bash
npm start
# atau
npm run dev
```

Aplikasi biasanya akan berjalan di `http://localhost:3000`.

---

## 📡 Cara Akses dari HP / Laptop Lain

Agar teman satu jaringan bisa mengakses LokalDrive:

1.  Pastikan Laptop Host dan perangkat teman terhubung ke **WiFi yang sama**.
2.  Cari **IP Address** Laptop Host:
    *   **Windows**: Buka CMD, ketik `ipconfig`. Cari IPv4 Address (contoh: `192.168.1.15`).
    *   **Mac/Linux**: Buka Terminal, ketik `ifconfig`.
3.  Di HP/Laptop teman, buka browser dan ketik alamat IP tersebut diikuti port:

```
http://192.168.1.15:3000
```

---

## 📂 Struktur Folder

*   `/src` - Kode sumber React.
*   `/services` - Logika "Backend" simulasi dan integrasi API.
*   `/components` - Komponen UI (Card, Chart, dll).

## ⚠️ Catatan Keamanan

Aplikasi ini didesain untuk penggunaan **Jaringan Lokal (Trusted Network)** seperti rumah, kelas, atau kantor kecil.
*   Siapapun yang mengetahui IP dan Port bisa mengunduh file yang ada di list.
*   Fitur hapus file aktif untuk semua pengguna dalam mode demo ini.

---

Built with ❤️ using **React** & **Google Gemini API**.