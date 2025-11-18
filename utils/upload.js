import fs from "fs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import Pinata from "./pinata.js";

// Use memory storage so we can stream to Pinata without writing to disk
const storage = multer.memoryStorage();

// Limit size by default (10MB); callers can override by building their own multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    // Accept images and common documents (pdf)
    const allowed = ["image/", "application/pdf", "text/"];
    if (allowed.some((prefix) => file.mimetype.startsWith(prefix))) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
});

async function uploadBufferToPinata(file, { useTempFile = true } = {}) {
  // file: { buffer, originalname, mimetype }
  if (!file || !file.buffer) {
    throw new Error("No file buffer provided");
  }

  // If global File exists (Node 18+ with fetch polyfills), try to use it
  if (typeof File !== "undefined") {
    try {
      const f = new File([file.buffer], file.originalname, {
        type: file.mimetype,
      });
      const uploaded = await Pinata.upload.public.file(f);
      return uploaded;
    } catch (err) {
      // swallow and fall back to stream approach
      console.warn(
        "Pinata file upload via File failed, falling back to stream:",
        err.message
      );
    }
  }

  // Create a temporary file and pass a stream to Pinata SDK
  const tempPath = path.join(os.tmpdir(), `${uuidv4()}-${file.originalname}`);
  try {
    await fs.promises.writeFile(tempPath, file.buffer);
    const stream = fs.createReadStream(tempPath);
    // Pinata SDK accepts streams for file uploads; pass the readable stream
    const uploadResult = await Pinata.upload.public.file(stream);
    return uploadResult;
  } finally {
    // Make sure to cleanup the temp file
    if (useTempFile) {
      fs.promises.unlink(tempPath).catch(() => {});
    }
  }
}

export { upload, uploadBufferToPinata };
export default upload;
