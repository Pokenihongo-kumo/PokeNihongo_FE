import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumb = ({ items, className = "" }: BreadcrumbProps) => {
    return (
        <nav className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
            <Link to="/admin/overview" className="flex items-center hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-1" />
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                            {item.icon && <span className="flex items-center">{item.icon}</span>}
                            {item.label}
                        </Link>
                    ) : (
                        <span className="flex items-center gap-1 text-foreground">
                            {item.icon && <span className="flex items-center">{item.icon}</span>}
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
