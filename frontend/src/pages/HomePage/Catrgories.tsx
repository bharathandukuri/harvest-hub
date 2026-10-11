import { categories } from "../../data/Categories";

function Catrgories() {
    return (
        <>
            <h1 className="text-4xl md:text-3xl font-extrabold text-green-800 mt-10 ml-15 drop-shadow-lg">
                Categories
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 py-10">
                {categories.map((cat) => (
                    <div key={cat.name} className="flex flex-col items-center">
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-lg mb-3 border-1 border-green-400 bg-white transition-transform hover:scale-105">
                            <img
                                src={cat.imageUrl}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-green-800 font-semibold text-base md:text-lg text-center">
                            {cat.name}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}
export default Catrgories;
