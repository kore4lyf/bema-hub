import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 overflow-y-scroll">
        {children}
      </div>

      <div className="hidden lg:flex items-center justify-center relative bg-muted">
        <img 
          src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&q=80" 
          alt="Artist community" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
        <div className="relative z-10 text-right text-white px-12">
          <Link href="/" className="text-4xl font-bold block mb-8">
            Bema Hub
          </Link>
          <h2 className="text-3xl font-bold mb-4">Your Creative Journey Starts Here</h2>
          <p className="text-lg opacity-90">
            Discover opportunities, showcase your talent, and grow with a supportive community.
          </p>
        </div>
      </div>
    </main>
  );
}
