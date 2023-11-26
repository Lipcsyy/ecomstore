import { prisma } from '../../../../prisma/shared-client';
import bcrypt from 'bcrypt'

export async function POST( req: Request  ) {

    const body = await req.json();
    const { data } = body;
    const {name, email, password} = data;

    //check if email, password or name is not missing
    if ( !name || !email || !password ) 
        return new Response("Missing name, email or password", { status: 400})

    const hashedPassword = await bcrypt.hash( password, 12 );

    //TODO: checking uniquesness

    const user = await prisma.user.create( {
        data: {
            name: name,
            email:email,
            hashedPassword: hashedPassword
        }
    })

    return new Response(JSON.stringify(user))
}   
