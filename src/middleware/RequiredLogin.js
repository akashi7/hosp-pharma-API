import { verify } from "jsonwebtoken";
import { config } from "dotenv";


config();

export default class IsloggedIn {

  static isHospAdmin(req, res, next) {

    const token = req.headers.authorization.replace("Bearer ", "");

    verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
      if (err) {
        res.send({
          status: 401,
          message: 'Must login '
        });
      }
      else {
        if (decoded.is_hadmin !== '1') {
          res.send({
            status: 401,
            message: 'Must be hospital admin'
          });
        }
        else {
          req.hosp = decoded;
          next();
        }
      }
    });
  }

  static isPharmacyAdmin(req, res, next) {

    const token = req.headers.authorization.replace("Bearer ", "");

    verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
      if (err) {
        res.send({
          status: 401,
          message: 'Must login '
        });
      }
      else {
        if (decoded.is_phadmin !== '1') {
          res.send({
            status: 401,
            message: 'Must be pharmacy admin'
          });
        }
        else {
          req.pharma = decoded;
          next();
        }
      }
    });
  }

  static isDoctor(req, res, next) {

    const token = req.headers.authorization.replace("Bearer ", "");

    verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
      if (err) {
        res.send({
          status: 401,
          message: 'Must login '
        });
      }
      else {
        if (decoded.is_doc === '1') {
          req.doc = decoded;
          next();
        }
        else {
          res.send({
            status: 401,
            message: 'Must be doctor'
          });
        }
      }
    });
  }

  static isReceptionist(req, res, next) {
    const token = req.headers.authorization.replace("Bearer ", "");

    verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
      if (err) {
        res.send({
          status: 401,
          message: 'Must login '
        });
      }
      else {
        if (decoded.is_doc === '0') {
          req.recep = decoded;
          next();
        }
        else {
          res.send({
            status: 401,
            message: 'Must be doctor'
          });
        }
      }
    });
  }
}


