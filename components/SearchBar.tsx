'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const router = useRouter()

    const popularSearches = [
        'Dell PowerEdge Server',
        'HP Laptop',
        'Lenovo ThinkPad',
        'CCTV Camera',
        'Biometric System',
        'Network Switch'
    ]

    useEffect(() => {
        if (query.length > 1) {
            // Filter popular searches based on query
            const filtered = popularSearches.filter(item =>
                item.toLowerCase().includes(query.toLowerCase())
            )
            setSuggestions(filtered)
            setShowSuggestions(true)
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }
    }, [query])

    const handleSearch = (searchQuery: string) => {
        if (searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery)}`)
            setShowSuggestions(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSearch(query)
    }

    return (
        <div className="relative w-full max-w-md">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>

            {/* Autocomplete Suggestions */}
            {showSuggestions && (query.length > 0 || suggestions.length > 0) && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSearch(suggestion)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                            >
                                <Search className="h-4 w-4 text-gray-400" />
                                <span>{suggestion}</span>
                            </button>
                        ))
                    ) : query.length > 1 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                            No suggestions found
                        </div>
                    ) : (
                        <div className="px-4 py-2">
                            <div className="text-xs font-semibold text-gray-500 mb-2">Popular Searches</div>
                            {popularSearches.slice(0, 5).map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSearch(item)}
                                    className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
