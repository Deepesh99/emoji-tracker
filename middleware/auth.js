require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * This is a middleware that ensures user is logged in before performing any action
 * @param {*} req - user jwt token from headers
 * @param {*} res 
 * @param {*} next - goes to next controller function in flow
 * @returns  response error if user is not logged in or token is expired
 */
exports.authorization = (req, res, next) => {

  const secret = process.env.SECRET;

  try {
    const authToken = req.headers.token;

    // return the request if user is not logged in
    if (authToken === undefined) {
      return res.status(401).json({ status: false, message: 'Please login' });
    }
    const tokenData = jwt.verify(authToken, secret);

    // exp data from token is in UNIX timestanp so need to convert Date.now to same format.
    if (tokenData.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ status: false, message: 'Login expired' });
    }
    res.locals.userName = tokenData.userName;
    console.log(res.locals.userName);
    return next();
  } catch (err) {
    return res.status(401).json({ status: false, message: `${err.name}` });
  }
};
