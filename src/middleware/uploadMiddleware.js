import multer from "multer"
import fs from "fs"
import path from "path"

const uploadDir = "uploads"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads")
  },

  filename(req, file, cb) {
    const unique =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9)

    // Sanitize the original file name to prevent space or parenthesis issues
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_")

    cb(
      null,
      unique + "-" + sanitizedName
    )
  },
})

export const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    if (
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true)
    } else {
      cb(new Error("only images allowed"))
    }
  },
})