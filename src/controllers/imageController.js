import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { getUploadsDir } from "../utils/uploads.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = getUploadsDir();

// Helper: check if uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

export function getImages(req, res) {
  try {
    const files = fs.readdirSync(uploadsDir)
    const images = files
      .map((file) => {
        const filePath = path.join(uploadsDir, file)
        const stat = fs.statSync(filePath)
        
        // Skip directories, only list files
        if (stat.isDirectory()) return null

        return {
          filename: file,
          size: stat.size,
          createdAt: stat.mtime,
          url: `/uploads/${file}`,
        }
      })
      .filter((img) => img !== null)
      // Sort newest first
      .sort((a, b) => b.createdAt - a.createdAt)

    res.json(images)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export function renameImage(req, res) {
  const { oldName, newName } = req.body
  if (!oldName || !newName) {
    return res.status(400).json({ error: "oldName and newName are required" })
  }

  // Sanitize the new name to ensure compatibility (spaces & parentheses to underscores)
  const sanitizedNewName = newName.replace(/[^a-zA-Z0-9.\-_]/g, "_")

  const oldPath = path.join(uploadsDir, oldName)
  const newPath = path.join(uploadsDir, sanitizedNewName)

  if (!fs.existsSync(oldPath)) {
    return res.status(404).json({ error: "Source image not found" })
  }

  if (fs.existsSync(newPath)) {
    return res.status(400).json({ error: "An image with the new name already exists" })
  }

  try {
    // Rename physical file
    fs.renameSync(oldPath, newPath)

    // Update occurrences of this image URL in all posts
    const oldPathLiteral = `/uploads/${oldName}`
    const oldPathEncoded = `/uploads/${oldName.replace(/ /g, "%20")}`

    const newPathLiteral = `/uploads/${sanitizedNewName}`
    const newPathEncoded = `/uploads/${sanitizedNewName.replace(/ /g, "%20")}`

    const posts = db
      .prepare("SELECT id, content FROM posts WHERE content LIKE ? OR content LIKE ?")
      .all(`%${oldPathLiteral}%`, `%${oldPathEncoded}%`)

    const stmt = db.prepare("UPDATE posts SET content = ? WHERE id = ?")
    for (const post of posts) {
      let updatedContent = post.content.split(oldPathLiteral).join(newPathLiteral)
      updatedContent = updatedContent.split(oldPathEncoded).join(newPathEncoded)
      stmt.run(updatedContent, post.id)
    }

    res.json({
      message: "Image renamed successfully",
      filename: sanitizedNewName,
      url: `/uploads/${sanitizedNewName}`,
      updatedPostsCount: posts.length,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export function deleteImage(req, res) {
  const { filename } = req.params
  if (!filename) {
    return res.status(400).json({ error: "filename is required" })
  }

  const filePath = path.join(uploadsDir, filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Image not found" })
  }

  try {
    fs.unlinkSync(filePath)
    res.json({ message: "Image deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export function downloadImage(req, res) {
  const { filename } = req.params
  if (!filename) {
    return res.status(400).json({ error: "filename is required" })
  }

  const filePath = path.join(uploadsDir, filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Image not found" })
  }

  res.download(filePath, filename)
}
