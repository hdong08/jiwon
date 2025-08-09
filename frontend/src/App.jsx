import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import ArticleSearch from './components/ArticleSearch';

function App() {
  return (
    <Router>
      <div className="p-4 max-w-4xl mx-auto">
        <header className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">사규 관리 시스템</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-blue-500 hover:underline">목록</Link>
            <Link to="/search" className="text-blue-500 hover:underline">검색</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<ArticleList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/search" element={<ArticleSearch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;