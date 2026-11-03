const getCardColor = (rarity: string) =>
    rarity === "COMMON"
        ? "border-green-200 hover:border-green-400 bg-green-50/40"
        : rarity === "UNCOMMON"
          ? "border-emerald-200 hover:border-emerald-400 bg-emerald-50/40"
          : rarity === "RARE"
            ? "border-blue-200 hover:border-blue-400 bg-blue-50/40"
            : rarity === "EPIC"
              ? "border-purple-200 hover:border-purple-400 bg-purple-50/40"
              : rarity === "LEGENDARY"
                ? "border-amber-200 hover:border-amber-400 bg-amber-50/40"
                : "border-border hover:border-primary bg-muted/30";

export default getCardColor;
