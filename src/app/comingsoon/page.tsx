import Navbar from "@/components/Navbar"

export default function ComingSoon() {
    return <>
    <Navbar />
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <h1 className="text-5xl text-primary font-bold mb-8 animate-pulse">
        Próximamente
    </h1>
    <p className="text-primary text-lg mb-8">
        Estoy trabajando en algo increíble, regresa pronto.
    </p>
</div>
</>
}