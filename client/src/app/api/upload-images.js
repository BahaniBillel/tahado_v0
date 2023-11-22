// api/upload-images.js
const AWS = require("aws-sdk");

export default async function handler(req, res) {
  const s3 = new AWS.S3({
    params: { Bucket: "tahadobucket" },
  });

  const images = req.files.get("images[]");

  for (const image of images) {
    // Upload the image to the S3 bucket
    await s3
      .upload({
        Key: `gifts_photos/gift_3${image.filename}`,
        Body: image,
      })
      .promise();
  }

  res.status(200).json({ message: "Images uploaded successfully" });
}
