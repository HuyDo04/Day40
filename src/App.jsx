import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPage, setPostsPage] = useState(25);

  useEffect(() => {
    fetch("https://dummyjson.com/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      });
  }, []);

  const searchValue = (e) => {
    setSearch(e.target.value);
  };

  console.log(search.length);
  const filteredPost = search.length >= 3
    ? posts.filter((item) => item.title.toLowerCase().includes(search))
    : posts;

  const lastPostIndex = currentPage * postsPage;
  const firstPostIndex = lastPostIndex - postsPage;
  const currentPosts = filteredPost.slice(firstPostIndex, lastPostIndex);

  const Pagination = ({ totalPosts, postPage, setCurrentPage, currentPage }) => {
    let pages = [];
    for (let i = 1; i <= Math.ceil(totalPosts / postPage); i++) {
      pages.push(i);
    }
    return (
      <div className="pagination">
        <button className="page-btn prev" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          « Trước
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button className="page-btn next" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pages.length))} disabled={currentPage === pages.length}>
          Sau »
        </button>
      </div>
    );
  };

  return (
    <div className="app">
      <h1>Danh sách bài viết</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm bài viết..."
          value={search}
          onChange={searchValue}
        />
      </div>

      {posts.length === 0 ? (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : filteredPost.length === 0 ? (
        <p className="no-results">Không tìm thấy bài viết nào.</p>
      ) : (
        <ul className="post-list">
          {currentPosts.map((item) => (
            <li key={item.id} className="post-item">
              <h2>{item.title}</h2>
              <p>{item.body}</p>
              <div className="post-meta">
                <span className="views">👀 {item.views}</span>
                <span className="likes">👍 {item.reactions.likes}</span>
                <span className="dislikes">👎 {item.reactions.dislikes}</span>
              </div>
              <div className="tags">
                {item.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination-container">
        <div className="records-per-page">
          <label htmlFor="records">Hiển thị:</label>
          <select id="records" className="records-select" value={postsPage} onChange={(e) => setPostsPage(Number(e.target.value))}>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>
        <Pagination totalPosts={filteredPost.length} postPage={postsPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
      </div>
    </div>
  );
}

export default App;
