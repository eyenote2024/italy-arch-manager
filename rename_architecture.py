import json
import os

# 台灣建築名家校對表 (精簡、道地、去補充說明)
NAME_REMAP = {
    # 米蘭
    "milan_01": "米蘭大教堂",
    "milan_02": "艾曼紐二世迴廊",
    "milan_03": "斯福爾扎古堡",
    "milan_04": "垂直森林",
    "milan_05": "聖母恩寵教堂",
    "milan_06": "斯卡拉大劇院",
    "milan_07": "倍耐力大樓",
    "milan_08": "普拉達基金會",
    "milan_09": "CityLife 三塔",
    "milan_10": "布雷拉美術館",
    "milan_11": "聖安布羅修大殿",
    "milan_12": "米蘭紀念墓園",
    "milan_13": "聖莫里齊奧教堂",

    # 威尼斯
    "venice_01": "聖馬可大教堂",
    "venice_02": "威尼斯總督宮",
    "venice_03": "里阿爾托橋",
    "venice_04": "安康聖母大殿",
    "venice_05": "鳳凰歌劇院",
    "venice_06": "嘆息橋",
    "venice_07": "黃金宮",
    "venice_08": "聖洛克大講堂",
    "venice_09": "古根漢美術館",
    "venice_10": "蝸牛府螺旋梯",
    "venice_11": "聖喬治馬焦雷教堂",
    "venice_12": "威尼斯軍械庫",
    "venice_13": "花神咖啡館",
    "venice_14": "威尼斯水都街景",
    "venice_15": "弗拉里教堂",

    # 佛羅倫斯
    "florence_01": "聖母百花大教堂",
    "florence_02": "聖若望洗禮堂",
    "florence_03": "老橋",
    "florence_04": "舊宮",
    "florence_05": "烏菲茲美術館",
    "florence_06": "碧提宮",
    "florence_07": "波波里花園",
    "florence_08": "聖十字大殿",
    "florence_09": "聖勞倫佐教堂",
    "florence_10": "學院美術館",
    "florence_11": "新聖母大殿",
    "florence_12": "聖神大殿",
    "florence_13": "布蘭卡奇禮拜堂",
    "florence_14": "米開朗基羅廣場",
    "florence_15": "領主廣場",
    "florence_16": "喬托鐘樓",

    # 羅馬
    "rome_01": "羅馬競技場",
    "rome_02": "萬神殿",
    "rome_03": "許願池",
    "rome_04": "聖彼得大教堂",
    "rome_05": "聖天使堡",
    "rome_06": "古羅馬論壇",
    "rome_07": "西班牙階梯",
    "rome_08": "波格賽美術館",
    "rome_09": "納沃納廣場",
    "rome_10": "祖國祭壇",
    "rome_11": "梵蒂岡美術館",
    "rome_12": "卡比托利歐博物館",
    "rome_13": "多利亞·潘菲利宮",
    "rome_14": "聖克萊門特教堂",
    "rome_15": "人民聖母教堂",
    "rome_16": "法國聖路易教堂"
}

DATA_DIR = "src/data"
for filename in os.listdir(DATA_DIR):
    if filename.endswith(".json"):
        path = os.path.join(DATA_DIR, filename)
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for item in data:
            item_id = item.get("id")
            if item_id in NAME_REMAP:
                item["name"] = NAME_REMAP[item_id]
                
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ 所有建築名稱已正名為台灣慣用簡稱！")
