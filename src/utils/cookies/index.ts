import Cookies from "js-cookie";

export const CookiesService = {
    get: (key: string) => {
        const data = Cookies.get(key);
        if (!data) {
            return null;
        }
        try {
            return JSON.parse(data);
        } catch (error) {
            return data;
        }
    },
    set: (key: string, value: any) => {
        if (typeof value === "string") {
            Cookies.set(key, value, { expires: 1 });
        } else {
            const dataJson = JSON.stringify(value);
            Cookies.set(key, dataJson, { expires: 1 });
        }
    },
    remove: (key: string) => {
        Cookies.remove(key);
    },
};
