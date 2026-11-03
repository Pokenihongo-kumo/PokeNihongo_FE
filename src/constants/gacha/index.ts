const GachaBannerStatus = {
    PREVIEW: "PREVIEW",
    EXPIRED: "EXPIRED",
    INACTIVE: "INACTIVE",
    ACTIVE: "ACTIVE",
} as const;

export const GachaItemRateStarType = {
    ONE: "ONE",
    TWO: "TWO",
    THREE: "THREE",
    FOUR: "FOUR",
    FIVE: "FIVE",
} as const;

// Mapping from Pokemon Rarity to Gacha StarType
export const RarityToStarTypeMap: Record<string, string> = {
    COMMON: "ONE",
    UNCOMMON: "TWO",
    RARE: "THREE",
    EPIC: "FOUR",
    LEGENDARY: "FIVE",
};

export const GACHA = {
    GachaBannerStatus,
    GachaItemRateStarType,
};

export type GachaBannerStatus = (typeof GachaBannerStatus)[keyof typeof GachaBannerStatus];
export type GachaItemRateStarType = (typeof GachaItemRateStarType)[keyof typeof GachaItemRateStarType];
