import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./NavBar/NavBar.jsx";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import Subscription from "./Subscription/Subscription.jsx";
import Payment from "./Payment/Payment.jsx";
import Settings from "./Settings/Settings.jsx";
import "./App.css";

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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function Home() {
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
      
      <div className="featured-article">
        <div className="article-image placeholder-image"></div>
        <div className="article-content">
          <h2>Unveiling the Future of Online Journalism</h2>
          <p className="article-date">October 20, 2023</p>
          <p>Explore the latest trends and technologies shaping the landscape of online news and magazine publishing.</p>
          <a className="read-more" href="#">Read More</a>
        </div>
      </div>

      <div className="articles-grid">
        <div className="article-card">
          <div className="article-image"></div>
          <h3>Deep Dive into AI-Powered Content Creation</h3>
          <p className="article-date">October 19, 2023</p>
          <a className="read-more" href="#">Read More</a>
        </div>
        
        <div className="article-card">
          <div className="article-content subscription-required">
            <p className="subscription-tag">Subscription Required</p>
            <h3>The Ethics of Algorithmic Curation in News Feeds</h3>
            <p className="article-date">October 18, 2023</p>
            <a className="read-more" href="#">Read More</a>
          </div>
        </div>
        
        <div className="article-card">
          <div className="article-image"></div>
          <h3>Behind the Scenes: A Day in the Life of a Digital Editor</h3>
          <p className="article-date">October 17, 2023</p>
          <a className="read-more" href="#">Read More</a>
        </div>

        <div className="article-card">
          <div className="article-content subscription-required">
            <p className="subscription-tag">Subscription Required</p>
            <h3>Mastering SEO for Online Magazines</h3>
            <p className="article-date">October 16, 2023</p>
            <a className="read-more" href="#">Read More</a>
          </div>
        </div>
        
        <div className="article-card">
          <div className="article-image"></div>
          <h3>The Evolution of Digital Storytelling</h3>
          <p className="article-date">October 15, 2023</p>
          <a className="read-more" href="#">Read More</a>
        </div>
        
        <div className="article-card">
          <div className="article-image"></div>
          <h3>Why Subscription Models are Key to Sustainable Journalism</h3>
          <p className="article-date">October 14, 2023</p>
          <a className="read-more" href="#">Read More</a>
        </div>

        <div className="article-card">
          <div className="article-content subscription-required">
            <p className="subscription-tag">Subscription Required</p>
            <h3>Navigating the Metaverse: New Frontiers for Content Creators</h3>
            <p className="article-date">October 13, 2023</p>
            <a className="read-more" href="#">Read More</a>
          </div>
        </div>
        
        <div className="article-card">
          <div className="article-image"></div>
          <h3>Cybersecurity Threats in the Digital Publishing World</h3>
          <p className="article-date">October 12, 2023</p>
          <a className="read-more" href="#">Read More</a>
        </div>

        <div className="article-card">
          <div className="article-content subscription-required">
            <p className="subscription-tag">Subscription Required</p>
            <h3>The Power of Visuals: Using Infographics Effectively</h3>
            <p className="article-date">October 11, 2023</p>
            <a className="read-more" href="#">Read More</a>
          </div>
        </div>
      </div>

      <button className="load-more">Load More Articles</button>

      <footer className="site-footer">
        <div className="footer-logo">
          <h2>Revista Online</h2>
        </div>
        
        <div className="newsletter-signup">
          <p>Stay up to date with our latest articles</p>
          <div className="signup-form">
            <input type="email" placeholder="Your email" />
            <button className="subscribe-button">Subscribe</button>
          </div>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h4>Explore</h4>
            <ul>
              <li><a href="#">Categories</a></li>
              <li><a href="#">Popular</a></li>
              <li><a href="#">Authors</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>English</p>
          <p>© 2023 Revista Online</p>
          <p>Accessibility</p>
          <p>Sitemap</p>
          <div className="social-icons">
            <a href="#" aria-label="Twitter"><i className="social-icon"></i></a>
            <a href="#" aria-label="Facebook"><i className="social-icon"></i></a>
            <a href="#" aria-label="Instagram"><i className="social-icon"></i></a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
