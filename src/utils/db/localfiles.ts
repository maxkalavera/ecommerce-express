import path from 'node:path';
import fs from 'node:fs';
import lodash from 'lodash';
import { createHmac } from 'crypto';
import urlJoin from 'url-join';
import { fileTypeFromBuffer } from 'file-type';
import settings from "@/settings";

/******************************************************************************
 * Types
 *****************************************************************************/

type StoreFileLocalOptions = {
  force: boolean,
  labels: string[]
}

type RetrieveFileLocalOptions = {
  labels: string[]
}

type DeleteFileLocalOptions = {
  labels: string[]
}

/******************************************************************************
 * Utils
 *****************************************************************************/

const ENCRYPTION_KEY = Buffer.from(settings.SECRET_KEY, "hex").subarray(0, 16);

// @deprecated
export function setupLocalFileStorage() {
  if (!fs.existsSync(settings.MEDIA_STORAGE_FOLDER)) {
    fs.mkdirSync(settings.MEDIA_STORAGE_FOLDER, { recursive: true });
  }
}

export function hashString (
  content: string
) {
  const hash = createHmac('sha256', ENCRYPTION_KEY)
    .update(content)
    .digest('base64url');
  return hash;
}

function buildFilename(
  key: string,
  labels: string[]
) {
  if (labels.some((label) => !label.match(/^[a-z0-9]+$/i))) {
    throw new Error("Store file labels should only contain alphanumeric characters.");
  }
  const filename = `${key}${labels.length > 0 ? '.' : ''}${labels.join(".")}`;
  return filename;
}

export async function storeFileLocal(
  domain: string,
  key: string,
  content: Buffer<ArrayBufferLike>,
  _options: Partial<StoreFileLocalOptions> = {}
): Promise<{ url: string, mimetype: string | null }>
{
  const options: StoreFileLocalOptions = lodash.defaults(_options, {
    force: false,
    labels: [],
  });
  const hashedDomain = hashString(domain);
  const hashedFilename = hashString(buildFilename(key, options.labels));

  // Create directory path if it doesn't exist
  const dirPath = path.join(settings.MEDIA_STORAGE_FOLDER, hashedDomain);
  fs.mkdirSync(dirPath, { recursive: true });
  // Create full file path and write file
  const filePath = path.join(dirPath, hashedFilename);
  if (fs.existsSync(filePath) && !options.force) {
    throw new Error(`File ${filePath} already exists`);
  }

  fs.writeFileSync(filePath, content);
  const fileInfo = await fileTypeFromBuffer(content);
  return {
    url: urlJoin(settings.MEDIA_URL_PREFIX, hashedDomain, hashedFilename),
    mimetype: fileInfo && fileInfo.mime ? fileInfo.mime : null,
  }
}

export async function retrieveFileLocal(
  domain: string,
  key: string,
  _options: Partial<RetrieveFileLocalOptions> = {}
) {
  const options: RetrieveFileLocalOptions = lodash.defaults(_options, {
    labels: [],
  });
  const hashedDomain = hashString(domain);
  const hashedFilename = hashString(buildFilename(key, options.labels));

  const filePath = path.join(settings.MEDIA_STORAGE_FOLDER, hashedDomain, hashedFilename);
  const fileContent = fs.readFileSync(filePath);
  return fileContent;
}

export async function deleteFileLocal(
  domain: string,
  key: string,
  _options: Partial<DeleteFileLocalOptions> = {}
) {
  const options: DeleteFileLocalOptions = lodash.defaults(_options, {
    labels: [],
  });
  const hashedDomain = hashString(domain);
  const hashedFilename = hashString(buildFilename(key, options.labels));

  const filePath = path.join(settings.MEDIA_STORAGE_FOLDER, hashedDomain, hashedFilename);
  fs.unlinkSync(filePath);
}

export async function fileExistsLocal(
  domain: string,
  key: string,
  _options: Partial<RetrieveFileLocalOptions> = {}
) {
  const options: RetrieveFileLocalOptions = lodash.defaults(_options, {
    labels: [],
  });
  const hashedDomain = hashString(domain);
  const hashedFilename = hashString(buildFilename(key, options.labels));

  const filePath = path.join(settings.MEDIA_STORAGE_FOLDER, hashedDomain, hashedFilename);
  return fs.existsSync(filePath);
}