import { v4 as uuidv4 } from "uuid";

export const replaceSpacesWithDashes = (str: string) => {
  return str.replace(/\s+/g, "-").toLowerCase();
};
export const generateUUID = () => {
  return uuidv4();
};
