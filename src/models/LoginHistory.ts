import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILoginHistory extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  ipAddress: string;
  device: string;
  userAgent: string;
  loginTime: Date;
}

const loginHistorySchema = new Schema<ILoginHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    ipAddress: { type: String, required: true },
    device: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: { createdAt: "loginTime", updatedAt: false },
  }
);

const LoginHistory: Model<ILoginHistory> =
  mongoose.models.LoginHistory || mongoose.model<ILoginHistory>("LoginHistory", loginHistorySchema);

export default LoginHistory;
