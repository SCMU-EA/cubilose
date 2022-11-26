import * as moment from "moment";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Minio = require("minio");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
const endPoint = "124.223.220.83";

const minioClient = new Minio.Client({
  endPoint,
  port: 9000,
  useSSL: false,
  accessKey: "root",
  secretKey: "wf20010417",
});

export async function uploadFile(
  bucketsName: string,
  fileName: string,
  path: string,
  type: string,
) {
  const nowDate = new Date().getMilliseconds();
  const random = Math.round((Math.random() * 9 + 1) * 1000);
  const fileNameRandom = nowDate + random;

  const fileSuffix = fileName.substring(fileName.lastIndexOf(".")); // 文件后缀名字
  const filePrefix = fileName.substring(0, fileName.lastIndexOf(".")); // 文件名字前面那段

  const objectName =
    filePrefix.length > 20
      ? filePrefix.substring(0, 20) + fileNameRandom + fileSuffix
      : filePrefix + fileNameRandom + fileSuffix;
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
          fileNameRandom,
          url: objectName,
        });
      },
    );
  });
  const url = `http://124.223.220.83:9000/${bucketsName}/${objectName}`;
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

export default minioClient;
