import json
import re
import os

# ==============================================================================
# 1. MARKDOWN PARSER
# ==============================================================================
def parse_markdown(md_path):
    """
    Parses the Architecture_Detailed_Guide.md file.
    Returns a dictionary keyed by city, then by ID (01, 02...).
    Structure:
    {
        "Milan": {
            "01": {
                "en_name": "...", "tw_name": "...",
                "tw_visual": "...", "en_visual": "...",
                "tw_history": "...", "en_history": "..."
            },
            ...
        },
        ...
    }
    """
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by City Sections using "## 🏛️" or "## 🛶" or "## 🎨"
    city_chunks = re.split(r'##\s+[^\n]+', content)
    
    # We need to map chunks to cities. The split removes headings, so let's find indices.
    # Actually, simpler regex to find blocks:
    city_pattern = r'##\s+.*?([A-Za-z]+)\)\s*\n(.*?)(?=##|\Z)'
    city_matches = re.findall(city_pattern, content, re.DOTALL)
    
    parsed_data = {}

    for city_name, table_block in city_matches:
        city_key = city_name.strip() # Milan, Venice, Florence, Rome
        parsed_data[city_key] = {}
        
        # Regex to find table rows
        # | **01** | **NAME**<br>(TW) | **[EN]** ...<br>**[TW]** ... | ...
        row_pattern = r'\|\s*\*\*(\d+)\*\*\s*\|\s*\*\*(.*?)\*\*\s*<br>\((.*?)\)\s*\|\s*\*\*\[EN\]\*\*(.*?)\s*<br>\s*\*\*\[TW\]\*\*(.*?)\s*\|\s*\*\*\[EN\]\*\*(.*?)\s*<br>\s*\*\*\[TW\]\*\*(.*?)\s*\|'
        
        rows = re.findall(row_pattern, table_block, re.DOTALL)
        
        for row in rows:
            id_num, en_name, tw_name, en_visual, tw_visual, en_history, tw_history = row
            
            parsed_data[city_key][id_num] = {
                "en_name": en_name.strip(),
                "tw_name": tw_name.strip(),
                "en_visual": en_visual.strip().replace('\n', ' '),
                "tw_visual": tw_visual.strip().replace('\n', ' '),
                "en_history": en_history.strip().replace('\n', ' '),
                "tw_history": tw_history.strip().replace('\n', ' ')
            }
            
    return parsed_data

# ==============================================================================
# 2. JSON UPDATER
# ==============================================================================
def update_json_files(parsed_data, base_dir):
    city_file_map = {
        "Milan": "milan.json",
        "Florence": "florence.json",
        "Venice": "venice.json",
        "Rome": "rome.json"
    }

    for city_key, json_filename in city_file_map.items():
        if city_key not in parsed_data:
            print(f"⚠️ No markdown data found for {city_key}")
            continue
            
        json_path = os.path.join(base_dir, json_filename)
        if not os.path.exists(json_path):
            print(f"⚠️ JSON file not found: {json_path}")
            continue
            
        print(f"Processing {json_filename} with data from Markdwon...")
        
        with open(json_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
            
        updated_count = 0
        
        for item in json_data:
            # Get ID number from item['id'] (e.g., 'milan_01' -> '01')
            try:
                id_num = item['id'].split('_')[-1]
            except:
                continue
                
            md_info = parsed_data[city_key].get(id_num)
            
            if md_info:
                # UPDATE FIELDS TO CHINESE
                item['name'] = md_info['tw_name']     # Main Display Name -> Chinese
                item['name_en'] = md_info['en_name']  # Backup English Name
                
                # We use the TW Visual Description for "features" for better context in UI
                item['features'] = md_info['tw_visual'] 
                
                item['history_text'] = md_info['tw_history'] # Display History -> Chinese
                
                # Keep English fields securely for Prompt Generation (or strictly separate)
                item['key_visual_en'] = md_info['en_visual']
                item['history_text_en'] = md_info['en_history']
                
                updated_count += 1
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=4, ensure_ascii=False)
            
        print(f"✅ Updated {updated_count} items in {json_filename}")

# ==============================================================================
# MAIN
# ==============================================================================
if __name__ == "__main__":
    md_path = "/Users/eyestudio/Documents/AILife/eyework/02_義大利建築/Architecture_Detailed_Guide.md"
    json_dir = "/Users/eyestudio/Documents/AILife/italy-arch-manager/src/data"
    
    data = parse_markdown(md_path)
    update_json_files(data, json_dir)
