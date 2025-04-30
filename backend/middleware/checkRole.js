const jwt = require('jsonwebtoken');

const checkRole = (roles) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Ambil token dari header Authorization
    
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    try {
      // Verifikasi token menggunakan JWT Secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userRole = decoded.role; // Mengambil role dari decoded token

      // Cek apakah role pengguna cocok dengan role yang dibutuhkan
      if (!roles.some(role => userRole.includes(role))) {
        return res.status(403).send('Access denied. You do not have permission to access this resource.');
      }

      // Menyimpan informasi pengguna dalam request untuk digunakan di route berikutnya
      req.user = decoded;
      next(); // Melanjutkan ke route berikutnya
    } catch (err) {
      return res.status(400).send('Invalid token.');
    }
  };
};

module.exports = checkRole;
