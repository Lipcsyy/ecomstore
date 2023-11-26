import { PrismaAdapter } from "@next-auth/prisma-adapter/dist";
import NextAuth, { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "../../../../../prisma/shared-client";
import bcrypt from 'bcrypt'
import { encode, decode } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },    
    providers: [
        CredentialsProvider({
            name: "Sign In",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@test.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize ( credentials: any ) : Promise<any> {

                //check to see if email and password is valid
                if ( !credentials.email || !credentials.password ) {
                    return null;
                }
                
                //check if the user exists
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    }
                });

                if ( !user ) {
                    return null;
                }
                
                //check if the password matches the user's password
                const passwordsMatch = await bcrypt.compare( credentials.password, user.hashedPassword );

                if ( passwordsMatch == false ) {
                    return null;
                }

                //everything is okay, we can return the user
                
                return user;

            }
        })
    ],
    callbacks: {
       async jwt({ token, user, session, trigger }) { 

            //it get's triggered on a change and the whole code runs again and now the database updtae
            if ( trigger === "update" && session?.name ) {
                token.name = session?.name; //setting the name in the token
            }

            if ( user )  { // this gets called in the sing in, because it gets the user from the authorite function, we put here the id and the isNewUser inside the token and it returns
                return {
                    ...token,
                    id: user.id,
                    isNewUser: user.isNewUser,
                };
            }  //when a new signin happens we return from this


            //update the database
            const newUser = await prisma.user.update( {
                where : {
                    id: token.id as string,
                },
                data: {
                    name : token.name
                }
            })
            
            return token;
       },
       async session({ session, token, user }) {

            //pass user id and isNewUser to the session callback
            return {
                ...session,
                user : {
                    ...session.user,
                    id: token.id,
                    isNewUser: token.isNewUser,
                    name : token.name // it is passed from the jwt callback
                }
            }
       },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug : process.env.NODE_ENV == "development",
    pages : {
        signIn : "/login",
        newUser : "/onboard"
    },

}

const handler = NextAuth(authOptions);
export { handler as POST, handler as GET }
