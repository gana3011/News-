import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsPortal = () => {
  const [activeSection, setActiveSection] = useState('headlines');
  const [news, setNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sections = [
    { id: 'headlines', name: 'Headlines' },
    { id: 'politics', name: 'Politics' },
    { id: 'business', name: 'Business' },
    { id: 'sports', name: 'Sports' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'health', name: 'Health' }
  ];

  const fetchNews = async (category) => {
    setLoading(true);
    try {
      const apiKey = 'c637a368f40f4570b38a21b89c1ac860';
      let endpoint = `https://newsapi.org/v2/everything?q=india&apiKey=${apiKey}`;
      
      if (category !== 'headlines') {
        endpoint = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`;
      }

      console.log("Fetching:", endpoint);

      const response = await axios.get(endpoint);
      if (response.status !== 200) throw new Error('Failed to fetch news');

      const formattedNews = response.data.articles.map((article, index) => ({
        id: index + 1,
        title: article.title || 'No Title Available',
        snippet: article.description || 'No description available',
        source: article.source.name || 'Unknown Source',
        url: article.url,
        image: article.urlToImage || '/api/placeholder/300/200',
        publishedAt: article.publishedAt
      }));

      setNews(prevNews => ({
        ...prevNews,
        [category]: formattedNews
      }));

      setLoading(false);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!news[activeSection]) {
      fetchNews(activeSection);
    }
  }, [activeSection]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const refreshNews = () => {
    fetchNews(activeSection);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <header className="bg-white shadow-md w-full px-4 py-4 sm:px-6">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-red-700">Bharat News</h1>
            <p className="text-gray-500 ml-2 hidden md:block">India's Premier News Portal</p>
          </div>
          <span className="text-sm text-gray-600">{formattedDate}</span>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-red-700 text-white sticky top-0 z-10 w-full">
        <div className="flex space-x-1 overflow-x-auto py-3 scrollbar-hide px-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 font-medium rounded-md whitespace-nowrap transition-colors ${
                activeSection === section.id 
                  ? 'bg-white text-red-700' 
                  : 'hover:bg-red-600'
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
            {sections.find(s => s.id === activeSection)?.name} Today
          </h2>
          <button 
            onClick={refreshNews}
            className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>Error loading news: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
            <span className="ml-3 text-lg text-gray-700">Loading latest news...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news[activeSection]?.length > 0 ? (
              news[activeSection].map((article) => (
                <a 
                  key={article.id} 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-3 text-sm">{article.snippet}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-red-700">{article.source}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(article.publishedAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">No news articles available for this category.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 w-full text-center">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} Bharat News. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NewsPortal;
