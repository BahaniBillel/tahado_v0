import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";

const fetchImagesFromS3 = async (giftId) => {
  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Prefix: `gifts_photos/gift_${giftId}/`,
  };

  const command = new ListObjectsCommand(params);
  const imagesData = await s3Client.send(command);

  if (imagesData && imagesData.Contents) {
    const imageObjects = imagesData.Contents.filter(
      (img) =>
        !img.Key.endsWith("/") &&
        (img.Key.toLowerCase().endsWith(".jpg") ||
          img.Key.toLowerCase().endsWith(".png"))
    );

    return imageObjects.map(
      (img) => `https://tahadobucket.s3.eu-central-1.amazonaws.com/${img.Key}`
    );
  }
  return [];
};

export default fetchImagesFromS3;
