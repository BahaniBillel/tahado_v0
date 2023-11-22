"use client";
import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
  },
});

export const getImages = async (giftsData, setImages, setGiftImageMap) => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Prefix: "gifts_photos/",
  };

  // console.log("Sending ListObjectsCommand with params:", params);
  // http://localhost:3000
  const command = new ListObjectsCommand(params);
  const imagesData = await s3Client.send(command);

  // console.log("Data from S3: ", imagesData);

  if (imagesData && imagesData.Contents) {
    const imageObjects = imagesData.Contents;

    let tempGiftImageMap = {};

    giftsData.forEach((gift) => {
      const { gift_id } = gift;

      // New logic to map images to gifts by gift_id
      const giftImages = imageObjects.filter(
        (img) =>
          img.Key.startsWith(`gifts_photos/gift_${gift_id}/`) &&
          !img.Key.endsWith("/") &&
          (img.Key.toLowerCase().endsWith(".jpg") ||
            img.Key.toLowerCase().endsWith(".png")) // New condition
      );

      tempGiftImageMap[gift_id] = giftImages.map(
        (img) => `https://tahadobucket.s3.eu-central-1.amazonaws.com/${img.Key}`
      );
    });

    // Save the gift-image mapping and the images
    const actualImages = imageObjects.filter(
      (obj) =>
        obj.Key.toLowerCase().endsWith(".jpg") ||
        obj.Key.toLowerCase().endsWith(".png")
    );
    setGiftImageMap(tempGiftImageMap);
    setImages(actualImages); // Only set actual images, not folder paths
  }
};
