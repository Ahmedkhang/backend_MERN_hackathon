const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    cloudinary.uploader.upload_stream(
      { folder: "hackathon_uploads" },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Upload failed", error });
        }

        res.status(200).json({
          message: "Image uploaded successfully",
          imageUrl: result.secure_url,
          public_id: result.public_id,
        });
      }
    ).end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};