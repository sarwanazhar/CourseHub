import NextAuth, { Account, DefaultSession, Profile, Session, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { AdapterUser } from "next-auth/adapters";
import { db } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"]
  }
}

let secret = process.env.NEXTAUTH_SECRET as string

if (!process.env.NEXTAUTH_SECRET){
  secret = "dsgiusfhd342nituhfnvz"
}

const authOptions = {
  secret: secret,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile | undefined;
    }) {
      const existingUser = await db.user.findUnique({
        where: { email: user.email as string }
      });

      if (!existingUser) {
        await db.user.create({
          data: {
            email: user.email as string,
            name: user.name as string,
            imageUrl: user.image as string
          }
        });
      }

      return true;
    },
    async session({ session, user }: { session: Session; user: User | AdapterUser }) {
      const dbUser = await db.user.findUnique({
        where: { email: session.user?.email as string }
      });
      if (session.user) {
        session.user.email = dbUser?.email;
        session.user.id = dbUser?.id;
      }
      return session;
    }
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };