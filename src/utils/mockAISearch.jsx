import { useState, useRef, useEffect } from 'react';

const okrs = [
  {
    objective: 'Improve website performance',
    department: 'Engineering',
    owner: 'Alice',
  },
  {
    objective: 'Launch new marketing campaign',
    department: 'Marketing',
    owner: 'Bob',
  },
  {
    objective: 'Enhance employee onboarding',
    department: 'HR',
    owner: 'Charlie',
  },
  {
    objective: 'Refactor backend services',
    department: 'Engineering',
    owner: 'Alice',
  },
  {
    objective: 'Increase social media engagement',
    department: 'Marketing',
    owner: 'Bob',
  },
];

const departments = ['Engineering', 'Marketing', 'HR'];
const owners = ['Alice', 'Bob', 'Charlie'];

export default function MockKeeOkrSearch() {
  const [keyword, setKeyword] = useState('');
  const [modalDepartment, setModalDepartment] = useState('');
  const [modalOwner, setModalOwner] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [results, setResults] = useState([]);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  function filterOKRs(keyword, department, owner) {
    const kw = keyword.toLowerCase();
    return okrs.filter(
      (okr) =>
        (!kw || okr.objective.toLowerCase().includes(kw)) &&
        (!department || okr.department === department) &&
        (!owner || okr.owner === owner),
    );
  }

  // Show predictive modal on input
  useEffect(() => {
    if (keyword) setShowModal(true);
    else setShowModal(false);
  }, [keyword, modalDepartment, modalOwner]);

  // Hide modal on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        inputRef.current &&
        e.target !== inputRef.current
      ) {
        setShowModal(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearch() {
    setResults(filterOKRs(keyword, modalDepartment, modalOwner));
    setShowModal(false);
  }

  // Modal content
  const filteredModalOKRs = filterOKRs(keyword, modalDepartment, modalOwner);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 40 }}>
      <h1 style={{ color: '#333' }}>Mock KEE OKR Search Interface</h1>
      <div
        className="search-container"
        style={{ marginBottom: 20, position: 'relative' }}
      >
        <input
          ref={inputRef}
          id="keyword"
          placeholder="Search OKRs by keyword"
          type="text"
          autoComplete="off"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        {showModal && (
          <div
            ref={modalRef}
            className="predictive-modal"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 60,
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 10,
              padding: 10,
              display: 'block',
            }}
          >
            {filteredModalOKRs.length === 0 ? (
              <div className="modal-okr-card">No OKRs found.</div>
            ) : (
              filteredModalOKRs.map((okr, i) => (
                <div
                  className="modal-okr-card"
                  key={i}
                  style={{
                    borderBottom:
                      i === filteredModalOKRs.length - 1
                        ? 'none'
                        : '1px solid #eee',
                    padding: '8px 0',
                  }}
                >
                  <strong>Objective:</strong> {okr.objective}
                  <br />
                  <strong>Department:</strong> {okr.department}
                  <br />
                  <strong>Owner:</strong> {okr.owner}
                </div>
              ))
            )}
            <div
              className="modal-filters"
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 10,
                justifyContent: 'flex-end',
              }}
            >
              <select
                value={modalDepartment}
                onChange={(e) => setModalDepartment(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                }}
              >
                <option value="">All Departments</option>
                {departments.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
              <select
                value={modalOwner}
                onChange={(e) => setModalOwner(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                }}
              >
                <option value="">All Owners</option>
                {owners.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      <div className="results" id="results" style={{ marginTop: 20 }}>
        {results.length === 0 && results !== null ? null : results.length ===
          0 ? (
          <p>No OKRs found.</p>
        ) : (
          results.map((okr, i) => (
            <div
              className="okr-card"
              key={i}
              style={{
                border: '1px solid #ccc',
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
              }}
            >
              <strong>Objective:</strong> {okr.objective}
              <br />
              <strong>Department:</strong> {okr.department}
              <br />
              <strong>Owner:</strong> {okr.owner}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
