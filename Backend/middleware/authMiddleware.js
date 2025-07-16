import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Access denied, token missing' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const verifyStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can perform this action' });
  }
  next();
};

export const verifyFaculty = (req, res, next) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).json({ message: 'Only faculty can perform this action' });
  }
  next();
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized, no user found' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can perform this action' });
  }

  next();
};
