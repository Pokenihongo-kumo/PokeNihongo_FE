import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@ui/Dialog";
import { Button } from "@ui/Button";
import { useTranslation } from "react-i18next";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    bannerId: number;
}

export default function AddRandomGachaPokemonDialog({ isOpen, onClose }: Props) {
    const { t } = useTranslation();
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="bg-white border-border max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {t("configGacha.addRandomPokemon") || "Add Random Pokemon"}
                    </DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground">Coming soon.</div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        {t("common.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
