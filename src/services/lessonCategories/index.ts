import { axiosPrivate } from "@configs/axios";

const lessonCategoriesService = {
    getLessonCategories: async () => {
        return axiosPrivate.get("/lesson-categories");
    },
};
export default lessonCategoriesService;
