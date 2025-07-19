"use client";

import Image from "next/image";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { tr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("tr", tr);

export default function Home() {
  const [formData, setFormData] = useState({
    pandispanya: "",
    krema: "",
    icerikler: [] as string[],
    sekil: "",
    ozelSekil: "",
    kisiSayisi: "",
    katSayisi: "tek",
    teslimat: "",
    adres: "",
    teslimatTarihi: "",
    teslimatSaati: "",
    musteriAdi: "",
    telefon: "+90",
    email: "",
    ozelNotlar: "",
    referansGorsel: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const icerikSecenekleri = [
    "Çikolata",
    "Çilek",
    "Muz",
    "Frambuaz",
    "Böğürtlen",
    "Oreo",
    "Lotus",
    "Krokan",
    "Kestane",
    "Vişne",
  ];

  const handleIcerikChange = (icerik: string) => {
    const currentIcerikler = [...formData.icerikler];
    const index = currentIcerikler.indexOf(icerik);

    if (index > -1) {
      currentIcerikler.splice(index, 1);
    } else {
      currentIcerikler.push(icerik);
    }

    setFormData({ ...formData, icerikler: currentIcerikler });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // FormData kullanarak dosya ile birlikte gönder
      const submitData = new FormData();

      // Text alanları ekle
      Object.keys(formData).forEach((key) => {
        if (key === "referansGorsel") {
          if (formData.referansGorsel) {
            submitData.append("referansGorsel", formData.referansGorsel);
          }
        } else if (key === "icerikler") {
          submitData.append("icerikler", JSON.stringify(formData.icerikler));
        } else {
          submitData.append(key, (formData as any)[key]);
        }
      });

      const response = await fetch("/api/siparis", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setSubmitMessage(
          "✅ Siparişiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz."
        );
        // Form sıfırlama
        setFormData({
          pandispanya: "",
          krema: "",
          icerikler: [],
          sekil: "",
          ozelSekil: "",
          kisiSayisi: "",
          katSayisi: "tek",
          teslimat: "",
          adres: "",
          teslimatTarihi: "",
          teslimatSaati: "",
          musteriAdi: "",
          telefon: "+90",
          email: "",
          ozelNotlar: "",
          referansGorsel: null,
        });
      } else {
        setSubmitMessage(
          "❌ Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    } catch (error) {
      setSubmitMessage("❌ Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Image
            src="/logo.jpeg"
            alt="Kaliteci Logo"
            width={200}
            height={100}
            className="m-auto"
          />
          <div className="text-center">
            <p className="text-gray-600">Özel Pasta Sipariş Sistemi</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Müşteri Bilgileri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.musteriAdi}
                    onChange={(e) =>
                      setFormData({ ...formData, musteriAdi: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📱 Telefon Numaranız *
                  </label>
                  <div className="phone-input-wrapper">
                    <span className="phone-prefix">🇹🇷 +90</span>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={formData.telefon.replace("+90", "")}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) {
                          setFormData({ ...formData, telefon: "+90" + value });
                        }
                      }}
                      className="phone-input w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      placeholder="532 123 45 67"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    ✅ Sadece rakam girin, format otomatik düzenlenecek
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail Adresiniz *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>
              <hr />
              {/* Kişi Sayısı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Kaç Kişilik? (1-50 arası) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={formData.kisiSayisi}
                  onChange={(e) =>
                    setFormData({ ...formData, kisiSayisi: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Kişi sayısı"
                />
              </div>
              {/* Kat Sayısı (10+ kişi için) */}
              {parseInt(formData.kisiSayisi) >= 10 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Kat Sayısı
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["tek", "çift"].map((kat) => (
                      <label
                        key={kat}
                        className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="katSayisi"
                          value={kat}
                          checked={formData.katSayisi === kat}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              katSayisi: e.target.value,
                            })
                          }
                          className="mr-3 text-pink-500 focus:ring-pink-400"
                        />
                        <span className="font-medium capitalize">
                          {kat} Katlı
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {/* Pandispanya Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pandispanya Türü *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Kakaolu", "Vanilya/Sade"].map((tur) => (
                    <label
                      key={tur}
                      className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="pandispanya"
                        value={tur}
                        checked={formData.pandispanya === tur}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pandispanya: e.target.value,
                          })
                        }
                        className="mr-3 text-pink-500 focus:ring-pink-400"
                        required
                      />
                      <span className="font-medium">{tur}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Krema Türü */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Krema Türü *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Çikolata Krema", "Beyaz Krema"].map((krema) => (
                    <label
                      key={krema}
                      className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="krema"
                        value={krema}
                        checked={formData.krema === krema}
                        onChange={(e) =>
                          setFormData({ ...formData, krema: e.target.value })
                        }
                        className="mr-3 text-pink-500 focus:ring-pink-400"
                        required
                      />
                      <span className="font-medium">{krema}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* İçerik Seçenekleri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  İçerik Seçenekleri (Birden fazla seçebilirsiniz)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {icerikSecenekleri.map((icerik) => (
                    <label
                      key={icerik}
                      className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={formData.icerikler.includes(icerik)}
                        onChange={() => handleIcerikChange(icerik)}
                        className="mr-2 text-pink-500 focus:ring-pink-400"
                      />
                      <span>{icerik}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Şekil Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pasta Şekli *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: "Kalp", emoji: "❤️", class: "shape-heart" },
                    { name: "Yuvarlak", emoji: "⭕", class: "shape-circle" },
                    { name: "Yıldız", emoji: "⭐", class: "shape-star" },
                    { name: "Özel Şekil", emoji: "🎨", class: "shape-custom" },
                  ].map((sekil) => (
                    <div key={sekil.name} className="relative">
                      <input
                        type="radio"
                        name="sekil"
                        value={sekil.name}
                        checked={formData.sekil === sekil.name}
                        onChange={(e) =>
                          setFormData({ ...formData, sekil: e.target.value })
                        }
                        className={`sr-only ${sekil.class}`}
                        required
                        id={`sekil-${sekil.name}`}
                      />
                      <label
                        htmlFor={`sekil-${sekil.name}`}
                        className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                          formData.sekil === sekil.name
                            ? sekil.class.replace("shape-", "shape-") +
                              " border-current shadow-lg"
                            : sekil.class +
                              " hover:shadow-md border-transparent"
                        }`}
                      >
                        <span className="text-4xl mb-2">{sekil.emoji}</span>
                        <span className="font-semibold text-center">
                          {sekil.name}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>

                {formData.sekil === "Özel Şekil" && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={formData.ozelSekil}
                      onChange={(e) =>
                        setFormData({ ...formData, ozelSekil: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Özel şekil talebinizi yazın..."
                      required={formData.sekil === "Özel Şekil"}
                    />
                  </div>
                )}
              </div>
              <hr />
              {/* Teslimat Seçenekleri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Teslimat Seçeneği *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Şubeden Teslim", "Adrese Teslim"].map((teslimat) => (
                    <label
                      key={teslimat}
                      className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="teslimat"
                        value={teslimat}
                        checked={formData.teslimat === teslimat}
                        onChange={(e) =>
                          setFormData({ ...formData, teslimat: e.target.value })
                        }
                        className="mr-3 text-pink-500 focus:ring-pink-400"
                        required
                      />
                      <span className="font-medium">{teslimat}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Adres Bilgisi */}
              {formData.teslimat === "Adrese Teslim" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏠 Teslimat Adresi *
                  </label>
                  <textarea
                    required={formData.teslimat === "Adrese Teslim"}
                    value={formData.adres}
                    onChange={(e) =>
                      setFormData({ ...formData, adres: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Tam adresinizi yazın..."
                  />
                </div>
              )}
              {/* Teslimat Tarihi ve Saati */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Teslimat Tarihi *
                  </label>
                  <DatePicker
                    selected={
                      formData.teslimatTarihi
                        ? new Date(formData.teslimatTarihi)
                        : null
                    }
                    onChange={(date: Date | null) => {
                      setFormData({
                        ...formData,
                        teslimatTarihi: date
                          ? date.toISOString().split("T")[0]
                          : "",
                      });
                    }}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    locale="tr"
                    placeholderText="Tarih seçin"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⏰ Teslimat Saati *
                  </label>
                  <DatePicker
                    selected={
                      formData.teslimatSaati
                        ? new Date(`2024-01-01 ${formData.teslimatSaati}`)
                        : null
                    }
                    onChange={(time: Date | null) => {
                      if (time) {
                        const hours = time
                          .getHours()
                          .toString()
                          .padStart(2, "0");
                        const minutes = time
                          .getMinutes()
                          .toString()
                          .padStart(2, "0");
                        setFormData({
                          ...formData,
                          teslimatSaati: `${hours}:${minutes}`,
                        });
                      }
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={60}
                    timeCaption="Saat"
                    dateFormat="HH:mm"
                    placeholderText="Saat seçin"
                    minTime={new Date(new Date().setHours(9, 0, 0))}
                    maxTime={new Date(new Date().setHours(18, 0, 0))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    locale="tr"
                    required
                  />
                </div>
              </div>
              <hr />

              {/* Özel Notlar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Özel Notlarınız
                </label>
                <textarea
                  value={formData.ozelNotlar}
                  onChange={(e) =>
                    setFormData({ ...formData, ozelNotlar: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Pastanız ile ilgili özel isteklerinizi yazın..."
                />
              </div>
              {/* Referans Görsel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🖼️ Referans Görsel (İsteğe Bağlı)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, referansGorsel: file });
                    }}
                    className="hidden"
                    id="referansGorsel"
                  />
                  <label
                    htmlFor="referansGorsel"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {formData.referansGorsel ? (
                      <div className="text-green-600">
                        <div className="text-4xl mb-2">✅</div>
                        <p className="font-medium">
                          {formData.referansGorsel.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Başka görsel seçmek için tıklayın
                        </p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <div className="text-4xl mb-2">📷</div>
                        <p className="font-medium">
                          İstediğiniz pasta modelinin fotoğrafını yükleyin
                        </p>
                        <p className="text-sm mt-1">
                          JPG, PNG veya GIF formatında
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Bu görsel referans olacaktır
                </p>
              </div>
              {/* Submit Button */}
              <div className="text-center pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button w-full text-white font-bold py-5 px-12 rounded-2xl text-xl"
                >
                  <span className="flex items-center justify-center">
                    {isSubmitting ? (
                      <>Sipariş Gönderiliyor...</>
                    ) : (
                      <>Siparişi Gönder</>
                    )}
                  </span>
                </button>
              </div>
            </form>
            {submitMessage && (
              <div
                className={`mt-6 p-4 rounded-lg text-center ${
                  submitMessage.includes("✅")
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {submitMessage}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
