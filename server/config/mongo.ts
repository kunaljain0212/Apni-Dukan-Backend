import mongoose from 'mongoose';

// DB connection
const URI: string | undefined =
  process.env.NODE_ENV === 'development' ? process.env.DATABASE_DOCKER : process.env.DATABASE;

export default async (): Promise<any> => {
  try {
    await mongoose.connect(URI as string, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB!');
  } catch (error) {
    console.log('Error connecting to DB: ', error);
  }
};
