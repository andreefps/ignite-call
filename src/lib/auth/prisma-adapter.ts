import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'
import { parseCookies, destroyCookie } from 'nookies'

export function PrismaAdapter(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res']
): Adapter {
  return {
    async createUser(user) {
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req })

      if (!userIdOnCookies) {
        throw new Error('User ID not present on cookie')
      }

      const prismaUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })
      destroyCookie({ res }, '@ignitecall:userId', {
        path: '/',
      })

      return {
        id: prismaUser?.id,
        avatar_url: prismaUser?.avatar_url!,
        email: prismaUser?.email!,
        name: prismaUser?.name,
        emailVerified: null,
        username: prismaUser?.username,
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })
      if (!user) return null
      return {
        id: user?.id,
        avatar_url: user?.avatar_url!,
        email: user?.email!,
        name: user?.name,
        emailVerified: null,
        username: user?.username,
      }
    },
    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })
      if (!user) return null
      return {
        id: user?.id,
        avatar_url: user?.avatar_url!,
        email: user?.email!,
        name: user?.name,
        emailVerified: null,
        username: user?.username,
      }
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_id_provider_account_id: {
            provider_account_id: providerAccountId,
            provider_id: provider,
          },
        },
        include: { user: true },
      })

      if (!account) {
        return null
      }
      const { user } = account
      return {
        id: account?.id,
        avatar_url: user?.avatar_url!,
        email: user?.email!,
        name: user?.name,
        emailVerified: null,
        username: user?.username,
      }
    },
    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name: user?.name,
          email: user?.email,
          avatar_url: user?.avatar_url,
        },
      })
      return {
        id: prismaUser?.id,
        avatar_url: prismaUser?.avatar_url!,
        email: prismaUser?.email!,
        name: prismaUser?.name,
        emailVerified: null,
        username: prismaUser?.username,
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          provider_type: account.type,
          provider_id: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          access_token_expires: new Date(account.expires_at!),
          id: String(account.id_token),
        },
      })
    },
    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          session_token: sessionToken,
          expires: expires,
          user_id: userId,
          access_token: sessionToken,
        },
      })
      return {
        sessionToken,
        userId,
        expires,
      }
    },
    async getSessionAndUser(sessionToken) {
      const session = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: { user: true },
      })
      if (!session) return null
      const { user } = session
      return {
        session: {
          expires: session.expires,
          sessionToken: session.session_token,
          userId: session.user_id,
        },
        user: {
          id: user?.id,
          avatar_url: user?.avatar_url!,
          email: user?.email!,
          name: user?.name,
          emailVerified: null,
          username: user?.username,
        },
      }
    },
    async updateSession({ sessionToken, expires, userId }) {
      const prismaSession = await prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        data: {
          user_id: userId,
          expires: expires,
        },
      })
      return {
        userId: prismaSession.user_id,
        sessionToken: prismaSession.session_token,
        expires: prismaSession.expires,
      }
    },
    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: { session_token: sessionToken },
      })
    },
  }
}
