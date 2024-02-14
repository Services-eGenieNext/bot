export const setLocalStorageItem = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    //
  }
};

export const getLocalStorageItem = (key: string): string | null => {
  try {
    const item = window.localStorage.getItem(key);
    return item;
  } catch (error) {
    return null;
  }
};

export const removeLocalStorageItem = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    //
  }
};
