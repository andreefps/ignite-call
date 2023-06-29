import { PrismaAdapter } from "@/src/lib/auth/prisma-adapter"
import { NextApiRequest, NextApiResponse, NextPageContext } from "next"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"
import { signIn } from "next-auth/react"

export function buildNextAuthOptions(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        authorization: {
          params: {
            scope:
              "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar",
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            avatar_url: profile.picture,
            username: "",
            email: profile.email,
            name: profile.name,
          }
        },
      }),
    ],
    callbacks: {
      async signIn({ account }) {
        if (
          !account?.scope?.includes("https://www.googleapis.com/auth/calendar")
        ) {
          return "/register/connect-calendar/?error=permissions"
        }
        return true
      },
      async session({ session, user }) {
        return { ...session, user }
      },
    },
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}
