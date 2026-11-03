import { CookiesService } from "@utils/cookies";
import { jwtDecode, JwtPayload } from "jwt-decode";

//#region [Method] decodeJWT
/**
 * Decode JWT
 * @returns JWTPayload | null
 */
export const decodeJWT = () => {
    const token = CookiesService.get("accessToken");
    try {
        if (!token) {
            return null;
        }

        const decodeToken = jwtDecode<JwtPayload>(token);
        return decodeToken;
    } catch (error) {
        console.error(error);
    }
    return null;
};
//---------------End------------------//
//#endregion

//#region [Method] isTokenExpired
/**
 * Check token is expired
 * @param token
 * @returns
 */
export const isTokenExpired = (token: string | null) => {
    if (!token) return true;
    try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp ? decodedToken.exp < currentTime : true;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};
//---------------End------------------//
//#endregion
