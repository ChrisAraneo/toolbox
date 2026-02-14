export const toBuffer = (data: unknown): Buffer =>
  Buffer.from(data as string, 'base64') as unknown as Buffer;
