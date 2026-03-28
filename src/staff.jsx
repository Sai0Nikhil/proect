import { useState, useEffect, useMemo } from 'react';
import './staff.css';

// ── Mock borrow data (in real app, this comes from your backend/API) ──
const MOCK_BORROWS = [
  {
    id: 'b001',
    bookTitle: 'To Kill a Mockingbird',
    bookAuthor: 'Harper Lee',
    section: 'Literature',
    borrowerName: 'Ayesha Raza',
    borrowerEmail: 'ayesha@student.edu',
    borrowerRole: 'Student',
    borrowedOn: '2025-06-01',
    dueDate: '2025-06-15',
    returnedOn: null,
    status: 'overdue',
  },
  {
    id: 'b002',
    bookTitle: '1984',
    bookAuthor: 'George Orwell',
    section: 'Literature',
    borrowerName: 'Ravi Shankar',
    borrowerEmail: 'ravi@student.edu',
    borrowerRole: 'Student',
    borrowedOn: '2025-06-10',
    dueDate: '2025-06-24',
    returnedOn: null,
    status: 'active',
  },
  {
    id: 'b003',
    bookTitle: 'Industrial Revolution',
    bookAuthor: 'Various',
    section: 'History',
    borrowerName: 'Meena Pillai',
    borrowerEmail: 'meena@student.edu',
    borrowerRole: 'Student',
    borrowedOn: '2025-05-28',
    dueDate: '2025-06-11',
    returnedOn: '2025-06-10',
    status: 'returned',
  },
  {
    id: 'b004',
    bookTitle: 'The Solar System',
    bookAuthor: 'Carl Sagan',
    section: 'Science',
    borrowerName: 'Omar Farouq',
    borrowerEmail: 'omar@student.edu',
    borrowerRole: 'Student',
    borrowedOn: '2025-06-08',
    dueDate: '2025-06-22',
    returnedOn: null,
    status: 'active',
  },
  {
    id: 'b005',
    bookTitle: 'Pride and Prejudice',
    bookAuthor: 'Jane Austen',
    section: 'Literature',
    borrowerName: 'Sana Mirza',
    borrowerEmail: 'sana@student.edu',
    borrowerRole: 'Student',
    borrowedOn: '2025-06-03',
    dueDate: '2025-06-17',
    returnedOn: null,
    status: 'overdue',
  },
  {
    id: 'b006',
    bookTitle: 'The Renaissance',
    bookAuthor: 'Various',
    section: 'History',
    borrowerName: 'James Okonkwo',
    borrowerEmail: 'james@student.edu',
    borrowerRole: 'Student',
    borrowedOn: '2025-06-12',
    dueDate: '2025-06-26',
    returnedOn: null,
    status: 'active',
  },
  {
    id: 'b007',
    bookTitle: 'Human Body Systems',
    bookAuthor: 'Various',
    section: 'Science',
    borrowerName: 'Priya Nair',
    borrowerEmail: 'priya@student.edu',
    borrowerRole: 'Student',
    borrowedOn: '2025-05-20',
    dueDate: '2025-06-03',
    returnedOn: '2025-06-02',
    status: 'returned',
  },
  {
    id: 'b008',
    bookTitle: 'The Alchemist',
    bookAuthor: 'Paulo Coelho',
    section: 'Literature',
    borrowerName: 'Tariq Hassan',
    borrowerEmail: 'tariq@student.edu',
    borrowerRole: 'Student',
    borrowedOn: '2025-06-14',
    dueDate: '2025-06-28',
    returnedOn: null,
    status: 'active',
  },
];

