import { isAdmin } from '../security.js';
export default function handler(req,res) { if(req.method!=='GET') return res.status(405).end(); return isAdmin(req) ? res.status(200).json({ok:true}) : res.status(401).json({ok:false}); }
