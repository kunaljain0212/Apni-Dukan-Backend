import './config/env';
import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import categoryRoutes from './routes/category';
import productRoutes from './routes/product';
import paymentRoutes from './routes/payment';

// DB connection
mongoose
  .connect(
    process.env.ENVIRONMENT === 'localhost'
      ? process.env.DATABASE_DOCKER
      : process.env.DATABASE,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log('DB CONNECTED');
  })
  .catch((err) => {
    console.log(err);
  });

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// My Routes

app.get('/', (req, res) => {
  res.status(200).json({
    message: `Server is up and running on port ${process.env.PORT || 8000}`,
  });
});
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', paymentRoutes);

// Port
const port = process.env.PORT || 8000;

// Starting the server
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
