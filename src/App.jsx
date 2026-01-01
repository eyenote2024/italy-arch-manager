import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'; // Import image generator
import milanData from './data/milan.json'
import florenceData from './data/florence.json'
import veniceData from './data/venice.json'
import romeData from './data/rome.json'
import veronaData from './data/verona.json'
import PostcardSandbox from './PostcardSandbox'

// Footprint Form Component
function FootprintForm({ arch, existingFootprint, onSave, onDelete, onCancel }) {
  const [note, setNote] = useState(existingFootprint?.note || arch?.quotes?.[0]?.text || '');
  const [mood, setMood] = useState(existingFootprint?.mood || '');
  // Date State for Editing (Text Mode)
  const [footprintDate, setFootprintDate] = useState(() => {
    const ts = existingFootprint?.timestamp || Date.now();
    const date = new Date(ts);
    // Format: YYYY/MM/DD HH:mm (Simple string for text input)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  });

  useEffect(() => {
    console.log("🛠️ FootprintForm Mounted for:", arch?.name);
  }, [arch]);

  const moods = ['震撼', '平靜', '浪漫', '孤獨', '感動', '其餘'];

  const handleSubmit = () => {
    if (!note.trim()) {
      alert('請寫下您的感受');
      return;
    }
    onSave(note, mood, new Date(footprintDate).getTime());
  };

  return (
    <div style={{ color: '#fff' }}>
      <header style={{ marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
        <h2 style={{ color: 'var(--accent-gold)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
          {arch.name} - {existingFootprint ? '我的足跡' : '留下足跡'}
        </h2>
        <div style={{ fontSize: '1.05rem', color: '#888', marginTop: '0.5rem', width: '100%' }}>
          <label style={{ cursor: 'pointer', display: 'block', width: '100%' }}>
            <input
              type="text"
              value={footprintDate}
              onChange={(e) => setFootprintDate(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid #444',
                borderRadius: '4px',
                padding: '0.8rem',
                color: '#fff',
                fontSize: '1rem',
                fontFamily: 'inherit',
                cursor: 'text',
                outline: 'none',
                width: '100%', // Match textarea width
                boxSizing: 'border-box'
              }}
            />
          </label>
        </div>
      </header>

      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontSize: '1.4rem' }}>
          寫下你的感受...
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="下午三點的陽光從玫瑰窗灑進來，那一刻我想起了..."
          style={{
            width: '100%',
            minHeight: '480px',
            padding: '0.8rem',
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '1.4rem',
            lineHeight: '1.6',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
          maxLength={500}
        />
        <p style={{ fontSize: '0.95rem', color: '#666', marginTop: '0.3rem', textAlign: 'right' }}>
          {note.length}/500
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.8rem', color: '#ccc', fontSize: '1.1rem' }}>
          😊 情緒標籤
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
                fontSize: '1.05rem',
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
            fontSize: '1.1rem',
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
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" style={{ opacity: 0.1, fill: '#000', stroke: 'none' }} />
            <path d="M12 18v-7" />
            <path d="M8 17l4-6" />
            <path d="M16 17l-4-6" />
            <path d="M4.2 14l7.8-3" />
            <path d="M19.8 14l-7.8-3" />
            <path d="M2 13a10 10 0 0 1 20 0" />
          </svg>
          足跡
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

  // --- User Identity ---
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || 'You Name';
  });

  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

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
  const [showJourneyModal, setShowJourneyModal] = useState(false);

  // Load footprints from LocalStorage on mount with error recovery
  useEffect(() => {
    try {
      const saved = localStorage.getItem('footprints');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFootprints(parsed);
          console.log('✅ Loaded footprints:', parsed.length);
        } else {
          console.warn('⚠️ Invalid footprints data, resetting');
          localStorage.removeItem('footprints');
          setFootprints([]);
        }
      }
    } catch (e) {
      console.error('❌ Failed to load footprints, clearing corrupted data:', e);
      localStorage.removeItem('footprints');
      setFootprints([]);
    }
  }, []);

  // Save footprints to LocalStorage with error handling
  useEffect(() => {
    try {
      if (footprints.length === 0) {
        localStorage.removeItem('footprints');
      } else {
        localStorage.setItem('footprints', JSON.stringify(footprints));
        console.log('💾 Saved footprints:', footprints.length);
      }
    } catch (e) {
      console.error('❌ Failed to save footprints:', e);
      alert('儲存失敗,請檢查瀏覽器儲存空間');
    }
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
  const saveFootprint = (archId, archName, cityName, note, mood, customTime = null) => {
    const timestamp = customTime || Date.now();
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
    console.log("👣 [DEBUG] openFootprintModal called for:", arch?.name, arch?.id);
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
  // User Personalization
  const [visitorName, setVisitorName] = useState(localStorage.getItem('visitorName') || 'Your Name');

  // Background Images for Journey Switcher
  const bgImages = [
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
    '/portal_assets/portal_bg_12.png',
    '/portal_assets/portal_bg_13.png',
    '/portal_assets/portal_bg_14.png',
    '/portal_assets/portal_bg_15.png',
    '/portal_assets/portal_bg_16.png',
    '/portal_assets/portal_bg_17.png',
    '/portal_assets/portal_bg_18.png',
    '/portal_assets/portal_bg_19.png',
    '/portal_assets/portal_bg_20.png'
  ];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  /* --- Handle Journey Navigation --- */
  const handleJourneyClick = (archId) => {
    let foundArch = null;
    let foundCity = null;

    // Search for the architecture across all cities
    for (const city of cities) {
      const list = Array.isArray(city.data) ? city.data : (city.data?.architectures || []);
      const target = list.find(a => a.id === archId);
      if (target) {
        foundArch = target;
        foundCity = city;
        break;
      }
    }

    if (foundArch) {
      setShowJourneyModal(false); // Close Journey Modal
      setView('architecture'); // Ensure we are in Architecture View
      setActiveCity(foundCity); // Switch to correct City Tab
      setTimeout(() => {
        openFootprintModal(foundArch); // Open Footprint/Message Modal (User Request)
      }, 100);
    }
  };

  const cycleBackground = () => {
    setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
  };

  /* --- Download Journey Function (Capture) --- */
  const downloadJourney = async () => {
    const modal = document.getElementById('journey-modal');
    if (!modal) return;

    // 1. Enter Export Mode (CSS handles visibility of title & controls)
    modal.classList.add('export-mode');

    // 2. Force Opacity for Items (still needed for animation safety)
    const items = modal.querySelectorAll('.journey-item');
    items.forEach(item => {
      item.style.opacity = '1';
      item.style.animation = 'none';
      // Ensure text is white/visible against dark bg
      const content = item.querySelector('.journey-content');
      if (content) content.style.color = '#fff';
    });

    try {
      // 3. Capture Screenshot
      const canvas = await html2canvas(modal, {
        useCORS: true,
        scale: 2, // High resolution
        backgroundColor: null, // Transparent background handling
        logging: false,
        allowTaint: true
      });

      // 4. Trigger Download
      const link = document.createElement('a');
      link.download = `${userName || 'My'}_Journey_Italy.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Snapshot failed:', err);
      alert('無法儲存圖片，請稍後再試');
    } finally {
      // 5. Exit Export Mode
      modal.classList.remove('export-mode');
    }
  };

  // Auto-cycle background for My Journey - REMOVED per user request
  // Manual control only


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
    } else if (path === '/' || path === '') {
      setView('portal');
    } else {
      // Default fallback
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
    } else if (targetView === 'journey') {
      window.history.pushState({ view: 'journey' }, '', '/journey');
      setView('journey');
    } else {
      window.history.pushState({ view: 'portal' }, '', '/');
      setView('portal');
    }
  };

  // Export Helper
  /* 
   * Export function: Now utilizing html2canvas to capture the visual memory
   * Updated to capture .main-content to include the full-screen background
   */
  const handleExportImage = async () => {
    // Target the main container which holds the background image
    const element = document.querySelector('.main-content');
    const btnText = document.getElementById('export-btn-text');

    if (!element) return;

    if (btnText) btnText.innerText = '顯影中...';

    try {
      // Wait a moment for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
        height: element.scrollHeight + 100,
        windowHeight: element.scrollHeight + 100,
        x: 0,
        y: 0,
        scrollY: -window.scrollY,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.main-content');
          const clonedInput = clonedDoc.querySelector('input[type="text"]');
          const clonedBtn = clonedDoc.querySelector('.btn-export-minimal');
          const clonedActions = clonedDoc.querySelectorAll('.action-buttons');
          const clonedChangeBtn = clonedDoc.querySelector('.btn-change-bg'); // Hide new button

          // 1. Ensure Layout in Clone (Should be naturally correct now)
          if (clonedElement) {
            clonedElement.style.backgroundAttachment = 'scroll';
            clonedElement.style.height = 'auto';
            clonedElement.style.minHeight = '100vh';
          }

          // 2. Hide Buttons
          if (clonedBtn) clonedBtn.style.display = 'none';
          if (clonedChangeBtn) clonedChangeBtn.style.display = 'none';
          clonedActions.forEach(el => el.style.display = 'none');

          // 3. SWAP INPUT WITH TEXT (Keep for font quality)
          if (clonedInput) {
            const textDiv = clonedDoc.createElement('div');
            textDiv.innerText = clonedInput.value;
            textDiv.style.color = 'var(--accent-gold)';
            textDiv.style.fontSize = '3.5rem';
            textDiv.style.fontFamily = "'Playfair Display', serif";
            textDiv.style.fontWeight = '500';
            textDiv.style.textShadow = '0 2px 10px rgba(0,0,0,0.5)';
            textDiv.style.marginBottom = '0.5rem';
            textDiv.style.lineHeight = '1.2';

            clonedInput.parentNode.replaceChild(textDiv, clonedInput);
          }
        }
      });

      if (btnText) btnText.innerText = '匯出回憶';

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `my_architecture_journey_${Date.now()}.png`;
      link.href = url;
      link.click();

    } catch (err) {
      console.error('Export failed:', err);
      if (btnText) btnText.innerText = '匯出失敗';
      setTimeout(() => { if (btnText) btnText.innerText = '匯出回憶'; }, 2000);
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
            <a href="mailto:eyenote@gmail.com" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>＠eyenote</a>
          </span>
        </div>
        <nav className="city-nav">
          {cities.map(city => (
            <div
              key={city.id}
              className={`city-item ${activeCity.id === city.id ? 'active' : ''}`}
              onClick={() => {
                setActiveCity(city);
                navigateTo('architecture');
                window.scrollTo(0, 0); // Scroll to top
              }}
            >
              {city.name}
            </div>
          ))}
        </nav>

        <div className="search-journey-row" style={{
          marginTop: '0.8rem',
          width: '100%',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'stretch'
        }}>
          <div style={{ flex: 2, height: '42px' }}>
            <input
              type="text"
              className="grand-ui-control"
              placeholder="搜尋建築名稱、風格..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid #333',
                color: '#fff',
                textAlign: 'left',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                padding: '0 0.8rem'
              }}
            />
          </div>

          <div style={{ flex: 1, height: '42px' }}>
            <button
              className="grand-ui-control"
              onClick={() => setShowJourneyModal(true)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--accent-gold)',
                color: 'var(--accent-gold)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                letterSpacing: '1px',
                width: '100%',
                height: '100%',
                padding: '0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-gold)';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--accent-gold)';
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" style={{ opacity: 0.1, fill: 'currentColor', stroke: 'none' }} />
                <path d="M12 18v-7" />
                <path d="M8 17l4-6" />
                <path d="M16 17l-4-6" />
                <path d="M4.2 14l7.8-3" />
                <path d="M19.8 14l-7.8-3" />
                <path d="M2 13a10 10 0 0 1 20 0" />
              </svg>
              <span>旅程</span>
            </button>
          </div>
        </div>

        <div style={{ marginTop: 'auto', padding: '1rem' }}>

          <div style={{ color: '#444', fontSize: '0.65rem', textAlign: 'center', letterSpacing: '2px', borderTop: '1px solid #222', paddingTop: '1rem' }}>
            EYE@note STUDIO
          </div>
        </div>
      </aside>

      {/* Main Exhibition Area */}
      <main className="main-content" style={{
        position: 'relative',
        minHeight: '100vh',
      }}>
        {/* Fixed Background Layer - Guaranteed Full Screen */}
        {/* Fixed Background Layer REMOVED as per user request for black bg */}
        {/* <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url('${bgImages[currentBgIndex]}')`,
          zIndex: 0
        }}></div> */}

        {/* Dark Overlay for readability - also fixed */}
        {/* Dark Overlay REMOVED - not needed for solid black bg */}
        {/* <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: 0 }}></div> */}

        {/* Architecture View */}
        <>
          <header>
            <h2>
              {activeCity.name} <span style={{ color: 'var(--accent-gold)', fontWeight: 300, fontSize: '0.6em', marginLeft: '10px', letterSpacing: '2px' }}>{activeCity.en}</span>
            </h2>
            <p style={{ color: '#fff', marginTop: '0.5rem', fontSize: '1.4rem', fontWeight: 300, letterSpacing: '1px' }}>
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
                    onClick={() => setSelectedImage(`/arch_images/${arch.id}.png`)}
                    style={{ position: 'relative', cursor: 'zoom-in' }}
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
                      fontSize: '1.1rem',
                      display: 'block',
                      color: '#666',
                      fontWeight: 400,
                      marginTop: '4px'
                    }}>{arch.name_en || arch.name}</span>
                  </h3>
                  <div className="features">
                    {arch.features}
                  </div>
                  <p className="history" style={{ color: '#eee', lineHeight: '1.6', marginBottom: '0.8rem', fontSize: '1.25rem', fontWeight: '300' }}>
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
                    <span style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', width: '1.2rem', display: 'inline-block', textAlign: 'center' }}>{currentPlayingId === arch.id ? '⊡' : '♪'}</span>
                    <span style={{ color: 'var(--accent-gold)', fontSize: '1.2rem', fontWeight: '600' }}>
                      {currentPlayingId === arch.id ? '正在播放...' : '語音導覽'}
                    </span>
                  </div>

                  <div className="action-buttons-grid">
                    <button
                      onClick={() => openSandbox(arch.image_url || `/arch_images/${arch.id}.png`, arch)}
                      className="btn-primary action-btn"
                    >
                      明信片
                    </button>
                    <button
                      className="btn-secondary action-btn"
                      onClick={() => setSelectedInfo(arch)}
                    >
                      攻略
                    </button>
                    <button
                      className="btn-primary action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStory(arch);
                      }}
                    >
                      故事
                    </button>
                    <button
                      className="action-btn-footprint"
                      onClick={(e) => {
                        e.stopPropagation();
                        openFootprintModal(arch);
                      }}
                      style={{
                        border: hasFootprint(arch.id) ? '1px solid var(--accent-gold)' : undefined,
                        color: hasFootprint(arch.id) ? 'var(--accent-gold)' : undefined,
                        fontWeight: hasFootprint(arch.id) ? '600' : undefined
                      }}
                    >
                      {hasFootprint(arch.id) ? (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" style={{ opacity: 0.1, fill: 'currentColor', stroke: 'none' }} />
                            <path d="M12 18v-7" />
                            <path d="M8 17l4-6" />
                            <path d="M16 17l-4-6" />
                            <path d="M4.2 14l7.8-3" />
                            <path d="M19.8 14l-7.8-3" />
                            <path d="M2 13a10 10 0 0 1 20 0" />
                          </svg>
                          足跡
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '1.2rem', marginRight: '4px', display: 'flex' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C13.5 2 14.8 2.8 15.6 4H19C20.1 4 21 4.9 21 6V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V6C3 4.9 3.9 4 5 4H8.4C9.2 2.8 10.5 2 12 2ZM12 4C11.1 4 10.3 4.6 10.1 5.5L10 6H5V18H19V6H14L13.9 5.5C13.7 4.6 12.9 4 12 4Z" fill="#D4AF37" />
                              <path d="M12 18C13.5 18 14.5 16.5 14.5 15C14.5 13.5 13.5 12 12 12C10.5 12 9.5 13.5 9.5 15C9.5 16.5 10.5 18 12 18Z" fill="#D4AF37" fillOpacity="0.5" />
                            </svg>
                          </span>
                          足跡
                        </>
                      )}
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
                  padding: '1.5rem', // Optimized padding
                  borderRadius: '8px',
                  border: '1px solid var(--accent-gold)',
                  width: '95%', // Widen for mobile as requested
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
                    <h3 style={{
                      color: 'var(--accent-gold)',
                      fontFamily: "'Noto Serif TC', serif", // Songti
                      fontSize: '2rem', // Increased by 2 levels
                      margin: 0,
                      fontWeight: '700'
                    }}>
                      {selectedInfo.name}
                    </h3>
                    <p style={{
                      color: '#888',
                      fontFamily: "'Noto Serif TC', serif", // Songti
                      fontSize: '1.3rem', // Increased by 2 levels
                      margin: '0.5rem 0 0 0',
                      letterSpacing: '0.5px'
                    }}>
                      {selectedInfo.name_en}
                    </p>
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
                            fontSize: '1.2rem',
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
                        fontSize: '1.2rem',
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
                          fontSize: '1.2rem',
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
                      fontSize: '1.6rem',
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
                    fontSize: '1.25rem',
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
                            fontSize: '1.25rem',
                            fontStyle: 'normal',
                            fontFamily: "'Noto Serif TC', serif",
                            fontWeight: '600',
                            lineHeight: '1.6',
                            letterSpacing: '0px'
                          }}>
                            {q.text}
                            <span style={{
                              color: '#000',
                              fontSize: '1.1rem',
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
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'transparent', border: '1px solid #444', color: '#888', fontSize: '1.2rem' }}
                  >
                    返回畫廊
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footprint Modal - Restored Cinematic Style */}
          {showFootprintModal && currentFootprintArch && (
            <div
              className="footprint-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.85)', // Cinematic overlay
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(12px)', // Slightly more blur for focus
                pointerEvents: 'auto'
              }}
              onClick={() => {
                setShowFootprintModal(false);
                setCurrentFootprintArch(null);
              }}
            >
              <div
                className="footprint-modal"
                style={{
                  backgroundColor: '#1c1c1c',
                  borderRadius: '24px', // Modern feel
                  border: '1px solid rgba(212, 175, 55, 0.4)', // Subtle gold border
                  width: '90%',
                  maxWidth: '550px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '3rem 2.5rem',
                  position: 'relative',
                  boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
                  zIndex: 10000
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setShowFootprintModal(false);
                    setCurrentFootprintArch(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '1.5rem',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  ×
                </button>

                <FootprintForm
                  key={currentFootprintArch.id}
                  arch={currentFootprintArch}
                  onSave={(note, mood, timestamp) => {
                    saveFootprint(
                      currentFootprintArch.id,
                      currentFootprintArch.name,
                      currentFootprintArch.cityName || activeCity.name,
                      note,
                      mood,
                      timestamp // Pass custom timestamp
                    );
                    setShowFootprintModal(false);
                    setCurrentFootprintArch(null);
                  }}
                  onDelete={() => {
                    deleteFootprint(currentFootprintArch.id);
                    setShowFootprintModal(false);
                    setCurrentFootprintArch(null);
                  }}
                  onCancel={() => {
                    setShowFootprintModal(false);
                    setCurrentFootprintArch(null);
                  }}
                />
              </div>
            </div>
          )}
        </>
        )
        }
      </main >

      {/* My Journey Modal - Full Screen */}
      {showJourneyModal && (
        <div
          id="journey-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent'
          }}>
          {/* Background Image - Clear, Rotating */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url('${bgImages[currentBgIndex]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1,
            transition: 'background-image 1s ease-in-out' // Smooth transition
          }}></div>

          {/* Top Left Toolbar */}
          <div style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem' // Space between buttons
          }}>
            <button
              className="journey-control-btn"
              onClick={cycleBackground}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)', // Very subtle border
                borderRadius: '30px', // Fully pill-shaped
                padding: '0.6rem 1.2rem',
                color: 'rgba(255,255,255,0.7)', // Slightly muted text
                fontSize: '0.85rem',
                letterSpacing: '1px',
                fontFamily: "'Outfit', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
                e.currentTarget.style.color = 'var(--accent-gold)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '1.2em' }}>↻</span> 變幻風景
            </button>

            {/* Camera / Download Button */}
            <button
              className="journey-control-btn"
              onClick={downloadJourney}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '56px', // Slightly adjusted to balance with the pill button
                height: '56px',
                color: '#fff',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-gold)';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="下載您的旅程海報"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </div>

          <div className="journey-container">


            {footprints.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#ccc', marginTop: '4rem' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>尚未留下任何足跡</p>
                <button
                  onClick={() => setShowJourneyModal(false)}
                  style={{
                    padding: '0.8rem 2rem',
                    background: 'var(--accent-gold)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  開始探索
                </button>
              </div>
            ) : (
              <div className="journey-timeline">
                {footprints.map((fp, index) => (
                  <div
                    key={index}
                    className="journey-item"
                    style={{
                      opacity: 0,
                      animation: `fadeIn 0.8s ease forwards ${index * 0.2}s` // Staggered Animation
                    }}
                  >
                    {/* Dot on timeline */}
                    <div className="journey-dot"></div>

                    <div className="journey-content"
                      style={{
                        background: 'transparent',
                        padding: '0.5rem 0',
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      onClick={() => handleJourneyClick(fp.archId)}
                    >
                      <div className="journey-meta">
                        <span>{new Date(fp.timestamp).toLocaleDateString()}</span>
                        <span>{new Date(fp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <h3 style={{
                        color: 'var(--accent-gold)',
                        fontSize: '1.4rem',
                        marginBottom: '0.5rem'
                      }}>
                        {fp.archName}
                      </h3>

                      {fp.mood && (
                        <span style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          background: 'rgba(212, 175, 55, 0.1)',
                          color: 'var(--accent-gold)',
                          fontSize: '0.8rem',
                          marginBottom: '0.8rem'
                        }}>
                          {fp.mood}
                        </span>
                      )}

                      <p style={{
                        color: '#eee',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {fp.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
