'use client'

import {useState} from 'react'


export default function Header() {

    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Desktop Navigation - Left side */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="/campaigns" className="text-white hover:text-gray-300 transition-colors">
                            campaigns
                        </a>
                        <a href="/events" className="text-white hover:text-gray-300 transition-colors">
                            events
                        </a>
                        <div className="relative group">
                            <button
                                className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors">
                                explore
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-white p-2"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 6h16M4 12h16M4 18h16"/>
                            )}
                        </svg>
                    </button>

                    {/* Logo - Center */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <h1 className="text-2xl font-script italic">Logo</h1>
                    </div>

                    {/* Login Button - Right */}
                    <a
                        href="/login"
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        login
                    </a>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <nav className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
                        <div className="flex flex-col gap-4">
                            <a href="/campaigns" className="text-white hover:text-gray-300 transition-colors">
                                campaigns
                            </a>
                            <a href="/events" className="text-white hover:text-gray-300 transition-colors">
                                events
                            </a>
                            <a href="/explore" className="text-white hover:text-gray-300 transition-colors">
                                explore
                            </a>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    )
}