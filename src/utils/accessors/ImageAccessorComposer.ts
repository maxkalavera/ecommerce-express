import { getTableName } from 'drizzle-orm';
import { APIError } from '@/utils/errors';
import { LayersReturnType } from '@/types/layers';
import CoreAccessor from '@/utils/accessors/CoreAccessor';
import { storeImage, deleteImage, imageExists } from '@/utils/db/images';
import base64url from '@/utils/base64url';
import { buildMediaURL } from '@/utils/urls';

export class ImageAccessorComposer {
  private context: CoreAccessor;
  private domain: string;

  constructor (
    context: CoreAccessor,
    domain: string = '',
  ) {
    this.context = context;
    this.domain = domain || getTableName(context.table);
  }

  public async addImage(
    data: Record<string, any>,
    image: Buffer,
  ): Promise<LayersReturnType> 
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
        url: buildMediaURL(imageInfo.path),
        mimetype: imageInfo.mimetype,
      });
    } catch (error) {
      throw new APIError({}, { 
        message: 'Failed to store image in database', 
      }, error);
    }
  }

  public async updateImage(
    identifiers: Record<string, any>,
    image: Buffer,
  ): Promise<LayersReturnType>  
  {
    try {
      const key = base64url.encodeBase64url(crypto.randomUUID());
      const imageInfo = await storeImage(this.domain, key, image, { force: true });
      return await this.context.update(identifiers, {
        key: key,
        url: buildMediaURL(imageInfo.path),
        mimetype: imageInfo.mimetype,
      });
    } catch (error) {
      throw new APIError({}, {
        message: 'Failed to update image in database',
      }, error);
    }
  }

  public async deleteImage(
    identifiers: Record<string, any>,
  ): Promise<LayersReturnType>  
  {
    try {
      const result = await this.context.delete(identifiers);
      await result.onSuccess(async (payload) => {
        await deleteImage(this.domain, payload.data.key);
      });
      return result;
    } catch (error) {
      throw new APIError({}, {
        message: 'Failed to delete image in database',
      }, error);
    }
  }

}