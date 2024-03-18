import multer from "multer";
import AWS from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const upload = multer({
  storage: multer.memoryStorage(),
});

export const AWS_s3 = new AWS.S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.access_key,
    secretAccessKey: config.aws.secret_key,
  },
});
