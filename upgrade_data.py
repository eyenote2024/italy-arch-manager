import json
import os
import re
import urllib.parse

def generate_maps_url(name, city):
    query = f"{name} {city} Italy"
    return f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(query)}"

def translate_to_tw(text):
    # 台灣道地建築與旅遊名詞對照
    mapping = {
        "Main Entrance": "主入口大門",
        "Nave": "中央中殿",
        "Stained Glass": "彩繪玻璃花窗",
        "High Altar": "主祭壇聖所",
        "Dome": "宏偉大圓頂",
        "Central Dome": "中央大圓頂",
        "Facade": "正面裝飾立面",
        "Bell Tower": "指標性鐘樓",
        "Crypt": "地下聖堂墓室",
        "Cloister": "修道院迴廊",
        "Baptistery": "洗禮堂",
        "Loggia" : "開放式拱廊",
        "Apse": "半圓形後殿",
        "Transept": "翼廊(十字交會處)",
        "Spire": "哥德式尖塔牆",
        "Flying Buttress": "支撐飛扶壁",
        "Mosaic": "馬賽克鑲嵌畫",
        "Statue": "大理石雕像群",
        "Courtyard": "中央中庭廣場",
        "Tower": "防禦式塔樓",
        "Fortress Walls": "堡疊防禦城牆",
        "Gothic Arch": "哥德式尖拱",
        "Corinthian Column": "柯林斯式柱廊",
        "Skyline": "城市天際線",
        "Skyscraper": "現代摩天大樓",
        "Facade Carvings": "立面精細雕刻",
        "Altar": "神聖祭壇",
        "Bridge": "石造景觀橋樑",
        "Canal": "運河水都風景",
        "Museum Entrance": "美術館入口",
        "Art Gallery": "藝術畫廊長廊",
        "Piazza": "公共廣場區",
        "Foundation": "建築地基構造",
        "Theater Hall": "歌劇院大廳"
    }
    
    # 移除序號與多餘空白
    clean = re.sub(r'^\d+\.\s*', '', text).strip()
    
    # 精確匹配翻譯
    for en, tw in mapping.items():
        if en.lower() in clean.lower():
            return tw
            
    return clean # 若沒匹配到，保留原樣(通常已經是從 MD 抓下來的中文)

def extract_specific_highlights(prompt_text, features_tw, history_tw):
    # 1. 從 prompt 提取英文關鍵標籤
    raw_keywords = re.findall(r'\d\.\s*([^,.\n]+)', prompt_text)
    
    highlights = []
    # 2. 翻譯提示詞中的具體物體
    for en in raw_keywords:
        tw_text = translate_to_tw(en)
        if tw_text and tw_text not in highlights:
            highlights.append(tw_text)
            if len(highlights) >= 4: break

    # 3. 從 features 中補足具體中文詞彙
    feat_points = re.split(r'[、，。]', features_tw)
    for p in feat_points:
        p_clean = p.strip()
        if p_clean and len(p_clean) < 15 and p_clean not in highlights:
            highlights.append(p_clean)
        if len(highlights) >= 6: break

    # 4. 保底機制
    if len(highlights) < 6:
        # 從歷史中抓關鍵詞
        if "大理石" in history_tw: highlights.append("免稅大理石標記")
        if "地道" in history_tw: highlights.append("公爵秘密地道")
        if "瓢蟲" in history_tw: highlights.append("自然防蟲植栽層")
        if "大衛" in history_tw: highlights.append("大衛像真跡角度")
    
    # 最終補足
    while len(highlights) < 6:
        highlights.append("建築裝飾細部")

    return highlights[:6]

DATA_DIR = "src/data"
for filename in os.listdir(DATA_DIR):
    if filename.endswith(".json"):
        city_name_en = filename.replace(".json", "")
        city_name_tw = {"milan": "米蘭", "florence": "佛羅倫斯", "venice": "威尼斯", "rome": "羅馬"}.get(city_name_en)
        
        path = os.path.join(DATA_DIR, filename)
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        for item in data:
            item["google_maps_url"] = generate_maps_url(item["name"], city_name_tw)
            item["visit_highlights"] = extract_specific_highlights(
                item.get("prompt", ""), 
                item.get("features", ""), 
                item.get("history_text", "")
            )
                
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ 所有參觀重點已完成『台灣繁體中文』優化翻譯與對齊！")
