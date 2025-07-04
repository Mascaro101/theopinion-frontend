import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./SingleArticle.css"; // <-- import the CSS file

function SingleArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("1", token)
        const response = await axios.get(
          `http://localhost:5000/api/articles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("2", token)
        console.log("Article fetched:", response.data);
        setArticle(response.data);
        console.log("3", token)
      } catch (err) {
        setError("Error fetching article");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("Calling comment API with ID:", id);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/articles/${id}/comment`,
        { commentText: newComment, user: "Anonymous" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment("");
      setArticle(response.data);
      setCommentError(null);
    } catch (err) {
      setCommentError("Failed to post comment.");
    }
  };
if (loading) return <div>Loading...</div>;
  if (error || !article) return <div>{error || "Article not found"}</div>;

  return (
    <div className="single-article-container">
      <h1>{article.titulo}</h1>
      <p className="subtitle">{article.segundo_titulo}</p>
      <p className="subtitle">Level of permission {article.permission}</p>
      <div>{article.contenido}</div>

      {article.Imagenes?.length > 0 && (
        <div className="article-images">
          <h3>Images</h3>
          {article.Imagenes.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Article image ${index + 1}`}
              className="article-img"
              style={{ maxWidth: "100%", marginBottom: "1rem" }}
            />
          ))}
        </div>
      )}



      <div className="comments-section">
        <h3>Comments</h3>
        {article.comentarios?.length > 0 ? (
          article.comentarios.map((c, i) => (
            <div key={i} className="comment">
              <strong>{c.user}</strong>
              {c.email && <span style={{ color: "#888", marginLeft: 8 }}>({c.email})</span>}
              : {c.text}
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}

        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            required
          />
          <button type="submit">Post Comment</button>
        </form>
        {commentError && <p className="error">{commentError}</p>}
      </div>
    </div>
  );
}

export default SingleArticle;