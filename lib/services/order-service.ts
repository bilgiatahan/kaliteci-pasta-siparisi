import { OrderFormData, RateLimitInfo } from "@/types/order";
import { RATE_LIMIT } from "@/constants/order";

// Service class for order-related business logic - Single Responsibility Principle
export class OrderService {
  private static lastOrderTimes = new Map<string, number>();

  // Check if phone number is rate limited
  static checkRateLimit(phone: string): RateLimitInfo {
    const currentTime = Date.now();

    if (!this.lastOrderTimes.has(phone)) {
      return { isAllowed: true };
    }

    const lastOrderTime = this.lastOrderTimes.get(phone)!;
    const timeDifference = currentTime - lastOrderTime;

    if (timeDifference < RATE_LIMIT.COOLDOWN_MS) {
      const remainingTime = RATE_LIMIT.COOLDOWN_MS - timeDifference;
      const remainingHours = Math.ceil(remainingTime / (60 * 60 * 1000));
      const remainingMinutes = Math.ceil(
        (remainingTime % (60 * 60 * 1000)) / (60 * 1000)
      );

      return {
        isAllowed: false,
        remainingTime,
        remainingHours,
        remainingMinutes,
      };
    }

    return { isAllowed: true };
  }

  // Record order time for rate limiting
  static recordOrderTime(phone: string): void {
    this.lastOrderTimes.set(phone, Date.now());
  }

  // Prepare form data for API submission
  static prepareFormData(orderData: OrderFormData): FormData {
    const formData = new FormData();

    Object.entries(orderData).forEach(([key, value]) => {
      if (key === "referansGorsel") {
        if (value) {
          formData.append("referansGorsel", value as File);
        }
      } else if (key === "icerikler") {
        formData.append("icerikler", JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    return formData;
  }

  // Calculate estimated price (placeholder for future enhancement)
  static calculateEstimatedPrice(orderData: OrderFormData): number {
    const basePrice = 50; // Base price for a cake
    const personMultiplier = orderData.kisiSayisi * 5;
    const layerMultiplier = orderData.katSayisi === "çift" ? 20 : 0;
    const ingredientPrice = orderData.icerikler.length * 3;
    const customShapePrice = orderData.sekil === "Özel Şekil" ? 15 : 0;

    return (
      basePrice +
      personMultiplier +
      layerMultiplier +
      ingredientPrice +
      customShapePrice
    );
  }

  // Validate business rules
  static validateBusinessRules(orderData: OrderFormData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check delivery date is not in the past
    const deliveryDate = new Date(orderData.teslimatTarihi);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (deliveryDate < tomorrow) {
      errors.push("Teslimat tarihi en az bir gün sonra olmalıdır");
    }

    // Check delivery time is within business hours
    if (orderData.teslimatSaati) {
      const [hours] = orderData.teslimatSaati.split(":").map(Number);
      if (hours < 9 || hours > 18) {
        errors.push("Teslimat saati 09:00-18:00 arasında olmalıdır");
      }
    }

    // Check minimum person count for multi-layer cakes
    if (orderData.katSayisi === "çift" && orderData.kisiSayisi < 10) {
      errors.push("Çift katlı pastalar en az 10 kişilik olmalıdır");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Get order summary for email
  static getOrderSummary(orderData: OrderFormData): string {
    const ingredients =
      orderData.icerikler.length > 0
        ? orderData.icerikler.join(", ")
        : "Seçilmedi";

    const specialShape =
      orderData.sekil === "Özel Şekil" && orderData.ozelSekil
        ? ` (${orderData.ozelSekil})`
        : "";

    return `
      ${orderData.kisiSayisi} kişilik ${orderData.sekil}${specialShape} pasta
      Pandispanya: ${orderData.pandispanya}
      Krema: ${orderData.krema}
      İçerikler: ${ingredients}
      ${orderData.katSayisi === "çift" ? "Çift katlı" : "Tek katlı"}
      Teslimat: ${orderData.teslimat} - ${orderData.teslimatTarihi} ${
      orderData.teslimatSaati
    }
    `.trim();
  }
}
