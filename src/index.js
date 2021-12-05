import express, { json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';

//routes

import authRouter from './routes/authRoutes';
import hospRouter from './routes/HospRoutes';
import pharmaRouter from './routes/pharmaRoutes';
import docRouter from './routes/doctorRoutes';

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(morgan("dev"));
app.use(json());

app.use(urlencoded({ extended: false }));

app.use("/api/auth", authRouter);
app.use("/api/hospital", hospRouter);
app.use("/api/pharma", pharmaRouter);
app.use("/api/doc", docRouter);



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
