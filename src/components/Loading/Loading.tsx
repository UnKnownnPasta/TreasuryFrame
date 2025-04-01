import './loading.css'

export const Loading = () => (
  <div className="loading-screen">
    <div className="loading-animation">
      <div className="square"></div>
      <div className="square"></div>
      <div className="square"></div>
      <div className="square"></div>
    </div>
    <div className="loading-text">Loading...</div>
  </div>
);
