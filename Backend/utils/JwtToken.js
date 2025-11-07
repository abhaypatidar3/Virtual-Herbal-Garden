// utils/JwtToken.js
export const sendToken = (userDoc, statusCode, res, message) => {
  // Create token using model method
  const token = userDoc.getJWTToken();

  // Ensure COOKIE_EXPIRE is a number (days). default: 7 days
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;
  const expires = new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000);

  const cookieOptions = {
    expires,
    httpOnly: true,
    // secure cookie in production (requires https)
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };

  // Sanitize user object before sending (remove password)
  let user = userDoc;
  try {
    // If it's a Mongoose document, convert to plain object
    if (typeof userDoc.toObject === "function") {
      user = userDoc.toObject();
    } else {
      user = { ...userDoc };
    }
    if (user.password) delete user.password;
  } catch (err) {
    // fallback: don't block response if sanitization fails
    user = { id: userDoc._id, email: userDoc.email, username: userDoc.username, role: userDoc.role };
  }

  return res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      user,
    });
};
