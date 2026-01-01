# EYENOTE STUDIO - 義大利建築巡禮網站設計規格文件

**專案名稱**: 義大利建築巡禮 (Italian Architecture Journey)  
**文件版本**: 1.0  
**最後更新**: 2026-01-01  
**負責人**: EYENOTE STUDIO  
**技術棧**: React + Vite + CSS

---

## 目錄

1. [設計系統](#設計系統)
2. [版面架構](#版面架構)
3. [元件規格](#元件規格)
4. [響應式設計](#響應式設計)
5. [動畫與互動](#動畫與互動)

---

## 設計系統

### 色彩系統

#### CSS 變數定義 (`:root`)

| 變數名稱 | 色碼 | 用途 |
|---------|------|------|
| `--bg-color` | `#0c0c0c` | 主背景色 |
| `--card-bg` | `#1a1a1a` | 卡片背景色 |
| `--accent-gold` | `#d4af37` | 強調色/金色 |
| `--text-main` | `#f0f0f0` | 主要文字色 |
| `--text-dim` | `#a0a0a0` | 次要文字色 |
| `--sidebar-w` | `260px` | 側邊欄寬度 |
| `--transition` | `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` | 標準過渡效果 |

#### 延伸色彩

| 用途 | 色碼 | 說明 |
|------|------|------|
| 側邊欄背景 | `#111` | 深灰色 |
| 邊框色 | `#333` | 中灰色 |
| 次要邊框 | `#444` | 淺灰色 |
| 提示文字 | `#888` | 灰色 |
| 淡化文字 | `#666` | 深灰色 |
| 刪除/警告 | `#d32f2f` | 紅色 |
| 成功/確認 | `#4caf50` | 綠色 |

### 字體系統

#### 字體家族

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&display=swap');
```

| 用途 | 字體 | 說明 |
|------|------|------|
| 內文/UI | `'Outfit', sans-serif` | 現代無襯線字體 |
| 標題 | `'Playfair Display', serif` | 優雅襯線字體 |

#### 字體大小規範

| 元素 | 字體大小 | 字重 | 行高 |
|------|----------|------|------|
| Logo | 1.4rem | 700 | - |
| Logo 副標 | 0.65rem | 300 | - |
| Logo 聯繫 | 0.72rem | 300 | 1.5 |
| 城市導航 | 0.9rem | 500 | - |
| 頁面標題 h2 | 2.5rem | normal | - |
| 頁面副標 p | 1.1rem | normal | - |
| 卡片標題 h3 | 1.5rem | 600 | - |
| 卡片英文名 | 0.8rem | 400 | - |
| 卡片特色 | 0.85rem | 300 | 1.5 |
| 卡片歷史 | 0.95rem | 300 | 1.6 |
| 按鈕文字 | 0.8rem - 0.9rem | 400-600 | - |

---

## 版面架構

### 整體佈局

```
┌────────────────────────────────────────────────┐
│  Sidebar (260px)  │  Main Content (flex: 1)   │
│  - Logo           │  - Header                  │
│  - City Nav       │  - Architecture Grid       │
│  - Search         │  - Modals/Overlays         │
│  (Fixed)          │  (Scrollable)              │
└────────────────────────────────────────────────┘
```

### Sidebar (側邊欄)

**尺寸規格**:
- 寬度: `260px` (固定)
- 高度: `100vh` (全螢幕)
- 位置: `fixed` (固定在左側)
- 背景: `#111`
- 邊框: `1px solid #333` (右側)
- 內距: `2rem 1.5rem`
- z-index: `100`

**內部結構**:
```
┌─────────────────────┐
│ Logo                │ padding-bottom: 1rem
│ (1.4rem, gold)      │ margin-bottom: 2rem
├─────────────────────┤
│ City Navigation     │ gap: 0.5rem
│ - 米蘭              │
│ - 威尼斯            │
│ - 維羅納            │
│ - 佛羅倫斯          │
│ - 羅馬              │
├─────────────────────┤
│ Search Input        │ margin-top: 0.5rem
└─────────────────────┘
```

#### Logo 規格

| 屬性 | 數值 |
|------|------|
| font-size | 1.4rem |
| font-weight | 700 |
| color | var(--accent-gold) |
| letter-spacing | 1px |
| border-bottom | 2px solid var(--accent-gold) |
| padding-bottom | 1rem |
| margin-bottom | 2rem |
| cursor | pointer |
| hover opacity | 0.8 |

#### City Navigation 規格

**容器**:
- display: `flex`
- flex-direction: `column`
- gap: `0.5rem`

**City Item**:
| 狀態 | 樣式 |
|------|------|
| 預設 | padding: `0.8rem 1rem`<br>border-radius: `8px`<br>color: `var(--text-dim)`<br>font-size: `0.9rem`<br>font-weight: `500` |
| Hover | background: `rgba(212, 175, 55, 0.1)`<br>color: `var(--text-main)` |
| Active | background: `var(--accent-gold)`<br>color: `#000` |

#### Search Input 規格

| 屬性 | 數值 |
|------|------|
| width | 100% |
| padding | 0.6rem 0.8rem |
| background | rgba(255,255,255,0.05) |
| border | 1px solid #333 |
| border-radius | 6px |
| color | #fff |
| font-size | 0.85rem |
| placeholder color | #666 |

### Main Content (主內容區)

**尺寸規格**:
- margin-left: `260px` (側邊欄寬度)
- flex: `1`
- padding: `3rem`
- min-height: `100vh`

---

## 元件規格

### 1. Architecture Grid (建築卡片網格)

**Grid 容器**:
```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
gap: 2.5rem;
align-items: stretch;
```

### 2. Architecture Card (建築卡片)

**卡片容器**:
| 屬性 | 數值 |
|------|------|
| background | var(--card-bg) `#1a1a1a` |
| border-radius | 6px |
| border | 1px solid #333 |
| overflow | hidden |
| display | flex |
| flex-direction | column |
| cursor | pointer |
| transition | var(--transition) |

**Hover 效果**:
```css
transform: translateY(-8px);
border-color: var(--accent-gold);
box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
```

#### 卡片圖片區

| 屬性 | 數值 |
|------|------|
| width | 100% |
| aspect-ratio | 1 / 1 (正方形) |
| background-color | #0c0c0c |
| border-bottom | 1px solid #333 |
| position | relative |

**圖片樣式**:
```css
width: 100%;
height: 100%;
object-fit: contain;
background-color: #111;
display: block;
transition: transform 0.5s ease;
```

**Hover 圖片效果**:
```css
transform: scale(1.05);
```

#### 卡片內容區 (.card-body)

| 屬性 | 數值 |
|------|------|
| padding | 1.5rem |
| display | flex |
| flex-direction | column |
| gap | 1rem |
| flex | 1 |

**標題 h3**:
- font-size: `1.5rem`
- font-weight: `600`
- color: `var(--text-main)`
- margin-bottom: `0.5rem`

**英文名稱**:
- font-size: `0.8rem`
- color: `#666`
- font-weight: `400`
- margin-top: `4px`

**特色標籤 (.features)**:
- font-size: `0.85rem`
- color: `var(--text-dim)`
- font-weight: `300`
- line-height: `1.5`

**歷史描述 (.history)**:
- color: `#eee`
- line-height: `1.6`
- margin-bottom: `0.8rem`
- font-size: `0.95rem`
- font-weight: `300`

#### UNESCO 標籤

```css
background-color: rgba(0,0,0,0.7);
border: 1px solid var(--accent-gold);
border-radius: 4px;
padding: 2px 8px;
color: var(--accent-gold);
font-size: 0.65rem;
letter-spacing: 1px;
font-weight: 400;
backdrop-filter: blur(4px);
box-shadow: 0 2px 4px rgba(0,0,0,0.2);
```

#### 語音導覽按鈕

**預設狀態**:
```css
display: flex;
align-items: center;
gap: 6px;
margin-bottom: 1.2rem;
cursor: pointer;
opacity: 0.7;
transition: opacity 0.3s ease;
```

**播放中**:
```css
opacity: 1;
```

**圖示**:
- font-size: `1.1rem`
- color: `var(--accent-gold)`
- width: `1.2rem`

**文字**:
- color: `var(--accent-gold)`
- font-size: `0.95rem`
- font-weight: `600`

#### 操作按鈕群組

**容器**:
```css
margin-top: auto;
padding-top: 1.5rem;
display: flex;
gap: 0.5rem;
width: 100%;
```

**主要按鈕 (寫明信片)**:
```css
flex: 1;
padding: 0.7rem 0;
background-color: var(--accent-gold);
color: #000;
border-radius: 6px;
font-size: 0.8rem;
white-space: nowrap;
```

**次要按鈕 (導覽攻略、建築故事)**:
```css
flex: 1;
padding: 0.7rem 0;
border-radius: 6px;
background: transparent;
border: 1px solid #444;
color: #ccc;
font-size: 0.8rem;
white-space: nowrap;
```

**留下足跡按鈕**:
- 未留下: `border: 1px solid #444`, `color: #ccc`
- 已留下: `border: 1px solid var(--accent-gold)`, `color: var(--accent-gold)`, `font-weight: 600`

### 3. Footprint Modal (留下足跡彈窗)

> [!WARNING]
> **此元件正在開發中**
> 
> Footprint Modal 功能尚未完成,規格仍在調整中。
> 目前已完成的部分請參考: [FOOTPRINT_FORM_SPEC.md](file:///Users/eyestudio/Documents/AILife/eyework/建築巡禮/義大利/網站系統/FOOTPRINT_FORM_SPEC.md)
> 
> **已知問題**:
> - 「我的旅程」頁面已移除 (黑屏問題未解決)
> - Footprint 資料儲存功能正常
> - Modal 彈窗顯示正常
> - 表單內容和樣式已定案

**目前狀態**: 🚧 開發中

### 4. Tourist Info Modal (導覽攻略彈窗)

**Overlay**:
```css
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0,0,0,0.8);
display: flex;
align-items: center;
justify-content: center;
z-index: 1100;
```

**Modal 容器**:
```css
background: linear-gradient(135deg, #1a1a1a 0%, #0c0c0c 100%);
border-radius: 16px;
padding: 2.5rem;
max-width: 700px;
max-height: 80vh;
overflow-y: auto;
box-shadow: 0 20px 60px rgba(0,0,0,0.9);
border: 1px solid #333;
```

**標題**:
- font-size: `2rem`
- color: `var(--accent-gold)`
- margin-bottom: `1.5rem`

**內容區塊**:
- margin-bottom: `2rem`

**小標題**:
- font-size: `1.2rem`
- color: `var(--text-main)`
- margin-bottom: `1rem`
- border-left: `3px solid var(--accent-gold)`
- padding-left: `1rem`

### 5. Building Story Drawer (建築故事抽屜)

**容器**:
```css
position: fixed;
top: 0;
right: 0;
width: 45%;
height: 100vh;
background: linear-gradient(to bottom, #0c0c0c 0%, #1a1a1a 100%);
box-shadow: -10px 0 30px rgba(0,0,0,0.8);
z-index: 2000;
overflow-y: auto;
padding: 3rem;
border-left: 1px solid var(--accent-gold);
```

**標題**:
- font-size: `2.2rem`
- color: `var(--accent-gold)`
- margin-bottom: `2rem`

**內容段落**:
- font-size: `1.1rem`
- line-height: `1.8`
- color: `#ddd`
- margin-bottom: `1.5rem`

**引言區塊**:
```css
background: rgba(212, 175, 55, 0.1);
border-left: 4px solid var(--accent-gold);
padding: 1.5rem;
margin: 2rem 0;
font-style: italic;
font-size: 1.05rem;
color: #f0f0f0;
```

### 6. Lightbox (圖片燈箱)

**Overlay**:
```css
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
background-color: rgba(0, 0, 0, 0.85);
display: flex;
align-items: center;
justify-content: center;
z-index: 3000;
cursor: zoom-out;
```

**圖片**:
```css
max-width: 90vw;
max-height: 90vh;
object-fit: contain;
box-shadow: 0 20px 60px rgba(0,0,0,0.9);
border-radius: 8px;
```

---

## 響應式設計

### 斷點規範

| 斷點 | 寬度 | 說明 |
|------|------|------|
| Mobile | < 768px | 手機版 |
| Tablet | 768px - 1024px | 平板版 |
| Desktop | > 1024px | 桌面版 |

### Mobile 適配 (< 768px)

**Sidebar**:
```css
width: 100%;
height: auto;
position: static;
border-right: none;
border-bottom: 1px solid #333;
padding: 1.5rem 1rem;
```

**Main Content**:
```css
margin-left: 0;
padding: 1.5rem;
```

**Architecture Grid**:
```css
grid-template-columns: 1fr;
gap: 1.5rem;
```

**Building Story Drawer**:
```css
width: 100%;
padding: 2rem 1.5rem;
```

---

## 動畫與互動

### 過渡效果

**標準過渡**:
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

**圖片縮放**:
```css
transition: transform 0.5s ease;
```

### Hover 效果總覽

| 元素 | 效果 |
|------|------|
| Logo | opacity: 0.8 |
| City Item | background: rgba(212, 175, 55, 0.1) |
| Architecture Card | translateY(-8px) + border-color + shadow |
| Card Image | scale(1.05) |
| 按鈕 | background 變化 + color 變化 |

### 動畫定義

**fadeIn**:
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

使用: `animation: fadeIn 0.3s ease-out;`

---

## 技術規格

### 檔案結構

```
src/
├── App.jsx              # 主應用元件
├── index.css            # 全域樣式
├── PostcardSandbox.jsx  # 明信片編輯器
└── data/
    ├── milan.json       # 米蘭建築資料
    ├── venice.json      # 威尼斯建築資料
    ├── verona.json      # 維羅納建築資料
    ├── florence.json    # 佛羅倫斯建築資料
    └── rome.json        # 羅馬建築資料
```

### 依賴套件

```json
{
  "html2canvas": "^1.4.1",
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
}
```

### 瀏覽器支援

- Chrome/Edge: 最新版
- Firefox: 最新版
- Safari: 最新版
- 不支援 IE

---

## 設計原則

1. **極簡主義**: 深色背景 + 金色強調
2. **優雅排版**: 使用 Playfair Display 襯線字體
3. **視覺層次**: 清晰的卡片層級和間距
4. **流暢互動**: 0.3s 標準過渡效果
5. **響應式**: 完整支援桌面和行動裝置

---

## 維護指南

### 修改主色調
編輯 `index.css` 第 6 行:
```css
--accent-gold: #d4af37;
```

### 修改側邊欄寬度
編輯 `index.css` 第 9 行:
```css
--sidebar-w: 260px;
```

### 修改卡片網格
編輯 `index.css` 第 149 行:
```css
grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
```

---

## 相關文件

- [FootprintForm 元件規格](file:///Users/eyestudio/Documents/AILife/eyework/建築巡禮/義大利/網站系統/FOOTPRINT_FORM_SPEC.md)
- [主程式碼](file:///Users/eyestudio/Documents/AILife/eyework/建築巡禮/義大利/網站系統/src/App.jsx)
- [全域樣式](file:///Users/eyestudio/Documents/AILife/eyework/建築巡禮/義大利/網站系統/src/index.css)

---

**文件版本**: 1.0  
**最後更新**: 2026-01-01  
**文件結束**
