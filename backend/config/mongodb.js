import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Databse is connected!!!");
  });
  mongoose.connection.on("error", (err) => {
    console.log(`Mongoose connection error: ${err}`);
  });
  await mongoose.connect(`${process.env.MONGODB_URI}/easyjudge`);
};
export default connectDB;
