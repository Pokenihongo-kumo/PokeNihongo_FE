import { useShopBannerById } from "@hooks/useShop";
import { Card, CardContent, CardHeader } from "@ui/Card";
import { Skeleton } from "@ui/Skeleton";
import { useParams } from "react-router-dom";
import HeaderAdmin from "@organisms/Header/Admin";
import { useTranslation } from "react-i18next";
import { IShopBannerSchema } from "@models/shop/entity";
import ShopBannerDetailView from "../ShopBannerDetailView";

export default function ShopBannerDetail() {
    const { t } = useTranslation();
    const { bannerId } = useParams<{ bannerId: string }>();
    const { data: bannerDetail, isLoading } = useShopBannerById(Number(bannerId));

    return (
        <>
            <HeaderAdmin title={t("configShop.title")} description={t("configShop.description")} />
            {isLoading ? (
                <div className="p-8 mt-24">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <Skeleton className="h-8 w-48" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-20 w-full" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <ShopBannerDetailView bannerDetail={bannerDetail?.data || ({} as IShopBannerSchema)} />
            )}
        </>
    );
}
