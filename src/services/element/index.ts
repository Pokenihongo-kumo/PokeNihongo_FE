import { axiosPrivate } from "@configs/axios";

const elementService = {
    getAllElementalType: async (
        qstype: string = "",
        qs: string = "",
        currentPage: number = 1,
        pageSize: number = 100,
    ) => {
        return axiosPrivate.get(`/elemental-type?qs=${qstype}:${qs}&currentPage=${currentPage}&pageSize=${pageSize}`);
    },
    getElementalTypeById: async (id: string) => {
        return axiosPrivate.get(`/elemental-type/${id}`);
    },
};

export default elementService;
