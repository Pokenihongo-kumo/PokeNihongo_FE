const ShopBannerStatus = {
    PREVIEW: "PREVIEW",
    EXPIRED: "EXPIRED",
    INACTIVE: "INACTIVE",
    ACTIVE: "ACTIVE",
} as const;

export const SHOP = {
    ShopBannerStatus,
};

export type ShopBannerStatus = (typeof ShopBannerStatus)[keyof typeof ShopBannerStatus];
