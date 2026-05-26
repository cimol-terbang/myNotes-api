import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

/**
 * Returns the absolute path to the uploads directory.
 * Uses environment variable UPLOADS_DIR if set; otherwise falls back to a directory
 * named 'uploads' located alongside the backend root.
 */
export function getUploadsDir() {
  const envDir = process.env.UPLOADS_DIR;
  if (envDir) {
    const resolved = path.resolve(envDir);
    // Ensure folder exists
    if (!fs.existsSync(resolved)) {
      fs.mkdirSync(resolved, { recursive: true });
    }
    return resolved;
  }
  // Default: <projectRoot>/uploads (relative to this file's location)
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const defaultDir = path.resolve(__dirname, '../../uploads');
  if (!fs.existsSync(defaultDir)) {
    fs.mkdirSync(defaultDir, { recursive: true });
  }
  return defaultDir;
}
