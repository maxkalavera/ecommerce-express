import path from 'node:path';
import fs from 'node:fs';
import settings from "@/settings";

export function storeFileLocal(
  domain: string,
  key: string,
  content: Buffer<ArrayBufferLike>,
) {
  // Create directory path if it doesn't exist
  const dirPath = path.join(settings.DEV_DATA_FOLDER, domain);
  fs.mkdirSync(dirPath, { recursive: true });

  // Create full file path and write file
  const filePath = path.join(dirPath, key);
  fs.writeFileSync(filePath, content);
}

export function retrieveFileLocal(
  domain: string,
  key: string,
) { 
  const filePath = path.join(settings.DEV_DATA_FOLDER, domain, key);
  const fileContent = fs.readFileSync(filePath);
  return fileContent;
}