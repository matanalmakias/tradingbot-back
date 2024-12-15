import { User } from "../../db/models/user.js";

const isUserExist = async (phone, res) => {
  // check if phone is already registered
  let user = await User.findOne({ phone });
  if (user) {
    console.log(user);
    return true;
  } else {
    return false;
  }
  //----------------------------------------------------------------
};

export default isUserExist;
