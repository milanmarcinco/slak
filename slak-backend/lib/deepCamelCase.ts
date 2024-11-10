import { string } from "@ioc:Adonis/Core/Helpers";

export const deepCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => deepCamelCase(v));
  }

  if (obj && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = string.camelCase(key);
      return { ...acc, [newKey]: deepCamelCase(obj[key]) };
    }, {});
  }

  return obj;
};
