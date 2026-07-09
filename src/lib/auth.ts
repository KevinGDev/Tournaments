import {cookies} from "next/headers";

export const ADMIN_PASSWORD = "oufslan";

export async function isAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");

    // Ajoute un log pour debugger dans ton terminal (pas le navigateur)
    console.log("Token trouvé :", token?.value);
    console.log("Token attendu :", process.env.ADMIN_SECRET_TOKEN);

    return token?.value === process.env.ADMIN_SECRET_TOKEN;
}