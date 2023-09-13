const jwt = require('jsonwebtoken');

exports.authorization = (req, res, next) => {
  // TODO: encrypt secret
  const secret = 'thisisjwttoken12345';

  try {
    const authToken = req.headers.token;
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
