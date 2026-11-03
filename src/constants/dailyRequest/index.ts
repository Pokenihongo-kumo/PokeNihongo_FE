export const DAILY_REQUEST_TYPE = {
    DAILY_LOGIN: {
        label: "Đăng nhập",
        value: "DAILY_LOGIN",
    },
    DAILY_LESSON: {
        label: "Hoàn thành bài học",
        value: "DAILY_LESSON",
    },
    DAILY_EXERCISE: {
        label: "Luyện tập",
        value: "DAILY_EXERCISE",
    },
    STREAK_LOGIN: {
        label: "Đăng nhập liên tiếp",
        value: "STREAK_LOGIN",
    },
    STREAK_LESSON: {
        label: "Hoàn thành bài học liên tiếp",
        value: "STREAK_LESSON",
    },
    STREAK_EXCERCISE: {
        label: "Luyện tập liên tiếp",
        value: "STREAK_EXCERCISE",
    },
} as const;

export const DAILY_REQUEST = {
    DAILY_REQUEST_TYPE,
};

export type DAILY_REQUEST = typeof DAILY_REQUEST;
