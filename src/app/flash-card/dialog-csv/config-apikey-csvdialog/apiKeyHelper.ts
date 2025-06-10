export const 
  getApiKeyParts = (key: any): {
    key: string;
    head?: string;
    tail?: string;
    segments: string[];
  } => {
    const { head, tail } =
      /^(?<head>(?:[0-9a-fA-F\-]+){4})(?<tail>:.*)/g.exec(key)?.groups || {};

    let i = 0;
    const pattern = /(?:(?<part>[0-9a-fA-F]+))-?/g;
    let g;
    const segments: string[] = [];
    while ((g = pattern.exec(head || '')?.groups)) {
      segments.push(g['part']);
      if (i++ > 10) {
        break;
      }
    }
    if (segments.length == 0) {
      segments.push(key);
    }

    return { key, head, tail, segments };
  }