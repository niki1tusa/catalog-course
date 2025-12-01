(function () {
  const root = document.querySelector("#market");
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll(".market__tab"));
  const searchInput = root.querySelector(".market__search-input");
  const cards = Array.from(root.querySelectorAll(".market__card"));
  const empty = root.querySelector(".market__empty");
  const allCountEl = root.querySelector('[data-count-for="All"]');

  const items = cards.map((el) => {
    const title = (el.dataset.title || "").trim();
    const category = (el.dataset.category || "").trim();
    return {
      el,
      title,
      titleLower: title.toLowerCase(),
      category
    };
  });

  let activeCategory = "All";
  let query = "";

  function setActiveTab(nextCategory) {
    activeCategory = nextCategory;

    tabs.forEach((btn) => {
      const isActive = btn.dataset.filter === activeCategory;
      btn.classList.toggle("market__tab--active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    apply();
  }

  function apply() {
    const q = query.trim().toLowerCase();

    let visibleCount = 0;

    items.forEach((item) => {
      const matchCategory = activeCategory === "All" || item.category === activeCategory;
      const matchQuery = !q || item.titleLower.includes(q);
      const isVisible = matchCategory && matchQuery;

      item.el.classList.toggle("market__card--hidden", !isVisible);
      if (isVisible) visibleCount++;
    });

    if (allCountEl) allCountEl.textContent = String(visibleCount);
    if (empty) empty.hidden = visibleCount !== 0;
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.filter || "All"));
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      query = e.target.value || "";
      apply();
    });
  }

  apply();
})();
