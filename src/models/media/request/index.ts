import { z } from "zod";

export const CreateMediaSchema = z.object({
    folderName: z.string(),
    file: z.instanceof(File),
    type: z.enum(["image", "video", "audio", "document", "other"]),
});

export type ICreateMediaRequest = z.infer<typeof CreateMediaSchema>;
