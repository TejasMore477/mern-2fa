import userModel from "../models/userModel.js";

export const getUserDataController = async (req, res) => {
  try {
    console.log(req.body);
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required",
      });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "usr data",
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.error("error getting user data", error.message);
    return res.status(500).json({
      success: false,
      message: "error getting user data",
    });
  }
};
