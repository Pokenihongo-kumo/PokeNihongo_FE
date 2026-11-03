import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingPage from "@pages/LoadingPage";
import { ROUTES } from "@constants/route";
import { CookiesService } from "@utils/cookies";
import { isTokenExpired } from "@utils/token";

const PersistToken = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const accessToken = CookiesService.get("accessToken");

    useEffect(() => {
        const checkAccessToken = () => {
            if (!accessToken || isTokenExpired(accessToken)) {
                CookiesService.remove("accessToken");
                navigate(ROUTES.AUTH.LOGIN);
            } else {
                setIsLoading(false);
            }
        };

        checkAccessToken();
    }, [accessToken, navigate]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return <Outlet />;
};

export default PersistToken;
