import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const ArticleSearch = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get('q');
        if (query) {
            setSearchTerm(query);
            fetchArticles(query);
        } else {
            setArticles([]); // Clear results if no query
        }
    }, [location.search]);

    const fetchArticles = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8000/articles/search?q=${query}`);
            setArticles(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Navigate to update URL and trigger useEffect
            window.history.pushState({}, '', `/search?q=${searchTerm.trim()}`);
            fetchArticles(searchTerm.trim());
        }
    };

    const truncateContent = (content, wordLimit) => {
        if (!content) return '';
        const words = content.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return content;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Search Regulations</h1>
            <form onSubmit={handleSearch} className="mb-8 flex justify-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by keyword..."
                    className="p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors duration-300"
                >
                    Search
                </button>
            </form>

            {loading && <div className="flex justify-center items-center text-xl">Searching...</div>}
            {error && <div className="flex justify-center items-center text-xl text-red-500">Error: {error.message}</div>}

            {!loading && !error && articles.length === 0 && searchTerm && (
                <p className="col-span-full text-center text-gray-500 text-lg mt-10">No articles found for "{searchTerm}".</p>
            )}
            {!loading && !error && articles.length === 0 && !searchTerm && (
                <p className="col-span-full text-center text-gray-500 text-lg mt-10">Enter a keyword to search for regulations.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.length > 0 && articles.map((article) => (
                    <Link to={`/articles/${article.id}`} key={article.id} className="block">
                        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
                            <div className="p-6 flex-grow">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h2>
                                <p className="text-gray-600 text-sm mb-4">
                                    {truncateContent(article.content, 30)}
                                </p>
                            </div>
                            <div className="p-6 pt-0 text-xs text-gray-500 border-t border-gray-100">
                                Source: <span className="font-medium">{article.source_filename || 'N/A'}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ArticleSearch;
