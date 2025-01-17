"use server";

import { ID, Query } from "node-appwrite";
import {  createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { avatarPlaceholderUrl } from "@/constants";

 // Ensure you are importing Query if you are using it.

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();
    
    const result = await databases.listDocuments(
        appwriteConfig.databaseId, 
        appwriteConfig.usersCollectionId, 
        [Query.equal("email", [email])],
    );

    return result.total > 0 ? result.documents[0] : null;
};


const handleError = (error:unknown,message:string) =>{
    console.log(error,message);
    throw error;
}

export const sendEmailOTP = async ({email}: {email:string}) =>{
    const {account} = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(),email);
        return session.userId;
       
    } catch(error){
        handleError(error,"Failed to send email OTP")
    }
}

export const createAccount = async ({
    fullName,
    email,
} : {
 fullName:string;
 email:string;
}) =>{
    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP({email});
    if(!accountId) throw new Error("Failed to send an OTP")

        if(!existingUser){
            const {databases} = await createAdminClient();
            
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                ID.unique(),
                {
                    fullName,
                    email,
                    avatar:avatarPlaceholderUrl,
                    accountId,
                }
            )
        }
        return parseStringify({ accountId });
    };

    export const verifySecret = async ({
        accountId,
        password,
    }: {
        accountId: string;
        password: string;
    }) => {
        try {
            // Initialize the admin client
            const { account } = await createAdminClient();
            console.log("Account Object:", account);
    
            // Attempt to create a session
            const session = await account.createSession(accountId, password);
            console.log("Session created:", session);
    
            // Validate session creation before proceeding
            if (!session || !session.secret) {
                throw new Error("Session creation failed: Missing session secret.");
            }
    
            // Set the session cookie
            const cookie = await cookies();
            cookie.set("appwrite-session", session.secret, {
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            });
            // console.log("Session cookie set successfully.");
    
            // Return the session ID
            return parseStringify({ sessionId: session.$id });
        } catch (error) {
            // Log the full error and provide a more descriptive message
            console.error("Error during verifySecret:", error);
            handleError(error, "Failed to verify session. Please check your credentials or try again.");
            // Optionally, rethrow the error if you want it to propagate
            throw new Error("Verification failed. Please try again.");
        }
    };
    


    export const getCurrentUser = async () => {
        try {
            // Initialize the client
            const { databases, account } = await createSessionClient();
    
            // Get the current authenticated account
            const result = await account.get();
            console.log("Authenticated Account:", result);
    
            if (!result || !result.$id) {
                throw new Error('No authenticated user found.');
            }
    
            // Query the user from the database
            const user = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                [Query.equal("accountId", result.$id)]
            );
            console.log("User Document Query Result:", user);
    
            if (user.total <= 0) {
                console.log('No matching user document found.');
                return null;
            }
    
            return parseStringify(user.documents[0]);
        } catch (error) {
            console.error('Error getting current user:', error);
            throw error;  // Rethrow the error after logging it
        }
    };
   
    
    



    export const signOutUser =async ()=>{
const {account} = await createSessionClient();

try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
} catch (error) {
    handleError(error,"failed to sign out user");
} finally{
    redirect("/sign-in")
}
    };

    export const SignInUser = async ({email} : {email:string })=>{
        try {
            const existingUser = await getUserByEmail(email);

            // user exit send OTP
            if(existingUser) {
                await sendEmailOTP({email});
                return parseStringify({accountId:existingUser.accountId})
            }
            return parseStringify({ accountId: null, error: "User not found" });
        } catch (error) {
            handleError(error,"FAiled to sign-in User")
        }
    }