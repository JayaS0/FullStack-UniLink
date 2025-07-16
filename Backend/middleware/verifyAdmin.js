import jwt from 'jsonwebtoken';
console.log("JWT_SECRET in verifyAdmin:", process.env.JWT_SECRET);

const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token in verifyAdmin:", decoded);


    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    req.user = decoded; // pass user info downstream
        console.log("Decoded token in verifyAdmin middleware:", decoded);
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default verifyAdmin;
