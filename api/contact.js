import { Resend } from 'resend';
export default async function handler(req,res) {
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const {name,email,message}=req.body||{};
  if(!name||!email||!message||name.length>120||message.length>5000||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:'Invalid contact form'});
  if(!process.env.RESEND_API_KEY)return res.status(503).json({error:'Email service not configured'});
  try { const resend=new Resend(process.env.RESEND_API_KEY); const {error}=await resend.emails.send({from:process.env.RESEND_FROM||'Portfolio <onboarding@resend.dev>',to:[process.env.CONTACT_TO||'ibadullahibad27@gmail.com'],replyTo:email,subject:`Portfolio message from ${name}`,text:`${message}\n\nReply to: ${email}`}); if(error)throw error; return res.status(200).json({ok:true}); }
  catch(e){console.error(e);return res.status(502).json({error:'Email could not be sent'});}
}
