import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token);

  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);  // <--- check what is inside
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verify error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
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
