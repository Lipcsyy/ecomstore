import { PrismaClient } from "@prisma/client"
import type { PrismaClient as PrismaClientType } from '@prisma/client'

declare global {
    namespace globalThis {
      interface Global {
        prisma: PrismaClient;
      }
    }
  }

let prisma : PrismaClientType;

if ( process.env.NODE_ENV == "production" ) {
    prisma = new PrismaClient();
} else {

    let globalWithPrisma = global as typeof globalThis & {
        prisma :PrismaClient;
    }; // the & makes sure that the globalWithPrisma has both properties of global type and prisma: PrismaClient

    if ( !globalWithPrisma.prisma ) {
        globalWithPrisma.prisma = new PrismaClient();
    }

    prisma = globalWithPrisma.prisma;

}

export { prisma } 