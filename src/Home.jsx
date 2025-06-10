import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching articles..."); // Debug log
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://theopinion-backend-1.onrender.com/api/articles", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debug API data
        setArticles(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Function to handle image URLs
  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    
    // If it's already a full URL
    if (imgPath.startsWith('http')) return imgPath;
    
    // If it's a local path
    return `https://theopinion-backend-1.onrender.com${imgPath}`;
  };

  if (loading) return <div className="loading">Loading articles...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <main className="main-content">
      <div className="articles-grid">
        {articles.map((article) => {
          const imageUrl = getImageUrl(article.Imagenes?.[0]);
          console.log(`Article ID: ${article._id}, Image URL: ${imageUrl}`); // Debug each image

          return (
            <div key={article._id} className="article-card">
              {imageUrl && (
                <div className="image-wrapper">
                  <img
                    src={imageUrl}
                    alt={article.titulo}
                    className="article-image"
                    onError={(e) => {
                      console.error("Image failed to load:", imageUrl);
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
                  {new Date(article.createdAt).toLocaleDateString()} • {article.categoria}
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