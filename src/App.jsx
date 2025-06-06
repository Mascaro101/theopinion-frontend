import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./NavBar/NavBar.jsx";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import Subscription from "./Subscription/Subscription.jsx";
import Payment from "./Payment/Payment.jsx";
import Settings from "./Settings/Settings.jsx";
import "./App.css";
import axios from "axios";

import SingleArticle from "./Article/SingleArticle.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/:tab" element={<Settings />} />
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<SingleArticle />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // You'll need to add your authentication token here
        const response = await axios.get("http://localhost:5000/api/articles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setArticles(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div className="main-content">Loading articles...</div>;
  if (error) return <div className="main-content">Error: {error}</div>;

  return (
    <main className="main-content">
      <div className="categories">
        <button>Technology</button>
        <button>Science</button>
        <button>Culture</button>
        <button>Opinion</button>
        <button>Business</button>
        <button>Insights</button>
      </div>
      
      {articles.length > 0 && (
        <>
          {/* Featured Article - using the first article as featured */}
          <div className="featured-article">
            <div className="article-image placeholder-image"></div>
            <div className="article-content">
              <h2>{articles[0].titulo}</h2>
              <p className="article-date">
                {new Date(articles[0].createdAt).toLocaleDateString()}
              </p>
              <p>{articles[0].segundo_titulo}</p>
              <a className="read-more" href={`/article/${articles[0]._id}`}>
                Read More
              </a>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="articles-grid">
            {articles.slice(1).map((article) => (
              <div className="article-card" key={article._id}>
                {article.article_Special && (
                  <div className="article-content subscription-required">
                    <p className="subscription-tag">Subscription Required</p>
                    <h3>{article.titulo}</h3>
                    <p className="article-date">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                    <a className="read-more" href={`/article/${article._id}`}>
                      Read More
                    </a>
                  </div>
                )}
                {!article.article_Special && (
                  <>
                    <div className="article-image"></div>
                    <h3>{article.titulo}</h3>
                    <p className="article-date">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                    <a className="read-more" href={`/article/${article._id}`}>
                      Read More
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <button className="load-more">Load More Articles</button>

      <footer className="site-footer">
        {/* ... (keep your existing footer code) ... */}
      </footer>
    </main>
  );
}

export default App;