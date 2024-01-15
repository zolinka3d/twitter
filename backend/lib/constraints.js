let _ = {};

_.name = () => {
  const regex = /^[a-zA-Z]+$/;
  const constraints = {
    presence: {
      allowEmpty: false,
      message: "is required",
    },
    type: "string",
    format: {
      pattern: regex,
      message: "can only contain letters",
    },
  };
  return constraints;
};

_.email = () => {
  const regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
  const constraints = {
    presence: {
      allowEmpty: false,
      message: "is required",
    },
    type: "string",
    format: {
      pattern: regex,
      message: "must be a valid email address",
    },
  };
  return constraints;
};

_.password = () => {
  const constraints = {
    presence: {
      allowEmpty: false,
      message: "is required",
    },
    type: "string",
    length: {
      minimum: 8,
      message: "must be at least 8 characters long",
    },
  };
  return constraints;
};

module.exports = _;
