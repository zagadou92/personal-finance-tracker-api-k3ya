import { check } from "express-validator";

export const bookValidator = () => [
  check("isbn").exists().isString().withMessage("Invalid book ISBN"),
  check("title").exists().isString().withMessage("Invalid book title."),
  check("author").exists().isString().withMessage("Invalid book author."),
  check("publisher").optional().isString().withMessage("Invalid book publisher."),
  check("year").optional().isInt({ min: 0 }).withMessage("Invalid year."),
  check("edition").optional().isString(),
  check("format").optional().isString(),
];
