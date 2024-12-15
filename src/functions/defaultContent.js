import dotenv from "dotenv";
import pkg from "bcryptjs";
const { hash } = pkg;

const saltRounds = 10;

dotenv.config();
export const defaultContent = async () => {
  //  Default Settings ------------------
  // await createDefaultSettings();
};
