import { axiosPrivate } from "@configs/axios";
import { IQueryRequest } from "@models/common/request";
import { ICreatePokemonRequest } from "@models/pokemon/request";

const pokemonService = {
    getAllPokemon: async (params: IQueryRequest) => {
        const queryParams = new URLSearchParams();
        const filters: string[] = [];

        if (params.page) queryParams.append("currentPage", params.page.toString());
        if (params.limit) queryParams.append("pageSize", params.limit.toString());

        if (params.type && params.type !== "all") {
            filters.push(`types=${params.type}`);
        }
        if (params.rarity && params.rarity !== "all") {
            filters.push(`rarity=${params.rarity}`);
        }
        if (params.search) {
            filters.push(`nameTranslations.en:like=${params.search}`);
        }

        if (filters.length > 0) {
            const qsValue = filters.join(",");
            queryParams.append("qs", qsValue);
        }

        const queryString = queryParams.toString();
        return axiosPrivate.get(`/pokemon?${queryString}`);
    },

    getPokemonById: async (id: string) => {
        return axiosPrivate.get(`/pokemon/${id}`);
    },
    createPokemon: async (data: ICreatePokemonRequest) => {
        return axiosPrivate.post("/pokemon", data);
    },
};

export default pokemonService;
