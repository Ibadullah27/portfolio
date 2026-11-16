import { db } from './firebase.js';
import { requireAdmin } from './security.js';
export default async function handler(req,res) {
  try {
    const store=db().collection('posts');
    if(req.method==='GET') {
      const includeAll=req.query?.all==='1' && requireAdmin(req,res); if(req.query?.all==='1'&&!includeAll)return;
      const snap=await store.orderBy('createdAt','desc').get();
      return res.status(200).json(snap.docs.map(d=>({id:d.id,...d.data()})).filter(p=>includeAll||p.published));
    }
    if(req.method==='POST') {
      if(!requireAdmin(req,res))return;
      const {title,excerpt,content,cover='',published=false}=req.body||{};
      if(!title?.trim()||!excerpt?.trim()||!content?.trim())return res.status(400).json({error:'Title, excerpt and content are required'});
      const now=new Date().toISOString(); const doc=await store.add({title:title.trim(),excerpt:excerpt.trim(),content:content.trim(),cover,published:Boolean(published),date:now.slice(0,10),createdAt:now});
      return res.status(201).json({id:doc.id});
    }
    return res.status(405).json({error:'Method not allowed'});
  } catch(error) { console.error(error); return res.status(500).json({error:'Blog service is not configured'}); }
}
