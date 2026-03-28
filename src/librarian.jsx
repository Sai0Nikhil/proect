// librarian.jsx — full CRUD for sections and resources
import { useState } from 'react';
import './librarian.css';

const CORE_SECTION_IDS = ['literature', 'history', 'science', 'governance'];

function Librarian({ user, onLogout, sections, resources, setSections, setResources }) {
  const [sectionForm, setSectionForm] = useState({ name: '', description: '' });
  const [editingSectionId, setEditingSectionId] = useState(null);

  const [resourceForm, setResourceForm] = useState({
    title: '', author: '', summary: '', sectionId: sections[0]?.id || 'literature', tags: '',
  });
  const [editingResourceId, setEditingResourceId] = useState(null);

  const [activeTab, setActiveTab] = useState('sections');

  // ── Section handlers ──
  const startEditSection = (sec) => {
    setEditingSectionId(sec.id);
    setSectionForm({ name: sec.name, description: sec.description });
    setActiveTab('sections');
  };

  const cancelEditSection = () => {
    setEditingSectionId(null);
    setSectionForm({ name: '', description: '' });
  };

  const handleSaveSection = (e) => {
    e.preventDefault();
    const name = sectionForm.name.trim();
    const description = sectionForm.description.trim();
    if (!name) return;

    if (editingSectionId) {
      setSections(sections.map(s =>
        s.id === editingSectionId ? { ...s, name, description } : s
      ));
      cancelEditSection();
    } else {
      const id = name.toLowerCase().replace(/\s+/g, '-');
      if (sections.some(s => s.id === id)) {
        alert('A section with this name already exists.');
        return;
      }
      setSections([...sections, { id, name, description: description || 'New section.' }]);
      setSectionForm({ name: '', description: '' });
    }
  };

  const handleDeleteSection = (id) => {
    if (CORE_SECTION_IDS.includes(id)) {
      alert('Core sections cannot be deleted.');
      return;
    }
    if (!window.confirm('Delete this section and all its resources?')) return;
    setSections(sections.filter(s => s.id !== id));
    setResources(resources.filter(r => r.sectionId !== id));
  };

  // ── Resource handlers ──
  const startEditResource = (res) => {
    setEditingResourceId(res.id);
    setResourceForm({
      title: res.title,
      author: res.author || '',
      summary: res.summary || '',
      sectionId: res.sectionId,
      tags: (res.tags || []).join(', '),
    });
    setActiveTab('resources');
  };

  const cancelEditResource = () => {
    setEditingResourceId(null);
    setResourceForm({ title: '', author: '', summary: '', sectionId: sections[0]?.id || 'literature', tags: '' });
  };

  const handleSaveResource = (e) => {
    e.preventDefault();
    const title = resourceForm.title.trim();
    const summary = resourceForm.summary.trim();
    const author = resourceForm.author.trim();
    const sectionId = resourceForm.sectionId;
    if (!title || !sectionId) return;

    const tags = resourceForm.tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingResourceId) {
      setResources(resources.map(r =>
        r.id === editingResourceId
          ? { ...r, title, summary, body: summary, author, sectionId, tags: tags.length ? tags : (r.tags || []) }
          : r
      ));
      cancelEditResource();
    } else {
      const newRes = {
        id: `res-${Date.now()}`,
        sectionId, title,
        summary: summary || 'No summary provided.',
        body: summary || '',
        tags: tags.length ? tags : ['librarian-add'],
        author: author || 'Unknown author',
      };
      setResources([newRes, ...resources]);
      setResourceForm({ title: '', author: '', summary: '', sectionId: sections[0]?.id || 'literature', tags: '' });
    }
  };

  const handleDeleteResource = (id) => {
    if (!window.confirm('Delete this resource?')) return;
    setResources(resources.filter(r => r.id !== id));
    if (editingResourceId === id) cancelEditResource();
  };

  const isEditingSection = editingSectionId !== null;
  const isEditingResource = editingResourceId !== null;

  return (
    <div className="librarian-dashboard">
      <header className="librarian-header">
        <div>
          <h1>Library Catalog</h1>
          <p>Manage sections and resources for the Knowledge Portal.</p>
        </div>
        <div className="user-info">
          <div className="user-pill">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'L'}</div>
            <div>
              <div className="user-name">{user?.name || 'Librarian'}</div>
              <div className="user-role">{user?.role || 'Librarian'}</div>
            </div>
          </div>
          <button type="button" className="logout-btn" onClick={onLogout}>Log out</button>
        </div>
      </header>

      <div className="lib-tabs">
        <button
          type="button"
          className={`lib-tab ${activeTab === 'sections' ? 'lib-tab--active' : ''}`}
          onClick={() => { setActiveTab('sections'); cancelEditSection(); }}
        >
          📂 Sections <span className="lib-tab-count">{sections.length}</span>
        </button>
        <button
          type="button"
          className={`lib-tab ${activeTab === 'resources' ? 'lib-tab--active' : ''}`}
          onClick={() => { setActiveTab('resources'); cancelEditResource(); }}
        >
          📄 Resources <span className="lib-tab-count">{resources.length}</span>
        </button>
      </div>

      <main className="librarian-main">

        {activeTab === 'sections' && (
          <>
            <section className="add-book-section">
              <h2>{isEditingSection ? '✏️ Edit Section' : '➕ Add New Section'}</h2>
              <p className="section-desc">
                {isEditingSection
                  ? `Editing "${sections.find(s => s.id === editingSectionId)?.name}". Core sections can be renamed but not deleted.`
                  : 'Core sections (Literature, History, etc.) are locked from deletion but you can edit their descriptions.'}
              </p>
              <form className="book-form" onSubmit={handleSaveSection}>
                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="section-name">Section name</label>
                    <input
                      id="section-name" type="text"
                      value={sectionForm.name}
                      onChange={e => setSectionForm(s => ({ ...s, name: e.target.value }))}
                      placeholder="e.g. Philosophy"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="section-desc">Description</label>
                    <input
                      id="section-desc" type="text"
                      value={sectionForm.description}
                      onChange={e => setSectionForm(s => ({ ...s, description: e.target.value }))}
                      placeholder="Shown to students on the portal"
                    />
                  </div>
                </div>
                <div className="lib-form-actions">
                  <button type="submit" className="add-book-btn">
                    {isEditingSection ? '💾 Save Changes' : '➕ Add Section'}
                  </button>
                  {isEditingSection && (
                    <button type="button" className="lib-cancel-btn" onClick={cancelEditSection}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="books-list">
              <h2>All Sections</h2>
              <p className="section-desc">
                {sections.length} section(s) total. Click ✏️ Edit to rename or change description.
              </p>
              <div className="books-grid">
                {sections.map(sec => (
                  <article
                    key={sec.id}
                    className={`book-card ${editingSectionId === sec.id ? 'book-card--editing' : ''}`}
                  >
                    <div className="book-card-top">
                      <h3>{sec.name}</h3>
                      <span className="section-badge">
                        {CORE_SECTION_IDS.includes(sec.id) ? '🔒 Core' : '✨ Custom'}
                      </span>
                    </div>
                    <p>{sec.description}</p>
                    <p className="book-card-meta">
                      {resources.filter(r => r.sectionId === sec.id).length} resource(s)
                    </p>
                    <div className="book-card-actions">
                      <button type="button" className="lib-edit-btn" onClick={() => startEditSection(sec)}>
                        ✏️ Edit
                      </button>
                      {!CORE_SECTION_IDS.includes(sec.id) && (
                        <button type="button" className="logout-btn" onClick={() => handleDeleteSection(sec.id)}>
                          🗑 Delete
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'resources' && (
          <>
            <section className="add-book-section">
              <h2>{isEditingResource ? '✏️ Edit Resource' : '➕ Add New Resource'}</h2>
              <p className="section-desc">
                {isEditingResource
                  ? 'Update fields below. Students will see changes immediately.'
                  : 'New resources appear instantly in the student portal.'}
              </p>
              <form className="book-form" onSubmit={handleSaveResource}>
                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="res-title">Title</label>
                    <input
                      id="res-title" type="text"
                      value={resourceForm.title}
                      onChange={e => setResourceForm(r => ({ ...r, title: e.target.value }))}
                      required placeholder="e.g. The Great Gatsby"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="res-author">Author</label>
                    <input
                      id="res-author" type="text"
                      value={resourceForm.author}
                      onChange={e => setResourceForm(r => ({ ...r, author: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="res-section">Section</label>
                    <select
                      id="res-section"
                      value={resourceForm.sectionId}
                      onChange={e => setResourceForm(r => ({ ...r, sectionId: e.target.value }))}
                    >
                      {sections.map(sec => (
                        <option key={sec.id} value={sec.id}>{sec.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="res-tags">Tags (comma-separated)</label>
                    <input
                      id="res-tags" type="text"
                      value={resourceForm.tags}
                      onChange={e => setResourceForm(r => ({ ...r, tags: e.target.value }))}
                      placeholder="theme, topic, grade"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="res-summary">Summary</label>
                  <textarea
                    id="res-summary" rows="3"
                    value={resourceForm.summary}
                    onChange={e => setResourceForm(r => ({ ...r, summary: e.target.value }))}
                    placeholder="Short explanation students will see"
                  />
                </div>
                <div className="lib-form-actions">
                  <button type="submit" className="add-book-btn">
                    {isEditingResource ? '💾 Save Changes' : '➕ Add Resource'}
                  </button>
                  {isEditingResource && (
                    <button type="button" className="lib-cancel-btn" onClick={cancelEditResource}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="books-list">
              <h2>All Resources</h2>
              <p className="section-desc">
                {resources.length} resource(s) across all sections.
              </p>
              <div className="books-grid">
                {resources.length === 0 ? (
                  <p className="books-empty">No resources yet.</p>
                ) : (
                  resources.map(res => {
                    const section = sections.find(s => s.id === res.sectionId);
                    return (
                      <article
                        key={res.id}
                        className={`book-card ${editingResourceId === res.id ? 'book-card--editing' : ''}`}
                      >
                        <div className="book-card-top">
                          <h3>{res.title}</h3>
                          <span className="section-badge">{section?.name || res.sectionId}</span>
                        </div>
                        <p>{res.summary}</p>
                        <p className="book-card-meta">{res.author || 'Unknown author'}</p>
                        <div className="lib-tags-row">
                          {(res.tags || []).slice(0, 4).map(t => (
                            <span key={t} className="lib-mini-tag">#{t}</span>
                          ))}
                        </div>
                        <div className="book-card-actions">
                          <button type="button" className="lib-edit-btn" onClick={() => startEditResource(res)}>
                            ✏️ Edit
                          </button>
                          <button type="button" className="logout-btn" onClick={() => handleDeleteResource(res.id)}>
                            🗑 Delete
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Librarian;