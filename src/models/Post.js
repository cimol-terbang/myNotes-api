import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
    unique: true,
  },

  content: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: ["essay", "poem", "story"],
    required: true,
  },

  tags: {
    type: [String],
    default: [],
  },

  isPublished: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Post = mongoose.model("Post", postSchema)

export default Post