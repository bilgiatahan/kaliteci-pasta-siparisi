import { Resend } from "resend";
import { OrderFormData } from "@/types/order";

// Email service for handling email operations - Single Responsibility Principle
export class EmailService {
  private static resend = new Resend(process.env.RESEND_API_KEY);

  // Generate HTML email content for business
  static generateBusinessEmailContent(orderData: OrderFormData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f17816;">🎂 Yeni Pasta Siparişi</h2>

        <h3 style="color: #333;">📋 Sipariş Detayları</h3>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 5px 0;"><strong>Kişilik:</strong> ${
              orderData.kisiSayisi
            } kişi</li>
            <li style="padding: 5px 0;"><strong>Şekil:</strong> ${
              orderData.sekil
            } ${orderData.ozelSekil ? `(${orderData.ozelSekil})` : ""}</li>
            <li style="padding: 5px 0;"><strong>Pandispanya:</strong> ${
              orderData.pandispanya
            }</li>
            <li style="padding: 5px 0;"><strong>Krema:</strong> ${
              orderData.krema
            }</li>
            <li style="padding: 5px 0;"><strong>İçerikler:</strong> ${
              orderData.icerikler.length > 0
                ? orderData.icerikler.join(", ")
                : "Seçilmedi"
            }</li>
            ${
              orderData.kisiSayisi >= 10
                ? `<li style="padding: 5px 0;"><strong>Kat Sayısı:</strong> ${orderData.katSayisi}</li>`
                : ""
            }
            ${
              orderData.ozelNotlar
                ? `<li style="padding: 5px 0;"><strong>Özel Not:</strong> ${orderData.ozelNotlar}</li>`
                : ""
            }
            ${
              orderData.referansGorsel
                ? `<li style="padding: 5px 0;"><strong>Referans Görsel:</strong> ${
                    orderData.referansGorsel.name
                  } (${(orderData.referansGorsel.size / 1024 / 1024).toFixed(
                    2
                  )} MB) - Ekte gönderildi</li>`
                : ""
            }
          </ul>
        </div>

        <h3 style="color: #333;">🚚 Teslimat Bilgileri</h3>
        <div style="background: #fafee2; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 5px 0;"><strong>Teslimat:</strong> ${
              orderData.teslimat
            }</li>
            <li style="padding: 5px 0;"><strong>Teslimat Tarihi:</strong> ${
              orderData.teslimatTarihi
            }</li>
            <li style="padding: 5px 0;"><strong>Teslimat Saati:</strong> ${
              orderData.teslimatSaati
            }</li>
            ${
              orderData.adres
                ? `<li style="padding: 5px 0;"><strong>Adres:</strong> ${orderData.adres}</li>`
                : ""
            }
          </ul>
        </div>

        <h3 style="color: #333;">👤 Müşteri Bilgileri</h3>
        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 5px 0;"><strong>Ad Soyad:</strong> ${
              orderData.name
            }</li>
            <li style="padding: 5px 0;"><strong>Telefon:</strong> ${
              orderData.phone
            }</li>
            <li style="padding: 5px 0;"><strong>E-mail:</strong> ${
              orderData.email
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
  }

  // Send business notification email
  static async sendBusinessEmail(
    orderData: OrderFormData
  ): Promise<{ success: boolean; emailId?: string; error?: string }> {
    try {
      const emailData: any = {
        from: "Kaliteci Pasta <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL as string,
        subject: `YENİ PASTA SİPARİŞİ - ${orderData.teslimatTarihi} | ${orderData.teslimatSaati}`,
        html: this.generateBusinessEmailContent(orderData),
      };

      // Add attachment if reference image exists
      if (orderData.referansGorsel) {
        const file = orderData.referansGorsel;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        emailData.attachments = [
          {
            filename: file.name,
            content: buffer,
          },
        ];
      }

      const response = await this.resend.emails.send(emailData);

      if (response.error) {
        console.error("Email sending error:", response.error);
        return { success: false, error: response.error.message };
      }

      return { success: true, emailId: response.data?.id };
    } catch (error) {
      console.error("Email service error:", error);
      return { success: false, error: "Failed to send email" };
    }
  }

  // Generate customer confirmation email (for future enhancement)
  static generateCustomerConfirmationEmail(orderData: OrderFormData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f17816;">✅ Siparişiniz Alındı!</h2>
        
        <p>Sayın ${orderData.name},</p>
        
        <p>Pasta siparişiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.</p>
        
        <h3>Sipariş Özeti:</h3>
        <p>${this.getOrderSummary(orderData)}</p>
        
        <p>Teşekkür ederiz!</p>
        <p><strong>Kaliteci Pasta</strong></p>
      </div>
    `;
  }

  private static getOrderSummary(orderData: OrderFormData): string {
    return `${orderData.kisiSayisi} kişilik ${orderData.sekil} pasta - ${orderData.teslimatTarihi} ${orderData.teslimatSaati}`;
  }
}
