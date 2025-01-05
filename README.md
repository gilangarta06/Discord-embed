# **Discord Embed Bot**

Bot Discord sederhana untuk membuat dan mengirimkan embed ke channel tertentu menggunakan perintah slash.

---

## **Instalasi**

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/username/repository-name.git

	2.	Masuk ke direktori proyek:

cd repository-name


	3.	Instal dependensi:

npm install


	4.	Konfigurasi file .env:
Ubah file .env dan masukkan token bot Anda. Contoh isi file:

DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_client_id_here


	5.	Jalankan bot:

node src/index.js

Fitur
	•	🚀 Membuat Embed Custom:
Anda dapat mengatur:
	•	Judul (title)
	•	Deskripsi (description)
	•	Warna (color)
	•	Thumbnail
	•	Gambar utama
	•	Dan lainnya!
	•	💬 Kirim Embed ke Channel:
Embed dapat dikirim ke:
	•	Channel tertentu (pilih melalui perintah)
	•	Channel tempat perintah dipanggil.

Cara Penggunaan
	1.	Ketik perintah /embed di server Discord Anda.
	2.	Isi opsi yang tersedia, seperti:
	•	title: Judul embed.
	•	description: Deskripsi embed (opsional).
	•	color: Warna embed dalam format hex (opsional).
	3.	Bot akan mengirim embed sesuai pengaturan Anda.

Contoh File .env

Pastikan Anda sudah membuat file .env di root proyek. Isi dengan:

DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_client_id_here

Kontribusi

💡 Jika Anda memiliki ide untuk meningkatkan proyek ini atau menemukan bug, silakan:
	•	Kirimkan pull request.
	•	Buat issue di repository ini.
