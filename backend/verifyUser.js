import jwt  from "jsonwebtoken";

const auth = (role = []) => {
    return (req, res, next) => {
      const token1 = req.header('x-auth-token');
      //const token1 = authHeader && authHeader.split(' ')[1];
      //const token1 = req.header['x-auth-token']
      if (!token1) return res.status(401).json({ msg: 'No token, authorization denied' });
  
      try {
        const decoded = jwt.verify(token1, process.env.JWT_SECRET);
        req.user = decoded;
  
        if (role.length && !role.includes(req.user.role)) {
          return res.status(403).json({ msg: 'Access denied' });
        }
  
        next();
      } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
      }
    };
  };
   export default auth;