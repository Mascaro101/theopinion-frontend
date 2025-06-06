import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Article.css";

const SingleArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setArticle(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching article:", err);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div className="article-loading">Cargando artículo...</div>;

  return (
    <div className="article-container">
      <div className="article-card">
        <h1 className="article-title">{article.titulo}</h1>
        <h2>{article.segundo_titulo}</h2>
        <div className="article-meta">
          <span className="article-date">{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
        {article.Imagenes && article.Imagenes.length > 0 && (
          <img className="article-image" src={article.Imagenes[0]} alt={article.titulo} />
        )}
        <div className="article-content">
          {Array.isArray(article.contenido)
            ? article.contenido.map((p, i) => <p key={i}>{p}</p>)
            : <p>{article.contenido}</p>}
        </div>
      </div>
    </div>
  );
};

export default SingleArticle;