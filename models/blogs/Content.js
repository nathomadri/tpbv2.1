import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    _id: { type: String, required: true }, // Sanity document _id

    title: { type: String, required: true },

    slug: {
      current: { type: String, required: true },
    },

    mainImage: {
      alt: { type: String },
      asset: {
        url: { type: String, required: true },
      },
    },

    publishedAt: { type: Date, required: true },

    author: { type: String }, // optional, resolved from Sanity reference

    body: { type: Array, default: [] }, // PortableText content array
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", blogSchema);
export default Content;
