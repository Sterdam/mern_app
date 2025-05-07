import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Check for token in cookies first (preferred), then in header
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }

    // Add additional check for token expiry
    const now = Math.floor(Date.now() / 1000);
    if (verified.exp && verified.exp < now) {
      return res.status(401).json({ message: 'Token expired, please login again' });
    }

    req.user = verified.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

export default auth;