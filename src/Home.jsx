import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/articles", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (response.status === 401) {
          setUnauthorized(true);
          return; // ⛔ do not throw an error for 401
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    return imgPath.startsWith("http") ? imgPath : `http://localhost:5000${imgPath}`;
  };

  if (loading) return <div className="main-content">Loading articles...</div>;

  if (unauthorized)
    return (
      <div className="main-content unauthorized-message">
        <b>Content Cannot Be Accessed Without an Account</b>
      </div>
    );

  if (error) return <div className="main-content error-message">Error: {error}</div>;

  return (
    <main className="main-content">
      <div className="articles-grid">
        {articles.map((article) => {
          const imageUrl = getImageUrl(article.Imagenes?.[0]);

          return (
            <div key={article._id} className="article-card">
              {imageUrl && (
                <div className="image-wrapper">
                  <img
                    src={imageUrl}
                    alt={article.titulo}
                    className="article-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="article-content">
                <h3>{article.titulo}</h3>
                <p className="article-subtitle">{article.segundo_titulo}</p>
                <p className="article-meta">
                  {new Date(article.createdAt).toLocaleDateString()} •{" "}
                  {article.categoria}
                </p>
                <Link to={`/article/${article._id}`} className="read-more">
                  Read More →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Home;
