const user = require("../models/user");


exports.createUserServices = async (data) => {
  const userData = await user.create(data);
  return userData;
};
