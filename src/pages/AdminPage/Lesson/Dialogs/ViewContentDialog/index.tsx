import { DialogContent, DialogHeader, DialogTitle } from "@ui/Dialog";
import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Badge } from "@ui/Badge";
import { Separator } from "@ui/Separator";
import { LessonContent } from "@models/lessonContent/entity";
import { FileText, Video, Image, File, Calendar, Eye, Edit, Download, X } from "lucide-react";

interface ViewContentDialogProps {
    content: LessonContent | null;
    onClose: () => void;
    onEdit?: (content: LessonContent) => void;
    onDelete?: (contentId: number) => void;
}

const ViewContentDialog = ({ content, onClose, onEdit, onDelete }: ViewContentDialogProps) => {
    if (!content) return null;

    const getTypeIcon = (type: string) => {
        const icons = {
            text: FileText,
            video: Video,
            image: Image,
            audio: File,
            document: File,
        };
        return icons[type as keyof typeof icons] || FileText;
    };

    const getTypeBadge = (type: string) => {
        const types = {
            text: { label: "Text", color: "bg-blue-500" },
            video: { label: "Video", color: "bg-red-500" },
            image: { label: "Image", color: "bg-green-500" },
            audio: { label: "Audio", color: "bg-purple-500" },
            document: { label: "Document", color: "bg-orange-500" },
        };
        return types[type as keyof typeof types] || { label: type, color: "bg-gray-500" };
    };

    const TypeIcon = getTypeIcon(content.contentType?.toLowerCase() || "text");
    const typeInfo = getTypeBadge(content.contentType?.toLowerCase() || "text");

    const handleDownload = () => {
        // TODO: Implement download functionality
        console.log("Downloading content:", content.id);
    };

    const handlePreview = () => {
        // TODO: Implement preview functionality
        console.log("Previewing content:", content.id);
    };

    return (
        <DialogContent className="bg-gradient-to-br from-white to-gray-50 border-border max-w-4xl max-h-[95vh] overflow-hidden">
            <DialogHeader className="pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <TypeIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <DialogTitle className="text-2xl font-bold text-foreground">
                            {content.contentType} #{content.contentId}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {content.lesson.titleKey} • Order: {content.contentOrder}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Badge className={`${typeInfo.color} text-white`}>{typeInfo.label}</Badge>
                        <Badge className="bg-blue-500 text-white">Order: {content.contentOrder}</Badge>
                    </div>
                </div>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[calc(95vh-200px)] pr-2">
                <div className="space-y-6">
                    {/* Content Details */}
                    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Eye className="h-5 w-5 text-primary" />
                                Content Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Content Type</label>
                                    <p className="text-sm text-muted-foreground">{content.contentType}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Content ID</label>
                                    <p className="text-sm text-muted-foreground">#{content.contentId}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Lesson</label>
                                    <p className="text-sm text-muted-foreground">{content.lesson.titleKey}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Lesson ID</label>
                                    <p className="text-sm text-muted-foreground">{content.lessonId}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Content Order</label>
                                    <Badge className="bg-blue-100 text-blue-800">{content.contentOrder}</Badge>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Lesson Slug</label>
                                    <p className="text-sm text-muted-foreground">{content.lesson.slug}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Created</label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(content.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Updated</label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(content.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Content Order</label>
                                <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                                    This content is ordered as position {content.contentOrder} in the lesson.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* File Preview/Actions */}
                    {content.contentType?.toLowerCase() !== "text" && (
                        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <File className="h-5 w-5 text-primary" />
                                    File Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handlePreview}
                                        className="flex items-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Preview
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleDownload}
                                        className="flex items-center gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-end items-center pt-4">
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-border text-foreground hover:bg-gray-50 h-10 px-6"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Close
                    </Button>
                    {onEdit && (
                        <Button
                            variant="outline"
                            onClick={() => onEdit(content)}
                            className="border-border text-foreground bg-transparent hover:bg-gray-50 h-10 px-6"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant="destructive" onClick={() => onDelete(content.id)} className="h-10 px-6">
                            Delete
                        </Button>
                    )}
                </div>
            </div>
        </DialogContent>
    );
};

export default ViewContentDialog;
