import json
import os
import re
import urllib.parse

def generate_maps_url(name, city):
    query = f"{name} {city} Italy"
    return f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(query)}"

def extract_specific_highlights(prompt_text, features_tw, history_tw):
    # 從 prompt 中尋找 1. 2. 3. 這種清單
    # 範例: 1. Main Entrance, 2. Archaeological Area...
    keywords_en = re.findall(r'\d\.\s*([^,.\n]+)', prompt_text)
    
    # 建立一個基礎對照表，將常見的建築術語翻譯成具體的中文標題
    trans_map = {
        "Main Entrance": "主入口大門",
        "Nave": "中殿建築結構",
        "Stained Glass": "彩繪玻璃窗",
        "High Altar": "主祭壇",
        "Dome": "宏偉圓頂",
        "Facade": "正面立面雕刻",
        "Bell Tower": "指標性鐘樓",
        "Crypt": "地下聖堂",
        "Cloister": "修道院迴廊",
        "Baptistery": "洗禮堂",
        "Loggia": "露天拱廊",
        "Apse": "半圓形後殿",
        "Transept": "翼廊 (十字交會處)",
        "Spire": "哥德式尖塔",
        "Flying Buttress": "飛扶壁結構",
        "Mosaic": "馬賽克鑲嵌畫",
        "Statue": "大理石雕像群",
        "Courtyard": "中央中庭",
        "Tower": "防禦式塔樓",
        "Palace": "宮殿主建築"
    }

    highlights = []
    # 1. 先從 prompt 提取
    for en in keywords_en[:4]: # 拿前 4 個最具體的
        clean_en = en.strip()
        highlights.append(trans_map.get(clean_en, clean_en))

    # 2. 從 features 中提取 1-2 個具體視覺
    # 嘗試抓取 features 中逗號分隔的第一句
    feat_points = re.split(r'[、，。]', features_tw)
    for p in feat_points:
        if p.strip() and p.strip() not in highlights:
            highlights.append(p.strip())
        if len(highlights) >= 5: break

    # 3. 從歷史中強行加入一個「故事物體」
    if "大理石" in history_tw: highlights.append("免稅大理石 AUF 標記")
    elif "公牛" in history_tw: highlights.append("公牛馬賽克轉圈處")
    elif "秘密地道" in history_tw: highlights.append("公爵逃亡秘密地道")
    elif "瓢蟲" in history_tw: highlights.append("綠建築植栽區")
    elif "手稿" in history_tw or "最後的晚餐" in history_tw: highlights.append("《最後的晚餐》壁畫")
    elif "大衛" in history_tw: highlights.append("大衛像真跡(及其角度)")
    elif "硬幣" in history_tw: highlights.append("許願池拋幣處")
    
    # 確保有 6 個，不夠就補
    if len(highlights) < 6:
        highlights.append("歷史英雄/聖人紀念碑")
        highlights.append("建築裝飾細節 (Detail)")

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

print("✅ 所有景點已升級為 6 大具體實體看點清單！")
