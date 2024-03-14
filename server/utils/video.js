import AWS from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config.js";

export const AWS_s3 = new AWS.S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.access_key,
    secretAccessKey: config.aws.secret_key,
  },
});

export class S3Video {
  constructor() {}

  // 비디오 부분
  async S3videoUpload(data) {
    try {
      const video_param = {
        Key: data["key"],
        Bucket: config.aws.bucket.video,
        Body: data["file"].buffer,
        ContentType: data["file"].mimetype,
        CacheControl: "public, max-age=900",
      };

      const command = new AWS.PutObjectCommand(video_param);
      const response = await AWS_s3.send(command);

      const urls = await getSignedUrl(AWS_s3, command);
      return urls.split("?")[0];
    } catch (err) {
      throw err;
    }
  }

  async S3videoDelete(data) {
    try {
      const param = {
        Key: data["key"],
        Bucket: config.aws.bucket.video,
      };

      const command = new AWS.DeleteObjectCommand(param);
      await AWS_s3.send(command);

      return;
    } catch (err) {
      throw err;
    }
  }
}

export let videoS3 = new S3Video();
