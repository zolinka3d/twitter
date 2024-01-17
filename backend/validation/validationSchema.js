const yup = require("yup");

shapes = {
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username too short")
    .max(20, "Username too long"),
  email: yup.string().required().email(),
  password: yup
    .string()
    .required()
    .min(8, "password too short")
    .max(20, "password too long"),
};

const userSchema = yup.object().shape({
  username: shapes.username,
  email: shapes.email,
  password: shapes.password,
});

const usernameSchema = yup.object().shape({
  username: shapes.username,
});

const emailSchema = yup.object().shape({
  email: shapes.email,
});

const passwordSchema = yup.object().shape({
  password: shapes.password,
});

module.exports = { userSchema, usernameSchema, emailSchema, passwordSchema };
