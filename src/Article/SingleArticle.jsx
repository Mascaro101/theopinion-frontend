import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function SingleArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchArticle = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/articles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setArticle(response.data);
    } catch (err) {
      setError("Error fetching article");
    } finally {
      setLoading(false);
    }
  };
  fetchArticle();
}, [id]);

  if (loading) return <div>Loading...</div>;
  if (error || !article) return <div>{error || "Article not found"}</div>;

  return (
    <div>
      <h1>{article.titulo}</h1>
      <p>{article.segundo_titulo}</p>
      {/* Render more article details here */}
    </div>
  );
}

export default SingleArticle;