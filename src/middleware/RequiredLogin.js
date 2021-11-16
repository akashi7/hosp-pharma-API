import { verify } from "jsonwebtoken";
import { config } from "dotenv";


config();

export const isHadmin = (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
    if (err) {
      res.send({
        status: 401,
        message: 'Must login '
      });
    }
    else {
      req.hosp = decoded;
      next();
    }
  });
};

