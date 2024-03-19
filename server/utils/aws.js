import AWS from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config.js";

const AWS_s3 = new AWS.S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.access_key,
    secretAccessKey: config.aws.secret_key,
  },
});

class S3FileControl {
  constructor() {}

  async s3FileUpload(data) {
    try {
      const param = {
        Key: data["key"],
        Bucket: data["bucket"],
        Body: data["file"].buffer,
        ContentType: data["file"].mimetype,
        // CacheControl: "public, max-age=900",
      };

      const command = new AWS.PutObjectCommand(param);
      await AWS_s3.send(command);

      const urls = await getSignedUrl(AWS_s3, command);
      return urls.split("?")[0];
    } catch (err) {
      throw err;
    }
  }

  async s3FileDelete(data) {
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

export const s3File = new S3FileControl();
