# Cloudinary Image Upload - Setup Guide

This guide explains the Cloudinary integration fixes that were made to your backend.

---

## 🛠️ What Was Fixed

### 1. Moved Cloudinary Config File
**Problem:** The Cloudinary configuration file was in the wrong folder (`controllers/` instead of `config/`).

**Fix:** Moved `controllers/cloudinary.js` → `config/cloudinary.js`

**Why:** Configuration files should be in a `config` folder to keep the project organized.

---

### 2. Fixed .env File Spaces
**Problem:** Some lines in `.env` had spaces around the `=` sign:
```
CLOUDINARY_API_KEY = "771143771639871"  ❌
```

**Fix:** Removed the spaces:
```
CLOUDINARY_API_KEY="771143771639871"  ✅
```

**Why:** Spaces can cause the values to be read incorrectly.

---

### 3. Fixed File Name Typos
**Problem:** Some imports used wrong file names:
- `uploadController` instead of `uploadControllers`
- `uploadRoutes` instead of `uploadRoute`

**Fix:** Corrected the import paths in:
- `routes/uploadRoute.js`
- `index.js`

**Why:** JavaScript is case-sensitive and exact with file names.

---

### 4. Fixed Upload Function Logic
**Problem:** The upload function mixed `await` with callback incorrectly:
```javascript
const result = await cloudinary.uploader.upload_stream(...); // Wrong
result.end(req.file.buffer);
```

**Fix:** Removed `await` and chained `.end()` directly:
```javascript
cloudinary.uploader.upload_stream(...).end(req.file.buffer); // Correct
```

**Why:** `upload_stream()` returns a stream, not a Promise. You don't use `await` with it.

---

### 5. Added Image File Validation
**Problem:** Users could upload any file type (PDF, videos, etc.).

**Fix:** Added a filter in `middleware/uploadMiddleware.js`:
```javascript
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);  // Allow image
  } else {
    cb(new Error("Only image files are allowed"), false);  // Reject others
  }
};
```

**Why:** Only images should be uploaded to Cloudinary for this feature.

---

## 📁 Final File Structure

```
backend/
├── config/
│   └── cloudinary.js       ← Cloudinary settings
├── controllers/
│   └── uploadControllers.js ← Upload logic
├── middleware/
│   └── uploadMiddleware.js  ← File validation (5MB, images only)
├── routes/
│   └── uploadRoute.js       ← Upload endpoint
├── index.js                 ← Main server file
└── .env                     ← Environment variables
```

---

## 🚀 How to Use

### 1. Start the Server
```bash
npm start
```

### 2. Upload an Image
Send a POST request to:
```
POST http://localhost:5000/api/upload
```

**Body (form-data):**
- Key: `image`
- Value: Select an image file

### 3. Response
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "https://res.cloudinary.com/...",
  "public_id": "hackathon_uploads/xyz123"
}
```

---

## 📋 File Limits

| Setting | Value |
|---------|-------|
| Max File Size | 5 MB |
| Allowed Types | Images only (jpg, png, gif, webp, etc.) |
| Upload Folder | `hackathon_uploads` |

---

## 🔐 Security Notes

- Never share your `.env` file (contains API keys)
- Add `.env` to `.gitignore` (already done)
- Consider adding authentication to upload routes

---

## ✅ Summary

All fixes are complete. Your Cloudinary upload feature should now work correctly!
