import User from '../models/user.mjs';
import jwt from 'jsonwebtoken';


// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// export const registerUser = async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     // Check if user already exists
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create new user
//     const user = await User.create({ username, email, password });

//     // Respond with user data and JWT
//     res.status(201).json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });

//     // Check if user exists and password matches
//     if (user && await user.matchPassword(password)) {
//       res.json({
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         token: generateToken(user._id),
//       });
      
//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
      const user = new User({ username, email, password });
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      req.session.token = token;
      res.redirect('/product');
  } catch (error) {
      res.status(500).send('Registration error');
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      //console.log("valid user", user);
      if (!user || !user.matchPassword(password)) {
          return res.status(400).send('Invalid credentials');
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      req.session.token = token;
      console.log("session token", token, req.session.token);
      res.redirect('/product');
  } catch (error) {
      res.status(500).send('Login error');
  }
};

