import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

/**
 * 🎨 數位明信片實驗室 v1.2 (穩定版)
 * 視覺：影像內框對齊、極致垂直壓縮、畫框精簡、思源宋體斜體。
 */
const PostcardSandbox = ({ onBack, imageSrc = "/arch_images/milan_01.png", initialText, initialSource }) => {
    // 自動抓取當天日期並格式化為 YYYY.MM.DD
    const today = new Date().toLocaleDateString('en-CA').replace(/-/g, '.');

    const [recipient, setRecipient] = useState('To: Juliet');
    const [date, setDate] = useState(today);
    const [text, setText] = useState(initialText || '我在大理石的詩篇中，聽見了妳的低語。');
    const [source, setSource] = useState(initialSource || '— 馬克．吐溫');
    const [signature, setSignature] = useState('From: Romeo');
    const [fontSize, setFontSize] = useState(14); // 預設下修至 14級 (14px)
    const [isManualFontSize, setIsManualFontSize] = useState(false);
    const [textAlign, setTextAlign] = useState('left');
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImageUrl, setCapturedImageUrl] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const postcardRef = useRef(null);

    // 監聽螢幕寬度，實現 RWD
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 🕵️ 智慧排版邏輯：以 16級 為核心基準
    React.useEffect(() => {
        if (!isManualFontSize) {
            const len = text.length;
            if (len < 30) setFontSize(14); // 預設 14 級
            else if (len < 60) setFontSize(12); // 中長文縮小
            else setFontSize(10); // 極長文縮小
        }
    }, [text, isManualFontSize]);

    const handleDownload = async () => {
        if (!postcardRef.current) return;
        setIsCapturing(true);
        setCapturedImageUrl(null);

        // 給瀏覽器一點時間渲染
        setTimeout(async () => {
            try {
                const canvas = await html2canvas(postcardRef.current, {
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    scale: 3,
                    logging: false
                });

                const imgData = canvas.toDataURL("image/png", 1.0);

                // 行動端（包含 iPhone/Android 等）強制顯示全螢幕預覽，繞過下載封鎖
                if (isMobile || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                    setCapturedImageUrl(imgData);
                    setIsCapturing(false);
                    return;
                }

                // 電腦端執行直接下載
                const link = document.createElement('a');
                link.href = imgData;
                link.download = `EYEnote-Postcard-${Date.now()}.png`;
                link.click();
                setIsCapturing(false);
            } catch (err) {
                console.error('下載出錯:', err);
                alert('下載失敗，請嘗試再點擊一次');
                setIsCapturing(false);
            }
        }, 500);
    };

    return (
        <div style={{
            padding: '1.5rem',
            minHeight: '100vh',
            backgroundColor: '#0a0a0a', // 更深的底層黑色
            backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)', // 加入層次漸層
            color: '#fff',
            fontFamily: '"Noto Serif TC", serif',
            display: 'flex',
            flexDirection: 'column'
        }}>

            {/* 頁首：增加一點影視質感 */}
            <header style={{
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end', // 對齊底部基進線，減少歪斜感
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '1rem',
                maxWidth: '1000px', // 縮小最大寬度
                margin: '0 auto 1.5rem',
                width: '100%'
            }}>
                <div>
                    <h1 style={{ color: '#d4af37', margin: 0, fontSize: '2rem', letterSpacing: '2px', fontWeight: '700' }}>EYE 數位明信片</h1>
                    <p style={{ color: '#666', margin: '8px 0 0', fontWeight: '300', fontSize: '1rem', letterSpacing: '1px' }}>
                        將建築的永恆，化作美的寄語
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="btn-secondary"
                    style={{
                        padding: '0.7rem 1.5rem',
                        borderRadius: '40px', // 圓角化更現代
                        fontSize: '0.85rem',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backgroundColor: 'transparent',
                        color: '#fff',
                        cursor: 'pointer'
                    }}
                >
                    ← 返回巡禮
                </button>
            </header>

            {/* 側邊並列布局 / 手機端自動切換為上下堆疊 */}
            <div style={{
                display: isMobile ? 'flex' : 'grid',
                flexDirection: isMobile ? 'column' : 'row',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(300px, 420px) 1fr',
                gap: isMobile ? '1.5rem' : '2.5rem',
                maxWidth: '1000px',
                margin: '0 auto',
                width: '100%',
                padding: isMobile ? '0 15px' : '0'
            }}>

                {/* 左側：預覽畫布 (定軸矯正版) */}
                <div style={{ position: 'relative' }}>
                    <div
                        ref={postcardRef}
                        style={{
                            backgroundColor: '#f8f8f8',
                            padding: '12px', // 增加護邊，確保不溢出
                            borderRadius: '2px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
                            width: '100%',
                            transform: isCapturing ? 'scale(0.98)' : 'scale(1)',
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        {/* 上面：1:1 建築畫報 */}
                        <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: '#e0e0e0' }}>
                            <img
                                src={imageSrc}
                                alt="Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* 下麵：文字留言區 */}
                        <div style={{
                            marginTop: '12px',
                            color: '#1a1a1a',
                            fontStyle: 'italic',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '0 12px' // 增加橫向護邊，徹底解決「快被切掉」的感覺
                        }}>
                            <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold', marginBottom: '4px' }}>
                                {recipient}
                            </div>
                            <div style={{
                                fontSize: `${fontSize}px`,
                                lineHeight: '1.4',
                                textAlign: textAlign,
                                color: '#1a1a1a',
                                letterSpacing: '0.5px',
                                whiteSpace: 'pre-line' // 讓 Enter 換行生效
                            }}>
                                {text}
                            </div>
                            {source && (
                                <div style={{ fontSize: '10px', color: '#999', textAlign: 'right', marginTop: '4px', fontStyle: 'italic' }}>
                                    {source}
                                </div>
                            )}

                            {/* 署名區：空間優化版 */}
                            <div style={{
                                marginTop: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                width: '100%'
                            }}>
                                <span style={{
                                    fontSize: '4.5px', // 更小
                                    color: '#aaa',
                                    letterSpacing: '0.2px', // 更緊
                                    textTransform: 'uppercase',
                                    whiteSpace: 'nowrap',
                                    marginBottom: '2px',
                                    flexShrink: 1, // 允許收縮
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis' // 若真的太長則優雅省略
                                }}>
                                    eyenote@gmail.com | ITALY
                                </span>
                                <div style={{
                                    textAlign: 'right',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0, // 絕對不准縮，確保羅密歐安全
                                    marginLeft: '10px' // 強制留出安全距離
                                }}>
                                    <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold' }}>{signature}</div>
                                    <div style={{ fontSize: '8px', color: '#aaa', letterSpacing: '1px', marginTop: '-1px' }}>{date}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右側：編輯控制台 (Glassmorphism 毛玻璃質感) */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(30px)',
                    padding: isMobile ? '1.5rem 1.2rem' : '1.2rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    height: isMobile ? 'auto' : '100%',
                    marginBottom: isMobile ? '40px' : '0'
                }}>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1rem' : '2rem' }}>
                        <div className="input-group">
                            <label style={{ color: '#d4af37', fontSize: '0.7rem', display: 'block', marginBottom: '0.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                致 (To)
                            </label>
                            <input
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ color: '#d4af37', fontSize: '0.7rem', display: 'block', marginBottom: '0.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                落款 (From)
                            </label>
                            <input
                                value={signature}
                                onChange={(e) => setSignature(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1rem' : '2rem' }}>
                        <div className="input-group">
                            <label style={{ color: '#d4af37', fontSize: '0.7rem', display: 'block', marginBottom: '0.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                日期 (Date)
                            </label>
                            <input
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ color: '#d4af37', fontSize: '0.7rem', display: 'block', marginBottom: '0.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                寄語級別 ({fontSize}px)
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="30"
                                value={fontSize}
                                onChange={(e) => {
                                    setFontSize(parseInt(e.target.value));
                                    setIsManualFontSize(true); // 使用者一旦調整，就停止自動縮放
                                }}
                                style={{ width: '100%', accentColor: '#d4af37' }}
                            />
                        </div>
                    </div>

                    <div style={{ flex: isMobile ? 'none' : 1, display: 'flex', flexDirection: 'column', minHeight: isMobile ? '120px' : 'auto' }}>
                        <label style={{ color: '#d4af37', fontSize: '0.7rem', display: 'block', marginBottom: '0.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            美的寄語
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{ flex: 1, width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontSize: '0.9rem', lineHeight: '1.6', outline: 'none', resize: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1rem' : '2rem' }}>
                        <div className="input-group">
                            <label style={{ color: '#666', fontSize: '0.7rem', display: 'block', marginBottom: '0.2rem', letterSpacing: '2px' }}>
                                水平佈局
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
                                <button
                                    onClick={() => setTextAlign('left')}
                                    style={{ padding: '0.5rem 1.5rem', backgroundColor: textAlign === 'left' ? '#d4af37' : 'transparent', color: textAlign === 'left' ? '#000' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.3s' }}
                                >
                                    靠左
                                </button>
                                <button
                                    onClick={() => setTextAlign('center')}
                                    style={{ padding: '0.5rem 1.5rem', backgroundColor: textAlign === 'center' ? '#d4af37' : 'transparent', color: textAlign === 'center' ? '#000' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.3s' }}
                                >
                                    置中
                                </button>
                            </div>
                        </div>
                        <div className="input-group">
                            <label style={{ color: '#d4af37', fontSize: '0.7rem', display: 'block', marginBottom: '0.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                出處 (Source)
                            </label>
                            <input
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
                                placeholder="例如: — Mark Twain"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={isCapturing}
                        style={{
                            marginTop: '0.5rem', // 縮減頂部距離
                            padding: '1rem', // 壓縮按鈕高度
                            backgroundColor: '#d4af37',
                            color: '#000',
                            fontWeight: '700',
                            fontSize: '1rem',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            opacity: isCapturing ? 0.7 : 1,
                            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {isCapturing ? '🎞️ 正在沖印...' : '📸 沖印明信片'}
                    </button>
                </div>

                {/* 手機端長按儲存遮罩層 (覆蓋全螢幕) */}
                {capturedImageUrl && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.95)',
                        zIndex: 10000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}>
                        <div style={{ color: '#d4af37', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
                            ✨ 已為您沖印完成 ✨<br />
                            <span style={{ color: '#fff', fontSize: '0.8rem' }}>長按下方圖片即可「儲存影像」</span>
                        </div>
                        <img
                            src={capturedImageUrl}
                            alt="Generated Postcard"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '75vh',
                                borderRadius: '4px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                            }}
                        />
                        <button
                            onClick={() => setCapturedImageUrl(null)}
                            style={{
                                marginTop: '25px',
                                padding: '10px 30px',
                                backgroundColor: 'transparent',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: '#fff',
                                borderRadius: '50px',
                                cursor: 'pointer'
                            }}
                        >
                            關閉預覽
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PostcardSandbox;
