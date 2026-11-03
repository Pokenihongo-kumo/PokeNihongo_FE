const getHeaderColor = (rarity: string) =>
    rarity === "COMMON"
        ? "bg-green-50 text-green-700 border-green-100"
        : rarity === "UNCOMMON"
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : rarity === "RARE"
            ? "bg-blue-50 text-blue-700 border-blue-100"
            : rarity === "EPIC"
              ? "bg-purple-50 text-purple-700 border-purple-100"
              : rarity === "LEGENDARY"
                ? "bg-amber-50 text-amber-700 border-amber-100"
                : "bg-muted text-foreground border-border";

export default getHeaderColor;
