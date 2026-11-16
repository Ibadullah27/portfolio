import crypto from 'node:crypto';
import { secret, sign } from '../security.js';
export default function handler(req,res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const password = req.body?.password || '';
  const expected = secret('ADMIN_PASSWORD');
  const a=Buffer.from(password), b=Buffer.from(expected);
  if (a.length!==b.length || !a.length || !crypto.timingSafeEqual(a,b)) return res.status(401).json({error:'Invalid credentials'});
  const expiry=String(Date.now()+1000*60*60*12);
  res.setHeader('Set-Cookie',`admin_session=${expiry}.${sign(expiry)}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=43200`);
  return res.status(200).json({ok:true});
}
