import express from 'express'
import { UserModel } from '../models/userModel.js'
import bcrypt from 'bcrypt'
import  jwt  from 'jsonwebtoken'
import dotenv from 'dotenv'
import auth from '../verifyUser.js'
dotenv.config()

const userRouter = express()
userRouter.post('/register', async(req, res) => {
    
    try{
        const { email, username, password, role} = req.body
        if(!username || ! email || ! password)
            return res.status(400).json({message: 'please send required fields'})
        const exist = await UserModel.findOne({email})
        if(exist) return res.status(400).json({message: 'user already exist'})
        const hashedPassword = bcrypt.hashSync(password, 10)
        const newUser = new UserModel({username, email, password: hashedPassword, role })
        await newUser.save()
        const token1 = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token1, user: { id: newUser._id, username, email, role }, message: "sucess" });
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
    
})
// login
userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User does not exist' });
  
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const token1 = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token1, user: { id: user._id, username: user.username, email: user.email, role: user.role }, msg: 'login with success' });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  });
  // get user profile
  userRouter.get('/profile/:_id', auth(), async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  });
export default userRouter;