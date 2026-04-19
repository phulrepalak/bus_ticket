import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const checkout = asyncHandler(async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  
  try {
    const order = await instance.orders.create(options);
    return res.status(200).json(new ApiResponse(200, order, "Checkout initialised"));
  } catch (error) {
    throw new ApiError(500, "Razorpay Error");
  }
});