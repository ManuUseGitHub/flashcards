export const convert = (from: any, to: any) => (str: any) =>
  (Buffer as BufferConstructor).from(str, from).toString(to);

export const utf8ToHex = convert('utf8', 'hex');
export const hexToUtf8 = convert('hex', 'utf8');
