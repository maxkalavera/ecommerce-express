import base64url from 'base64url';


export function encodeBase64url(data: string) {
  return base64url(data);
}

export function decodeBase64url(data: string) {
  return base64url.decode(data);
}

export function encodeBase64urlFromBuffer(data: Buffer) {
  return base64url(data);
}

export function decodeBase64urlToBuffer(data: string) {
  return base64url.toBuffer(data);
}

export function encodeBase64urlFromBase64(data: string) {
  return base64url.fromBase64(data);
}

export function decodeBase64urlToBase64(data: string) {
  return base64url.toBase64(data);
}

export default {
  encodeBase64url,
  decodeBase64url,
  encodeBase64urlFromBuffer,
  decodeBase64urlToBuffer,
  encodeBase64urlFromBase64,
  decodeBase64urlToBase64,
};