const StatsCard = ({title, value, subtitle}) =>{
    return(
        <div className="rounded-3xl border border-neutral-700 bg-[#171717] p-5 shadow-lg transition hover:-translate-y-1 hover:border-orange-400/40">
            <p className="text-sm uppercase tracking-wide text-neutral-400">{title}</p>
            <h3 className="mt-4 text-4xl font-black text-white">{value}</h3>
            {subtitle && (
                <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>
            )}
        </div>
    )
}

export default StatsCard