import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiRefreshCcw } from "react-icons/fi";

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
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!news[activeSection]) {
      fetchNews(activeSection);
    }
  }, [activeSection]);

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const refreshNews = () => {
    fetchNews(activeSection);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-black font-serif">
      <header className="bg-white text-black border-b-2 border-black py-4 text-center">
        <h1 className="text-5xl font-bold uppercase tracking-widest chomsky-font">C-Times</h1>
        <p className="text-lg italic chomsky-font">{today}</p>
      </header>

      <nav className="bg-white border-b border-black py-2 flex justify-center space-x-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 font-bold uppercase border-b-2 transition-all ${
              activeSection === section.id ? 'border-black' : 'border-transparent hover:border-gray-500'
            }`}
          >
            {section.name}
          </button>
        ))}
      </nav>

      <main className="flex-grow p-6 max-w-full mx-auto">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-3xl font-bold uppercase">{sections.find(s => s.id === activeSection)?.name} Today</h2>
          <FiRefreshCcw className='cursor-pointer' onClick={refreshNews} size={30} />
        </div>

        {error && <p className="text-red-600 mt-4">Error loading news: {error}</p>}

        {loading ? (
          <p className="text-center py-10 text-lg">Loading latest news...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {news[activeSection]?.length > 0 ? (
              news[activeSection].map((article) => (
                <a 
                  key={article.id} 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass block rounded-xl p-4 shadow-lg border border-gray-500 hover:shadow-xl transition-all"
                >
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-48 object-cover mb-3"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/api/placeholder/300/200'; }}
                  />
                  <h3 className="text-xl font-bold mb-2 leading-tight">{article.title}</h3>
                  <p className="text-gray-700 text-sm mb-2">{article.snippet}</p>
                  <p className="text-xs font-bold uppercase text-gray-600">{article.source}</p>
                </a>
              ))
            ) : (
              <p className="text-center col-span-2 py-10">No news articles available.</p>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-black py-4 text-center text-xs uppercase">
        <p>&copy; {new Date().getFullYear()} C-Times. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NewsPortal;