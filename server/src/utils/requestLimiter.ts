import rateLimit from "express-rate-limit";

const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes"
});

const authRequestLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 1 minutes
    max: 5,
    message: "Too many requests from this IP, please try again after 15 minutes"
});

export { requestLimiter, authRequestLimiter };