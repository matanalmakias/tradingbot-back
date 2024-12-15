import { body, validationResult } from "express-validator";

const validateRegistration = [
  body("name").isString().withMessage("Name must be a string"),
  body("phone").isMobilePhone().withMessage("Invalid phone number"),
  body("address.city").isObject().withMessage("Address must be a object"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
export default validateRegistration;
