

"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";

import { cookies } from "next/headers";
import { appwriteConfig } from "./config";

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  // Debugging cookies
  // console.log("Available cookies:", (await cookies()).getAll());


  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
    console.error("Session cookie not found:");
    throw new Error("No session");
  }

  // console.log("Session found:", session);

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