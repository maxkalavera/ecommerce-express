import { APIError } from '@/utils/errors';
import CoreAccessor from '@/utils/accessors/CoreAccessor';
import { AccessorReturnType } from "@/types/accessors";
import { storeImage, deleteImage, imageExists } from '@/utils/db/images';
import base64url from '@/utils/base64url';

export class ImageAccessorComposer {
  private context: CoreAccessor;
  private domain: string;

  constructor (
    context: CoreAccessor,
    domain: string,
  ) {
    this.context = context;
    this.domain = domain;
  }

  public async addImage(
    data: Record<string, any>,
    image: Buffer,
  ): Promise<AccessorReturnType> 
  {
    try {
      const key = data.key || base64url.encodeBase64url(crypto.randomUUID());
      if (await imageExists(this.domain, key)) {  
        throw new APIError({ code: 400, message: `There is already an image associated with ${key}` });
      }
      const imageInfo = await storeImage(this.domain, key, image);
      return await this.context.create({
        ...data,
        key: key,
        url: imageInfo.url,
        mimetype: imageInfo.mimetype,
      });
    } catch (err) {
      console.error(err);
      throw APIError.fromError(err, { code: 500, message: 'Failed to store image in database' });
    }
  }

  public async updateImage(
    identifiers: Record<string, any>,
    image: Buffer,
  ): Promise<AccessorReturnType>  
  {
    try {
      const key = base64url.encodeBase64url(crypto.randomUUID());
      const imageInfo = await storeImage(this.domain, key, image, { force: true });
      return await this.context.update(identifiers, {
        key: key,
        url: imageInfo.url,
        mimetype: imageInfo.mimetype,
      });
    } catch (err) {
      throw APIError.fromError(err, { code: 500, message: 'Failed to update image in database' });
    }
  }

  public async deleteImage(
    identifiers: Record<string, any>,
  ): Promise<AccessorReturnType>  
  {
    try {
      const result = await this.context.delete(identifiers);
      if (!result.success) {
        return result;
      }

      console.log(result.payload)
      await deleteImage(this.domain, result.payload.data.key);
      return result;
    } catch (err) {
      throw APIError.fromError(err, { code: 500, message: 'Failed to delete image in database' });
    }
  }

}