import { createContext, useContext, useEffect, useState } from "react";
import settingService from "../services/setting";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(4100);
  const [khqrImageUrl, setKhqrImageUrl] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [footerMessage, setFooterMessage] = useState(
    "Thank you! Please come again.",
  );

  useEffect(() => {
    const fetchPublicSettings = async () => {
      try {
        const settings = await settingService.getPublicSettings();
        setCurrency(settings.currency);
        setExchangeRate(parseFloat(settings.exchange_rate));
        setKhqrImageUrl(settings.khqr_image_url || null);
        setLogoUrl(settings.logo_url || null);
        setRestaurantName(settings.restaurant_name || "");
        setAddress(settings.address || "");
        setPhone(settings.phone || "");
        setFooterMessage(
          settings.footer_message || "Thank you! Please come again.",
        );
      } catch (err) {
        console.error("Failed to load public settings", err);
      }
    };
    fetchPublicSettings();
  }, []);

  const formatPrice = (amount) => {
    if (currency === "KHR") {
      const khr = Math.round(parseFloat(amount) * exchangeRate);
      return `${khr.toLocaleString()} រៀល`;
    }
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        currency,
        exchangeRate,
        khqrImageUrl,
        logoUrl,
        formatPrice,
        restaurantName,
        address,
        phone,
        footerMessage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
