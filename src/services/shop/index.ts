import { axiosPrivate } from "@configs/axios";
import {
    ICreateShopBannerRequest,
    IGetRandomPokemonRequest,
    ICreateShopItemsRequest,
    IUpdateShopItemsRequest,
} from "@models/shop/request";

const shopService = {
    getAllShopBanners: async (params: {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
        status?: string[];
    }) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("currentPage", params.page.toString());
        if (params.limit) queryParams.append("pageSize", params.limit.toString());

        // Build the qs parameter for filtering
        const filterParts: string[] = [];
        if (params.startDate) {
            filterParts.push(`startDate:lte=${params.startDate}`);
        }
        if (params.endDate) {
            filterParts.push(`endDate:gte=${params.endDate}`);
        }
        if (params.status && params.status.length > 0) {
            filterParts.push(`status:in=${params.status.join("|")}`);
        }

        if (filterParts.length > 0) {
            queryParams.append("qs", filterParts.join(","));
        }

        return axiosPrivate.get(`/shop-banner?${queryParams.toString()}`);
    },

    getShopBannerById: async (id: number) => {
        return axiosPrivate.get(`/shop-banner/${id}`);
    },

    getShopItemRandom: async (shopBannerId: number, amount: number) => {
        return axiosPrivate.get("/shop-item/random", { params: { shopBannerId, amount } });
    },

    getShopBannerAllPokemonByShopBannerId: async (
        shopBannerId: number,
        params?: {
            page?: number;
            limit?: number;
            sort?: string;
            search?: string;
            rarity?: string;
            types?: string | number;
        },
    ) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("currentPage", params.page.toString());
        if (params?.limit) queryParams.append("pageSize", params.limit.toString());

        // Build the qs parameter for filtering
        const filterParts: string[] = [];
        if (params?.sort) {
            filterParts.push(`sort:${params.sort}`);
        }
        if (params?.search) {
            filterParts.push(`nameTranslations.en:like=${params.search}`);
        }
        if (params?.rarity) {
            filterParts.push(`rarity=${params.rarity}`);
        }
        if (params?.types) {
            filterParts.push(`types=${params.types}`);
        }

        if (filterParts.length > 0) {
            queryParams.append("qs", filterParts.join(","));
        }

        const queryString = queryParams.toString();
        const url = `/shop-banner/all-pokemon/${shopBannerId}${queryString ? `?${queryString}` : ""}`;

        return axiosPrivate.get(url);
    },

    createShopItemWithRandom: async (data: ICreateShopItemsRequest) => {
        return axiosPrivate.post("/shop-item/list", data);
    },

    createShopBanner: async (data: ICreateShopBannerRequest) => {
        return axiosPrivate.post("/shop-banner", data);
    },

    updateShopItemByShopItemId: async (id: number, data: IUpdateShopItemsRequest) => {
        return axiosPrivate.put(`/shop-item/${id}`, data);
    },

    updateShopBanner: async (id: number, data: ICreateShopBannerRequest) => {
        return axiosPrivate.put(`/shop-banner/${id}`, data);
    },

    deleteShopItem: async (id: number) => {
        return axiosPrivate.delete(`/shop-item/${id}`);
    },

    // Get random Pokemon for shop
    getRandomPokemon: async (data: IGetRandomPokemonRequest) => {
        return axiosPrivate.post("/shop-banner/random-pokemon", data);
    },
};

export default shopService;
