import { axiosPrivate } from "@configs/axios";
import { IQueryRequest } from "@models/common/request";
import { WordTypeListSchema } from "@models/wordType";
import { toApiResult } from "@utils/api-response";

const wordTypeService = {
    getAllWordTypes: async (params: IQueryRequest) => {
        const response = await axiosPrivate.get("/wordtype", {
            params: params,
        });
        return toApiResult(response, WordTypeListSchema);
    },
};

export default wordTypeService;
