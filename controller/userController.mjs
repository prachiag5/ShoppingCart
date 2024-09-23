import User from '../models/user.mjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
      const user = new User({ username, email, password });
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      req.session.token = token;
      res.redirect('/product');
  } catch (error) {
    console.log(error);
      res.status(500).send('Registration error');
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      console.log("found the user", user);
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

export const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
          return res.status(500).send('Error logging out'); // Handle error if any
        }
        res.redirect('/login');       
      });
};

