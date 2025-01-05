# Discord Embed Bot

Bot Discord sederhana untuk membuat dan mengirimkan embed ke channel tertentu menggunakan perintah slash.

---

## Instalasi

1. Clone repository 
```
git clone https://github.com/username/repository-name.git
```

3. Masuk ke direktori proyek:
```
cd repository-name
```

3. Instal dependensi:
```
npm install
```
4. Ubah file .env:
```
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_client_id_here
```
5. Jalankan bot:

```node src/index.js```

Fitur
	•	Membuat embed custom dengan judul, deskripsi, warna, thumbnail, gambar utama, dan lainnya.
	•	Mengirim embed ke channel tertentu atau channel tempat command dipanggil.

Cara Penggunaan
	1.	Masukkan perintah /embed di server Discord Anda.
	2.	Isi opsi yang diperlukan seperti title, description, dan lainnya.
	3.	Bot akan mengirim embed sesuai pengaturan Anda.
