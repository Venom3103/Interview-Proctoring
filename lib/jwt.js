import jwt from 'jsonwebtoken';
export function sign(payload){ return jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn:'8h' }); }
export function verify(token){ return jwt.verify(token, process.env.JWT_SECRET || 'devsecret'); }
