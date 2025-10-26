"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, LogOut, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTheme as setReduxTheme } from "@/lib/features/ui/uiSlice";
import { signOut } from "@/lib/features/auth/authSlice";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { theme: reduxTheme } = useAppSelector((state) => state.ui);
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    if (theme && theme !== reduxTheme) {
      dispatch(setReduxTheme(theme as 'light' | 'dark'));
    }
  }, [theme, reduxTheme, dispatch]);

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
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Events", href: "/events" },
    { name: "Campaigns", href: "/campaigns" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Bema Hub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : isAuthenticated && user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <Avatar className="h-8 w-8 bg-primary/10">
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                    {user.name?.[0] || user.email?.[0] || "U"}
                  </div>
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
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      size="sm"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
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
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
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
