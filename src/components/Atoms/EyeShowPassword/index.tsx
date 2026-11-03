import { Eye, EyeOff } from "lucide-react";

const EyeShowPassword = ({ showPassword, size, color }: { showPassword: boolean; size: number; color: string }) => {
    return <>{!showPassword ? <EyeOff size={size} color={color} /> : <Eye size={size} color={color} />}</>;
};

export default EyeShowPassword;
