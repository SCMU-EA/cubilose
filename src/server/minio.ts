// eslint-disable-next-line @typescript-eslint/no-var-requires
const Minio = require("minio");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { uuid } = require("uuidv4");

// export const endPoint = "124.223.220.83"; //remote
export const endPoint = "localhost"; //local

const minioClient = new Minio.Client({
  endPoint,
  port: 9000,
  useSSL: false,
  accessKey: "minioadmin",
  secretKey: "minioadmin",
  // accessKey: "root",
  // secretKey: "wf20010417",
});

export async function uploadFile(
  bucketsName: string,
  fileName: string,
  path: string,
  type: string,
) {
  const fileSuffix = fileName.substring(fileName.lastIndexOf(".")); // 文件后缀名字

  const objectName = uuid() + fileSuffix;
  const fileStream = fs.createReadStream(path);
  fs.stat(path, function (err: any, stats: any) {
    if (err) {
      console.log(err);
    }

    minioClient.putObject(
      bucketsName,
      objectName,
      fileStream,
      stats.size,
      { "Content-Type": type },
      function (err: any, etag: any) {
        if (err) {
          console.log(err);
        }

        console.log({
          fileName,
          bucketsName,
          size: stats.size,
          url: objectName,
        });
      },
    );
  });
  const url = `http://${endPoint}:9000/${bucketsName}/${objectName}`;
  return url;
}

export function download(buckctsName: string, file: File) {
  minioClient.fGetObject(buckctsName, file, function (err: any) {
    if (err) {
      console.log(err);
    }

    console.log("下载成功");
  });
}
export function removeObject(buckctName: string, objectName: string) {
  minioClient.removeObject(buckctName, objectName, function (err: any) {
    if (err) {
      console.log("Unable to remove object", err);
    }
    console.log("Removed the object");
  });
}

export default minioClient;
