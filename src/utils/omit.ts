/* eslint-disable @typescript-eslint/no-explicit-any */
export default function omit(
  obj: { [key: string]: any },
  omitKey: string,
): { [key: string]: any } {
  return Object.keys(obj).reduce((result: { [key: string]: any }, key) => {
    if (key !== omitKey) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}
