import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./NavBar/NavBar.jsx";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import SingleArticle from "./Article/SingleArticle.jsx";
import MockPayment from "./NavBar/MockPayment.jsx";
import "./App.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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
            <Route path="/mock-payment" element={<MockPayment />} />
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

  // Get user's permission from token
  let userPermission = 0;
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      userPermission = Number(decoded.permission) || 0;
    } catch (e) {
      console.error("Failed to decode token:", e);
      userPermission = 0;
    }
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/articles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticles(response.data.articles); // ✅ backend sends { articles: [...] }
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
          {/* Featured Article */}
          {Number(articles[0].permission) <= Number(userPermission) ? (
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
          ) : (
            <div className="featured-article">
              <div className="subscription-overlay">
                Subscription required to view this content
              </div>
              <div className="article-content">
                <h2>{articles[0].titulo}</h2>
                <p className="article-date">
                  {new Date(articles[0].createdAt).toLocaleDateString()}
                </p>
                <p>{articles[0].segundo_titulo}</p>
              </div>
            </div>
          )}

          {/* Article Grid */}
          <div className="articles-grid">
            {articles.slice(1).map((article) => {
              console.log("Article permission:", article.permission);
              console.log("User permission:", userPermission);

              return Number(article.permission) <= Number(userPermission) ? (
                <div className="article-card" key={article._id}>
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
                </div>
              ) : (
                <div className="article-card" key={article._id}>
                  <div className="subscription-overlay">
                    Subscription required to view this content
                  </div>
                  <h3>{article.titulo}</h3>
                  <p className="article-date">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
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
