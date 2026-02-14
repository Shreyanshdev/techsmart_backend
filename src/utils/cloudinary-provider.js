import { v2 as cloudinary } from 'cloudinary';

// Temporary storage to communicate between upload and after-hook
export const uploadCache = new Map();

export default class CloudinaryProvider {
    constructor() {
        this.name = 'BaseProvider';
        this.bucket = 'takesmart';
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async upload(file, key, context) {
        console.log(`[Cloudinary] Starting upload for: ${file.name} with key: ${key}`);
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'takesmart',
        });
        console.log(`[Cloudinary] Success! URL: ${result.secure_url}`);

        // Store the result in a cache so the AdminJS after-hook can pick it up
        // and save the full URL instead of the relative key.
        uploadCache.set(key, result.secure_url);

        return result.secure_url;
    }

    async delete(key, bucket, context) {
        if (!key || !key.startsWith('http')) return;
        try {
            const parts = key.split('/');
            const filename = parts[parts.length - 1];
            const publicId = filename.split('.')[0];
            await cloudinary.uploader.destroy(`takesmart/${publicId}`);
            console.log(`[Cloudinary] Deleted: ${publicId}`);
        } catch (error) {
            console.error('[Cloudinary] Delete failed:', error.message);
        }
    }

    path(key, bucket, context) {
        // If it's already a URL, return it. 
        // If it's a relative key from a fresh upload, check the cache.
        if (key && key.startsWith('http')) return key;
        return uploadCache.get(key) || key;
    }
}
