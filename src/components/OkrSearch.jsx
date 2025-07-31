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

const styles = {
  container: { marginBottom: 20, position: 'relative' },
  modal: {
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
  },
  modalOkrCard: {
    borderBottom: '1px solid #eee',
    padding: '8px 0',
  },
  modalFilters: {
    display: 'flex',
    gap: 10,
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  modalSelect: {
    padding: '4px 8px',
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  results: { marginTop: 20 },
  okrCard: {
    border: '1px solid #ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
};

export default function OkrSearch() {
  const [keyword, setKeyword] = useState('');
  const [modalDepartment, setModalDepartment] = useState('');
  const [modalOwner, setModalOwner] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef();
  const modalRef = useRef();

  function filterOKRs(keyword, department, owner) {
    keyword = keyword.toLowerCase();
    return okrs.filter((okr) => {
      return (
        (!keyword || okr.objective.toLowerCase().includes(keyword)) &&
        (!department || okr.department === department) &&
        (!owner || okr.owner === owner)
      );
    });
  }

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

  useEffect(() => {
    if (keyword) setShowModal(true);
    else setShowModal(false);
  }, [keyword]);

  function handleSearch() {
    setResults(filterOKRs(keyword, modalDepartment, modalOwner));
    setShowModal(false);
  }

  const predictiveResults = filterOKRs(keyword, modalDepartment, modalOwner);

  return (
    <div>
      <h1 style={{ color: '#333' }}>Mock KEE OKR Search Interface</h1>
      <div style={styles.container}>
        <input
          ref={inputRef}
          id="keyword"
          placeholder="Search OKRs by keyword"
          type="text"
          autoComplete="off"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleSearch}>Search</button>
        {showModal && (
          <div ref={modalRef} style={styles.modal}>
            {predictiveResults.length === 0 ? (
              <div style={styles.modalOkrCard}>No OKRs found.</div>
            ) : (
              predictiveResults.map((okr, idx) => (
                <div key={idx} style={styles.modalOkrCard}>
                  <strong>Objective:</strong> {okr.objective}
                  <br />
                  <strong>Department:</strong> {okr.department}
                  <br />
                  <strong>Owner:</strong> {okr.owner}
                </div>
              ))
            )}
            <div style={styles.modalFilters}>
              <select
                style={styles.modalSelect}
                value={modalDepartment}
                onChange={(e) => setModalDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
              </select>
              <select
                style={styles.modalSelect}
                value={modalOwner}
                onChange={(e) => setModalOwner(e.target.value)}
              >
                <option value="">All Owners</option>
                <option value="Alice">Alice</option>
                <option value="Bob">Bob</option>
                <option value="Charlie">Charlie</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <div style={styles.results}>
        {results.length === 0 && keyword ? null : results.length === 0 ? (
          <p>No OKRs found.</p>
        ) : (
          results.map((okr, idx) => (
            <div key={idx} style={styles.okrCard}>
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
