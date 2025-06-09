import { keepAlive } from "@/utils/playground";

console.log("Playground running...");
/******************************************************************************
 * Place code here 
 *****************************************************************************/

import { storeImage, imageExists } from "@/utils/db/images";
import fs from 'fs';
import path from 'path';


const imagePath = path.resolve('assets/images/categories/YgMVlkiMSs.jpg');
const imageBuffer = fs.readFileSync(imagePath);

console.log("Image exists: " + await imageExists("categories", "YgMVlkiMSs"))
if (!(await imageExists("categories", "YgMVlkiMSs"))) {
  const imageInfo = await storeImage("categories", "YgMVlkiMSs", imageBuffer);
  console.log("Image info:")
  console.log(imageInfo);
}


/*****************************************************************************/
keepAlive();
