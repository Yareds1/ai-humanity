// The archive owns its search and topic state; bookmarks supply membership only.
export function mountResearchBrowser(root, { isSaved = () => false } = {}) {
  const search = root.querySelector('#research-search');
  const filters = [...root.querySelectorAll('[data-filter]')];
  const entries = [...root.querySelectorAll('.story-entry')].map(element => {
    const card = element.querySelector('.story-card');
    return { element, card, topics: card.dataset.topic.split(/\s+/), text: card.textContent.toLocaleLowerCase() };
  });
  const count = root.querySelector('#research-count');
  const empty = root.querySelector('#research-empty');
  const reset = root.querySelector('#reset-research');
  let topic = 'all';
  let query = '';
  let timer;

  function readLocation() {
    const params = new URLSearchParams(location.search);
    const requested = params.get('topic');
    topic = filters.some(button => button.dataset.filter === requested) ? requested : 'all';
    query = params.get('q') || '';
    search.value = query;
  }

  function writeLocation() {
    const url = new URL(location.href);
    if (topic === 'all') url.searchParams.delete('topic');
    else url.searchParams.set('topic', topic);
    if (query.trim()) url.searchParams.set('q', query.trim());
    else url.searchParams.delete('q');
    // Typing updates the current entry without filling browser history per key.
    history.replaceState(null, '', url);
  }

  function render() {
    const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const matchingSearch = entries.filter(entry => terms.every(term => entry.text.includes(term)));
    let visible = 0;
    const matchesTopic = (entry, value) => value === 'all' || (value === 'saved' ? isSaved(entry.card.href) : entry.topics.includes(value));
    entries.forEach(entry => {
      const show = matchingSearch.includes(entry) && matchesTopic(entry, topic);
      entry.element.hidden = !show;
      if (show) visible++;
    });
    filters.forEach(button => {
      const value = button.dataset.filter;
      const selected = value === topic;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.querySelector('.topic-count').textContent = matchingSearch.filter(entry => matchesTopic(entry, value)).length;
    });
    count.textContent = `${visible} of ${entries.length} articles${topic === 'saved' ? ' · saved on this device' : ''}`;
    reset.hidden = topic === 'all' && !query;
    empty.hidden = visible > 0;
    empty.querySelector('h3').textContent = topic === 'saved' && !query ? 'Your reading list starts here.' : 'No matching articles.';
    empty.querySelector('p').textContent = topic === 'saved' && !query ? 'Tap a bookmark on any article to keep it on this device.' : 'Try fewer words, another topic, or reset the filters.';
  }

  filters.forEach(button => {
    // Keep the existing saved-total hook away from the topic-specific count.
    button.querySelector('.saved-total')?.remove();
    const badge = document.createElement('span');
    badge.className = 'topic-count';
    button.append(badge);
    button.addEventListener('click', () => {
      clearTimeout(timer);
      topic = button.dataset.filter;
      writeLocation();
      render();
    });
  });
  search.addEventListener('input', () => {
    query = search.value;
    render();
    clearTimeout(timer);
    timer = setTimeout(writeLocation, 200);
  });
  const clear = () => {
    clearTimeout(timer);
    topic = 'all'; query = ''; search.value = '';
    writeLocation(); render(); search.focus({ preventScroll: true });
  };
  reset.addEventListener('click', clear);
  root.querySelector('#clear-research').addEventListener('click', clear);
  addEventListener('popstate', () => { clearTimeout(timer); readLocation(); render(); });
  readLocation();
  render();
  if (new URLSearchParams(location.search).get('search') === '1') {
    search.focus({ preventScroll: true });
  }
  return { refresh: render };
}
