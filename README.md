# Discord Embed Bot

Bot Discord sederhana untuk membuat dan mengirimkan embed ke channel tertentu menggunakan perintah slash.

---

## Instalasi

1. Clone repository:
    ```sh
    git clone https://github.com/gilangarta06/Discord-embed.git
    ```

2. Masuk ke direktori proyek:
    ```sh
    cd Discord-embed
    ```

3. Instal dependensi:
    ```sh
    npm install discord.js
    ```

4. Ubah file .env dengan informasi bot Anda:
    ```env
    DISCORD_TOKEN=your_discord_bot_token_here
    CLIENT_ID=your_discord_client_id_here
    ```

5. Jalankan bot:
    ```sh
    node src/index.js
    ```

## Fitur

- Membuat embed custom dengan judul, deskripsi, warna, thumbnail, gambar utama, dan lainnya.
- Mengirim embed ke channel tertentu atau channel tempat command dipanggil.

## Cara Penggunaan

1. Masukkan perintah `/embed` di server Discord Anda.
2. Isi opsi yang diperlukan seperti title, description, dan lainnya.
3. Bot akan mengirim embed sesuai pengaturan Anda.

## Dependensi

- [discord.js](https://discord.js.org/)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Kontributor

Jika Anda ingin berkontribusi, silakan buat pull request atau hubungi saya melalui GitHub.
