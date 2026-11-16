import crypto from 'node:crypto';
export function secret(name) { const value = process.env[name]; if (!value) throw new Error(`${name} is not configured`); return value; }
export function sign(value) { return crypto.createHmac('sha256', secret('ADMIN_SESSION_SECRET')).update(value).digest('hex'); }
export function isAdmin(req) { const raw = req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('admin_session='))?.slice('admin_session='.length); if (!raw) return false; const [expiry, mac] = raw.split('.'); if (!expiry || Number(expiry) < Date.now() || !mac) return false; const expected=Buffer.from(sign(expiry)); const actual=Buffer.from(mac); return expected.length===actual.length && crypto.timingSafeEqual(expected,actual); }
export function requireAdmin(req,res) { if (isAdmin(req)) return true; res.status(401).json({error:'Unauthorized'}); return false; }
