import { COOKIES } from "@constants/common";
import { ROUTES } from "@constants/route";
import { useQueryClient } from "@tanstack/react-query";
import { CookiesService } from "@utils/cookies";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Logs out: drops the access token, leaves the protected layout, then empties
 * the React Query cache so the next account never sees the previous one's data
 * @returns logout handler
 */
export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useCallback(() => {
        CookiesService.remove(COOKIES.ACCESS_TOKEN);
        navigate(ROUTES.AUTH.LOGIN, { replace: true });
        // After navigating, so the pages being left do not refetch without a token
        queryClient.cancelQueries();
        queryClient.clear();
    }, [navigate, queryClient]);
};
//----------------------End----------------------//
