import { axiosPrivate } from "@configs/axios";
import { IQueryRequest } from "@models/common/request";
import { ICreateGachaItemListRequest, ICreateGachaRequest } from "@models/gacha/request";

const gachaService = {
    //---------------------Gacha Banner---------------------//
    getGachaList: async (params?: IQueryRequest) => {
        const queryParams = new URLSearchParams();
        const qsParts: string[] = [];

        // Sort
        if (params?.sort) {
            qsParts.push(`sort:${params.sort}`);
        }

        // Filters
        if (params?.nameTranslation) {
            qsParts.push(`nameTranslation:like=${params.nameTranslation}`);
        }

        if (params?.startDate) {
            qsParts.push(`startDate:lte=${params.startDate}`);
        }

        if (params?.endDate) {
            qsParts.push(`endDate:gte=${params.endDate}`);
        }

        if (params?.status && params.status.length > 0) {
            qsParts.push(`status:in=${params.status.join("|")}`);
        }

        if (params?.enablePrecreate !== undefined) {
            qsParts.push(`enablePrecreate=${params.enablePrecreate}`);
        }

        // Add qs parameter if we have any filters
        if (qsParts.length > 0) {
            queryParams.append("qs", qsParts.join(","));
        }

        // Pagination
        if (params?.currentPage) {
            queryParams.append("currentPage", params.currentPage.toString());
        }

        const queryString = queryParams.toString();
        return axiosPrivate.get(`/gacha-banner${queryString ? `?${queryString}` : ""}`);
    },

    getGachaBannerById: async (id: number) => {
        return axiosPrivate.get(`/gacha-banner/${id}`);
    },

    getPreparePokemonList: async (
        gachaBannerId: number,
        params?: {
            rarity?: string[];
            types?: number | number[];
            nameEn?: string;
            currentPage?: number;
            pageSize?: number;
        },
    ) => {
        const queryParams = new URLSearchParams();
        const qsParts: string[] = [];

        if (params?.rarity && params.rarity.length > 0) {
            qsParts.push(`rarity:in=${params.rarity.join("|")}`);
        }

        if (params?.types !== undefined) {
            const typesValue = Array.isArray(params.types) ? params.types.join("|") : String(params.types);
            qsParts.push(`types=${typesValue}`);
        }

        if (params?.nameEn && params.nameEn.trim() !== "") {
            qsParts.push(`nameTranslations.en:like=${params.nameEn.trim()}`);
        }

        if (qsParts.length > 0) {
            queryParams.append("qs", qsParts.join(","));
        }

        if (params?.currentPage !== undefined) {
            queryParams.append("currentPage", String(params.currentPage));
        }
        if (params?.pageSize !== undefined) {
            queryParams.append("pageSize", String(params.pageSize));
        }

        const qs = queryParams.toString();
        return axiosPrivate.get(`/gacha-item/prepare-pokemons/${gachaBannerId}${qs ? `?${qs}` : ""}`);
    },

    createGacha: async (data: ICreateGachaRequest) => {
        return axiosPrivate.post("/gacha-banner", data);
    },

    updateGacha: async (id: number, data: ICreateGachaRequest) => {
        return axiosPrivate.put(`/gacha-banner/${id}`, data);
    },
    //------------------------End------------------------//

    //---------------------Gacha Item---------------------//
    createGachaItemList: async (data: ICreateGachaItemListRequest) => {
        return axiosPrivate.post("/gacha-item/list", data);
    },

    updateGachaItemList: async (data: ICreateGachaItemListRequest) => {
        return axiosPrivate.put(`/gacha-item/list`, data);
    },

    deleteGachaItem: async (gachaItemId: number) => {
        return axiosPrivate.delete(`/gacha-item/${gachaItemId}`);
    },
    //------------------------End------------------------//
};

export default gachaService;
