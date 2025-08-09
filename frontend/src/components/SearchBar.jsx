import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate(); // ✅ 추가

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      // ✅ 검색 페이지로 이동하면서 쿼리 파라미터 전달
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="w-full max-w-2xl flex mb-10 shadow-md rounded-lg overflow-hidden">
      <input
        type="text"
        placeholder="검색어를 입력하세요..."
        className="flex-grow p-4 text-lg border-none outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <button
        className="px-6 py-4 bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
        onClick={handleSearchClick}
      >
        검색
      </button>
    </div>
  );
};

export default SearchBar;
