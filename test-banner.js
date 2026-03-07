import mongoose from 'mongoose';
import Banner from './src/models/banner.js';
mongoose.connect('mongodb://127.0.0.1:27017/takesmart');
const banners = await Banner.find({});
console.log(JSON.stringify(banners, null, 2));
process.exit(0);
