import json
import os
import re
import urllib.parse

def generate_maps_url(name, city):
    query = f"{name} {city} Italy"
    return f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(query)}"

def clean_and_translate(text):
    # 1. 基本清理
    text = text.replace("**", "").strip()
    text = re.sub(r'^\d+\.\s*', '', text) # 移除序號
    
    # 2. 如果只有數字或長度太短，視為垃圾資訊
    if len(text) < 2 or text.isdigit():
        return None
        
    # 3. 過濾開發術語
    if any(keyword in text.upper() for keyword in ["SECTION", "UPPER", "MIDDLE", "LOWER", "FOOTER", "PART", "VIEW", "ANGLE"]):
        if ":" in text:
            text = text.split(":")[-1].strip()
        else:
            return None

    # 4. 再次檢查長度
    if len(text) < 2: return None

    # 5. 術語對照
    mapping = {
        "Main Entrance": "主入口大門",
        "Nave": "中央大中殿",
        "Stained Glass": "彩繪玻璃花窗",
        "High Altar": "主祭壇聖所",
        "Dome": "宏偉大圓頂",
        "Facade": "裝飾立面",
        "Bell Tower": "指標性鐘樓",
        "Crypt": "地下聖堂",
        "Mosaic": "馬賽克鑲嵌畫",
        "Statue": "大理石雕像群",
        "Cloister": "修道院迴廊",
        "Gallery": "藝術長廊",
        "Chandelier": "水晶吊燈",
        "Boxes": "絲絨包廂"
    }

    for en, tw in mapping.items():
        if en.lower() in text.lower():
            return tw
            
    # 如果包含中文，直接回傳
    if any('\u4e00' <= char <= '\u9fff' for char in text):
        return text
        
    return text.split(',')[0].strip()

def extract_specific_highlights(prompt_text, features_tw, history_tw):
    # 提取所有可能的清單項
    raw_lines = re.findall(r'\d\.\s*([^.\n,]+)', prompt_text)
    
    highlights = []
    for line in raw_lines:
        res = clean_and_translate(line)
        if res and res not in highlights and not res.isdigit():
            highlights.append(res)
            if len(highlights) >= 4: break

    # 從特徵中補足
    feat_points = re.split(r'[、，。]', features_tw)
    for p in feat_points:
        p_clean = p.strip()
        if p_clean and 2 <= len(p_clean) <= 12 and p_clean not in highlights:
            highlights.append(p_clean)
        if len(highlights) >= 6: break

    # 強制檢查是否有純數字
    highlights = [h for h in highlights if not h.isdigit() and len(h) > 1]

    # 保底
    defaults = ["文藝復興裝飾細節", "歷史古蹟識別牌", "工藝雕刻精品", "建築全景視野", "古典石造建築", "內部光影藝術"]
    for d in defaults:
        if len(highlights) >= 6: break
        if d not in highlights:
            highlights.append(d)

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

print("✅ 垃圾資料庫大掃除完成！已剔除純數字與無意義字元。")
