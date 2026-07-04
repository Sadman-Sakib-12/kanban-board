export const getStorage = (key: string) => {
  if (typeof window !== "undefined") return localStorage.getItem(key);
  return null;
};
