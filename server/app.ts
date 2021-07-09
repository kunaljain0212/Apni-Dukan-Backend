import './config/env';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import categoryRoutes from './routes/category';
import productRoutes from './routes/product';
import paymentRoutes from './routes/payment';

export const app = express();

// Middlewares
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// DB connection
const URI: string | undefined =
  process.env.NODE_ENV === 'development' ? process.env.DATABASE_DOCKER : process.env.DATABASE;

mongoose
  .connect(URI as string, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB CONNECTED');
  })
  .catch((err) => {
    console.log(err);
  });

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
  console.log(`Server is up running on port ${port}🚀`);
});
