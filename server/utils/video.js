import { config } from "../config.js";

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
