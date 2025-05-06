import path from 'node:path';
import fs from 'node:fs';
import settings from "@/settings";

export function storeFileLocal(
  domain: string,
  key: string,
  content: Buffer<ArrayBufferLike>,
) {
  try {
    // Create directory path if it doesn't exist
    const dirPath = path.join(settings.DEV_DATA_FOLDER, domain);
    fs.mkdirSync(dirPath, { recursive: true });

    // Create full file path and write file
    const filePath = path.join(dirPath, key);
    fs.writeFileSync(filePath, content);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error storing file: ${error.message}`);
    }
    throw new Error('Unknown error occurred while storing file');
  }

}

export function retrieveFileLocal(
  domain: string,
  key: string,
) { 
  try {
    const filePath = path.join(settings.DEV_DATA_FOLDER, domain, key);
    const fileContent = fs.readFileSync(filePath);
    return fileContent;
  } catch (error) {
    if (error instanceof Error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`File not found: ${domain}/${key}`);
      }
      throw new Error(`Error reading file: ${error.message}`);
    }
    throw new Error('Unknown error occurred while reading file');
  
  }
}