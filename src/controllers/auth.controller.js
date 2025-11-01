const User = require('../models/User'); // FIXED (no braces)
const ApiError = require('../utils/ApiError'); // FIXED (no braces)
const ApiResponse = require('../utils/ApiResponse'); // FIXED (no braces)
const asyncHandler = require('../utils/asyncHandler'); // FIXED (no braces)

// --- 1. REGISTER USER ---
const registerUser = asyncHandler(async (req, res) => {
  console.log('--- 1. REGISTER USER ENTERED ---');
  const { name, email, password, role } = req.body;

  // --- Validation ---
  if (!name || !email || !password) {
    throw new ApiError(400, 'All fields (name, email, password) are required');
  }

  // --- Check for existing user ---
  console.log('--- 2. CHECKING FOR EXISTING USER ---');
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, `User with email ${email} already exists`);
  }

  // --- Create user (password will be hashed by 'pre-save' middleware) ---
  console.log('--- 3. CREATING USER ---');
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // --- Find the created user (to remove password from the response) ---
  console.log('--- 4. FINDING CREATED USER (to remove password) ---');
  const createdUser = await User.findById(user._id).select('-password');
  if (!createdUser) {
    throw new ApiError(500, 'Failed to create user');
  }

  // --- Send Response ---
  console.log('--- 5. SENDING RESPONSE ---');
  return res
    .status(201)
    .json(
      new ApiResponse(201, { user: createdUser }, 'User registered successfully')
    );
});

// --- 2. LOGIN USER ---
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // FIXED (removed typo '_')

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // --- Find user ---
  const user = await User.findOne({ email }).select('+password'); // Explicitly select password
  if (!user) {
    throw new ApiError(401, 'Invalid user credentials'); // 401 for security
  }

  // --- Check password ---
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  // --- Generate tokens ---
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // --- Save refresh token to DB ---
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false }); // Save without validations

  // --- Find user again (to remove sensitive data from response) ---
  const loggedInUser = await User.findById(user._id).select('-password');

  // --- Set options for secure, httpOnly cookies ---
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        'User logged in successfully'
      )
    );
});

// --- 3. LOGOUT USER ---
const logoutUser = asyncHandler(async (req, res) => {
  // Clear the refresh token from the database
  await User.findByIdAndUpdate(
    req.user.__id,
    {
      $unset: {
        refreshToken: 1, // Remove the refreshToken field
      },
    },
    {
      new: true,
    }
  );

  // --- Set options to clear cookies ---
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Set expiry to the past
  };

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

// Export all controller functions
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};

