import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  //decoding the token
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "access denied no user token found login again",
      });
    }

    console.log("Cookies received:", req.cookies);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded token", decodedTokenInfo);

    if (decodedTokenInfo.id) {
      req.body = req.body || {};
      req.body.userId = decodedTokenInfo.id;
    }

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Access denied. Invalid or expired token.",
    });
  }
};


