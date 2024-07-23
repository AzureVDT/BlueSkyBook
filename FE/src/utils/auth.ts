import Cookies from "js-cookie";
const userKey = "BLUE_SKY_BOOK_USER";

const objCookies = {
    expires: 30,
    domain:
        typeof window !== "undefined" ? window.location.hostname : "localhost",
};

export const saveUser = (id: string) => {
    if (id) {
        Cookies.set(userKey, id, {
            ...objCookies,
        });
    } else {
        Cookies.remove(userKey, {
            ...objCookies,
            path: "/",
            domain: window.location.hostname,
        });
    }
};

export const getUser = () => {
    const user = Cookies.get(userKey);
    return user;
};
