# 📱 Cara Akses LokalDrive dari Device Lain

## Setup Awal (Hanya sekali)

1. **Jalankan server** di laptop/PC host:
   ```bash
   npm start
   ```

2. **Lihat IP Address** yang muncul di terminal:
   ```
   Access from other devices on your network:
      http://192.168.100.114:3000
   ```

## Akses dari HP/Tablet/Laptop Lain

### Langkah-langkah:

1. **Hubungkan ke WiFi yang sama** dengan laptop host
   
2. **Buka browser** (Chrome/Safari/Firefox)

3. **Ketik IP address** di address bar:
   ```
   http://192.168.100.114:3000
   ```
   (Gunakan IP yang muncul di terminal Anda)

4. **Selesai!** Sekarang bisa:
   - Upload file dari device lain
   - Download file yang sudah di-upload
   - Lihat storage statistics
   - AI analysis akan otomatis berjalan

## Tips & Trik

### 💡 Akses Cepat
- **Bookmark** IP address di browser untuk akses cepat
- **Share link** via WhatsApp/Telegram ke teman yang ingin akses
- **Buat shortcut** di home screen HP (Add to Home Screen)

### 📤 Upload dari HP
1. Buka LokalDrive di browser HP
2. Klik tombol upload atau drag & drop
3. Pilih foto/video/file dari galeri
4. File otomatis tersimpan di laptop host

### 📥 Download ke HP
1. Klik tombol download pada file
2. File akan tersimpan di folder Downloads HP
3. Bisa langsung dibuka atau di-share

### 🎯 Use Cases
- **Transfer foto** dari HP ke laptop tanpa kabel
- **Share file** ke semua device di rumah/kantor
- **Backup cepat** dari HP sebelum factory reset
- **Presentasi** - share file ke banyak orang sekaligus

## Troubleshooting

### ❌ Tidak bisa akses dari HP?

**1. Cek WiFi**
- Pastikan HP dan laptop di WiFi yang **sama**
- Jangan gunakan "Guest Network"

**2. Cek Firewall di Laptop**
```bash
# macOS - Allow ports
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

**3. Test Koneksi**
- Ping laptop dari HP (gunakan app Network Tools)
- Atau akses `http://192.168.x.x:3000` di browser

**4. Restart Server**
- Di laptop: tekan `Ctrl+C` untuk stop
- Jalankan lagi: `npm start`

### ❌ Upload lambat?

- **Cek sinyal WiFi** - pastikan kuat
- **Jangan gunakan VPN**
- **Gunakan WiFi 5GHz** kalau tersedia (lebih cepat)
- **Dekat ke router** untuk speed maksimal

### ❌ File tidak muncul?

- **Refresh browser** (F5 atau pull to refresh)
- **Clear cache** browser
- **Cek folder uploads/** di laptop

## Keamanan

⚠️ **PENTING:**

- **Hanya untuk jaringan lokal** - jangan expose ke internet
- **Tidak ada password** - siapa saja di WiFi bisa akses
- **Untuk sharing cepat** di lingkungan terpercaya
- **Matikan server** kalau tidak digunakan

## Port yang Digunakan

- **Port 3000**: Frontend (UI Web)
- **Port 3001**: Backend (API & File Storage)

Pastikan kedua port tidak digunakan aplikasi lain.

---

**Happy Sharing! 🚀**

