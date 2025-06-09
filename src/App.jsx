import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./NavBar/NavBar.jsx";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import SingleArticle from "./Article/SingleArticle.jsx";
import "./App.css";
import axios from "axios";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/articles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setArticles(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setUnauthorized(true);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div className="main-content">Loading articles...</div>;

  if (unauthorized) {
    return (
      <div className="main-content unauthorized-message">
        <b>Content Cannot Be Accessed Without an Account</b>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content error-message">
        <b>Error: {error}</b>
      </div>
    );
  }

  return (
    <main className="main-content">
      
      {articles.length > 0 && (
        <>
          <div className="featured-article">
            {articles[0].Imagenes?.[0] && (
              <img
                src={articles[0].Imagenes[0]}
                alt={articles[0].titulo}
                className="article-image"
              />
            )}
            <div className="article-content">
              <h2>{articles[0].titulo}</h2>
              <p className="article-date">
                {new Date(articles[0].createdAt).toLocaleDateString()}
              </p>
              <p>{articles[0].segundo_titulo}</p>
              <Link className="read-more" to={`/article/${articles[0]._id}`}>
                Read More
              </Link>
            </div>
          </div>

          <div className="articles-grid">
            {articles.slice(1).map((article) => (
              <div className="article-card" key={article._id}>
                {article.article_Special ? (
                  <div className="article-content subscription-required">
                    <p className="subscription-tag">Subscription Required</p>
                    <h3>{article.titulo}</h3>
                    <p className="article-date">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                    <Link className="read-more" to={`/article/${article._id}`}>
                      Read More
                    </Link>
                  </div>
                ) : (
                  <>
                    {article.Imagenes?.[0] && (
                      <img
                        src={article.Imagenes[0]}
                        alt={article.titulo}
                        className="article-image"
                      />
                    )}
                    <h3>{article.titulo}</h3>
                    <p className="article-date">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                    <Link className="read-more" to={`/article/${article._id}`}>
                      Read More
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <button className="load-more">Load More Articles</button>

      <footer className="site-footer">
        {/* Your footer content */}
      </footer>
    </main>
  );
}

export default App;
