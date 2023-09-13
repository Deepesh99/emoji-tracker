const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../schema/user');

/**
 * This function is used for user registration
 * @param {*} req - takes name, password and userName from request body
 * @param {*} res 
 * @returns success/failure response based on result of user creation in db
 */
exports.register = async (req, res) => {
  const { name, password, userName } = req.body;

  try {
    const user = await User.findOne({ where: { userName } });

    console.log(user);
    if (user) {
      return res
        .status(401)
        .json({ status: false, message: 'User already exists in databse' });
    }

    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      password: hashedPassword,
      userName,
    });

    return res
      .status(200)
      .json({ status: true, message: 'Registration Success' });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ status: false, message: 'Server Error' });
  }
};

/**
 * 
 * @param {*} req - takes userName an password from request body
 * @param {*} res 
 * @returns jwt token on success
 */
exports.login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ where: { userName } });
    const validUser = await bcrypt.compare(password, user.password);

    if (user && validUser) {
      // create jwt tokens
      // scret is used to create hash. TODO: encrypt secret
      const secret = 'thisisjwttoken12345';

      // token will have userid and expire in 30days
      const token = jwt.sign({ userName }, secret, { expiresIn: '7 days' });
      return res
        .status(200)
        .json({ status: true, message: 'Login Success!!', token });
    }

    return res
      .status(401)
      .json({ status: false, message: 'Email or Password is incorrect' });
  } catch (err) {
    return res.status(401).json({ status: false, message: 'Server Error' });
  }
};
