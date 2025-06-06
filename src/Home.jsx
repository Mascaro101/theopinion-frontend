import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch("/api/articles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setArticles(data);
    };
    fetchArticles();
  }, []);

  return (
    <main className="main-content">
      <div className="articles-grid">
        {articles.map((a) => (
          <div key={a._id} className="article-card">
            <h3>{a.titulo}</h3>
            <p className="article-date">{new Date(a.createdAt).toLocaleDateString()}</p>
            <Link className="read-more" to={`/articles/${a._id}`}>Read More</Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;
