(function () {
  "use strict";

  const topics = Array.isArray(window.TAIWAN_TOPICS) ? window.TAIWAN_TOPICS : [];

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function safeUrl(value) {
    try {
      const url = new URL(value, window.location.href);
      if (url.protocol === "https:" || url.protocol === "http:") return url.href;
      if (url.origin === window.location.origin) return url.href;
    } catch (error) {
      return "#";
    }
    return "#";
  }

  function updateYear() {
    const year = document.getElementById("current-year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function renderIndex() {
    const grid = document.getElementById("topic-grid");
    if (!grid) return;

    const categoryList = document.getElementById("category-list");
    const searchInput = document.getElementById("topic-search");
    const status = document.getElementById("results-status");
    const emptyState = document.getElementById("empty-state");
    const categories = ["全部主題", ...new Set(topics.map((topic) => topic.category))];
    let activeCategory = "全部主題";

    categoryList.innerHTML = categories.map((category, index) => `
      <button class="category-button" type="button" data-category="${escapeHtml(category)}" aria-pressed="${index === 0}">
        ${escapeHtml(category)}
      </button>
    `).join("");

    function renderCards() {
      const query = searchInput.value.trim().toLocaleLowerCase("zh-Hant");
      const visibleTopics = topics.filter((topic) => {
        const categoryMatches = activeCategory === "全部主題" || topic.category === activeCategory;
        const searchText = `${topic.title} ${topic.category} ${topic.summary}`.toLocaleLowerCase("zh-Hant");
        return categoryMatches && searchText.includes(query);
      });

      grid.innerHTML = visibleTopics.map((topic) => `
        <article class="topic-card">
          <a class="topic-card-link" href="topic.html?id=${encodeURIComponent(topic.id)}" aria-label="閱讀：${escapeHtml(topic.title)}">
            <div class="topic-card-image">
              <img src="${escapeHtml(safeUrl(topic.coverImage))}" alt="${escapeHtml(topic.imageAlt)}" loading="lazy">
              <span class="topic-card-number">${escapeHtml(topic.number)}</span>
            </div>
            <div class="topic-card-body">
              <div class="topic-card-meta"><span>${escapeHtml(topic.category)}</span><span>${escapeHtml(topic.readingTime || "")}</span></div>
              <h3>${escapeHtml(topic.title)}</h3>
              <p>${escapeHtml(topic.summary)}</p>
              <span class="card-read">閱讀主題 <span aria-hidden="true">→</span></span>
            </div>
          </a>
        </article>
      `).join("");

      status.textContent = `共 ${visibleTopics.length} 個主題`;
      emptyState.hidden = visibleTopics.length > 0;
      grid.hidden = visibleTopics.length === 0;
    }

    categoryList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-category]");
      if (!button) return;
      activeCategory = button.dataset.category;
      categoryList.querySelectorAll("button").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      renderCards();
    });

    searchInput.addEventListener("input", renderCards);
    document.getElementById("clear-filters").addEventListener("click", () => {
      activeCategory = "全部主題";
      searchInput.value = "";
      categoryList.querySelectorAll("button").forEach((button, index) => {
        button.setAttribute("aria-pressed", String(index === 0));
      });
      renderCards();
      searchInput.focus();
    });

    renderCards();
  }

  function renderNotFound(container, message) {
    container.setAttribute("aria-busy", "false");
    container.className = "topic-error";
    container.innerHTML = `
      <p class="eyebrow">ISLAND NOTES / 404</p>
      <h1>這篇島嶼筆記暫時找不到</h1>
      <p>${escapeHtml(message)}</p>
      <a class="text-link" href="index.html">回到主題探索 <span aria-hidden="true">↗</span></a>
    `;
  }

  function renderTopic(data, registryEntry) {
    const sections = Array.isArray(data.sections) ? data.sections : [];
    const highlights = Array.isArray(data.highlights) ? data.highlights : [];
    const facts = Array.isArray(data.quickFacts) ? data.quickFacts : [];
    const sources = Array.isArray(data.sources) ? data.sources : [];
    const validSources = sources.filter((source) => source && source.title && safeUrl(source.url) !== "#");
    const coverUrl = safeUrl(data.coverImage || registryEntry.coverImage);

    return `
      <article class="topic-article">
        <nav class="breadcrumbs" aria-label="麵包屑導覽">
          <a href="index.html">主題探索</a><span aria-hidden="true">/</span><span>${escapeHtml(data.category)}</span>
        </nav>
        <header class="topic-header">
          <p class="eyebrow">FIELD NOTES <span class="heading-index">/ ${escapeHtml(registryEntry.number)}</span></p>
          <h1>${escapeHtml(data.title)}</h1>
          <p class="topic-summary">${escapeHtml(data.subtitle || data.summary)}</p>
          <p class="topic-byline">${data.region ? `${escapeHtml(data.region)} · ` : ""}${escapeHtml(data.readingTime || registryEntry.readingTime || "")} · 更新於 ${escapeHtml(data.updatedAt || "")}</p>
        </header>
        <figure class="topic-cover">
          <img src="${escapeHtml(coverUrl)}" alt="${escapeHtml(data.imageAlt || registryEntry.imageAlt)}">
          <figcaption>${escapeHtml(data.imageCaption || data.imageAlt || "台灣生活風景")}</figcaption>
        </figure>
        ${highlights.length ? `
          <div class="topic-highlights" aria-label="主題摘要">
            ${highlights.map((item) => `<div class="highlight-item"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join("")}
          </div>
        ` : ""}
        <div class="topic-body">
          <div class="topic-sections">
            ${sections.map((section, index) => `
              <section class="article-section" id="section-${index + 1}">
                <h2><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(section.heading)}</h2>
                <p>${escapeHtml(section.body)}</p>
              </section>
            `).join("")}
          </div>
          ${facts.length ? `
            <aside class="topic-aside" aria-labelledby="facts-title">
              <h2 id="facts-title">${escapeHtml(data.quickFactsTitle || "主題小筆記")}</h2>
              <ul>${facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
            </aside>
          ` : ""}
        </div>
        ${validSources.length ? `
          <section class="topic-sources" aria-labelledby="sources-title">
            <h2 id="sources-title">延伸資料</h2>
            <ul>${validSources.map((source) => `<li><a href="${escapeHtml(safeUrl(source.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} ↗</a></li>`).join("")}</ul>
          </section>
        ` : ""}
        ${Array.isArray(data.relatedTopics) && data.relatedTopics.length ? `
          <section class="related-topics" aria-labelledby="related-title">
            <h2 id="related-title">繼續探索</h2>
            <div class="related-list">${data.relatedTopics.map((id) => topics.find((topic) => topic.id === id)).filter(Boolean).map((topic) => `<a class="related-link" href="topic.html?id=${encodeURIComponent(topic.id)}">${escapeHtml(topic.title)} ↗</a>`).join("")}</div>
          </section>
        ` : ""}
      </article>
    `;
  }

  async function renderTopicPage() {
    const container = document.getElementById("topic-content");
    if (!container) return;

    const id = new URLSearchParams(window.location.search).get("id");
    const registryEntry = topics.find((topic) => topic.id === id);
    if (!registryEntry) {
      renderNotFound(container, "請從主題列表選擇一篇筆記，或確認網址中的主題編號。");
      return;
    }

    try {
      const response = await fetch(registryEntry.file);
      if (!response.ok) throw new Error(`載入主題資料失敗 (${response.status})`);
      const data = await response.json();
      if (data.id !== registryEntry.id) throw new Error("主題資料與索引編號不一致。");
      document.title = `${data.title} | 認識台灣`;
      container.setAttribute("aria-busy", "false");
      container.className = "topic-content";
      container.innerHTML = renderTopic(data, registryEntry);
    } catch (error) {
      renderNotFound(container, "主題資料載入失敗，請稍後再試或回到主題列表。");
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateYear();
    renderIndex();
    renderTopicPage();
  });
})();