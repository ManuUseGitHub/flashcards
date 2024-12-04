export const onMatched = (
  expression: RegExp,
  s: string,
  cb: (m: RegExpExecArray) => any
) => {
  let m;
  if ((m = expression.exec(s))) {
    return cb(m);
  }
};

export const truthy = (x: any) => x;

export const firstGroup = (m: RegExpExecArray) => m[1];
