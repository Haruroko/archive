export default function Header() {
    return (
        <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/60 bg-white/38 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-600">Location</p>
                    <h1 className="text-xl font-black text-slate-900 sm:text-2xl">로비</h1>
                </div>
            </div>
        </header>
    )
}