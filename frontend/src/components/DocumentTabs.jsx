import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios 임포트

const DocumentTabs = () => {
  const [documents, setDocuments] = useState([]); // API에서 가져올 문서 데이터
  const [activeDocumentIndex, setActiveDocumentIndex] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/articles/'); // FastAPI 백엔드 URL
        // API 응답 데이터를 source_filename별로 그룹화
        const groupedArticles = response.data.reduce((acc, article) => {
          const filename = article.source_filename;
          if (!acc[filename]) {
            acc[filename] = { source_filename: filename, articles: [] };
          }
          acc[filename].articles.push({
            title: article.title,
            content: article.content,
          });
          return acc;
        }, {});

        // 배열 형태로 변환
        const documentsArray = Object.values(groupedArticles);
        setDocuments(documentsArray);
        setLoading(false);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
        console.error('Error fetching articles:', err);
      }
    };

    fetchArticles();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const activeDocument = activeDocumentIndex !== null ? documents[activeDocumentIndex] : null;

  if (loading) {
    return <div className="text-center text-gray-600 text-lg mt-8">데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 text-lg mt-8">{error}</div>;
  }

  if (documents.length === 0) {
    return <div className="text-center text-gray-500 text-lg mt-8">표시할 문서가 없습니다.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      {/* Document Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 pb-2 mb-4 scrollbar-hide">
        {documents.map((doc, index) => (
          <button
            key={doc.source_filename}
            className={`
              px-6 py-3 text-lg font-medium whitespace-nowrap
              ${index === activeDocumentIndex
                ? 'border-b-4 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-blue-500 hover:border-blue-300 border-b-4 border-transparent'
              }
              focus:outline-none transition-colors duration-200
            `}
            onClick={() => setActiveDocumentIndex(index)}
          >
            {doc.source_filename}
          </button>
        ))}
      </div>

      {/* Article List - activeDocument가 있을 때만 렌더링 */}
      {activeDocument ? (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {activeDocument.source_filename} 조문 목록
          </h2>
          <ul className="space-y-4">
            {activeDocument.articles.map((article, index) => (
              <li key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <h3 className="text-xl font-medium text-gray-700 mb-1">{article.title}</h3>
                <p className="text-gray-600 leading-relaxed">{article.content}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-8">문서를 선택하여 조문 목록을 확인하세요.</p>
      )}
    </div>
  );
};

export default DocumentTabs;
