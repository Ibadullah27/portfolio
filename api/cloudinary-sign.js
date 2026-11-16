import crypto from 'node:crypto';
import { requireAdmin } from './security.js';
export default function handler(req,res) {
  if(req.method!=='POST')return res.status(405).end();
  if(!requireAdmin(req,res))return;
  const {CLOUDINARY_CLOUD_NAME:cloudName,CLOUDINARY_API_KEY:apiKey,CLOUDINARY_API_SECRET:secret}=process.env;
  if(!cloudName||!apiKey||!secret)return res.status(503).json({error:'Cloudinary is not configured'});
  const timestamp=Math.floor(Date.now()/1000);
  const signature=crypto.createHash('sha1').update(`timestamp=${timestamp}${secret}`).digest('hex');
  return res.status(200).json({cloudName,apiKey,timestamp,signature});
}
