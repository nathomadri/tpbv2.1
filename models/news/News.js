import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    original_url: { type: String, required: true },
    categories: { type: [Number], default: [] },
    published_at: { type: Date, required: true },
    posted: { type: Boolean, default: false } 
});

const Post = mongoose.model('Post', postSchema);

export default Post;
