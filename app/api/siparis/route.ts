import { NextRequest, NextResponse } from "next/server";
import { OrderFormData } from "@/types/order";
import { OrderService, EmailService, ValidationService } from "@/lib/services";
import { ERROR_MESSAGES } from "@/constants/order";

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formDataFromRequest = await request.formData();
    const orderData = parseFormData(formDataFromRequest);

    // Validate order with business rules and rate limiting
    const validationResult = ValidationService.validateForSubmission(orderData);

    if (!validationResult.isValid) {
      return handleValidationError(validationResult);
    }

    // Record order time for rate limiting
    OrderService.recordOrderTime(orderData.phone);

    // Send business notification email
    const emailResult = await EmailService.sendBusinessEmail(orderData);

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.MAIL_ERROR },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        message: "Sipariş başarıyla alındı",
        businessEmailId: emailResult.emailId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { error: "Sipariş işlenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// Helper function to parse form data into OrderFormData - Single Responsibility
function parseFormData(formData: FormData): OrderFormData {
  const data: any = {};

  formData.forEach((value, key) => {
    if (key === "icerikler") {
      data[key] = JSON.parse(value as string);
    } else if (key === "referansGorsel") {
      data[key] = value; // File object
    } else {
      data[key] = value;
    }
  });

  // Map to our expected field names
  return {
    name: data.musteriAdi || data.name || "",
    phone: data.telefon || data.phone || "",
    email: data.email || "",
    pandispanya: data.pandispanya || "",
    krema: data.krema || "",
    icerikler: data.icerikler || [],
    sekil: data.sekil || "",
    ozelSekil: data.ozelSekil || "",
    kisiSayisi: parseInt(data.kisiSayisi) || 0,
    katSayisi: data.katSayisi || "tek",
    teslimat: data.teslimat || "",
    adres: data.adres || "",
    teslimatTarihi: data.teslimatTarihi || "",
    teslimatSaati: data.teslimatSaati || "",
    ozelNotlar: data.ozelNotlar || "",
    referansGorsel: data.referansGorsel || null,
  } as OrderFormData;
}

// Helper function to handle validation errors - Single Responsibility
function handleValidationError(validationResult: any) {
  const rateLimitInfo = validationResult.rateLimitInfo;

  if (rateLimitInfo && !rateLimitInfo.isAllowed) {
    const remainingHours = rateLimitInfo.remainingHours || 0;
    const remainingMinutes = rateLimitInfo.remainingMinutes || 0;

    return NextResponse.json(
      {
        error: ERROR_MESSAGES.RATE_LIMIT_ERROR,
        warning: `Yeni sipariş verebilmek için ${
          remainingHours > 0 ? remainingHours + " saat " : ""
        }${remainingMinutes} dakika beklemeniz gerekmektedir.`,
        remainingTimeMs: rateLimitInfo.remainingTime,
      },
      { status: 429 }
    );
  }

  // Return general validation error
  return NextResponse.json(
    {
      error: "Form doğrulama hatası",
      details: validationResult.errors,
    },
    { status: 400 }
  );
}
