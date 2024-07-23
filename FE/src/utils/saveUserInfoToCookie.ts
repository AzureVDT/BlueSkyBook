import CryptoJS from "crypto-js";
import { LoginResponse } from "../types/customerType";
import { saveUser } from "./auth";

export default function saveUserInfoToCookie(user: LoginResponse) {
    const key = import.meta.env.VITE_COOKIE_KEY;
    const cipherText = CryptoJS.AES.encrypt(
        JSON.stringify(user),
        key
    ).toString();
    saveUser(cipherText);
}
