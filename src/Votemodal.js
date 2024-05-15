import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './Votemodal.css'

const VoteModal = ({ isOpen, onClose, candidates, onVote }) => {
  const [studentName, setStudentName] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');

  const handleVote = () => {
    if (studentName && selectedCandidate) {
      onVote(studentName, selectedCandidate);
      onClose();
      setStudentName('');
      setSelectedCandidate('');
    }
  };

  const handleClose = () => {
    onClose();
    setStudentName('');
    setSelectedCandidate('');
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <h2>Cast Your Vote</h2>
        <form>
          <div className="form-group">
            <label htmlFor="studentName">Your Name:</label>
            <input
              type="text"
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="candidate">Choose Candidate:</label>
            <select
              id="candidate"
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
            >
              <option value="">Select Candidate</option>
              {candidates.map(candidate => (
                <option key={candidate} value={candidate}>{candidate}</option>
              ))}
            </select>
          </div>
          <div className="form-buttons">
            <button type="button" onClick={handleVote}>Vote</button>
            <button type="button" onClick={handleClose}>Close</button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default VoteModal;