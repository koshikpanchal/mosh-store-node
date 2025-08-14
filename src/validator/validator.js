const validator = require("validator");

function validateSignupData(req) {
  const { firstName, lastName, email, password } = req.body;
  if (firstName.length > 50 || firstName.length < 4) {
    throw new Error("First name not valid");
  } else if (lastName.length > 50 || lastName.length < 4) {
    throw new Error("Last name not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("email id is not valid");
    //   } else if (!validator.isStrongPassword(password)) {
    //     throw new Error("password is not strong enough");
  }
}

function validateEditRequestData(req) {
  const allowedFields = ["firstName", "lastName", "email"];

  return Object.keys(req.body).every((field) => allowedFields.includes(field));
}

module.exports = {
  validateSignupData,
  validateEditRequestData,
};
