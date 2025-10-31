export default function PlatformSection() {
  return (
    <section className="bg-black text-white py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">platform</p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            transform your music experience
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            Seamless tools for fans and artists to collaborate and grow together.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Card 1 - Campaigns */}
          <div className="bg-neutral-900 rounded-3xl overflow-hidden group hover:bg-neutral-800 transition-colors flex flex-col">
            <div className="p-8 md:p-10 flex flex-col justify-between flex-grow">
              {/* Left Content */}
              <div className="p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">campaigns</p>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    launch and support music projects
                  </h3>
                  <p className="text-gray-300 mb-8">
                    Direct funding and engagement for emerging artists.
                  </p>
                </div>
                <a
                  href="/campaigns"
                  className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors group/link"
                >
                  explore
                  <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Right Image */}
              <div className="relative h-64 md:h-auto">
                <img
                  src="/api/placeholder/600/600"
                  alt="Artist with laptop working on music"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Bottom Row - Events and Community side by side */}
          <div className="grid  md:grid-cols-2 gap-6">
          {/* Card 2 - Events */}
          <div className="bg-neutral-900 rounded-3xl overflow-hidden group hover:bg-neutral-800 transition-colors">
            <div className="p-8 md:p-10 flex flex-col justify-between h-full">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">events</p>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  connect live
                </h3>
                <p className="text-gray-300 mb-8">
                  Virtual and physical events that bring music communities closer.
                </p>
                <a
                  href="/events"
                  className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors group/link mb-8"
                >
                  join
                  <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Image */}
              <div className="relative h-48 rounded-2xl overflow-hidden">
                <img
                  src="/api/placeholder/400/300"
                  alt="People at an event"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Card 3 - Community */}
          <div className="bg-neutral-900 rounded-3xl overflow-hidden group hover:bg-neutral-800 transition-colors">
            <div className="p-8 md:p-10 flex flex-col justify-between h-full">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">community</p>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  grow together
                </h3>
                <p className="text-gray-300 mb-8">
                  Networking and collaboration opportunities for music enthusiasts.
                </p>
                <a
                  href="/community"
                  className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors group/link mb-8"
                >
                  connect
                  <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Image */}
              <div className="relative h-48 rounded-2xl overflow-hidden">
                <img
                  src="/api/placeholder/400/300"
                  alt="Community collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}