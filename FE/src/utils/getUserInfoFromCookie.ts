import CryptoJS from "crypto-js";
import { getUser } from "./auth";
export default function getUserInfoFromCookie() {
    const key = import.meta.env.VITE_COOKIE_KEY;
    const encryptedUser = getUser();
    let decryptedData = null;
    if (encryptedUser && key) {
        const bytes = CryptoJS.AES.decrypt(encryptedUser, key);
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return decryptedData;
}
