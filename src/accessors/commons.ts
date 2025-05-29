import settings from '@/settings';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { APIError } from '@/utils/errors';
import base64url from 'base64url';

export class CoreAccessor {
  protected ENCRYPTION_KEY = Buffer.from(settings.SECRET_KEY, "hex").subarray(0, 16);
  protected ENCRYPTION_IV_LENGTH = 16;
  protected ENCRYPTION_ALGORITHM = "aes-128-ctr";

  serializeObject(data: Record<string, any>): string {
    return Buffer.from(JSON.stringify(data), 'utf8').toString('base64');
  }
  
  deserializeObject(str: string): Record<string, any> {
    return JSON.parse(Buffer.from(str, 'base64').toString('utf8'));
  }

  generateCursor (
    data: Record<string, any>
  ): string 
  {
    // Configuration
    const serialized = this.serializeObject(data);
    const iv = randomBytes(this.ENCRYPTION_IV_LENGTH);
    const cipher = createCipheriv(
      this.ENCRYPTION_ALGORITHM, 
      this.ENCRYPTION_KEY, 
      iv
    );

    // Encrypt the serialized data
    const encrypted = Buffer.concat([
      cipher.update(serialized, 'utf8'),
      cipher.final(),
    ]);

    // Combine IV + encrypted data and return as Base64
    return base64url.fromBase64(Buffer.concat([iv, encrypted]).toString('base64'));
  }

  decodeCursor (
    cursor: string,
  ): { success: true, data: Record<string, any> } | { success: false, error: APIError} 
  { 
    try {
      const buffer = base64url.toBuffer(cursor);
      const iv = buffer.subarray(0, this.ENCRYPTION_IV_LENGTH);
    
      // Extract encrypted data (remaining bytes)
      const encrypted = buffer.subarray(this.ENCRYPTION_IV_LENGTH);
    
      // Create decipher in CTR mode
      const decipher = createDecipheriv(
        this.ENCRYPTION_ALGORITHM, 
        this.ENCRYPTION_KEY, 
        iv
      );
    
      // Decrypt the data
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]).toString('utf8');
    
      // Deserialize back to object
      return {
        success: true,
        data: this.deserializeObject(decrypted),
      };
    } catch (error) {
      console.error("Error decoding cursor:", error);
      return {
        success: false,
        error: new APIError(400, 'Invalid cursor'),
      }
    }
  }

  public decodeCursorWithDefaults (
    cursor: string | null, defaults: Record<string, any> = {},
  ): { success: true, data: Record<string, any> } | { success: false, error: APIError} 
  {
    if (typeof cursor === 'string' && cursor) {
      const decodedCursor = this.decodeCursor(cursor);
      if (!decodedCursor.success) {
        return decodedCursor as { success: false, error: APIError };
      }
      return decodedCursor;
    }
    return {
      success: true,
      data: defaults,
    }
  }

  public buildCursorAttributes (
    data: Record<string, any>[],
    mapper: (data: Record<string, any>) => Record<string, any>,
    limit: number = 20
  ): { nextCursor: string, hasMore: boolean } 
  {
    if (data.length === limit) {
      const lastItem = data[data.length - 1];
      const nextCursor = this.generateCursor(mapper(lastItem));
      const hasMore = data.length === limit;
      console.info(`Cursor: {${nextCursor}}`);
      return {
        nextCursor: nextCursor,
        hasMore: hasMore,
      };
    }
    return {
      nextCursor: "",
      hasMore: false,
    };
  }

}