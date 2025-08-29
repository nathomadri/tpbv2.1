import mongoose from "mongoose";

const UserSchemav1 = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      max:20,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    emailConfirm: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "newsletter_user"
    },
    status: {
      type: Boolean,
      default: true
    },
    availableBalance:{
      type: Number,
      default: 0
    },
    balance:{
      type: Number,
      default: 0
    },
    ip:{
      type: Array,
    },
  },
  { timestamps: true }
);

var Userv1 = mongoose.model("Userv1", UserSchemav1);
export default Userv1;
