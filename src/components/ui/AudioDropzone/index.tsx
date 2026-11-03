import { Button } from "@ui/Button";
import { UploadCloud, Trash2 } from "lucide-react";
import React from "react";

interface AudioDropzoneProps {
    label?: string;
    value?: File;
    onChange: (file?: File) => void;
}

const AudioDropzone: React.FC<AudioDropzoneProps> = ({ label = "Audio", value, onChange }) => {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [fileName, setFileName] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);
            setFileName(value.name);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl(null);
        setFileName(null);
    }, [value]);

    return (
        <div className="space-y-2">
            <label className="font-medium">{label}</label>
            {!value && !previewUrl ? (
                <label
                    htmlFor="audio-dropzone-input"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50 transition-colors"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả
                        </p>
                        <p className="text-xs text-muted-foreground">MP3, WAV (Tối đa 5MB)</p>
                    </div>
                    <input
                        id="audio-dropzone-input"
                        type="file"
                        className="hidden"
                        accept="audio/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                        }}
                    />
                </label>
            ) : (
                <div className="relative w-full">
                    {previewUrl && <audio className="w-full" controls src={previewUrl} />}
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => onChange(undefined)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    {fileName && <p className="mt-2 text-xs text-muted-foreground">Đã chọn: {fileName}</p>}
                </div>
            )}
        </div>
    );
};

export default AudioDropzone;
