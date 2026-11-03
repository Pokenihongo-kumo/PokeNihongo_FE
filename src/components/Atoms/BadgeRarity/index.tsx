import { RarityPokemon } from "@constants/pokemon";
import { cn } from "@utils/CN";

interface RarityBadgeProps {
    level: keyof typeof RarityPokemon;
    className?: string;
}

const rarityConfig = {
    common: {
        label: "COMMON",
        bgColor: "bg-gray-300",
        textColor: "text-gray-800",
        borderColor: "border-gray-400",
        hasEffect: false,
    },
    uncommon: {
        label: "UNCOMMON",
        bgColor: "bg-green-400",
        textColor: "text-green-900",
        borderColor: "border-green-500",
        hasEffect: false,
    },
    rare: {
        label: "RARE",
        bgColor: "bg-blue-400",
        textColor: "text-blue-900",
        borderColor: "border-blue-500",
        hasEffect: false,
    },
    epic: {
        label: "EPIC",
        bgColor: "bg-purple-500",
        textColor: "text-white",
        borderColor: "border-purple-600",
        hasEffect: true,
        effectClass: "epic-glow",
    },
    legendary: {
        label: "LEGENDARY",
        bgColor: "bg-yellow-400",
        textColor: "text-yellow-900",
        borderColor: "border-yellow-500",
        hasEffect: true,
        effectClass: "legendary-glow",
    },
};

export function RarityBadge({ level, className }: RarityBadgeProps) {
    const getConfig = () => {
        switch (level) {
            case "COMMON":
                return rarityConfig.common;
            case "UNCOMMON":
                return rarityConfig.uncommon;
            case "RARE":
                return rarityConfig.rare;
            case "EPIC":
                return rarityConfig.epic;
            case "LEGENDARY":
                return rarityConfig.legendary;
            default:
                return rarityConfig.common;
        }
    };

    const config = getConfig();

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border-2 font-semibold text-xs",
                config.bgColor,
                config.textColor,
                config.borderColor,
                config.hasEffect ? (config as any).effectClass : undefined,
                className,
            )}
        >
            <span>{config.label}</span>
        </div>
    );
}
