import settings from '@/settings';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { APIError } from '@/utils/errors';
import base64url from '@/utils/base64url';

const ENCRYPTION_KEY = Buffer.from(settings.SECRET_KEY, "hex").subarray(0, 16);
const ENCRYPTION_IV_LENGTH = 16;
const ENCRYPTION_ALGORITHM = "aes-128-ctr";

function _serializeObject(data: Record<string, any>): string {
  return Buffer.from(JSON.stringify(data), 'utf8').toString('base64');
}

function _deserializeObject(str: string): Record<string, any> {
  return JSON.parse(Buffer.from(str, 'base64').toString('utf8'));
}

export function buildCursor (
  data: Record<string, any>
): string
{
  try {
    // Configuration
    const serialized = _serializeObject(data);
    const iv = randomBytes(ENCRYPTION_IV_LENGTH);
    const cipher = createCipheriv(
      ENCRYPTION_ALGORITHM, 
      ENCRYPTION_KEY, 
      iv
    );

    // Encrypt the serialized data
    const encrypted = Buffer.concat([
      cipher.update(serialized, 'utf8'),
      cipher.final(),
    ]);

    // Combine IV + encrypted data and return as Base64
    const cursor = base64url.encodeBase64urlFromBuffer(Buffer.concat([iv, encrypted]));
    return cursor
  } catch (error) {
    throw APIError.fromError(error,{ code: 400, message: 'Could not generate pagination cursor'});    
  }
}

export function decodeCursor (
  cursor: string,
): Record<string, any>
{ 
  try {
    const buffer = base64url.decodeBase64urlToBuffer(cursor);
    const iv = buffer.subarray(0, ENCRYPTION_IV_LENGTH);
  
    // Extract encrypted data (remaining bytes)
    const encrypted = buffer.subarray(ENCRYPTION_IV_LENGTH);
  
    // Create decipher in CTR mode
    const decipher = createDecipheriv(
      ENCRYPTION_ALGORITHM, 
      ENCRYPTION_KEY, 
      iv
    );
  
    // Decrypt the data
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString('utf8');
  
    // Deserialize back to object
    return _deserializeObject(decrypted);
  } catch (error) {
    throw APIError.fromError(error, { code: 400, message: 'Invalid cursor'}); 
  }
}