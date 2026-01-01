import React, { useState, useEffect } from 'react'
import milanData from './data/milan.json'
import florenceData from './data/florence.json'
import veniceData from './data/venice.json'
import romeData from './data/rome.json'
import veronaData from './data/verona.json'
import PostcardSandbox from './PostcardSandbox'

// Footprint Form Component
function FootprintForm({ arch, existingFootprint, onSave, onDelete, onCancel }) {
  const [note, setNote] = useState(existingFootprint?.note || '');
  const [mood, setMood] = useState(existingFootprint?.mood || '');

  const moods = ['震撼', '平靜', '浪漫', '孤獨', '感動', '其他'];

  const handleSubmit = () => {
    if (!note.trim()) {
      alert('請寫下您的感受');
      return;
    }
    onSave(note, mood);
  };

  return (
    <div style={{ color: '#fff' }}>
      <header style={{ marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
        <h2 style={{ color: 'var(--accent-gold)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
          {arch.name} - {existingFootprint ? '我的足跡' : '留下足跡'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#888' }}>
          📅 {new Date(existingFootprint?.timestamp || Date.now()).toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </header>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontSize: '0.9rem' }}>
          📝 寫下你的感受...
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="下午三點的陽光從玫瑰窗灑進來，那一刻我想起了..."
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '0.8rem',
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
          maxLength={500}
        />
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.3rem', textAlign: 'right' }}>
          {note.length}/500
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.8rem', color: '#ccc', fontSize: '0.9rem' }}>
          😊 選擇情緒標籤
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {moods.map(m => (
            <button
              key={m}
              onClick={() => setMood(m)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: mood === m ? '2px solid var(--accent-gold)' : '1px solid #444',
                background: mood === m ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                color: mood === m ? 'var(--accent-gold)' : '#ccc',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {existingFootprint && (
          <button
            onClick={onDelete}
            style={{
              flex: 1,
              padding: '0.8rem',
              borderRadius: '6px',
              border: '1px solid #d32f2f',
              background: 'transparent',
              color: '#d32f2f',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            刪除
          </button>
        )}
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '0.8rem',
            borderRadius: '6px',
            border: '1px solid #444',
            background: 'transparent',
            color: '#888',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          取消
        </button>
        <button
          onClick={handleSubmit}
          style={{
            flex: 1,
            padding: '0.8rem',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--accent-gold)',
            color: '#000',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          儲存足跡
        </button>
      </div>
    </div>
  );
}

function App() {

  const cities = [
    { id: 'milan', name: '米蘭', en: 'MILANO', intro: '哥德尖塔與現代時尚的垂直交匯', data: milanData },
    { id: 'venice', name: '威尼斯', en: 'VENEZIA', intro: '漂浮於潟湖之上的拜占庭夢境', data: veniceData },
    { id: 'verona', name: '維羅納', en: 'VERONA', intro: '羅馬遺跡與中世紀紅磚的層疊', data: veronaData },
    { id: 'florence', name: '佛羅倫斯', en: 'FIRENZE', intro: '文藝復興與理性美學的起源地', data: florenceData },
    { id: 'rome', name: '羅馬', en: 'ROMA', intro: '永恆之城的帝國榮光與廢墟美學', data: romeData }
  ];

  // --- Voice Engine ---
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  const handleSpeak = (text, archId) => {
    window.speechSynthesis.cancel(); // Stop previous
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW'; // Chinese Taiwan
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setCurrentPlayingId(null);
    window.speechSynthesis.speak(utterance);
    setCurrentPlayingId(archId);
  };

  const handleToggleAudio = (text, archId) => {
    if (currentPlayingId === archId) {
      window.speechSynthesis.cancel();
      setCurrentPlayingId(null);
    } else {
      handleSpeak(text, archId);
    }
  };

  // --- Footprint System ---
  const [footprints, setFootprints] = useState([]);
  const [showFootprintModal, setShowFootprintModal] = useState(false);
  const [currentFootprintArch, setCurrentFootprintArch] = useState(null);

  // Load footprints from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('footprints');
    if (saved) {
      try {
        setFootprints(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load footprints:', e);
      }
    }
  }, []);

  // Save footprints to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('footprints', JSON.stringify(footprints));
  }, [footprints]);

  // Check if architecture has footprint
  const hasFootprint = (archId) => {
    return footprints.some(f => f.archId === archId);
  };

  // Get footprint for architecture
  const getFootprint = (archId) => {
    return footprints.find(f => f.archId === archId);
  };

  // Add or update footprint
  const saveFootprint = (archId, archName, cityName, note, mood) => {
    const timestamp = Date.now();
    const existingIndex = footprints.findIndex(f => f.archId === archId);

    if (existingIndex >= 0) {
      // Update existing
      const updated = [...footprints];
      updated[existingIndex] = { archId, archName, cityName, timestamp, note, mood };
      setFootprints(updated);
    } else {
      // Add new
      setFootprints([...footprints, { archId, archName, cityName, timestamp, note, mood }]);
    }
  };

  // Delete footprint
  const deleteFootprint = (archId) => {
    setFootprints(footprints.filter(f => f.archId !== archId));
  };

  // Open footprint modal
  const openFootprintModal = (arch) => {
    setCurrentFootprintArch(arch);
    setShowFootprintModal(true);
  };

  const [activeCity, setActiveCity] = useState(cities[0]);
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [showSandbox, setShowSandbox] = useState(false);
  const [view, setView] = useState('portal'); // 'portal' or 'architecture'
  const [postcardData, setPostcardData] = useState({ image: '/arch_images/milan_01.png', text: '', source: '' });
  const [bgImage, setBgImage] = useState('/portal_assets/desktop_bg.png');
  const [quote, setQuote] = useState('');

  // Random Background & Quote Logic
  useEffect(() => {
    // Backgrounds
    const backgrounds = [
      '/portal_assets/desktop_bg.png',
      '/portal_assets/portal_bg_2.png',
      '/portal_assets/portal_bg_3.png',
      '/portal_assets/portal_bg_4.png',
      '/portal_assets/portal_bg_5.png',
      '/portal_assets/portal_bg_6.png',
      '/portal_assets/portal_bg_7.png',
      '/portal_assets/portal_bg_8.png',
      '/portal_assets/portal_bg_9.png',
      '/portal_assets/portal_bg_10.png',
      '/portal_assets/portal_bg_11.png',
      '/portal_assets/portal_bg_12.png'
    ];
    // Golden Quotes (Literature, Art, Cinema, Architecture)
    const quotes = [
      "城市猶如夢境，是用渴望與恐懼構築而成的。\nCities, like dreams, are made of desires and fears. — Italo Calvino",
      "我看見大理石中的天使，於是我不停雕刻，直到讓他自由。\nI saw the angel in the marble and carved until I set him free. — Michelangelo",
      "夢境與現實之間，並沒有界線。\nThere is no line between the imaginary and the real. — Federico Fellini",
      "簡約是細膩的極致。\nSimplicity is the ultimate sophistication. — Leonardo da Vinci",
      "電影，就是雕刻時光。\nDirecting is sculpting in time. — Andrei Tarkovsky",
      "建築是凝固的音樂，而電影是流動的建築。\nArchitecture is frozen music, Cinema is fluid architecture."
    ];

    // Randomly select one on mount
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    setBgImage(randomBg);
    setQuote(randomQuote);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle Browser History & Routing
  useEffect(() => {
    // 1. Initial Load: Check URL path
    const path = window.location.pathname;
    if (path === '/architecture') {
      setView('architecture');
    } else if (path === '/journey') {
      setView('journey');
    } else {
      setView('portal');
    }

    // 2. Handle Back/Forward Button
    const handlePopState = (event) => {
      const currentPath = window.location.pathname;
      if (currentPath === '/architecture') {
        setView('architecture');
      } else if (currentPath === '/journey') {
        setView('journey');
      } else {
        setView('portal');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation Helper
  const navigateTo = (targetView) => {
    if (targetView === 'architecture') {
      window.history.pushState({ view: 'architecture' }, '', '/architecture');
      setView('architecture');
    } else {
      window.history.pushState({ view: 'portal' }, '', '/');
      setView('portal');
    }
  };

  // Global Search Logic
  const allData = cities.flatMap(city =>
    city.data.map(item => ({ ...item, cityName: city.name, cityId: city.id }))
  );

  const filteredData = search
    ? allData.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.history_text && item.history_text.toLowerCase().includes(search.toLowerCase())) ||
      (item.features && item.features.toLowerCase().includes(search.toLowerCase()))
    )
    : activeCity.data;

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

  if (view === 'portal') {
    return (
      <div className="portal-container">
        <div className="portal-bg" style={{ backgroundImage: `url('${bgImage}')` }}></div>
        <div className="portal-content">
          <h1 className="portal-logo">EYENOTE<br />STUDIO</h1>
          <div className="portal-menu">
            <button
              className="portal-menu-item"
              onClick={() => navigateTo('architecture')}
            >
              [ 建築巡禮 ]
            </button>
            <button className="portal-menu-item" onClick={() => alert('劇本研究模組開發中...')}>[ 電影開發 ]</button>
            <button className="portal-menu-item" onClick={() => alert('關於導演頁面開發中...')}>[ 關於導演 ]</button>
            <button className="portal-menu-item" onClick={() => window.location.href = 'mailto:eyenote@gmail.com'}>[ 聯絡我們 ]</button>
          </div>

          <div className="portal-quote">
            {quote.split('\n').map((line, i) => (
              <p key={i} className={i === 0 ? "quote-zh" : "quote-en"}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div
          className="logo"
          onClick={() => navigateTo('portal')}
          title="返回首頁 (Back to Portal)"
        >
          <div>
            EYE 建築巡禮
            <span className="logo-subtitle">
              AI 視角重構世界經典建築
            </span>
          </div>
          <span className="logo-subtext">
            聯繫: <a href="mailto:eyenote@gmail.com" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>＠eyenote</a>
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

        {/* My Journey Button */}
        <div
          onClick={() => {
            setView('journey');
            window.history.pushState({}, '', '/journey');
          }}
          style={{
            marginTop: '1rem',
            padding: '0.8rem 1rem',
            background: view === 'journey' ? 'var(--accent-gold)' : 'transparent',
            border: view === 'journey' ? 'none' : '1px solid var(--accent-gold)',
            color: view === 'journey' ? '#000' : 'var(--accent-gold)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          📖 我的旅程 {footprints.length > 0 && `(${footprints.length})`}
        </div>

        <div style={{ marginTop: '0.5rem', width: '100%' }}>
          <input
            type="text"
            placeholder="搜尋建築名稱、風格或歷史軼事..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 1rem', // Increased padding for "Grand" feel
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid #333',
              borderRadius: '6px', // Less rounded as requested
              color: '#fff',
              outline: 'none',
              fontSize: '0.9rem', // Slightly larger text
              textAlign: 'left' // Standard input alignment
            }}
          />
        </div>

        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          <div style={{ color: '#444', fontSize: '0.65rem', textAlign: 'center', letterSpacing: '2px', borderTop: '1px solid #222', paddingTop: '1rem' }}>
            EYE@note STUDIO
          </div>
        </div>
      </aside>

      {/* Main Exhibition Area */}
      <main className="main-content">
        {view === 'journey' ? (
          <div className="journey-container" style={{ padding: '2rem', color: '#fff' }}>
            <header style={{ marginBottom: '3rem', borderBottom: '1px solid #333', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
              <div>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: "'Noto Serif TC', serif" }}>
                  我的建築巡禮 <span style={{ color: 'var(--accent-gold)', fontSize: '0.5em', marginLeft: '10px', letterSpacing: '2px' }}>MY JOURNEY</span>
                </h2>
                <p style={{ color: '#888', letterSpacing: '1px', fontWeight: 300 }}>
                  紀錄每個感動的瞬間
                </p>
              </div>
              <div style={{ textAlign: 'right', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{footprints.length}</span> 個足跡
              </div>
            </header>

            {footprints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>💭</div>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>還沒有留下足跡</p>
                <button
                  className="btn-primary"
                  onClick={() => navigateTo('architecture')}
                  style={{
                    padding: '0.8rem 2rem',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#000',
                    borderRadius: '30px',
                    fontSize: '1rem',
                  }}
                >
                  開始探索
                </button>
              </div>
            ) : (
              <div className="footprint-timeline" style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', backgroundColor: '#333' }}></div>

                {[...footprints].sort((a, b) => b.timestamp - a.timestamp).map((footprint, index) => {
                  // Find city data to get image url (fallback if needed, though we don't store image url directly yet)
                  // We stored archId. Let's find the image URL from our data.
                  // This is a bit inefficient (searching all cities), but okay for client-side prototype.
                  let archImg = null;
                  for (const c of cities) {
                    const found = c.data.find(a => a.id === footprint.archId);
                    if (found) {
                      archImg = found.image_url || `/arch_images/${found.id}.png`;
                      break;
                    }
                  }

                  return (
                    <div key={footprint.archId} style={{ marginBottom: '3rem', paddingLeft: '60px', position: 'relative' }}>
                      {/* Dot */}
                      <div style={{
                        position: 'absolute',
                        left: '11px',
                        top: '24px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#1a1a1a',
                        border: '2px solid var(--accent-gold)',
                        zIndex: 1
                      }}></div>

                      {/* Content Card */}
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #333',
                        transition: 'transform 0.2s',
                      }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          {/* Image Thumbnail */}
                          {archImg && (
                            <div
                              style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                flexShrink: 0,
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                // Navigate to architecture view and scroll to card (simple version: just switch view)
                                // To scroll to specific card would require more logic, for now just switch view
                                const cityId = Object.keys(cities).find(key => cities[key]?.data?.some(a => a.id === footprint.archId)) // incorrect logic, cities is array
                                const targetCity = cities.find(c => c.data.find(a => a.id === footprint.archId));
                                if (targetCity) {
                                  setActiveCity(targetCity);
                                  navigateTo('architecture');
                                  // Ideally scroll to element
                                }
                              }}
                            >
                              <img src={archImg} alt={footprint.archName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}

                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-gold)', margin: 0 }}>
                                {footprint.archName}
                              </h3>
                              <span style={{ fontSize: '0.85rem', color: '#666' }}>
                                {new Date(footprint.timestamp).toLocaleDateString()}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#888' }}>
                              <span>📍 {footprint.cityName}</span>
                              {footprint.mood && (
                                <span style={{ color: '#ccc', border: '1px solid #444', padding: '0 8px', borderRadius: '10px', fontSize: '0.8rem' }}>
                                  {footprint.mood}
                                </span>
                              )}
                            </div>

                            {footprint.note && (
                              <p style={{
                                fontSize: '0.95rem',
                                lineHeight: '1.6',
                                color: '#ddd',
                                whiteSpace: 'pre-wrap',
                                fontStyle: 'italic',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                padding: '1rem',
                                borderRadius: '6px',
                                borderLeft: '3px solid #555'
                              }}>
                                "{footprint.note}"
                              </p>
                            )}

                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                              <button
                                style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem', padding: '5px' }}
                                onClick={(e) => {
                                  const targetCity = cities.find(c => c.data.find(a => a.id === footprint.archId));
                                  if (targetCity) {
                                    // Pass full arch object if possible, or minimally what FootprintForm needs
                                    const archData = targetCity.data.find(a => a.id === footprint.archId);
                                    // Augment with cityName if missing
                                    const archObj = { ...archData, cityName: targetCity.name };
                                    openFootprintModal(archObj);
                                  }
                                }}
                              >
                                編輯
                              </button>
                              <button
                                style={{ background: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '0.9rem', padding: '5px' }}
                                onClick={() => {
                                  if (window.confirm(`確定要刪除 ${footprint.archName} 的足跡嗎？`)) {
                                    deleteFootprint(footprint.archId);
                                  }
                                }}
                              >
                                刪除
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <>
            <header>
              <h2>
                {activeCity.name} <span style={{ color: 'var(--accent-gold)', fontWeight: 300, fontSize: '0.6em', marginLeft: '10px', letterSpacing: '2px' }}>{activeCity.en}</span>
              </h2>
              <p style={{ color: '#888', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 300, letterSpacing: '1px' }}>
                {activeCity.intro}
              </p>


            </header>

            <section className="arch-grid">
              {filteredData.map((arch) => (
                <article key={arch.id} className="arch-card">
                  <div
                    className="card-image-container"
                  >
                    <div
                      className="card-img"
                      style={{ position: 'relative' }}
                      onClick={() => setSelectedImage(`/arch_images/${arch.id}.png`)}
                      style={{ cursor: 'zoom-in' }}
                    >
                      <img
                        src={arch.image_url || `/arch_images/${arch.id}.png`}
                        alt={arch.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="card-img-placeholder" style={{ display: 'none' }}>
                        [ AI 視覺預覽: {arch.key_visual ? arch.key_visual.substring(0, 30) : 'No Visual'}... ]
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {arch.name}
                        {search && arch.cityName && (
                          <span style={{
                            backgroundColor: '#333',
                            color: '#eee',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '0.65rem',
                            marginLeft: '4px',
                            fontWeight: 400,
                            border: '1px solid #444'
                          }}>
                            📍 {arch.cityName}
                          </span>
                        )}
                        {arch.is_unesco && (
                          <span style={{
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            border: '1px solid var(--accent-gold)',
                            borderRadius: '4px',
                            padding: '2px 8px',
                            color: 'var(--accent-gold)',
                            fontSize: '0.65rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 'fit-content',
                            letterSpacing: '1px',
                            fontWeight: 400,
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            gap: '4px',
                            marginLeft: '4px'
                          }}>
                            <span style={{ fontSize: '0.8rem' }}>🏛️</span>
                            <span style={{ transform: 'translateY(1px)' }}>UNESCO</span>
                          </span>
                        )}
                      </div>
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
                    <p className="history" style={{ color: '#eee', lineHeight: '1.6', marginBottom: '0.8rem', fontSize: '0.95rem', fontWeight: '300' }}>
                      {arch.history_text}
                    </p>
                    {/* Audio Player Control */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAudio(arch.story || arch.history_text, arch.id);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '1.2rem',
                        cursor: 'pointer',
                        opacity: currentPlayingId === arch.id ? 1 : 0.7,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', width: '1.2rem', display: 'inline-block', textAlign: 'center' }}>{currentPlayingId === arch.id ? '⊡' : '♪'}</span>
                      <span style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', fontWeight: '600' }}>
                        {currentPlayingId === arch.id ? '正在播放...' : '語音導覽'}
                      </span>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', gap: '0.5rem', width: '100%' }}>
                      <button
                        onClick={() => openSandbox(arch.image_url || `/arch_images/${arch.id}.png`, arch)}
                        className="btn-primary"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', padding: '0.7rem 0', whiteSpace: 'nowrap', backgroundColor: 'var(--accent-gold)', color: '#000', borderRadius: '6px' }}
                      >
                        寫明信片
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => setSelectedInfo(arch)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', padding: '0.7rem 0', whiteSpace: 'nowrap', borderRadius: '6px', background: 'transparent', border: '1px solid #444', color: '#ccc' }}
                      >
                        導覽攻略
                      </button>
                      <button
                        className="btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStory(arch);
                        }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', padding: '0.7rem 0', whiteSpace: 'nowrap', borderRadius: '6px', border: '1px solid #444', color: '#ccc', background: 'transparent' }}
                      >
                        建築故事
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openFootprintModal(arch);
                        }}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          padding: '0.7rem 0',
                          whiteSpace: 'nowrap',
                          borderRadius: '6px',
                          background: 'transparent',
                          border: hasFootprint(arch.id) ? '1px solid var(--accent-gold)' : '1px solid #444',
                          color: hasFootprint(arch.id) ? 'var(--accent-gold)' : '#ccc',
                          fontWeight: hasFootprint(arch.id) ? '600' : '400'
                        }}
                      >
                        {hasFootprint(arch.id) ? '❤️ 足跡' : '留下足跡'}
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
                          openSandbox(selectedInfo.image_url || `/arch_images/${selectedInfo.id}.png`, selectedInfo);
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
                            borderRadius: '6px',
                            background: 'transparent',
                            border: '1px solid var(--accent-gold)',
                            color: 'var(--accent-gold)'
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
                    <button className="btn-secondary" onClick={() => setSelectedInfo(null)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'transparent', border: '1px solid #444', color: '#888' }}>
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

            {/* Building Story Drawer (建築故事) - 改為居中彈窗對齊導演偏好 */}
            {selectedStory && (
              <div
                className="lightbox"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1100,
                  animation: 'fadeIn 0.3s forwards',
                  padding: '1rem'
                }}
                onClick={() => setSelectedStory(null)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '85vh',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '16px',
                    padding: '2rem 1.5rem',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                    border: '1px solid #333'
                  }}
                >
                  <button
                    onClick={() => setSelectedStory(null)}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      fontSize: '1.8rem',
                      cursor: 'pointer',
                      zIndex: 10,
                      opacity: 0.6
                    }}
                  >
                    ×
                  </button>

                  <div className="custom-scrollbar" style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
                    <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.6rem',
                        color: 'var(--accent-gold)',
                        marginBottom: '0.3rem',
                        letterSpacing: '1px'
                      }}>
                        {selectedStory.name_en || selectedStory.name.split('/')[0]}
                      </h3>
                      <div style={{
                        fontFamily: "'Noto Serif TC', serif",
                        fontSize: '1.25rem',
                        color: 'var(--accent-gold)',
                        fontWeight: '700',
                        marginTop: '0.2rem'
                      }}>
                        {selectedStory.name}
                      </div>
                      <div style={{
                        width: '80%',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
                        opacity: 0.55,
                        margin: '1.5rem auto'
                      }} />
                    </header>

                    <div style={{
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      color: '#ddd',
                      textAlign: 'justify',
                      whiteSpace: 'pre-wrap',
                      marginBottom: '2rem',
                      fontFamily: "var(--font-sans, sans-serif)",
                      fontWeight: '300',
                      opacity: 0.95
                    }}>
                      {selectedStory.story || "這座建築的故事正在歷史的塵埃中甦醒，敬請期待。"}
                    </div>

                    {selectedStory.quotes && selectedStory.quotes.length > 0 && (
                      <footer style={{
                        marginTop: '1.5rem',
                        padding: '1rem 1.2rem',
                        backgroundColor: 'var(--accent-gold)',
                        borderRadius: '10px',
                        marginBottom: '1rem',
                        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)'
                      }}>
                        {selectedStory.quotes.map((q, i) => (
                          <div key={i} style={{ marginBottom: i === selectedStory.quotes.length - 1 ? 0 : '1rem' }}>
                            <p style={{
                              color: '#000',
                              fontSize: '0.92rem',
                              fontStyle: 'normal',
                              fontFamily: "'Noto Serif TC', serif",
                              fontWeight: '600',
                              lineHeight: '1.6',
                              letterSpacing: '0px'
                            }}>
                              {q.text}
                              <span style={{
                                color: '#000',
                                fontSize: '0.75rem',
                                marginLeft: '12px',
                                fontFamily: "var(--font-sans, sans-serif)",
                                fontStyle: 'normal',
                                opacity: 0.7,
                                whiteSpace: 'nowrap',
                                fontWeight: '700'
                              }}>
                                {q.source}
                              </span>
                            </p>
                          </div>
                        ))}
                      </footer>
                    )}

                    <button
                      className="btn-secondary"
                      onClick={() => setSelectedStory(null)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'transparent', border: '1px solid #444', color: '#888' }}
                    >
                      返回畫廊
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footprint Modal */}
            {showFootprintModal && currentFootprintArch && (
              <div className="lightbox" onClick={() => setShowFootprintModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '2rem' }}>
                  <FootprintForm
                    arch={currentFootprintArch}
                    existingFootprint={getFootprint(currentFootprintArch.id)}
                    onSave={(note, mood) => {
                      saveFootprint(
                        currentFootprintArch.id,
                        currentFootprintArch.name,
                        currentFootprintArch.cityName || activeCity.name,
                        note,
                        mood
                      );
                      setShowFootprintModal(false);
                    }}
                    onDelete={() => {
                      deleteFootprint(currentFootprintArch.id);
                      setShowFootprintModal(false);
                    }}
                    onCancel={() => setShowFootprintModal(false)}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
