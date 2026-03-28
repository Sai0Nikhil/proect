import React, { useEffect, useMemo, useState } from 'react';

// Paste your Gemini API key from https://aistudio.google.com/apikey
import Librarian from './librarian.jsx';
import Staff from './staff.jsx';
import Landing from './Landing.jsx';

const sections = [
  { id: 'literature', name: 'Literature', description: 'Classic and modern books with key themes and quick summaries.' },
  { id: 'history', name: 'History', description: 'Important events, civilizations, and world-changing movements.' },
  { id: 'science', name: 'Science', description: 'Core scientific topics explained in simple and practical terms.' },
  { id: 'governance', name: 'Governance', description: 'Policy and civic resources for public systems and institutions.' },
];

const allResources = [
  {
    id: 'to-kill-a-mockingbird',
    sectionId: 'literature',
    title: 'To Kill a Mockingbird',
    summary: 'A coming-of-age novel centered on justice, empathy, and morality.',
    body: 'Set in the American South during the 1930s, this Pulitzer Prize-winning novel follows young Scout Finch as she observes her father Atticus defend a Black man falsely accused of a crime. The story tackles racism, injustice, and the loss of innocence through the eyes of a child.',
    tags: ['classic', 'justice', 'novel'],
    author: 'Harper Lee',
    year: 1960,
    pages: 281,
    difficulty: 'Intermediate',
    keyThemes: ['Racial injustice', 'Moral courage', 'Loss of innocence', 'Empathy', 'Social class'],
    keyQuote: '"You never really understand a person until you consider things from his point of view."',
    whyRead: 'Essential American literature that remains deeply relevant. Teaches empathy and the courage to stand up for what is right even when unpopular.',
    similarTo: ['The Catcher in the Rye', 'Of Mice and Men', 'The Color Purple'],
  },
  {
    id: '1984',
    sectionId: 'literature',
    title: '1984',
    summary: 'A dystopian story about surveillance, power, and truth.',
    body: 'George Orwell explores authoritarian control and the manipulation of language and information.',
    tags: ['dystopia', 'politics', 'society'],
  },
  {
    id: 'pride-and-prejudice',
    sectionId: 'literature',
    title: 'Pride and Prejudice',
    summary: 'A social comedy about love, class, and first impressions.',
    body: 'Jane Austen follows Elizabeth Bennet as she navigates family expectations, misunderstanding, and personal growth in Regency England.',
    tags: ['romance', 'society', 'classic'],
  },
  {
    id: 'the-alchemist',
    sectionId: 'literature',
    title: 'The Alchemist',
    summary: 'A fable about following your personal legend and trusting the journey.',
    body: 'Paulo Coelho tells the story of Santiago, a shepherd who travels in search of treasure and discovers meaning and self-belief.',
    tags: ['philosophy', 'motivation', 'novel'],
  },
  {
    id: 'industrial-revolution',
    sectionId: 'history',
    title: 'Industrial Revolution',
    summary: 'How mechanization transformed economies, cities, and labor systems.',
    body: 'Beginning in Britain around 1760, the Industrial Revolution introduced steam power, factories, and mass production. It triggered rapid urbanization, the rise of the working class, child labor controversies, and ultimately created the modern capitalist economy.',
    tags: ['industry', 'economy', 'society'],
    period: '1760–1840',
    origin: 'Great Britain',
    difficulty: 'Beginner',
    keyFigures: ['James Watt', 'Richard Arkwright', 'George Stephenson', 'Robert Owen'],
    keyThemes: ['Mechanization', 'Urbanization', 'Class struggle', 'Capitalism', 'Labor rights'],
    keyFact: 'In 1800, fewer than 10% of people lived in cities. By 1900, 50% of Britain\'s population was urban — one of history\'s fastest demographic shifts.',
    impact: 'Created modern capitalism, the factory system, labor unions, and set the stage for the 20th century\'s global industrial powers.',
    similarTopics: ['The Gilded Age', 'Marxism & Socialism', 'The Digital Revolution'],
  },
  {
    id: 'renaissance-overview',
    sectionId: 'history',
    title: 'The Renaissance',
    summary: 'A cultural revival that reshaped art, science, and philosophy in Europe.',
    body: 'The Renaissance marked a transition from medieval to early modern thought in art, literature, and humanism.',
    tags: ['europe', 'culture', 'art'],
  },
  {
    id: 'world-war-ii',
    sectionId: 'history',
    title: 'World War II Basics',
    summary: 'A global conflict that reshaped borders, power, and international institutions.',
    body: 'From 1939 to 1945, World War II involved major powers on multiple continents and led to the UN, decolonisation, and new global alliances.',
    tags: ['war', 'geopolitics', '20th-century'],
  },
  {
    id: 'indian-independence',
    sectionId: 'history',
    title: 'Indian Independence Movement',
    summary: 'The struggle that ended colonial rule in India.',
    body: 'Through mass movements, non-violent resistance, and negotiations, India achieved independence from British rule in 1947.',
    tags: ['india', 'freedom', 'nationalism'],
  },
  {
    id: 'solar-system',
    sectionId: 'science',
    title: 'The Solar System',
    summary: 'A concise guide to planets, orbits, and key space concepts.',
    body: 'Our solar system formed about 4.6 billion years ago from a giant cloud of gas and dust. It contains the Sun, 8 planets, 5 dwarf planets, hundreds of moons, and millions of asteroids and comets.',
    tags: ['astronomy', 'planets', 'space'],
    difficulty: 'Beginner',
    keyFacts: [
      'Light from the Sun takes 8 minutes to reach Earth',
      'Jupiter is so massive it contains 2.5× the mass of all other planets combined',
      'A day on Venus is longer than its year',
      'Saturn\'s rings are only ~10 meters thick but span 282,000 km',
      'Mars has the tallest volcano in the solar system (Olympus Mons: 22km high)',
    ],
    keyThemes: ['Gravity', 'Orbital mechanics', 'Planetary formation', 'Habitability', 'Space exploration'],
    keyQuote: '"The cosmos is within us. We are made of star-stuff." — Carl Sagan',
    whyStudy: 'Understanding the solar system is the foundation of astronomy, space exploration, and the search for extraterrestrial life.',
    relatedTopics: ['Black Holes', 'The Big Bang', 'Exoplanets', 'Astrobiology'],
  },
  {
    id: 'human-body-systems',
    sectionId: 'science',
    title: 'Human Body Systems',
    summary: 'Major organ systems and how they work together to sustain life.',
    body: 'The human body contains 11 major organ systems working in perfect coordination.',
    tags: ['biology', 'health', 'anatomy'],
    difficulty: 'Intermediate',
    keyFacts: [
      'The human brain has ~86 billion neurons forming 100 trillion connections',
      'Your body replaces most cells every 7–10 years',
      'The small intestine is about 6 meters long',
      'Bone is 5× stronger than steel by weight',
    ],
    keyThemes: ['Homeostasis', 'Organ function', 'Cell biology', 'Nervous system', 'Immune response'],
    keyQuote: '"To keep the body in good health is a duty." — Buddha',
    whyStudy: 'Foundation for medicine, public health, nutrition, and understanding your own body and wellbeing.',
    relatedTopics: ['Genetics & DNA', 'Nutrition Science', 'Neuroscience', 'Immunology'],
  },
  {
    id: 'basic-electricity',
    sectionId: 'science',
    title: 'Basic Electricity',
    summary: 'The idea of charge, current, voltage, and resistance.',
    body: 'Explains how electrons move in circuits, the meaning of voltage and current, and how resistors control the flow of electricity.',
    tags: ['physics', 'circuits', 'fundamentals'],
  },
  {
    id: 'states-of-matter',
    sectionId: 'science',
    title: 'States of Matter',
    summary: 'Solid, liquid, gas, and beyond.',
    body: 'Describes how particle arrangement and energy levels change between solids, liquids, gases, and plasma, with daily-life examples.',
    tags: ['chemistry', 'particles', 'everyday'],
  },
];

