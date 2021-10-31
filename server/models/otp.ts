import mongoose from 'mongoose';

//Before starting the database, please create the following index using mongo shell
// db.otp.createIndex( {"createdAt": 1 } , {expireAfterSeconds: 3600} );

const otp = new mongoose.Schema(
  {
    _id: { type: String, required: [true, 'Roll number required'] },
    otp: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    counter: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('otp', otp);
