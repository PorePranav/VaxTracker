import NextAuth, { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { getUser, createUser } from './data-service';

declare module 'next-auth' {
  interface Session {
    user: {
      userId: string;
      role: string;
    };
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingUser = await getUser(user.email!);
        if (!existingUser)
          await createUser({ email: user.email!, name: user.name! });
        return true;
      } catch {
        return false;
      }
    },
    async session({ session, user }) {
      const fetchedUser = await getUser(session.user.email);
      if (fetchedUser) {
        session.user.userId = fetchedUser.id!;
        session.user.role = fetchedUser.role!;
      } else {
        session.user.userId = '';
        session.user.role = 'parent';
      }

      return session;
    },
  },
  // pages: {
  //   signIn: '/login',
  // },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
