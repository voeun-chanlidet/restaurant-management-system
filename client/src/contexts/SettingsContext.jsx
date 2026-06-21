import { createContext, useContext, useEffect, useState } from "react";
import settingService from "../services/setting";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(4100);
  const [khqrImageUrl, setKhqrImageUrl] = useState(null);

  useEffect(() => {
    const fetchPublicSettings = async () => {
      try {
        const settings = await settingService.getPublicSettings();
        setCurrency(settings.currency);
        setExchangeRate(parseFloat(settings.exchange_rate));
        setKhqrImageUrl(settings.khqr_image_url);
      } catch (err) {
        console.error("Failed to load public settings", err);
      }
    };
    fetchPublicSettings();
  }, []);

  const formatPrice = (amount) => {
    if (currency === "KHR") {
      const khr = Math.round(parseFloat(amount) * exchangeRate);
      return `៛${khr.toLocaleString()}`;
    }
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <SettingsContext.Provider
      value={{ currency, exchangeRate, khqrImageUrl, formatPrice }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
