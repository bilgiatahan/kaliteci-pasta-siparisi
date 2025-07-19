# 🎂 Kaliteci Pasta Sipariş Sistemi

Bu proje, müşterilerin özel pasta siparişi verebileceği modern bir web uygulamasıdır.

## 🚀 Özellikler

- **Pandispanya Seçimi**: Kakaolu veya Vanilya/Sade
- **Krema Türü**: Çikolata veya Beyaz krema
- **Zengin İçerik Seçenekleri**: Çikolata, çilek, muz, frambuaz, böğürtlen, oreo, lotus, krokan, kestane, vişne
- **Şekil Seçenekleri**: Kalp, yuvarlak, yıldız veya özel şekil talebi
- **Kişi Sayısı**: 1-50 kişi arası, 10+ kişi için çift/tek katlı seçeneği
- **Teslimat Seçenekleri**: Şubeden teslim veya adrese teslim
- **Otomatik Mail Bildirimi**: Sipariş alındığında otomatik mail gönderimi

## 🛠️ Teknolojiler

- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Modern CSS framework
- **Nodemailer** - Mail gönderim sistemi

## 📦 Kurulum

1. Bağımlılıkları yükleyin:
   \`\`\`bash
   npm install
   \`\`\`

2. Çevre değişkenlerini ayarlayın:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

3. `.env.local` dosyasını mail ayarlarınızla güncelleyin:
   \`\`\`
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@yourstore.com
   \`\`\`

4. Geliştirme sunucusunu başlatın:
   \`\`\`bash
   npm run dev
   \`\`\`

## 📧 Mail Ayarları

Gmail kullanıyorsanız:

1. Google Hesabınızda 2 aşamalı doğrulamayı açın
2. Uygulama şifresi oluşturun
3. EMAIL_PASS olarak bu uygulama şifresini kullanın

## 🎨 Özelleştirme

- Renk teması `tailwind.config.js` dosyasında ayarlanabilir
- Form alanları `app/page.tsx` dosyasında düzenlenebilir
- Mail şablonu `app/api/siparis/route.ts` dosyasında özelleştirilebilir

## 📱 Responsive Tasarım

Uygulama mobil ve masaüstü cihazlarda mükemmel görünüm sağlar.

## 🔧 Geliştirme

\`\`\`bash

# Geliştirme sunucusu

npm run dev

# Üretim build

npm run build

# Üretim sunucusu

npm start
\`\`\`
