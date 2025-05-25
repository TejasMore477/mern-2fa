// imports
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const registerController = async (req, res) => {
  // get the user info from req.body
  // check if all the fields are complete filled
  // check if user already exists?
  // hash the password
  // register the new user in the db
  // generate a token
  // save the token in cooke

  try {
    if (!process.env.JWT_SECRET || !process.env.SENDERS_EMAIL) {
      throw new Error(
        "Missing environment variables: JWT_SECRET or SENDERS_EMAIL"
      );
    }

    // get the user info from req.body
    const { name, email, password } = req.body;

    // check if all the fields are complete filled
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "name, email, password fields are required to complete registeration",
      });
    }

    // check if user already exists?
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with following credentials already Exists",
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // register the new user in the db
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "error occured while registering new user to db after hashing",
      });
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log(token, " \n token from authCointroller");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days in milisec
    });

    // console.log(process.env.SENDERS_EMAIL,"mail**************************");

    //sending welcome mail
    const mailOptions = {
      from: process.env.SENDERS_EMAIL,
      to: email,
      subject: "Welcome here",
      html: `<h3>Welcome to our platform, ${name}!</h3><p>Thanks for signing up with ${email}. We're glad to have you!</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      newUser,
      token,
    });
  } catch (error) {
    console.error("\n Error occured while registering the user : ", error);

    res.status(500).json({
      success: false,
      message: "internal server error occured while registering user",
      //   data: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  // get the user info from req.body
  // check if all the fields are complete filled
  // check if user already exists?
  // checking the password  --bcrypt.compare
  // creating bearer token using jwt.sign
  // send the brearer token back to frontend using response
  // and save in the cache

  try {
    // get the user info from req.body
    const { email, password } = req.body;

    // check if all the fields are complete filled
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "email and password fields are required to complete registeration",
      });
    }

    // check if user already exists?
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with following credentials does not Exists",
      });
    }

    // checking the password
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "User does not exist in DB for these credentials",
      });
    }

    // creating bearer token
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log(token, "\n token from authCointroller login");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days in milisec
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error("\n Error occured while  loging-in the user : ", error);

    res.status(500).json({
      success: false,
      message: "internal server error occured while loging-in user",
      data: error.message,
    });
  }
};

export const logOutController = async (req, res) => {
  // clear the cookied token from users cookie

  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "loged out succussfull",
    });
  } catch (error) {
    console.error("\n Error occured while loging-out the user : ", error);

    res.status(500).json({
      success: false,
      message: "internal server error occured while loging-out user",
    });
  }
};

export const sendVerifyOtpController = async (req, res) => {
  //get userId from req.body from token
  //find the user in the databse
  // checck if user account s verified
  // if not then generate otp using math.random
  // add generated otp to user database
  // add otp expire time to user databse
  // save the user
  // send the otp to mail
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "no user found",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "user already verified",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.verifyOtp = hashedOtp;

    console.log(Date.now(), "**********now date time");

    user.verifyOptExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDERS_EMAIL,
      to: user.email,
      subject: "account verification",
      text: `otp :: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "verificcation mail sent sucessfully",
    });
  } catch (error) {
    console.error("\n Error occured while verifying the user : ", error);

    res.status(500).json({
      success: false,
      message: "internal server error occured while verifying user",
    });
  }
};

export const verifyEmailController = async (req, res) => {
  // get otp and userid from user input and token
  // find the user in db from id
  // check user exists
  // if yes then check the otp matches and is not expired
  // if all good then set isAccount verified true , verifyOtp to an empty sting and oth expires at to 0
  // save the changes in db
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "missing details",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    console.log("\n verifyOtpExpireAt:", user.verifyOtpExpireAt);
    console.log("\n Now:", Date.now());
    console.log("\n Is expired?", user.verifyOtpExpireAt < Date.now());

    if (user.verifyOptExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const isMatch = await bcrypt.compare(otp, user.verifyOtp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "invalid otp",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOptExpireAt = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "verificcation sucessfully",
    });
  } catch (error) {
    console.error("\n Error occured while verifying the user : ", error);

    res.status(500).json({
      success: false,
      message: "internal server error occured while verifying user",
    });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    console.error("\n Error occured while isAuth the user : ", error);

    res.status(500).json({
      success: false,
      message: "internal server error occured while isAuth user",
    });
  }
};

export const sendResetOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email required",
      });
    }
    const user = await userModel.findOne({email});
    if(!user){
              return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.resetOtp = hashedOtp;

    console.log(Date.now(), "**********now date time");

    user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDERS_EMAIL,
      to: user.email,
      subject: "reset otp",
      text: `resert password by otp :: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "reset paswword mail sent sucessfully",
    });

  } catch (error) {
    console.error("reset pass otp error", error.message);
    return res.status(500).json({
      success: false,
      message: "error accured whule sending opt for password reset",
    });
  }
};

export const resetPasswordController = async (req,res) => {
try {
    const {email,otp,newPassword} = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "missing details",
      });
    }

    const user = await userModel.findOne({email});

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    console.log("\n resetOtpExpireAt:", user.resetOtpExpireAt);
    console.log("\n Now:", Date.now());
    console.log("\n Is expired?", user.resetOtpExpireAt < Date.now());

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const isMatch = await bcrypt.compare(otp, user.resetOtp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "invalid otp",
      });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "passwore changed sucessfully",
    });

} catch (error) {
        console.error("reset pass  error", error.message);
    return res.status(500).json({
      success: false,
      message: "error accured whule  password reset",
    });
}
};
