// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { removeObject } from "../../server/minio";
// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const buckctName = "image";
const removeImage = async (req: NextApiRequest, res: NextApiResponse) => {
  const firstPictureUrl = req.headers.firstpicture as string;
  const objectName = firstPictureUrl.split("/").pop() as string;
  console.log(objectName);
  removeObject(buckctName, objectName);
  res.status(200).json({ msg: "success" });
};

export default removeImage;

// commit some tips
