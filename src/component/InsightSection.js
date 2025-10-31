export default function InsightsSection() {
  const articles = [
    {
      category: "industry",
      readTime: "5 min read",
      title: "emerging artists changing the music landscape",
      description: "Innovative musicians breaking traditional boundaries and creating new sounds.",
      image: "/api/placeholder/600/400"
    },
    {
      category: "technology",
      readTime: "5 min read",
      title: "how ai is transforming music production",
      description: "Exploring cutting-edge technologies revolutionizing creative processes.",
      image: "/api/placeholder/600/400"
    },
    {
      category: "culture",
      readTime: "5 min read",
      title: "global music trends and cultural exchanges",
      description: "Connecting musical traditions across different regions and communities.",
      image: "/api/placeholder/600/400"
    }
  ]

  return (
    <section className="bg-black text-white py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">insights</p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            latest music stories
          </h2>
          <p className="text-gray-300 text-lg md:text-xl">
            Discover fresh perspectives and industry trends.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-neutral-900 rounded-3xl overflow-hidden group hover:bg-neutral-800 transition-colors"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Tags */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-gray-300">
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-400">
                    {article.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 mb-6">
                  {article.description}
                </p>

                {/* Read More Link */}
                <a
                  href={`/insights/${article.category}`}
                  className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors group/link"
                >
                  read more
                  <svg
                    className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <a
            href="/insights"
            className="inline-block px-8 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition-colors font-medium"
          >
            view all
          </a>
        </div>
      </div>
    </section>
  )
}