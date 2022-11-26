// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { uploadFile } from "../minio";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const formidable = require("formidable");
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const buckctName = "image";
const uploadImage = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err: Error, fields: any, files: any) {
    const url = await uploadFile(
      buckctName,
      files.picture.originalFilename,
      files.picture.filepath,
      files.picture.mimetype,
    );
    res.status(200).json({ imageUrl: url });
  });
};
export const config = {
  api: {
    bodyParser: false,
  },
};
export default uploadImage;

// commit some tips
