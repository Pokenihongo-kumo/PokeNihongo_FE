import { Button } from "@ui/Button";
import { UploadCloud, Trash2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface ImageDropzoneProps {
    label?: string;
    value?: File | string;
    onChange: (file?: File) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ label, value, onChange }) => {
    const { t } = useTranslation();
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (typeof value === "string") {
            setPreviewUrl(value || null);
            return;
        }
        if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl(null);
    }, [value]);

    return (
        <div className="space-y-2">
            <label className="font-medium">{label || t("imageDropzone.defaultLabel")}</label>
            {!value && !previewUrl ? (
                <label
                    htmlFor="image-dropzone-input"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50 transition-colors"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">{t("imageDropzone.clickToUpload")}</span>{" "}
                            {t("imageDropzone.orDragDrop")}
                        </p>
                        <p className="text-xs text-muted-foreground">{t("imageDropzone.supportedFormats")}</p>
                    </div>
                    <input
                        id="image-dropzone-input"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                        }}
                    />
                </label>
            ) : (
                <div className="relative w-32 h-32">
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="preview"
                            className="object-contain w-full h-full rounded-lg border bg-muted"
                        />
                    )}
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full"
                        onClick={() => onChange(undefined)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ImageDropzone;
