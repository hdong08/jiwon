import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSource, setSelectedSource] = useState(null); // 새 상태 추가: 선택된 source_filename
    const location = useLocation();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = searchTerm
                    ? `http://localhost:8000/articles/search/?query=${searchTerm}`
                    : 'http://localhost:8000/articles/';

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setArticles(data);
                // 첫 로드 시, 첫 번째 source_filename을 기본으로 선택
                if (data.length > 0 && !selectedSource) {
                    const uniqueSources = [...new Set(data.map(article => article.source_filename))];
                    if (uniqueSources.length > 0) {
                        setSelectedSource(uniqueSources[0]);
                    }
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [searchTerm]);

    const handleSearch = (query) => {
        console.log("Searching for:", query);
        setSearchTerm(query);
    };

    const truncateContent = (content, wordLimit) => {
        if (!content) return '';
        const words = content.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return content;
    };

    // 고유한 source_filename 목록 추출
    const uniqueSourceFilenames = useMemo(() => {
        const sources = articles.map(article => article.source_filename);
        return [...new Set(sources)].filter(Boolean);
    }, [articles]);

    // 선택된 source_filename에 따라 문서 필터링
    const filteredArticles = useMemo(() => {
        if (!selectedSource) {
            return articles; // 아무것도 선택되지 않았다면 모든 문서 표시 (초기 상태)
        }
        return articles.filter(article => article.source_filename === selectedSource);
    }, [articles, selectedSource]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl">Loading articles...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-xl text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {/* Search Page Link */}
            <nav className="mb-8 flex justify-end">
                <Link
                    to="/search"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                >
                    Go to Search Page
                </Link>
            </nav>

            {/* SearchBar 컴포넌트 조건부 렌더링 */}
            {location.pathname === '/' && (
                <div className="mb-8">
                    <SearchBar onSearch={handleSearch} />
                </div>
            )}

            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Regulations List</h1>

            {/* Source Filename Tabs */}
            {uniqueSourceFilenames.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {uniqueSourceFilenames.map(source => (
                        <button
                            key={source}
                            onClick={() => setSelectedSource(source)}
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200
                                ${selectedSource === source
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                            `}
                        >
                            {source}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-4">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
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
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 text-lg mt-10">
                        {selectedSource
                            ? `No articles found for source: ${selectedSource}`
                            : 'No articles found.'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ArticleList;
