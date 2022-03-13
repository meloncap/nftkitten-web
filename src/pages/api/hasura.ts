// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { reloadUpstream } from '../../services/reloadUpstream';

type Data = {
  success: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
   try {
      if (req.headers['x-api-key'] !== process.env.WEBHOOK_API_KEY) {
         return;
      }
      
      console.log(req.body);
      const { type, payload } = req.body;
      switch (type) {
         case "RELOAD_UPSTREAM":
            await reloadUpstream(payload);
            res.json({ success: true });
            break;
      }
   } catch (ex) {
      console.error(ex);
   }
   res.status(401).json({ error: "Unauthorized Access" } as any);
}
