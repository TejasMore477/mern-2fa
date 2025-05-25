import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';


import connectToDB from './database/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';


// creating server
const app = express();
const port = process.env.PORT || 4000;

// connecting to db
connectToDB();

//
const allowedOrigins = ['http://localhost:5173']

// middlewares
app.use(express.json({
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      throw new SyntaxError('Invalid JSON');
    }
  }
}));

app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}));

// API Endpoints
app.get('/',(req,res)=>{res.send("server live")});
app.use('/api/auth',authRouter);
app.use('/api/user', userRouter);

// Error-handling middleware (must be last)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, message: 'Invalid or empty JSON payload' });
  }
  return res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
});

// listening to port
app.listen(port, ()=>{console.log("server listening to port",port);
})