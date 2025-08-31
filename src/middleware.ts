
import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export async function middleware(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const res = NextResponse.next();
    
    // Capture UTM parameters
    const utmKeys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'];
    const updates: Record<string,string> = {};
    
    for (const k of utmKeys) {
      const v = url.searchParams.get(k);
      if (v) updates[k] = v;
    }
    
    if (Object.keys(updates).length) {
      const cookie = { ...updates, ts: Date.now() };
      res.cookies.set('utm_params', Buffer.from(JSON.stringify(cookie)).toString('base64'), { 
        maxAge: 60*60*24*90, 
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      return res;
    }
    
    // Experiment: hero variant
    const hasHero = req.cookies.get('exp_hero');
    if (!hasHero) {
      try {
        const variant = await get('exp_hero');
        const v = (variant === 'b' ? 'b' : 'a');
        res.cookies.set('exp_hero', v, { 
          maxAge: 60*60*24*30, 
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
      } catch {
        // Edge Config not available, use default
      }
    }
    
    return res;
  } catch (error) {
    // On any error, pass through the request without modification
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Match all paths except:
    // - API routes that need raw body (webhooks)
    // - Static files
    // - Image optimization files
    // - Favicon
    '/((?!api/stripe/webhook|api/calendly/webhook|_next/static|_next/image|favicon.ico).*)',
  ],
};