function ResourceDetailPanel({ resource, allSections }) {
  if (!resource) return (
    <aside className="detail-panel detail-panel--empty">
      <div className="detail-empty">
        <span className="detail-empty-icon">📖</span>
        <h3>Select a resource</h3>
        <p>Choose any item from the list to explore in depth.</p>
      </div>
    </aside>
  );

  return (
    <aside className="detail-panel">
      <div className="detail-header">
        <div className="detail-badge">
          {(allSections || sections).find(s => s.id === resource.sectionId)?.name}
        </div>
        <h2 className="detail-title">{resource.title}</h2>

        {(resource.author || resource.period || resource.difficulty) && (
          <div className="detail-meta-row">
            {resource.author && <span className="detail-chip">{resource.author}</span>}
            {resource.year && <span className="detail-chip">{resource.year}</span>}
            {resource.pages && <span className="detail-chip">{resource.pages} pages</span>}
            {resource.period && <span className="detail-chip">{resource.period}</span>}
            {resource.origin && <span className="detail-chip">{resource.origin}</span>}
            {resource.difficulty && (
              <span className={`detail-chip detail-chip--${resource.difficulty.toLowerCase()}`}>
                {resource.difficulty}
              </span>
            )}
          </div>
        )}

        <p className="detail-summary">{resource.summary}</p>
      </div>

      <div className="detail-body">
        <p className="detail-description">{resource.body}</p>

        {resource.keyQuote && (
          <blockquote className="detail-quote">
            <p>{resource.keyQuote}</p>
          </blockquote>
        )}

        {resource.keyThemes && (
          <div className="detail-section">
            <h4 className="detail-section-title">Key Themes</h4>
            <div className="detail-tags">
              {resource.keyThemes.map(t => <span key={t} className="detail-tag">{t}</span>)}
            </div>
          </div>
        )}

        {resource.keyFigures && (
          <div className="detail-section">
            <h4 className="detail-section-title">Key Figures</h4>
            <div className="detail-tags">
              {resource.keyFigures.map(f => <span key={f} className="detail-tag detail-tag--person">{f}</span>)}
            </div>
          </div>
        )}

        {resource.keyFacts && (
          <div className="detail-section">
            <h4 className="detail-section-title">Fascinating Facts</h4>
            <ul className="detail-facts">
              {resource.keyFacts.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}

        {resource.keyFact && (
          <div className="detail-section">
            <h4 className="detail-section-title">Key Fact</h4>
            <div className="detail-highlight">{resource.keyFact}</div>
          </div>
        )}

        {resource.impact && (
          <div className="detail-section">
            <h4 className="detail-section-title">Historical Impact</h4>
            <p className="detail-impact">{resource.impact}</p>
          </div>
        )}

        {resource.whyRead && (
          <div className="detail-section">
            <h4 className="detail-section-title">Why Read This?</h4>
            <p className="detail-impact">{resource.whyRead}</p>
          </div>
        )}

        {resource.whyStudy && (
          <div className="detail-section">
            <h4 className="detail-section-title">Why Study This?</h4>
            <p className="detail-impact">{resource.whyStudy}</p>
          </div>
        )}

        {(resource.similarTo || resource.similarTopics || resource.relatedTopics) && (
          <div className="detail-section">
            <h4 className="detail-section-title">Explore Next</h4>
            <div className="detail-tags">
              {(resource.similarTo || resource.similarTopics || resource.relatedTopics || []).map(t => (
                <span key={t} className="detail-tag detail-tag--link">{t}</span>
              ))}
            </div>
          </div>
        )}

        <div className="detail-tags-footer">
          {(resource.tags || []).map(t => <span key={t} className="detail-raw-tag">#{t}</span>)}
        </div>
      </div>
    </aside>
  );
}


// ── Student / Staff Knowledge Portal ─────────────────────────
function StudentPortal({ user, onLogout, allResources: propResources, sections: propSections }) {
  // Fall back to module-level constants if props not provided
  const resourcePool = propResources || allResources;
  const sectionList = propSections || sections;

  const [activeSectionId, setActiveSectionId] = useState(sectionList[0]?.id || 'literature');
  const [searchText, setSearchText] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const sectionResources = resourcePool.filter(item => item.sectionId === activeSectionId);
      setResources(sectionResources);
      setSelectedResourceId(sectionResources[0]?.id || null);
      setSearchText('');
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [activeSectionId, resourcePool]);

  const filteredResources = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return resources;
    return resources.filter(item => {
      const text = `${item.title} ${item.summary} ${(item.tags || []).join(' ')}`;
      return text.toLowerCase().includes(query);
    });
  }, [resources, searchText]);

  const selectedResource =
    filteredResources.find(item => item.id === selectedResourceId) ||
    filteredResources[0] ||
    null;

  const activeSection = sectionList.find(item => item.id === activeSectionId);

  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-top">
          <div>
            <h1 className="site-title">Knowledge Portal</h1>
            <p className="muted">Browse books, history, and science with rich detail.</p>
          </div>
          <div className="header-auth">
            <span className="header-user"><strong>{user.name}</strong> · {user.role}</span>
            <button type="button" className="btn-ghost" onClick={onLogout}>Log out</button>
          </div>
        </div>

        <nav className="nav" aria-label="Sections">
          {sectionList.map(section => (
            <button
              key={section.id}
              type="button"
              className={`nav-link ${section.id === activeSectionId ? 'active' : ''}`}
              onClick={() => setActiveSectionId(section.id)}
            >
              {section.name}
            </button>
          ))}
        </nav>
      </header>

      <main className="section-layout">
        <section className="panel panel-list">
          <h2 className="panel-heading">{activeSection?.name}</h2>
          <p className="muted panel-desc">{activeSection?.description}</p>

          <div className="search-wrapper">
            <label htmlFor="search" className="label">Search resources</label>
            <input
              id="search"
              className="search-input"
              type="search"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Type book name, topic, or tag…"
            />
          </div>

          <div className="loading-status" role="status" aria-live="polite">
            {isLoading ? (
              <>
                <img src="/loading.gif" alt="Loading" className="loading-spinner" />
                <span className="loading-text">Loading resources…</span>
              </>
            ) : (
              <span className="loading-text">{filteredResources.length} resource(s) found</span>
            )}
          </div>

          {!isLoading && filteredResources.length === 0 && (
            <p className="muted">No matching resources found.</p>
          )}

          {!isLoading && filteredResources.length > 0 && (
            <ul className="list">
              {filteredResources.map(item => (
                <li key={item.id} className="list-item">
                  <button
                    type="button"
                    className={`resource-btn ${selectedResourceId === item.id ? 'resource-btn--active' : ''}`}
                    onClick={() => setSelectedResourceId(item.id)}
                  >
                    <h3 className="list-title">{item.title}</h3>
                    <p className="list-summary">{item.summary}</p>
                    <div className="list-tags">
                      {(item.tags || []).map(t => <span key={t} className="mini-tag">#{t}</span>)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <ResourceDetailPanel resource={selectedResource} allSections={sectionList} />
      </main>

    </div>
  );
}

// ── Root App — handles routing by auth state & role ───────────
function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kp_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Lift shared state here so Librarian edits are visible to Students
  const [sharedSections, setSharedSections] = useState(sections);
  const [sharedResources, setSharedResources] = useState(allResources);

  const handleAuthSuccess = (u) => {
    setUser(u);
    localStorage.setItem('kp_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kp_user');
  };

  if (!user) {
    return <Landing onAuthSuccess={handleAuthSuccess} />;
  }

  if (user.role === 'Librarian') {
    return (
      <Librarian
        user={user}
        onLogout={handleLogout}
        sections={sharedSections}
        resources={sharedResources}
        setSections={setSharedSections}
        setResources={setSharedResources}
      />
    );
  }

  if (user.role === 'Staff') {
    return (
      <Staff
        user={user}
        onLogout={handleLogout}
        resources={sharedResources}
      />
    );
  }

  // Student → Knowledge Portal
  return (
    <StudentPortal
      user={user}
      onLogout={handleLogout}
      allResources={sharedResources}
      sections={sharedSections}
    />
  );
}

export default App;