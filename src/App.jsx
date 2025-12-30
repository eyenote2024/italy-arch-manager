import React, { useState, useEffect } from 'react'
import milanData from './data/milan.json'
import florenceData from './data/florence.json'
import veniceData from './data/venice.json'
import romeData from './data/rome.json'
import PostcardSandbox from './PostcardSandbox'

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
  const [selectedInfo, setSelectedInfo] = useState(null); // 新增：導覽與攻略狀態
  const [showSandbox, setShowSandbox] = useState(false);
  const [postcardData, setPostcardData] = useState({ image: '/arch_images/milan_01.png', text: '', source: '' });

  const filteredData = activeCity.data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.history_text && item.history_text.toLowerCase().includes(search.toLowerCase())) ||
    (item.features && item.features.toLowerCase().includes(search.toLowerCase()))
  );

  // 進入實驗室的智慧邏輯
  const openSandbox = (imageSrc, buildingData) => {
    let selectedQuote = { text: '我在大理石的詩篇中，聽見了妳的低語。', source: '— 馬克．吐溫' };

    // 如果該建築有預設金句，則亂數抽籤
    if (buildingData && buildingData.quotes && buildingData.quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * buildingData.quotes.length);
      selectedQuote = buildingData.quotes[randomIndex];
    }

    setPostcardData({
      image: imageSrc,
      text: selectedQuote.text,
      source: selectedQuote.source
    });
    setShowSandbox(true);
  };

  if (showSandbox) {
    return (
      <PostcardSandbox
        imageSrc={postcardData.image}
        initialText={postcardData.text}
        initialSource={postcardData.source}
        onBack={() => setShowSandbox(false)}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo">
          EYE 建築工作室
          <span className="logo-subtext">
            設計: <span style={{ color: 'var(--accent-gold)' }}>陸拾陸電影</span>
            <br />
            聯繫: <a href="mailto:eyenote@gmail.com" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>eyenote@gmail.com</a>
            <br />
            狀態: 創意開發模式
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
        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          <div style={{ color: '#444', fontSize: '0.65rem', textAlign: 'center', letterSpacing: '2px', borderTop: '1px solid #222', paddingTop: '1rem' }}>
            EYE@note STUDIO
          </div>
        </div>
      </aside>

      {/* Main Exhibition Area */}
      <main className="main-content">
        <header>
          <h2>{activeCity.name} 建築巡禮</h2>
          <p className="subtitle">AI 視角：重構義大利經典</p>

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

                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', gap: '0.4rem', width: '100%' }}>
                  <button
                    onClick={() => openSandbox(`/arch_images/${arch.id}.png`, arch)}
                    className="btn-primary"
                    style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem 0.2rem', whiteSpace: 'nowrap', backgroundColor: 'var(--accent-gold)', color: '#000' }}
                  >
                    🖋️ 寫明信片
                  </button>
                  <button className="btn-secondary" onClick={() => setSelectedInfo(arch)} style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', fontSize: '0.85rem', padding: '0.6rem 0.2rem', whiteSpace: 'nowrap' }}>
                    📍 導覽攻略
                  </button>
                  <button
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPromptModal({ isOpen: true, text: arch.prompt || "咒語尚未建立" });
                    }}
                    style={{ flex: 1, fontSize: '0.85rem', padding: '0.6rem 0.2rem', whiteSpace: 'nowrap' }}
                  >
                    🪄 AI 咒語
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Tourist Info Modal (導覽與攻略) */}
        {selectedInfo && (
          <div
            className="lightbox" // Reusing lightbox class for overlay
            onClick={() => setSelectedInfo(null)}
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
              onClick={e => e.stopPropagation()}
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
                gap: '1rem',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: 'var(--accent-gold)', fontFamily: 'Playfair Display', margin: 0 }}>{selectedInfo.name}</h3>
                  <p style={{ color: '#888', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>{selectedInfo.name_en}</p>
                </div>
                <button
                  className="close-btn"
                  onClick={() => setSelectedInfo(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem'
                  }}
                >&times;</button>
              </div>
              <div className="custom-scrollbar" style={{ overflowY: 'auto', paddingRight: '5px', flex: 1 }}>
                <section style={{ marginBottom: '1.2rem' }}>
                  <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem' }}>
                    💡 參觀重點 (Must-See Checklist)
                  </h4>
                  {selectedInfo.visit_highlights && selectedInfo.visit_highlights.length > 0 ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}>
                      {selectedInfo.visit_highlights.map((h, i) => (
                        <div key={i} style={{
                          backgroundColor: '#252525',
                          padding: '0.5rem 0.8rem',
                          borderRadius: '4px',
                          borderLeft: '3px solid var(--accent-gold)',
                          color: '#eee',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          lineHeight: '1.3'
                        }}>
                          <span style={{ marginRight: '8px', opacity: 0.5, fontWeight: 'bold', fontSize: '0.8rem', minWidth: '15px' }}>{i + 1}</span>
                          {h}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#ccc' }}>參觀重點尚未提供。</p>
                  )}
                </section>

                <section style={{ marginBottom: '1rem' }}>
                  <button
                    onClick={() => {
                      openSandbox(`/arch_images/${selectedInfo.id}.png`, selectedInfo);
                      setSelectedInfo(null);
                    }}
                    className="btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '0.8rem',
                      width: '100%',
                      fontSize: '1rem',
                      fontWeight: '700',
                      borderRadius: '6px',
                      backgroundColor: '#d4af37',
                      color: '#000',
                      border: 'none',
                      cursor: 'pointer',
                      marginBottom: '0.8rem'
                    }}
                  >
                    🖋️ 寫明信片
                  </button>
                </section>

                <section style={{ marginBottom: '0.5rem' }}>
                  {selectedInfo.google_maps_url ? (
                    <a
                      href={selectedInfo.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '0.8rem',
                        width: '100%',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        fontWeight: '700',
                        borderRadius: '6px'
                      }}
                    >
                      🚀 在 Google Maps 中開啟定位
                    </a>
                  ) : (
                    <p style={{ color: '#ccc' }}>Google Maps 連結尚未提供。</p>
                  )}
                </section>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn-secondary" onClick={() => setSelectedInfo(null)} style={{ width: '100%' }}>
                  返回畫廊
                </button>
              </div>
            </div>
          </div>
        )}

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
