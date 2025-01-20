// "use server";

// import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";

// import { cookies } from "next/headers";
// import { appwriteConfig } from "./config";

// export const createSessionClient = async () => {
//   const client = new Client()
//     .setEndpoint(appwriteConfig.endpointUrl)
//     .setProject(appwriteConfig.projectId);

//   const session = (await cookies()).get("appwrite-session");

//   if (!session || !session.value) throw new Error("No session");
// //  console.log(session,"no session created");
 
//   client.setSession(session.value);

//   return {
//     get account() {
//       return new Account(client);
//     },
//     get databases() {
//       return new Databases(client);
//     },
//   };
// };

// export const createAdminClient = async () => {
//   const client = new Client()
//     .setEndpoint(appwriteConfig.endpointUrl)
//     .setProject(appwriteConfig.projectId)
//     .setKey(appwriteConfig.SecretKey);
// //  console.log(client,"error is runing");
//   return {
//     get account() {
//       return new Account(client);
//     },
//     get databases() {
//       return new Databases(client);
//     },
//     get storage() {
//       return new Storage(client);
//     },
//     get avatars() {
//       return new Avatars(client);
//     },
//   };
// };


"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) throw new Error("No session");

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.SecretKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};