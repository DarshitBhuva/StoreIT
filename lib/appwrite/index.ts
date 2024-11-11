"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";

// Why we are creating different client on each request
// Because Sharing the same connection between requests can lead to security issues and exposing someone's data over session.
export const createSessionClient = async () => {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId)

    const session = (await cookies()).get("appwrite-session");

    if (!session || !session.value)
        throw new Error("No session");

    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
        get database() {
            return new Databases(client);
        }
    }
}

export const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId)
        .setKey(appwriteConfig.secretKey);

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
        get avatar() {
            return new Avatars(client);
        }
    }
}