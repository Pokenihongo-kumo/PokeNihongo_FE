export default function HeaderAdmin({ title, description }: { title: string; description: string }) {
    return (
        <header className="mb-10 px-8 py-4 fixed w-full bg-white border-b border-border z-20">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
        </header>
    );
}
