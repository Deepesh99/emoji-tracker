const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const User = require('../schema/user');

exports.register = async (req, res) => {
  const {
    name, password, userName,
  } = req.body;

  try {
    
    const user = await User.findOne({ where: { userName } });

    console.log(user);
    if (user) {
      return res.status(401).json({ status: false, message: 'User already exists in databse' });
    }

    
    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    const newUser = await User.create({
      name,
      password: hashedPassword,
      userName
    });

    return res.status(200).json({ status: true, message: 'Registration Success' });
  } catch (err) {
      console.log(err);
    return res.status(401).json({ status: false, message: 'Server Error' });
  }
};

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await UserAuth.findOne({ where: { email } });
//     const validUser = await bcrypt.compare(password, user.password);

//     if (user && validUser) {
//       // create jwt tokens
//       // scret is used to create hash. TODO: encrypt secret
//       const secret = 'thisisjwttoken12345';

//       // token will have userid and expire in 30days
//       const token = jwt.sign({ userid: user.id }, secret, { expiresIn: '7 days' });
//       return res.status(200).json({ status: true, message: 'Login Success!!', token });
//     }

//     return res.status(401).json({ status: false, message: 'Email or Password is incorrect' });
//   } catch (err) {
//     return res.status(401).json({ status: false, message: 'Server Error' });
//   }
// };
