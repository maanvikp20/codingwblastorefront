const SectionHeader = ({title, description}) =>{
    return(
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
                <h2 className="text-3xl font-black text-white">{title}</h2>
                {description &&(
                    <p mt-2 text-neutral-400>{description}</p>
                )}
            </div>
        </div>
    )
}

export default SectionHeader