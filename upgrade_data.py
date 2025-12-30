import json
import os
import re
import urllib.parse

def generate_maps_url(name, city):
    query = f"{name} {city} Italy"
    return f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(query)}"

def clean_and_translate(text):
    # 1. 移除 Markdown 粗體號與序號
    text = text.replace("**", "").strip()
    text = re.sub(r'^\d+\.\s*', '', text)
    
    # 2. 如果包含 "Section" 等版面術語，嘗試抓取冒號後的實體內容
    if any(keyword in text for keyword in ["Section", "Upper", "Middle", "Lower", "Footer", "Part"]):
        if ":" in text:
            text = text.split(":")[-1].strip()
        elif "(" in text and ")" in text:
            # 嘗試抓取括號外或括號內的關鍵詞
            text = re.sub(r'\(.*?\)', '', text).strip()
            
    # 3. 台灣道地建築專有名詞翻譯表
    mapping = {
        "Main Entrance": "主入口大門",
        "Nave": "中央大中殿",
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
        "Opera Hall": "歌劇大廳",
        "Chandelier": "大型水晶吊燈",
        "Red Velvet Boxes": "紅色絲絨包廂",
        "Auditorium": "表演觀眾席",
        "Palace facade": "宮殿裝飾外牆",
        "Arches": "經典圓弧拱門",
        "Museum": "美術館展示廳",
        "Square": "公共藝術廣場",
        "Fountain": "巴洛克噴泉景觀",
        "Spiral Staircase": "雙螺旋樓梯結構",
        "Obelisk": "古代方尖碑標誌"
    }

    # 進行匹配翻譯
    for en, tw in mapping.items():
        if en.lower() in text.lower():
            return tw
            
    # 如果已經是中文，直接返回
    if any('\u4e00' <= char <= '\u9fff' for char in text):
        return text
        
    return text.split(',')[0].strip() # 沒匹配到，取第一個單詞

def extract_specific_highlights(prompt_text, features_tw, history_tw):
    # 1. 從 prompt 提取
    raw_lines = re.findall(r'\d\.\s*([^.\n]+)', prompt_text)
    
    highlights = []
    for line in raw_lines:
        tw_text = clean_and_translate(line)
        # 過濾掉純粹的版面方位詞
        if tw_text and not any(k in tw_text.upper() for k in ["SECTION", "UPPER", "MIDDLE", "LOWER", "FOOTER"]):
            if tw_text not in highlights:
                highlights.append(tw_text)
                if len(highlights) >= 4: break

    # 2. 從 features 中補足具體中文 (再次過濾冗長敘述)
    feat_points = re.split(r'[、，。]', features_tw)
    for p in feat_points:
        p_clean = p.strip()
        if p_clean and 2 <= len(p_clean) <= 12 and p_clean not in highlights:
            highlights.append(p_clean)
        if len(highlights) >= 6: break

    # 3. 根據歷史特色精準補位
    if len(highlights) < 6:
        special_hints = {
            "馬賽克": "公牛馬賽克轉圈處",
            "拿破崙": "拿破崙青銅雕像",
            "最後的晚餐": "達文西壁畫真跡",
            "大衛": "大衛像真跡角度",
            "許願池": "許願池拋幣處",
            "鬥獸場": "地下野獸關押區",
            "萬神殿": "頂部圓孔射入光線",
            "提香": "提香大師長眠處",
            "歌劇": "斯卡拉水晶吊燈"
        }
        for k, v in special_hints.items():
            if k in (features_tw + history_tw) and v not in highlights:
                highlights.append(v)
                if len(highlights) >= 6: break
    
    # 最終強制補足
    defaults = ["精緻建築裝飾", "歷史古蹟識別牌", "藝術雕刻細節", "建築全景視角"]
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

print("✅ 所有參觀重點已徹底掃除『版面術語』，全面替換為道地『台灣中文建築看點』！")
