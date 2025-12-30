import json
import os

# ==============================================================================
# 黃金 PROMPT 模板 (The Approved Golden Template)
# ==============================================================================
MASTER_TEMPLATE = """[Square 1:1 Layout] [Symmetrical Split] Role: You are a lead curator. Subject: {name}.

Style & Vibe: (CRITICAL) Subtle High-Quality Antique Paper. Light creamy texture. Very faint aging. FULL BLEED TEXTURE (Edge-to-Edge). The paper must fill the entire canvas 100%. NO visible paper edges. NO borders. NO background surface. Elegant Architect's Manuscript.

Layout Strategy:
[CRITICAL CONSTRAINT: GRID SYSTEM] The image is strictly divided by a **VISIBLE THIN VERTICAL LINE** down the center.
**[LOCKED CENTRAL AXIS]:** The dividing line MUST remain exactly in the center (50%). **NO SHIFTING.**
LEFT SIDE (Locked 50%): Architectural Analysis. Content MUST NOT cross the center line.
RIGHT SIDE (Locked 50%): Historical Narrative. Content MUST NOT cross the center line.
**Margins:** Keep text and diagrams away from the absolute edges (Safe Zone).

**Instructions for the LEFT SIDE (50% - Strict Original Framework):**
(Strictly following the User's Original Chinese Framework)

1. **Top Section (Upper 1/3):**
   *   **Key Visual:** {key_visual} (Full Color Photo).
   *   **[CRITICAL: PURE PHOTOGRAPHY]:** Visual Impact ONLY.
       *   **NO TEXT.** NO Captions. NO Summaries. NO Labels in this section.
       *   **Lighting:** **PERFECT LIGHTING** (Golden Hour / Dramatic God Rays). Best moment of the day.
       *   **Quality:** 8k Masterpiece, High Res.
       *   **Composition:** Immersive, wide-angle interior shot.

2. **Middle Section (Middle 1/3):**
   *   **Left Half:** {name} 最具代表性的「正立面圖」，繪製 **色彩鮮豔的精細水彩 (Vibrant Full Color Watercolor)**。
   *   **Right Half:** 繪製精細的工程剖面圖，展示內部結構和施工方法。
   *   **[CRITICAL: RED DOTS 錨定協議]:** 必須精確包含 4-6 個 **小巧、精緻、細膩的寶石紅圓點 (Small, Delicate, Exquisite Ruby-Red Dots)**。
       *   **Refined Size:** Dots must be small and elegant, not large.
       *   **標籤:** 每個紅點帶有細緻的黑色墨水引導線，指向 **Visible English Text Labels**.

3. **Bottom Section (Lower 1/3):**
   *   **Left Plan (Layout & Flow):** {name} 主要樓層的詳細平面圖 (仿古藍圖風格)。
       *   **[參觀動線]:** 繪製一條清晰的 **帶箭頭虛線 (Dashed Vector Line)**。
       *   **[POI]:** 4-6 **SOLID DOTS with VISIBLE NUMBER DIGITS (1, 2, 3...)**. Numbers MUST be visible.
       *   **[相機圖標]:** 放置 2-3 個帶有視野錐形的相機圖標。
       *   **[圖例]:** 在旁提供清晰的 **Legend List**, with numbered text items explaining the points.
   *   **Right Map (Context):** 建築物城市背景地圖，包含街道、English Labels、比例尺與指北針。

4. **Footer:**
   *   帶有裝飾性古典雙重邊框的矩形區域。
   *   **Title:** "{name_upper}" in **Bold Didot Typeface (Heavy Weight)**. Use consistent thick strokes.
   *   **Description:** "{features}" in Modern Sans-serif.
   *   **[Watermark]:** Clearly display small text "**eyenote@gmail.com**" in the bottom corner.

**Instructions for the RIGHT SIDE (50% - The Story):**
*   **Concept:** Storytelling space with **Specimens**.
*   **Background:** Clean antique paper.
*   **Primary Content (Historical Anecdote & Illustrations):**
    *   **Position:** Center.
    *   **The Text:** A block of English text titled "HISTORICAL LEGEND".
    *   **Style:** **Smaller Font Size (Elegant Book Body)**. Much smaller than the title. High-Legibility Sans-serif.
    *   **[Visual Integration]:** **Text Wrapping**. The text block MUST integreate/wrap around **2-3 small detailed spot illustrations** (e.g., an antique Coin, a Mason's Tool, or a small Sketch Fragment).
    *   **Content (EXACT TEXT):** "{history_text}"
*   **Visual Balance (Typography):**
    *   **Numbering:** "No.{num_id}" in **Bold Didot Typeface**. **SIZE: Medium/Small**. Consistent Weight.
    *   **Logotype:** Vertical **Artistic Typography** for "{name_upper}".

Technical Specs: [Square 1:1 Layout], [50/50 Symmetrical Split], [Subtle Antique Texture], [Full Color Mode], [Visible Text Integretation], [Watermark eyenote@gmail.com], Best Quality:1.2.
--ar 1:1"""

def update_city_data(file_path):
    print(f"Processing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    
    for item in data:
        # Extract necessary fields
        name = item.get('name', 'Unknown Architecture')
        name_upper = name.upper()
        features = item.get('features', 'Architecture')
        key_visual = item.get('key_visual', f"View of {name}")
        history_text = item.get('history_text', f"Historical details about {name}")
        
        # Extract number ID (e.g., milan_01 -> 01, flo_02 -> 02)
        item_id = item.get('id', '00')
        try:
            num_id = item_id.split('_')[-1]
        except:
            num_id = "00"
            
        # Generate Prompt
        prompt = MASTER_TEMPLATE.format(
            name=name,
            name_upper=name_upper,
            features=features,
            key_visual=key_visual,
            history_text=history_text,
            num_id=num_id
        )
        
        # Update the item
        item['prompt'] = prompt
        updated_count += 1
        
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
    print(f"✅ Updated {updated_count} items in {file_path}")

def main():
    base_dir = '/Users/eyestudio/Documents/AILife/italy-arch-manager/src/data'
    files = ['milan.json', 'florence.json', 'venice.json', 'rome.json']
    
    for filename in files:
        full_path = os.path.join(base_dir, filename)
        if os.path.exists(full_path):
            update_city_data(full_path)
        else:
            print(f"⚠️ File not found: {full_path}")

if __name__ == "__main__":
    main()
