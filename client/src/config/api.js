const isMobileNetwork = window.location.hostname !== "localhost";

export const API_URL = isMobileNetwork
  ? import.meta.env.VITE_API_NETWORK
  : import.meta.env.VITE_API_URL;
