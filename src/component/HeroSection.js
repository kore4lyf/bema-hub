export default function HeroSection() {
    return (
        <section className="min-h-screen bg-neutral-900 text-white pt-24 pb-12 px-4">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                            Power your music journey with bema hub
                        </h2>
                        <p className="text-gray-300 text-lg md:text-xl max-w-xl">
                            Connect with artists, support campaigns, and unlock exclusive experiences.
                            We build bridges between fans and creators.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium">
                                join now
                            </button>
                            <button
                                className="px-8 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition-colors font-medium">
                                learn more
                            </button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <div className="rounded-2xl overflow-hidden bg-gray-800 aspect-[4/3]">
                            <img
                                src="/api/placeholder/800/600"
                                alt="People collaborating in a modern workspace"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


