const byId = id => document.getElementById(id);
const escapeHTML = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');
const withBreaks = value => escapeHTML(value).replaceAll('\n', '<br>');
const doiURL = doi => `https://doi.org/${encodeURI(String(doi).trim())}`;

function setText(id, value) {
  byId(id).textContent = value ?? '';
}

function profileLinks(site, variant = 'light') {
  const { identity, profile_labels: labels } = site;
  const orcidClass = variant === 'dark' ? 'orcid-link orcid-link-dark' : variant === 'academic' ? 'orcid-link' : '';
  const emailClass = variant === 'dark' ? 'contact-link' : '';
  const scholarClass = variant === 'dark' ? 'contact-link' : '';
  const emailLink = variant === 'dark' ? '' : `<a class="${emailClass}" href="mailto:${escapeHTML(identity.email)}">${escapeHTML(labels.email)}</a>`;
  return `
    ${emailLink}
    <a class="${scholarClass}" href="${escapeHTML(identity.google_scholar_url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(labels.google_scholar)} <span aria-hidden="true">↗</span></a>
    <a class="${orcidClass}" href="${escapeHTML(identity.orcid_url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(labels.orcid)} profile for ${escapeHTML(identity.name)}, opens in a new tab"><span class="${variant === 'light' ? 'orcid-dot' : 'orcid-icon'}" aria-hidden="true">iD</span><span>${escapeHTML(labels.orcid)}: ${escapeHTML(identity.orcid_id)}</span></a>`;
}

function renderSite(site) {
  const { identity, hero, about, team, contact, footer, publications_section: publications } = site;
  document.title = site.seo.title;
  document.querySelector('meta[name="description"]').content = site.seo.description;

  setText('brand-mark', identity.initials);
  setText('brand-name', identity.name);
  document.querySelector('.brand').setAttribute('aria-label', `${identity.name}, home`);
  byId('nav-links').innerHTML = site.navigation.map((item, index) =>
    `<a${index === 0 ? ' class="active"' : ''} href="#${escapeHTML(item.target)}">${escapeHTML(item.label)}</a>`
  ).join('');

  setText('hero-eyebrow', hero.eyebrow);
  setText('hero-title', hero.title);
  setText('hero-title-emphasis', hero.title_emphasis);
  document.querySelector('.hero-copy h1 br').hidden = !hero.title_emphasis;
  byId('hero-title-emphasis').hidden = !hero.title_emphasis;
  setText('hero-subtitle', hero.subtitle);
  byId('hero-actions').innerHTML = `
    <a class="button button-primary" href="#${escapeHTML(hero.primary_button_target)}">${escapeHTML(hero.primary_button_label)} <span aria-hidden="true">→</span></a>
    <a class="button button-text" href="#${escapeHTML(hero.secondary_button_target)}">${escapeHTML(hero.secondary_button_label)}</a>`;
  byId('hero-profile-links').innerHTML = profileLinks(site);
  byId('hero-image').src = hero.image;
  byId('hero-image').alt = hero.image_alt;
  setText('hero-image-label', hero.image_label);

  setText('about-label', about.section_label);
  setText('about-heading', about.heading);
  setText('about-lead', about.lead);
  byId('biographies').innerHTML = `
    <div class="language-block"><p class="language-label">${escapeHTML(about.english_label)}</p>${about.biography_en.map(text => `<p>${escapeHTML(text)}</p>`).join('')}</div>`;
  const aboutOrcid = byId('about-orcid');
  aboutOrcid.href = identity.orcid_url;
  aboutOrcid.setAttribute('aria-label', `ORCID profile for ${identity.name}, opens in a new tab`);
  aboutOrcid.querySelector('span:last-child').textContent = `${site.profile_labels.orcid}: ${identity.orcid_id}`;
  byId('facts').innerHTML = about.facts.map(fact => `<div><dt>${escapeHTML(fact.label)}</dt><dd>${withBreaks(fact.value)}</dd></div>`).join('');

  setText('publications-label', publications.section_label);
  setText('publications-heading', publications.heading);
  byId('publication-profile-links').innerHTML = profileLinks(site, 'academic');

  setText('team-label', team.section_label);
  setText('team-heading', team.heading);
  setText('team-intro', team.intro);
  byId('team-grid').innerHTML = team.members.map(member => `
    <article class="profile ${member.featured ? 'featured' : 'placeholder-profile'}">
      <div class="avatar">${escapeHTML(member.initials)}</div>
      <div><h3>${escapeHTML(member.name)}</h3><p>${escapeHTML(member.role)}</p></div>
    </article>`).join('');
  setText('opportunities-label', team.opportunities.label);
  setText('opportunities-heading', team.opportunities.heading);
  setText('opportunities-text', team.opportunities.text);
  const opportunitiesLink = byId('opportunities-link');
  opportunitiesLink.href = `mailto:${identity.email}`;
  opportunitiesLink.textContent = team.opportunities.button_label;

  setText('contact-label', contact.section_label);
  setText('contact-heading-1', contact.heading_line_1);
  setText('contact-heading-2', contact.heading_line_2);
  setText('contact-intro', contact.intro);
  byId('contact-list').innerHTML = `
    <div><dt>${escapeHTML(contact.email_label)}</dt><dd><a class="contact-link" href="mailto:${escapeHTML(identity.email)}">${escapeHTML(identity.email)}</a></dd></div>
    <div><dt>${escapeHTML(contact.office_label)}</dt><dd>${contact.office_lines.map(escapeHTML).join('<br>')}</dd></div>
    <div><dt>${escapeHTML(contact.profiles_label)}</dt><dd class="contact-profiles">${profileLinks(site, 'dark')}</dd></div>`;

  setText('year', new Date().getFullYear());
  setText('footer-name', identity.name);
  setText('footer-institution', footer.institution_line);
  setText('back-to-top', footer.back_to_top_label);
}

