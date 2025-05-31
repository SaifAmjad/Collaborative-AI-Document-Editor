const { FormData } = require("openai/_shims/auto/types");
const User = require("../models/User");

const authenticate = async (req, res) => {
  const { user } = req.body;

  try {
    if (!user) {
      return res.json({ data: "The user field is empty" });
    }

    const checkUser = await User.find({ username: user.username });

    if (checkUser.length > 0) {
      
      if (checkUser[0].password != user.password) {
        return res.status(200).json({ data: "Invalid Username or Password" });
      }
      return res.status(200).json({ success: true, data: checkUser[0] });
    }

    const createUser = await User.create({
      username: user.username,
      password: user.password,
    });

    if (!createUser) {
      return res.json({ msg: "Error while creating user" });
    }

    return res.status(200).json({ success: true, data: createUser });
  } catch (error) {
    console.log(error);
    return res.json({ data: error });
  }
};



module.exports = { authenticate };
