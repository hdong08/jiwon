import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading article...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">Error: {error.message}</div>;
  }

  if (!article) {
    return <div className="flex justify-center items-center h-screen text-xl">Article not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">{article.title}</h1>
      <p className="text-gray-600 text-sm mb-6">Source: {article.source_filename}</p>
      <div className="prose lg:prose-xl max-w-none">
        <p className="text-lg leading-relaxed text-gray-700">{article.content}</p>
      </div>
    </div>
  );
}

export default ArticleDetail;
