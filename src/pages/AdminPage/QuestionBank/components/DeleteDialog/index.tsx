import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@ui/Dialog";
import { Button } from "@ui/Button";

const DeleteDialog: React.FC<COMPONENTS.IDeleteDialogProps> = ({ open, onClose, onConfirm, isDeleting, t }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>{t("questionBank.deleteDialog.title")}</DialogTitle>
                </DialogHeader>
                <p className="text-gray-600 mb-6">{t("questionBank.deleteDialog.message")}</p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        {t("common.cancel")}
                    </Button>
                    <Button
                        variant="destructive"
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting
                            ? t("questionBank.deleteDialog.deleting")
                            : t("questionBank.deleteDialog.deleteButton")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteDialog;
