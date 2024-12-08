import express from 'express';
import path from 'path';
import connectDb from './database';
import morgan from 'morgan';
import cors from 'cors';
import notFoundHandler from './middleware/notFoundHandler';
import errorHandler from './middleware/errorHandler';
import router from './api/x.router';
import dotenv from 'dotenv';
dotenv.config();
connectDb();
const app = express();
app.use(express.json());
app.use(cors())
app.use(morgan("dev"))


app.use('/', router);

// use if u want to see images in browser-> localhost:PORT/media/...imgUrl
// app.use("media", express.static(path.join(__dirname, "/media")))

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`The application is running on localhost:${process.env.PORT}`);
});
