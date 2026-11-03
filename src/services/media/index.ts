import { axiosPrivate } from "@configs/axios";
import { ICreateMediaRequest } from "@models/media/request";

const mediaService = {
    uploadFile: async (data: ICreateMediaRequest) => {
        const formData = new FormData();
        formData.append("folderName", data.folderName);
        formData.append("file", data.file);
        formData.append("type", data.type);

        return axiosPrivate.post("/upload/file", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};

export default mediaService;
