import User from '../models/user-model.js';

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('email displayName profilePicture');
    if (!user) {
      return res.status(404).json({ message: 'error' });
    }
    return res.status(200).json({user: user, message: 'success'});
  } catch (err) {
    res.status(500).json({ error: err.message, message:'error' });
  }
}

const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.find({'email': email});
    if (user.length === 0) {
      return res.status(404).json({ message: 'error' });
    }
    return res.status(200).json({user: user, message: 'success'});
  } catch (err) {
    res.status(500).json({ error: err.message, message:'error' });
  }

}

export {
  getUserById,
  getUserByEmail
};