(function () {
  const root = document.querySelector("#market");
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll(".market__tab"));
  const searchInput = root.querySelector(".market__search-input");
  const cards = Array.from(root.querySelectorAll(".market__card"));
  const empty = root.querySelector(".market__empty");

  const countEls = new Map(
    Array.from(root.querySelectorAll(".market__tab-count")).map((el) => [
      el.getAttribute("data-count-for"),
      el,
    ])
  );

  const items = cards.map((el) => {
    const title = (el.dataset.title || "").trim();
    const category = (el.dataset.category || "").trim();
    return {
      el,
      titleLower: title.toLowerCase(),
      category,
    };
  });

  let activeCategory = "All";
  let query = "";

  function setActiveTab(nextCategory) {
    activeCategory = nextCategory || "All";

    tabs.forEach((btn) => {
      const isActive = btn.dataset.filter === activeCategory;
      btn.classList.toggle("market__tab--active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    apply();
  }

  function updateCounts(qLower) {
    const counts = { All: 0 };

    items.forEach((item) => {
      const matchQuery = !qLower || item.titleLower.includes(qLower);
      if (!matchQuery) return;

      counts.All++;
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    for (const [category, el] of countEls.entries()) {
      const value = counts[category] ?? 0;
      el.textContent = String(value);
    }
  }

  function apply() {
    const qLower = query.trim().toLowerCase();
    updateCounts(qLower);

    let visibleCount = 0;

    items.forEach((item) => {
      const matchCategory = activeCategory === "All" || item.category === activeCategory;
      const matchQuery = !qLower || item.titleLower.includes(qLower);
      const isVisible = matchCategory && matchQuery;

      item.el.classList.toggle("market__card--hidden", !isVisible);
      if (isVisible) visibleCount++;
    });

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
