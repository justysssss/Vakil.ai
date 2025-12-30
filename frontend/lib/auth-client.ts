import { createAuthClient } from "better-auth/react"

const baseURL = 
  typeof window !== "undefined"
    ? undefined
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000/"

export const authClient = createAuthClient({
  baseURL,
})

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession,
} = authClient;
