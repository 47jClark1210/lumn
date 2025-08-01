import { useState, useRef, useEffect } from 'react';
import { mockData as data } from '../utils/mockData';

// Dynamically generate filter options from mock data
function getFilterOptions(entity) {
  switch (entity) {
    case 'okrs':
      return [
        {
          key: 'department',
          label: 'Department',
          options: [...new Set(data.okrs.map((o) => o.department))],
        },
        {
          key: 'owner',
          label: 'Owner',
          options: [...new Set(data.okrs.map((o) => o.owner.name))],
        },
      ];
    case 'reports':
      return [
        {
          key: 'team',
          label: 'Team',
          options: [...new Set(data.reports.map((r) => r.team.name))],
        },
        {
          key: 'owner',
          label: 'Owner',
          options: [...new Set(data.reports.map((r) => r.owner.name))],
        },
        {
          key: 'status',
          label: 'Status',
          options: [...new Set(data.reports.map((r) => r.status))],
        },
      ];
    case 'modules':
      return [
        {
          key: 'category',
          label: 'Category',
          options: [...new Set(data.modules.map((m) => m.category))],
        },
        {
          key: 'instructor',
          label: 'Instructor',
          options: [...new Set(data.modules.map((m) => m.instructor))],
        },
      ];
    case 'users':
      return [
        {
          key: 'role',
          label: 'Role',
          options: [...new Set(data.users.map((u) => u.role))],
        },
        {
          key: 'team',
          label: 'Team',
          options: [...new Set(data.users.map((u) => u.team))],
        },
      ];
    case 'teams':
      return [
        {
          key: 'lead',
          label: 'Lead',
          options: [...new Set(data.teams.map((t) => t.lead))],
        },
      ];
    default:
      return [];
  }
}

export default function AISearch() {
  const [entity, setEntity] = useState('okrs');
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef();
  const modalRef = useRef();

  // Update filters when entity changes
  useEffect(() => {
    setFilters({});
    setResults([]);
    setShowModal(false);
    setKeyword('');
  }, [entity]);

  // Modal show/hide logic
  useEffect(() => {
    if (keyword) setShowModal(true);
    else setShowModal(false);
  }, [keyword, filters, entity]);

  useEffect(() => {
    function handleClick(e) {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        inputRef.current !== e.target
      ) {
        setShowModal(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Generic filter function
  function filterEntities() {
    const items = data[entity] || [];
    const kw = keyword.toLowerCase();
    return items.filter((item) => {
      // Keyword search: check all string fields and nested name fields
      const matchesKeyword =
        !kw ||
        Object.values(item)
          .flatMap((v) =>
            typeof v === 'string'
              ? [v]
              : v && typeof v === 'object' && v.name
                ? [v.name]
                : [],
          )
          .some((v) => v.toLowerCase().includes(kw));
      // Filter fields
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === 'owner' && item.owner) return item.owner.name === value;
        if (key === 'team' && item.team) return item.team.name === value;
        if (key === 'lead' && item.lead) return item.lead === value;
        return item[key] === value;
      });
      return matchesKeyword && matchesFilters;
    });
  }

  function handleSearch() {
    setResults(filterEntities());
    setShowModal(false);
  }

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  // Modal predictive results
  const predictiveResults = filterEntities();

  // Render result card based on entity type
  function renderResult(item, idx) {
    switch (entity) {
      case 'okrs':
        return (
          <div
            key={idx}
            style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}
            aria-label={`OKR result ${idx + 1}`}
          >
            <strong>Objective:</strong> {item.objective}
            <br />
            <strong>Department:</strong> {item.department}
            <br />
            <strong>Owner:</strong> {item.owner?.name}
          </div>
        );
      case 'reports':
        return (
          <div
            key={idx}
            style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}
            aria-label={`Report result ${idx + 1}`}
          >
            <strong>Title:</strong> {item.title}
            <br />
            <strong>Status:</strong> {item.status}
            <br />
            <strong>Team:</strong> {item.team?.name}
            <br />
            <strong>Owner:</strong> {item.owner?.name}
          </div>
        );
      case 'modules':
        return (
          <div
            key={idx}
            style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}
            aria-label={`Module result ${idx + 1}`}
          >
            <strong>Name:</strong> {item.name}
            <br />
            <strong>Category:</strong> {item.category}
            <br />
            <strong>Instructor:</strong> {item.instructor}
          </div>
        );
      case 'users':
        return (
          <div
            key={idx}
            style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}
            aria-label={`User result ${idx + 1}`}
          >
            <strong>Name:</strong> {item.name}
            <br />
            <strong>Role:</strong> {item.role}
            <br />
            <strong>Team:</strong> {item.team}
          </div>
        );
      case 'teams':
        return (
          <div
            key={idx}
            style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}
            aria-label={`Team result ${idx + 1}`}
          >
            <strong>Name:</strong> {item.name}
            <br />
            <strong>Lead:</strong> {item.lead}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 40 }}>
      <h1 style={{ color: '#333' }}>Company AI Search</h1>
      <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <select value={entity} onChange={(e) => setEntity(e.target.value)}>
          <option value="okrs">OKRs</option>
          <option value="reports">Reports</option>
          <option value="modules">Learning Modules</option>
          <option value="users">Users</option>
          <option value="teams">Teams</option>
        </select>
        <input
          ref={inputRef}
          placeholder={`Search ${entity} by keyword`}
          type="text"
          autoComplete="off"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {/* Dynamic filters */}
      <div style={{ marginBottom: 10, display: 'flex', gap: 10 }}>
        {getFilterOptions(entity).map((filter) => (
          <select
            key={filter.key}
            value={filters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          >
            <option value="">{`All ${filter.label}s`}</option>
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ))}
      </div>
      {/* Predictive modal */}
      {showModal && (
        <div
          ref={modalRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 110,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10,
            padding: 10,
            maxWidth: 600,
          }}
        >
          {predictiveResults.length === 0 ? (
            <div>No results found.</div>
          ) : (
            predictiveResults.slice(0, 5).map(renderResult)
          )}
        </div>
      )}
      {/* Search results */}
      <div style={{ marginTop: 40 }}>
        {results.length === 0 && keyword ? null : results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          results.map(renderResult)
        )}
      </div>
    </div>
  );
}