const STATUS_CONFIG = {
  active:   { label: 'Active',   color: 'status--active'   },
  overdue:  { label: 'Overdue',  color: 'status--overdue'  },
  returned: { label: 'Returned', color: 'status--returned' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }) {
  return (
    <div className={`stat-card ${accent ? 'stat-card--accent' : ''}`}>
      <span className="stat-icon">{icon}</span>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

// ── Main Staff Component ──────────────────────────────────────
function Staff({ user, onLogout, resources: sharedResources }) {
  const [borrows, setBorrows] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('borrowedOn');
  const [selectedBorrow, setSelectedBorrow] = useState(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Recalculate overdue status from actual dates
    const recalculated = MOCK_BORROWS.map(b => {
      if (b.returnedOn) return { ...b, status: 'returned' };
      const due = new Date(b.dueDate);
      due.setHours(0, 0, 0, 0);
      return { ...b, status: due < today ? 'overdue' : 'active' };
    });

    // Generate extra borrow rows from librarian-added resources
    const extra = (sharedResources || [])
      .filter(r => !MOCK_BORROWS.some(b => b.bookTitle === r.title))
      .slice(0, 3)
      .map((r, i) => {
        const dueDate = '2025-06-27';
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const status = due < today ? 'overdue' : 'active';
        return {
          id: `extra-${r.id || i}`,
          bookTitle: r.title,
          bookAuthor: r.author || 'Unknown',
          section: r.sectionId
            ? r.sectionId.charAt(0).toUpperCase() + r.sectionId.slice(1)
            : 'General',
          borrowerName: ['Ali Khan', 'Fatima Zahra', 'Rohan Das'][i],
          borrowerEmail: ['ali@student.edu', 'fatima@student.edu', 'rohan@student.edu'][i],
          borrowerRole: 'Student',
          borrowedOn: '2025-06-13',
          dueDate,
          returnedOn: null,
          status,
        };
      });

    setBorrows([...recalculated, ...extra]);
  }, [sharedResources]);

  // Stats
  const stats = useMemo(() => ({
    total: borrows.length,
    active: borrows.filter(b => b.status === 'active').length,
    overdue: borrows.filter(b => b.status === 'overdue').length,
    returned: borrows.filter(b => b.status === 'returned').length,
  }), [borrows]);

  // Filter + search + sort
  const displayed = useMemo(() => {
    let list = [...borrows];
    if (filterStatus !== 'all') list = list.filter(b => b.status === filterStatus);
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      list = list.filter(b =>
        b.bookTitle.toLowerCase().includes(q) ||
        b.borrowerName.toLowerCase().includes(q) ||
        b.borrowerEmail.toLowerCase().includes(q) ||
        b.section.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === 'borrowedOn') return new Date(b.borrowedOn) - new Date(a.borrowedOn);
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'borrowerName') return a.borrowerName.localeCompare(b.borrowerName);
      if (sortBy === 'bookTitle') return a.bookTitle.localeCompare(b.bookTitle);
      return 0;
    });
    return list;
  }, [borrows, filterStatus, searchText, sortBy]);

  const handleMarkReturned = (id) => {
    setBorrows(prev =>
      prev.map(b => b.id === id
        ? { ...b, status: 'returned', returnedOn: new Date().toISOString().split('T')[0] }
        : b
      )
    );
    if (selectedBorrow?.id === id) {
      setSelectedBorrow(prev => ({ ...prev, status: 'returned', returnedOn: new Date().toISOString().split('T')[0] }));
    }
  };

  return (
    <div className="staff-shell">

      {/* ── Header ── */}
      <header className="staff-header">
        <div className="staff-header-left">
          <div className="staff-header-logo">📋</div>
          <div>
            <h1 className="staff-title">Staff Dashboard</h1>
            <p className="staff-subtitle">Borrow records &amp; borrower management</p>
          </div>
        </div>
        <div className="staff-header-right">
          <div className="staff-user-pill">
            <span className="staff-user-avatar">{getInitials(user?.name || 'S')}</span>
            <span className="staff-user-name">{user?.name}</span>
            <span className="staff-user-role">{user?.role}</span>
          </div>
          <button className="staff-logout-btn" onClick={onLogout}>Log out</button>
        </div>
      </header>

      <main className="staff-main">

        {/* ── Stats Row ── */}
        <div className="staff-stats-row">
          <StatCard icon="" label="Total Borrows" value={stats.total} />
          <StatCard icon="" label="Currently Active" value={stats.active} />
          <StatCard icon="" label="Overdue" value={stats.overdue} accent />
          <StatCard icon="" label="Returned" value={stats.returned} />
        </div>

        {/* ── Controls ── */}
        <div className="staff-controls">
          <div className="staff-search-wrap">
            <span className="staff-search-icon">🔍</span>
            <input
              className="staff-search"
              type="search"
              placeholder="Search by book, borrower, or section…"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>

          <div className="staff-filter-group">
            {['all', 'active', 'overdue', 'returned'].map(s => (
              <button
                key={s}
                className={`staff-filter-btn ${filterStatus === s ? 'staff-filter-btn--active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="staff-sort-wrap">
            <label className="staff-sort-label">Sort by</label>
            <select
              className="staff-sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="borrowedOn">Borrow Date</option>
              <option value="dueDate">Due Date</option>
              <option value="borrowerName">Borrower Name</option>
              <option value="bookTitle">Book Title</option>
            </select>
          </div>
        </div>

        {/* ── Result count ── */}
        <p className="staff-result-count">
          Showing <strong>{displayed.length}</strong> of <strong>{borrows.length}</strong> records
        </p>

        {/* ── Table + Detail split layout ── */}
        <div className="staff-content-grid">

          {/* Table */}
          <div className="staff-table-wrap">
            {displayed.length === 0 ? (
              <div className="staff-empty">
                <span>🗂️</span>
                <p>No records match your filter.</p>
              </div>
            ) : (
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrower</th>
                    <th>Section</th>
                    <th>Borrowed</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map(b => (
                    <tr
                      key={b.id}
                      className={`staff-row ${selectedBorrow?.id === b.id ? 'staff-row--selected' : ''} ${b.status === 'overdue' ? 'staff-row--overdue' : ''}`}
                      onClick={() => setSelectedBorrow(b)}
                    >
                      <td>
                        <p className="cell-book-title">{b.bookTitle}</p>
                        <p className="cell-book-author">{b.bookAuthor}</p>
                      </td>
                      <td>
                        <div className="cell-borrower">
                          <span className="cell-avatar">{getInitials(b.borrowerName)}</span>
                          <div>
                            <p className="cell-name">{b.borrowerName}</p>
                            <p className="cell-email">{b.borrowerEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="cell-section">{b.section}</span></td>
                      <td className="cell-date">{formatDate(b.borrowedOn)}</td>
                      <td className="cell-date">{formatDate(b.dueDate)}</td>
                      <td>
                        <span className={`status-badge ${STATUS_CONFIG[b.status].color}`}>
                          {STATUS_CONFIG[b.status].label}
                        </span>
                      </td>
                      <td>
                        {b.status !== 'returned' ? (
                          <button
                            className="mark-returned-btn"
                            onClick={e => { e.stopPropagation(); handleMarkReturned(b.id); }}
                          >
                            Mark Returned
                          </button>
                        ) : (
                          <span className="returned-tick">✓ Done</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Detail sidebar */}
          {selectedBorrow && (
            <aside className="staff-detail">
              <button
                className="staff-detail-close"
                onClick={() => setSelectedBorrow(null)}
                aria-label="Close detail"
              >✕</button>

              <div className="staff-detail-book-icon">📖</div>
              <h2 className="staff-detail-book-title">{selectedBorrow.bookTitle}</h2>
              <p className="staff-detail-book-author">by {selectedBorrow.bookAuthor}</p>
              <span className={`status-badge ${STATUS_CONFIG[selectedBorrow.status].color} staff-detail-status`}>
                {STATUS_CONFIG[selectedBorrow.status].label}
              </span>

              <div className="staff-detail-divider" />

              <div className="staff-detail-borrower-card">
                <div className="staff-detail-avatar">{getInitials(selectedBorrow.borrowerName)}</div>
                <div>
                  <p className="staff-detail-borrower-name">{selectedBorrow.borrowerName}</p>
                  <p className="staff-detail-borrower-email">{selectedBorrow.borrowerEmail}</p>
                  <p className="staff-detail-borrower-role">{selectedBorrow.borrowerRole}</p>
                </div>
              </div>

              <div className="staff-detail-dates">
                <div className="staff-detail-date-row">
                  <span className="sdd-label">Section</span>
                  <span className="sdd-value">{selectedBorrow.section}</span>
                </div>
                <div className="staff-detail-date-row">
                  <span className="sdd-label">Borrowed On</span>
                  <span className="sdd-value">{formatDate(selectedBorrow.borrowedOn)}</span>
                </div>
                <div className="staff-detail-date-row">
                  <span className="sdd-label">Due Date</span>
                  <span className={`sdd-value ${selectedBorrow.status === 'overdue' ? 'sdd-value--overdue' : ''}`}>
                    {formatDate(selectedBorrow.dueDate)}
                  </span>
                </div>
                <div className="staff-detail-date-row">
                  <span className="sdd-label">Returned On</span>
                  <span className="sdd-value">{formatDate(selectedBorrow.returnedOn)}</span>
                </div>
              </div>

              {selectedBorrow.status !== 'returned' && (
                <button
                  className="staff-detail-action-btn"
                  onClick={() => handleMarkReturned(selectedBorrow.id)}
                >
                  ✓ Mark as Returned
                </button>
              )}
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}

export default Staff;
