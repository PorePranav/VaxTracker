import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/app/_lib/auth';
import { getUser } from '@/app/_lib/data-service';
import { supabase } from '@/app/_lib/supabase';

export async function middleware(request: NextRequest) {
  const session = await auth();

  const authRequiredPaths = ['/children', '/immunizations', '/profile'];
  const requiresAuth = authRequiredPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (requiresAuth && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (session?.user) {
    const user = await getUser(session.user.email);
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('is_profile_complete')
        .eq('id', user.id)
        .single();

      if (
        profile?.is_profile_complete &&
        request.nextUrl.pathname.startsWith('/completeProfile')
      )
        return NextResponse.redirect(new URL('/', request.url));

      if (
        !profile?.is_profile_complete &&
        !request.nextUrl.pathname.startsWith('/completeProfile')
      ) {
        return NextResponse.redirect(new URL('/completeProfile', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
