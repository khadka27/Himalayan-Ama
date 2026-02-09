  const { hash, compare } = require("bcryptjs");

  exports.hashPassword = async (value, saltValue = 12) => {
    return await hash(value, saltValue);
  };

  exports.comparePassword = async (value, hashedValue) => {
    return await compare(value, hashedValue);
  };