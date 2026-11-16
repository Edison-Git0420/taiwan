# AGENTS.md — 認識台灣 (Discover Taiwan) 數位文化與知識庫

## 1. 專案目的 (Project Purpose)
本專案是一個介紹台灣多元面貌的靜態知識庫網站，部署於 GitHub Pages（專案名稱 `taiwan`）。
核心目標是將台灣的飲食文化、自然地理、傳統節慶、歷史古蹟與現代科技結構化，讓 AI 助手能依據本文件的規範，快速擴充新的台灣主題介紹頁面，無需修改任何 HTML 或 CSS 排版程式碼。

## 2. 技術棧與部署限制 (Tech Stack & Constraints)
- **核心技術**：原生 HTML5、CSS3（使用 CSS Variables）、Vanilla JavaScript (ES6+)。
- **零依賴原則**：禁止引入 React、Vue、Webpack 或任何需要編譯建置的框架，確保推送至 GitHub Pages 後可直接瀏覽。
- **字體與圖示**：僅透過 Google Fonts 引入 `Noto Sans TC` 與 `Plus Jakarta Sans`，圖示統一使用 Unicode Emoji 或內嵌 SVG。

## 3. 檔案結構與命名規範 (File Structure & Naming)
```text
taiwan/
├── AGENTS.md                 # 本開發規範文件
├── index.html                # 首頁（分類篩選與所有主題卡片總覽）
├── topic.html                # 主題詳情頁（透過 URL Query `?id=<id>` 載入對應資料）
├── assets/
│   ├── css/style.css         # 全站統一樣式表（禁止在 HTML 寫 inline style）
│   └── js/
│       ├── registry.js       # 主題總目錄索引（新增主題時必須更新此檔）
│       └── renderer.js       # 負責讀取 data/*.json 並渲染至畫面的核心邏輯
└── data/                     # 存放所有台灣主題內容的 JSON 檔案
    └── <編號>-<英文主題>.json  # 命名規則：兩位數編號 + 小寫連字號，例如 `01-night-market.json`
    4. 網頁設計與視覺風格 (Design System)
視覺風格：現代人文誌風格（Modern Editorial），結合台灣「玉山青綠」與「珍珠奶茶暖金」意象，清爽易讀。

色彩規範（定義於 assets/css/style.css 的 :root）：

背景主色：#F8FAF9（卡片背景 #FFFFFF）

主要強調色：#0F766E（台灣山海青綠，用於標題、主按鈕與重點標記）

輔助強調色：#D97706（暖琥珀金，用於分類標籤與文化亮點）

文字主色：#1E293B，次要文字：#475569

版面規則：最大閱讀寬度為 1000px 置中，卡片統一採用 border-radius: 14px 與柔和陰影，並完整支援手機與桌面版響應式排版。

5. 新增內容標準作業程序 (SOP for Adding New Content)
當使用者要求「新增一個台灣主題」、「建立一篇介紹」或「補充某個景點/文化」時，AI 必須嚴格執行以下兩個步驟，禁止直接修改 index.html 的靜態內容：

步驟 A：建立資料檔 (data/<編號>-<slug>.json)
在 data/ 資料夾下建立新的 JSON 檔案，必須完全符合現有 data/01-night-market.json 與 assets/js/renderer.js 所解析的欄位結構（包含 id、category、title、subtitle、region、updatedAt 以及各內容區塊陣列），確保新舊資料欄位名稱完全一致。

步驟 B：更新目錄索引 (assets/js/registry.js)
開啟 assets/js/registry.js，在主題目錄陣列中新增該主題的摘要物件（包含 id、file、category、title、subtitle、region 等欄位），使其能自動顯示於首頁卡片清單與分類篩選器中。

6. AI 開發與修改守則 (Rules for AI)
保持向後相容：修改 renderer.js 或 style.css 時，必須確保 data/ 目錄下所有既有的 JSON 檔案仍能正常渲染，不得破壞舊頁面。

禁止硬編碼內容：嚴禁在 index.html 或 topic.html 中直接寫死文章段落或景點介紹。

結構對齊驗證：每次新增主題前，必須先讀取現有的 data/01-night-market.json 與 assets/js/registry.js 確認確切鍵名（Keys），產出後檢查 JSON 語法合法性（無多餘逗號、雙引號正確跳脫），且 id 與檔名（不含副檔名）完全一致。

語言與在地規範：全站使用繁體中文（台灣習慣用語，如「夜市」、「捷運」、「珍珠奶茶」），專有名詞可附註英文翻譯以利國際交流。