import lodash from 'lodash';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import { 
  storeFileLocal, 
  retrieveFileLocal, 
  deleteFileLocal, 
  fileExistsLocal 
} from '@/utils/db/localfiles';

/******************************************************************************
 * Types
 *****************************************************************************/

type StoreImageOptions = {
  force: boolean,
};

/******************************************************************************
 * Utils
 *****************************************************************************/

const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/png',
];

const MAX_IMAGE_SIZE = [3840, 2160];

const storeImageOptionsDefaults: StoreImageOptions = {
  force: false,
}

export async function storeImage (
  domain: string,
  key: string,
  content: Buffer<ArrayBufferLike>,
  _options: Partial<StoreImageOptions> = {},
) {
  const options = lodash.defaults(storeImageOptionsDefaults, _options);
  const fileInfo = await fileTypeFromBuffer(content);
  if (!fileInfo || !ALLOWED_MIMETYPES.includes(fileInfo.mime)) {
    throw new Error('Invalid file type');
  }

  let imageBuffer = content;
  let image = sharp(content);
  const imageMetadata = await image.metadata();
  // Resize image if it bigger than max size
  if (imageMetadata.width > MAX_IMAGE_SIZE[0]) {
    image = image.resize({ width: MAX_IMAGE_SIZE[0] });
  } else if (imageMetadata.height > MAX_IMAGE_SIZE[1]) {
    image = image.resize({ height: MAX_IMAGE_SIZE[1] });
  }
  imageBuffer = await image.toBuffer();

  // Store image
  return storeFileLocal(domain, key, imageBuffer, {force: options.force });
}

export async function retrieveImage (
  domain: string,
  key: string,
) {
  return retrieveFileLocal(domain, key);
}

export async function deleteImage (
  domain: string,
  key: string,
) {
  deleteFileLocal(domain, key);
}

export async function imageExists (
  domain: string,
  key: string,
) {
  return fileExistsLocal(domain, key);
}