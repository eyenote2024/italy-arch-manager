import React, { useState, useEffect } from 'react'
import milanData from './data/milan.json'
import florenceData from './data/florence.json'
import veniceData from './data/venice.json'
import romeData from './data/rome.json'

function App() {

  const cities = [
    { id: 'milan', name: '米蘭', data: milanData },
    { id: 'florence', name: '佛羅倫斯', data: florenceData },
    { id: 'venice', name: '威尼斯', data: veniceData },
    { id: 'rome', name: '羅馬', data: romeData }
  ];

  const [activeCity, setActiveCity] = useState(cities[0]);
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [promptModal, setPromptModal] = useState({ isOpen: false, text: '' });

  const filteredData = activeCity.data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.history_text && item.history_text.toLowerCase().includes(search.toLowerCase())) ||
    (item.features && item.features.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo">
          EYE 建築工作室
          <span className="logo-subtext">
            設計: 陸拾陸電影 | 聯繫: <a href="mailto:eyenote@gmail.com" style={{ color: 'inherit', textDecoration: 'underline' }}>eyenote@gmail.com</a> | 狀態: 創意開發模式
          </span>
        </div>
        <nav className="city-nav">
          {cities.map(city => (
            <div
              key={city.id}
              className={`city-item ${activeCity.id === city.id ? 'active' : ''}`}
              onClick={() => setActiveCity(city)}
            >
              {city.name}
            </div>
          ))}
        </nav>

        {/* 原本底部的資訊已移除並整合至 Logo */}
      </aside>

      {/* Main Exhibition Area */}
      <main className="main-content">
        <header>
          <h2>{activeCity.name} 建築巡禮</h2>
          <p>透過 AI 視角，探索義大利跨越時空的經典地標。</p>

          <div style={{ marginTop: '1.5rem' }}>
            <input
              type="text"
              placeholder="搜尋建築名稱、風格或歷史軼事..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1.2rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                outline: 'none',
                fontFamily: 'Outfit'
              }}
            />
          </div>
        </header>

        <section className="arch-grid">
          {filteredData.map((arch) => (
            <article key={arch.id} className="arch-card">
              <div
                className="card-image-container"
                onClick={() => setSelectedImage(`/arch_images/${arch.id}.png`)}
                style={{ cursor: 'zoom-in' }}
              >
                <img
                  src={`/arch_images/${arch.id}.png`}
                  alt={arch.name}
                  onError={(e) => {
                    e.target.parentElement.style.pointerEvents = 'none';
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="card-img-placeholder" style={{ display: 'none' }}>
                  [ AI 視覺預覽: {arch.key_visual ? arch.key_visual.substring(0, 30) : 'No Visual'}... ]
                </div>
              </div>
              <div className="card-body">
                <h3>
                  {arch.name}
                  <span style={{
                    fontSize: '0.8rem',
                    display: 'block',
                    color: '#666',
                    fontWeight: 400,
                    marginTop: '4px'
                  }}>{arch.name_en || arch.name}</span>
                </h3>
                <div className="features">
                  {arch.features}
                </div>
                <p className="history">
                  {arch.history_text}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={`/arch_images/${arch.id}.png`}
                    download={`${arch.id}_${arch.name}.png`}
                    className="btn-secondary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ⬇ 下載原圖
                  </a>
                  <button
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPromptModal({ isOpen: true, text: arch.prompt || "提示詞尚未建立" });
                    }}
                  >
                    📜 複製提示詞
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Lightbox Overlay */}
        {selectedImage && (
          <div
            className="lightbox"
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              cursor: 'zoom-out',
              opacity: 0,
              animation: 'fadeIn 0.3s forwards'
            }}
          >
            <img
              src={selectedImage}
              alt="Full Detail"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                boxShadow: '0 0 50px rgba(0,0,0,0.8)',
                borderRadius: '4px'
              }}
            />
          </div>
        )}

        {/* Prompt Modal */}
        {promptModal.isOpen && (
          <div
            className="lightbox"
            onClick={() => setPromptModal({ isOpen: false, text: '' })}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#1a1a1a',
                padding: '2rem',
                borderRadius: '8px',
                border: '1px solid var(--accent-gold)',
                width: '80%',
                maxWidth: '600px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <h3 style={{ color: 'var(--accent-gold)', fontFamily: 'Playfair Display' }}>AI 生成提示詞</h3>
              <textarea
                readOnly
                value={promptModal.text}
                style={{
                  width: '100%',
                  height: '300px',
                  backgroundColor: '#111',
                  color: '#ccc',
                  border: '1px solid #333',
                  padding: '1rem',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  borderRadius: '4px',
                  resize: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setPromptModal({ isOpen: false, text: '' })}
                >
                  關閉
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(promptModal.text);
                    alert("提示詞已複製到剪貼簿！Prompt Copied!");
                  }}
                >
                  📋 複製全部
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
