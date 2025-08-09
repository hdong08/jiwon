import React from 'react';
import DocumentTabs from './DocumentTabs'; // DocumentTabs 컴포넌트 임포트

const LawSearchPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>법령 검색</h1>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        marginBottom: '40px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <input
          type="text"
          placeholder="Search by keyword..."
          style={{
            flexGrow: 1,
            padding: '15px 20px',
            border: 'none',
            outline: 'none',
            fontSize: '18px'
          }}
        />
        <button style={{
          padding: '15px 30px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '0 8px 8px 0',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          검색
        </button>
      </div>

      {/* 기존 법령 목록 대신 DocumentTabs 컴포넌트 렌더링 */}
      <DocumentTabs />

    </div>
  );
};

export default LawSearchPage;