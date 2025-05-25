import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "\n MONGODB_URI dossent exist in the dotenv file, please check the token"
      );
    }

    mongoose.connection.on("connected", () =>
      console.log("Database connected Successfully")
    );

    // specifying a database name
    await mongoose.connect(`${process.env.MONGODB_URI}/Mern-Auth`);

  } catch (error) {
    console.error("\n Error occured while connecting to DataBase", error);
    process.exit(1);
  }
};

export default connectToDB;
