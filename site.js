(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-navigation');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Åpne meny');
    }));
  }
  const filters = [...document.querySelectorAll('.topic-filter')];
  const topics = [...document.querySelectorAll('.topic')];
  const count = document.getElementById('topic-count');
  filters.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    topics.forEach(topic => {
      const show = selected === 'alle' || topic.dataset.group === selected;
      topic.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = `Viser ${visible} av ${topics.length} temaer`;
  }));

  const archiveFilters = [...document.querySelectorAll('.archive-filter')];
  const archiveItems = [...document.querySelectorAll('.archive-item')];
  const archiveSearch = document.getElementById('archive-search');
  const archiveCount = document.getElementById('archive-count');
  const archiveEmpty = document.getElementById('archive-empty');
  if (archiveItems.length) {
    let activeCategory = 'alle';
    const applyArchiveFilters = () => {
      const term = (archiveSearch?.value || '').toLocaleLowerCase('nb-NO').trim();
      let visible = 0;
      archiveItems.forEach(item => {
        const categoryMatch = activeCategory === 'alle' || item.dataset.group === activeCategory;
        const searchMatch = !term || (item.dataset.search || '').includes(term);
        const show = categoryMatch && searchMatch;
        item.hidden = !show;
        if (show) visible++;
      });
      if (archiveCount) archiveCount.textContent = `Viser ${visible} av ${archiveItems.length} temaer`;
      if (archiveEmpty) archiveEmpty.hidden = visible !== 0;
    };
    archiveFilters.forEach(button => button.addEventListener('click', () => {
      activeCategory = button.dataset.filter || 'alle';
      archiveFilters.forEach(b => {
        const active = b === button;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      applyArchiveFilters();
    }));
    archiveSearch?.addEventListener('input', applyArchiveFilters);
    applyArchiveFilters();
  }
})();