function renderResearch(research) {
  setText('research-label', research.section_label);
  setText('research-heading', research.heading);
  setText('research-intro', research.intro);
  byId('research-directions').innerHTML = research.directions.map((direction, index) => `
    <article class="research-card reveal">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <h3>${escapeHTML(direction.title)}</h3>
      <p>${escapeHTML(direction.description)}</p>
    </article>`).join('');
  setText('highlights-label', research.highlights_label);
  setText('highlights-heading', research.highlights_heading);
  byId('highlights-grid').innerHTML = research.highlights.map((highlight, index) => `
    <article class="result-card reveal">
      <a class="result-image" href="${escapeHTML(highlight.doi_url)}" target="_blank" rel="noopener noreferrer" aria-label="Open the ${escapeHTML(highlight.title)} paper">
        <img src="${escapeHTML(highlight.image)}" alt="${escapeHTML(highlight.image_alt)}">
      </a>
      <div class="result-copy">
        <span>${String(index + 1).padStart(2, '0')} / ${escapeHTML(highlight.year)}</span>
        <h3><a href="${escapeHTML(highlight.doi_url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(highlight.title)} <span aria-hidden="true">↗</span></a></h3>
        <p>${escapeHTML(highlight.description)}</p>
        <p class="citation">${escapeHTML(highlight.citation)}</p>
      </div>
    </article>`).join('');
}

function renderPublications(publications) {
  setText('selected-heading', publications.selected_heading);
  setText('selected-note', publications.selected_note);
  setText('full-heading', publications.full_heading);
  setText('full-note', publications.full_note);
  setText('verification-note', publications.verification_note);
  byId('selected-publications').innerHTML = publications.items.filter(item => item.featured).map(item => `
    <article class="publication-feature">
      <span class="publication-year">${escapeHTML(item.year)}</span>
      <div><h3>${escapeHTML(item.title)}</h3><p>${item.authors ? `${escapeHTML(item.authors)} · ` : ''}<em>${escapeHTML(item.journal)}</em></p><a href="${doiURL(item.doi)}" target="_blank" rel="noopener noreferrer">DOI: ${escapeHTML(item.doi)} <span aria-hidden="true">↗</span></a></div>
    </article>`).join('');
  byId('full-publications').innerHTML = publications.items.map(item => `
    <li><span>${escapeHTML(item.year)}</span><div><h3>${escapeHTML(item.title)}</h3><p>${item.authors ? `${escapeHTML(item.authors)} · ` : ''}<em>${escapeHTML(item.journal)}</em> · <a href="${doiURL(item.doi)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.doi)}</a></p></div></li>`).join('');
}

function initializeInteractions() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = [...document.querySelectorAll('.nav-links a')];

  function closeMenu() {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    navLinks.classList.toggle('open', !isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  });
  links.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const sections = [...document.querySelectorAll('header[id], main section[id]')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

async function loadContent() {
  try {
    const [site, research, publications] = await Promise.all([
      fetch('content/site.json').then(response => response.ok ? response.json() : Promise.reject(new Error(response.statusText))),
      fetch('content/research.json').then(response => response.ok ? response.json() : Promise.reject(new Error(response.statusText))),
      fetch('content/publications.json').then(response => response.ok ? response.json() : Promise.reject(new Error(response.statusText)))
    ]);
    renderSite(site);
    renderResearch(research);
    renderPublications(publications);
    initializeInteractions();
  } catch (error) {
    console.error('Unable to load website content.', error);
    document.body.insertAdjacentHTML('afterbegin', '<p class="load-error">Website content could not be loaded. Please refresh the page.</p>');
  }
}

loadContent();
