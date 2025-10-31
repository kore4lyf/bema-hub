"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTheme as setReduxTheme } from "@/lib/features/ui/uiSlice";
import { signOut } from "@/lib/features/auth/authSlice";
import Logo from "./Logo";
import { AnimatedBackground } from '@/components/motion-primitives/animated-background';
import { motion } from "motion/react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { theme: reduxTheme } = useAppSelector((state) => state.ui);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [indicatorStyle, setIndicatorStyle] = useState<{left: number, width: number} | null>(null);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme && theme !== reduxTheme) {
      dispatch(setReduxTheme(theme as 'light' | 'dark'));
    }
  }, [theme, reduxTheme, dispatch]);

  // Update indicator position when pathname changes or window resizes
  useEffect(() => {
    const updateIndicator = () => {
      const filteredItems = navItems.filter((item) => 
        (!isAuthenticated && !protectedNavRoutesName.includes(item.name)) || isAuthenticated
      );
      
      // Find the active item (exact match or subroute)
      const activeItemIndex = filteredItems.findIndex(item => 
        pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/')) || pathname.startsWith(item.href + '?')
      );
      
      if (activeItemIndex !== -1 && navRefs.current[activeItemIndex] && navContainerRef.current) {
        const activeLink = navRefs.current[activeItemIndex];
        if (activeLink) {
          const containerRect = navContainerRef.current.getBoundingClientRect();
          const linkRect = activeLink.getBoundingClientRect();
          
          // Calculate position and width based on the actual link width + 4px
          const indicatorWidth = linkRect.width + 4;
          const indicatorLeft = linkRect.left - containerRect.left - 2; // Adjust for the extra 4px width (2px on each side)
          
          setIndicatorStyle({
            left: indicatorLeft,
            width: indicatorWidth,
          });
        }
      } else {
        // Hide indicator if no active item found by setting width to 0
        setIndicatorStyle({
          left: 0,
          width: 0,
        });
      }
    };

    // Update immediately
    updateIndicator();
    
    // Update on resize
    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pathname, isAuthenticated]);

  // Initialize indicator position
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const filteredItems = navItems.filter((item) => 
        (!isAuthenticated && !protectedNavRoutesName.includes(item.name)) || isAuthenticated
      );
      
      // Find the active item (exact match or subroute)
      const activeItemIndex = filteredItems.findIndex(item => 
        pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/')) || pathname.startsWith(item.href + '?')
      );
      
      if (activeItemIndex !== -1 && navRefs.current[activeItemIndex] && navContainerRef.current) {
        const activeLink = navRefs.current[activeItemIndex];
        if (activeLink) {
          const containerRect = navContainerRef.current.getBoundingClientRect();
          const linkRect = activeLink.getBoundingClientRect();
          
          // Calculate position and width based on the actual link width + 4px
          const indicatorWidth = linkRect.width + 4;
          const indicatorLeft = linkRect.left - containerRect.left - 2; // Adjust for the extra 4px width (2px on each side)
          
          setIndicatorStyle({
            left: indicatorLeft,
            width: indicatorWidth,
          });
        }
      } else {
        // Hide indicator if no active item found by setting width to 0
        setIndicatorStyle({
          left: 0,
          width: 0,
        });
      }
    }, 50); // Small delay to ensure DOM is ready
    
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    dispatch(setReduxTheme(newTheme));
  };

  const handleSignOut = () => {
    dispatch(signOut());
    toast.success("Signed out successfully");
    window.location.href = "/";
  };

  const navItems = [
    { name: "Blog", href: "/blog" },
    { name: "Events", href: "/events" },
    { name: "Campaigns", href: "/campaigns" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Contact", href: "/contact" },
  ];

  const protectedNavRoutesName = [ "Events", "Campaigns", "Leaderboard" ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="75"/> 
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <div ref={navContainerRef} className="relative flex items-center gap-6">
            {navItems
              .filter((item) => 
                (!isAuthenticated && !protectedNavRoutesName.includes(item.name)) || isAuthenticated
              )
              .map((item, index) => {
                // Check for exact match or subroute match
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/')) || pathname.startsWith(item.href + '?');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    ref={(el) => { if (el) navRefs.current[index] = el; }}
                    className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-lg relative z-10 ${
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            {/* Sliding background indicator - no animation */}
            {/* Show indicator even when no nav item is active, but hide when width is 0 */}
            {indicatorStyle && indicatorStyle.width > 0 && (
              <div 
                className="absolute bottom-0 h-0.5 bg-primary transition-all duration-0"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                }}
              />
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated && user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <Avatar className="h-8 w-8">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name || "User avatar"} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold bg-primary/10">
                      {user.name?.[0].toUpperCase() || user.email?.[0].toUpperCase() || "U"}
                    </div>
                  )}
                </Avatar>
              </Button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-background shadow-lg">
                  <div className="p-3 border-b">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <Link href="/profile">
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      size="sm"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin" className="hidden md:block">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup" className="hidden md:block">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="container max-w-7xl md:hidden px-4 pb-4 mx-auto">
          <div className="flex flex-col gap-2 pt-2">
            {navItems.map((item) => {
              if ((!isAuthenticated && !protectedNavRoutesName.includes(item.name)) || isAuthenticated) {

                return (<Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary py-2"
                  onClick={() => setIsMenuOpen(false)}
                  >
                  {item.name}
                </Link>
                )
              }
            })}
            {!isAuthenticated && (
              <>
                <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}