import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formDataFromRequest = await request.formData();

    // Form verilerini object'e çevir
    const formData: any = {};
    formDataFromRequest.forEach((value, key) => {
      if (key === "icerikler") {
        formData[key] = JSON.parse(value as string);
      } else if (key === "referansGorsel") {
        formData[key] = value; // File object olarak kalacak
      } else {
        formData[key] = value;
      }
    });

    // Mail içeriğini hazırla
    const mailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f17816;">🎂 Yeni Pasta Siparişi</h2>

        <h3 style="color: #333;">📋 Sipariş Detayları</h3>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 5px 0;"><strong>Kişilik:</strong> ${
              formData.kisiSayisi
            } kişi</li>
            <li style="padding: 5px 0;"><strong>Şekil:</strong> ${
              formData.sekil
            } ${formData.ozelSekil ? "(" + formData.ozelSekil + ")" : ""}</li>
            <li style="padding: 5px 0;"><strong>Pandispanya:</strong> ${
              formData.pandispanya
            }</li>
            <li style="padding: 5px 0;"><strong>Krema:</strong> ${
              formData.krema
            }</li>
            <li style="padding: 5px 0;"><strong>İçerikler:</strong> ${
              formData.icerikler.length > 0
                ? formData.icerikler.join(", ")
                : "Seçilmedi"
            }</li>
            ${
              parseInt(formData.kisiSayisi) >= 10
                ? `<li style="padding: 5px 0;"><strong>Kat Sayısı:</strong> ${formData.katSayisi}</li>`
                : ""
            }
            ${
              formData.ozelNotlar
                ? `<li style="padding: 5px 0;"><strong>Özel Not:</strong> ${formData.ozelNotlar}</li>`
                : ""
            }
                         ${
                           formData.referansGorsel
                             ? `<li style="padding: 5px 0;"><strong>Referans Görsel:</strong> ${
                                 formData.referansGorsel.name
                               } (${(
                                 formData.referansGorsel.size /
                                 1024 /
                                 1024
                               ).toFixed(2)} MB) - Ekte gönderildi</li>`
                             : ""
                         }
          </ul>
        </div>

        <h3 style="color: #333;">🚚 Teslimat Zamanı</h3>
        <div style="background: #fafee2; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 5px 0;"><strong>Teslimat:</strong> ${
              formData.teslimat
            }</li>
            <li style="padding: 5px 0;"><strong>Teslimat Tarihi:</strong> ${
              formData.teslimatTarihi
            }</li>
            <li style="padding: 5px 0;"><strong>Teslimat Saati:</strong> ${
              formData.teslimatSaati
            }</li>
            ${
              formData.adres
                ? `<li style="padding: 5px 0;"><strong>Adres:</strong> ${formData.adres}</li>`
                : ""
            }
          </ul>
        </div>

        <h3 style="color: #333;">👤 Müşteri Bilgileri</h3>
        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 5px 0;"><strong>Ad Soyad:</strong> ${
              formData.musteriAdi
            }</li>
            <li style="padding: 5px 0;"><strong>Telefon:</strong> ${
              formData.telefon
            }</li>
            <li style="padding: 5px 0;"><strong>E-mail:</strong> ${
              formData.email
            }</li>
          </ul>
        </div>

        <p style="color: #666; font-style: italic; margin-top: 20px;">
          <em>Bu sipariş ${new Date().toLocaleString(
            "tr-TR"
          )} tarihinde alınmıştır.</em>
        </p>
      </div>
    `;

    // İşletmeye sipariş maili
    const businessEmail: any = {
      from: "Kaliteci Pasta <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL as string,
      subject: `YENİ PASTA SİPARİŞİ - ${formData.teslimatTarihi} | ${formData.teslimatSaati}`,
      html: mailContent,
    };

    // Referans görseli varsa attachment olarak ekle
    if (formData.referansGorsel) {
      const file = formData.referansGorsel as File;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      businessEmail.attachments = [
        {
          filename: file.name,
          content: buffer,
        },
      ];
    }

    // Mail gönder
    const businessResponse = await resend.emails.send(businessEmail);

    if (businessResponse.error) {
      console.error("Mail gönderme hatası:", businessResponse.error);
      return NextResponse.json(
        { error: "Mail gönderilirken hata oluştu" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Sipariş başarıyla alındı",
        businessEmailId: businessResponse.data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sipariş işleme hatası:", error);
    return NextResponse.json(
      { error: "Sipariş işlenirken hata oluştu" },
      { status: 500 }
    );
  }
}
