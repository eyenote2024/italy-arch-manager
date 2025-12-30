import json
import os
import shutil

# 設定路徑
BASE_JSON_DIR = '/Users/eyestudio/Documents/AILife/italy-arch-manager/src/data'
SOURCE_IMAGES_ROOT = '/Volumes/eye_1Ts/02_Italian_Architecture_Project/assets/images'
TARGET_IMAGES_DIR = '/Volumes/eye_1Ts/02_Italian_Architecture_Project/assets/images' # 也是同一個地方，但要放到根目錄

# 城市對應資料夾名稱
CITY_FOLDER_MAP = {
    'florence.json': '佛羅倫斯',
    'venice.json': '威尼斯',
    'rome.json': '羅馬',
    'milan.json': '米蘭'
}

def link_images():
    print("🚀 開始連結圖片...")
    linked_count = 0
    
    for json_file, folder_name in CITY_FOLDER_MAP.items():
        json_path = os.path.join(BASE_JSON_DIR, json_file)
        
        if not os.path.exists(json_path):
            print(f"⚠️ JSON file not found: {json_path}")
            continue
            
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        source_folder = os.path.join(SOURCE_IMAGES_ROOT, folder_name)
        if not os.path.exists(source_folder):
            print(f"⚠️ 找不到城市資料夾: {source_folder}")
            continue
            
        print(f"\n📂 處理 {folder_name} ({json_file})...")
        
        for item in data:
            architect_name = item['name'] # 這是中文名稱，例如 "聖母百花大教堂"
            file_id = item['id'] # 例如 "florence_01"
            
            # 可能的檔名 (有些名字可能有別名，我們嘗試模糊匹配)
            # 策略：在 source_folder 裡找包含 architect_name 關鍵字的檔案
            
            found_file = None
            
            # 1. 精確匹配
            potential_path = os.path.join(source_folder, f"{architect_name}.png")
            if os.path.exists(potential_path):
                found_file = potential_path
            
            # 2. 如果沒找到，嘗試部分匹配 (例如 '百花大教堂' vs '聖母百花大教堂')
            if not found_file:
                # 簡化名稱：去掉 '聖母', '大教堂' 等通用詞來做關鍵字搜尋? 
                # 先簡單列出資料夾所有檔案來比對
                files = os.listdir(source_folder)
                for f_name in files:
                    if not f_name.endswith('.png'): continue
                    
                    # 檢查檔案名是否包含建築名的核心部分，或者建築名包含檔案名
                    name_core = f_name.replace('.png', '')
                    
                    # 雙向包含測試
                    if name_core in architect_name or architect_name in name_core:
                         # 排除誤判，例如 "聖母" 可能對應多個，這裡可能要小心
                         # 但暫時先假設使用者命名夠獨特
                         found_file = os.path.join(source_folder, f_name)
                         break
            
            # 3. 特殊處理 (Mapping Dictionary for mismatched names)
            name_mapping = {
               # 威尼斯 (venice_XX)
               "venice_01": "聖馬可大教堂.png",
               "venice_03": "里亞托橋.png",
               "venice_07": "黃金宮.png", 
               "venice_08": "聖洛可大會堂.png",
               "venice_09": "佩姬·古根漢美術館.png",
               "venice_10": "孔塔里尼蝸牛樓梯.png",
               "venice_11": "聖喬治馬焦雷教堂.png",
               "venice_12": "威尼斯軍火庫.png",
               
               # 羅馬 (rome_XX)
               "rome_03": "特萊維許願池.png",
               "rome_05": "聖天使堡.png",
               "rome_16": "羅馬聖路易堂.png", 

               # 佛羅倫斯 (firenze_XX 或 florence_XX)
               "firenze_01": "百花大教堂.png", # 注意 JSON 可能用 firenze
               "florence_01": "百花大教堂.png",
               
               "firenze_02": "聖喬治洗禮堂.png",
               "florence_02": "聖喬治洗禮堂.png",
               
               "firenze_06": "皮蒂宮.png",
               "florence_06": "皮蒂宮.png",
               
               "firenze_09": "聖羅洛倫佐大殿.png",
               "florence_09": "聖羅洛倫佐大殿.png",
               
               "firenze_14": "米朗基羅廣場.png",
               "florence_14": "米朗基羅廣場.png",

               # 為了保險，把中文名也 Map 進去
               "聖馬可宗座聖殿": "聖馬可大教堂.png",
               "里阿爾托橋": "里亞托橋.png",
               "聖洛克大講堂": "聖洛可大會堂.png",
               "威尼斯古根漢美術館": "佩姬·古根漢美術館.png",
               "蝸牛府螺旋梯": "孔塔里尼蝸牛樓梯.png",
               "SAN GIORGIO MAGGIORE": "聖喬治馬焦雷教堂.png",
               "碧提宮 / 彼提宮": "皮蒂宮.png",
               "聖勞倫佐聖殿 / 美第奇家族教堂": "聖羅洛倫佐大殿.png",
               "米開朗基羅廣場": "米朗基羅廣場.png"
            }
            
            # 先檢查 ID 是否在 mapping 中
            if file_id in name_mapping:
                 potential_path = os.path.join(source_folder, name_mapping[file_id])
                 if os.path.exists(potential_path):
                     found_file = potential_path

            # 再檢查 Name 是否在 mapping 中 (Backwards compatibility)
            if not found_file and architect_name in name_mapping:
                 potential_path = os.path.join(source_folder, name_mapping[architect_name])
                 if os.path.exists(potential_path):
                     found_file = potential_path
            
            if found_file:
                target_path = os.path.join(TARGET_IMAGES_DIR, f"{file_id}.png")
                
                # Check if target already exists
                if os.path.exists(target_path):
                    # print(f"  ⏭️  已存在: {file_id}.png")
                    pass
                else:
                    # Copy file to root
                    shutil.copy2(found_file, target_path)
                    print(f"  ✅ 連結成功: {found_file.split('/')[-1]} -> {file_id}.png")
                    linked_count += 1
            else:
                 print(f"  ❌ 找不到圖片: {architect_name} (ID: {file_id})")

    print(f"\n🎉 完成！共處理 {linked_count} 張圖片。")

if __name__ == "__main__":
    link_images()
