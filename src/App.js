import React, { useState } from 'react';
import './App.css';
import VoteModal from './Votemodal';

function App() {
  const [totalVotes, setTotalVotes] = useState(0);
  const [votes, setVotes] = useState({
    Rabindra: { count: 0, voters: [] },
    Gaurav: { count: 0, voters: [] },
    Sourav: { count: 0, voters: [] }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddVote = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleVote = (studentName, selectedCandidate) => {
    setTotalVotes(prevTotalVotes => prevTotalVotes + 1);
    setVotes(prevVotes => ({
      ...prevVotes,
      [selectedCandidate]: {
        ...prevVotes[selectedCandidate],
        count: prevVotes[selectedCandidate].count + 1,
        voters: [...prevVotes[selectedCandidate].voters, studentName]
      }
    }));
  };

  const handleRemoveVote = (candidate, voterIndex) => {
    setTotalVotes(prevTotalVotes => prevTotalVotes - 1);
    setVotes(prevVotes => ({
      ...prevVotes,
      [candidate]: {
        ...prevVotes[candidate],
        count: prevVotes[candidate].count - 1,
        voters: prevVotes[candidate].voters.filter((_, index) => index !== voterIndex)
      }
    }));
  };

  const candidates = Object.keys(votes);

  return (
    <div className="App">
      <h1>Class Monitor Vote</h1>
      <p>Total Votes: {totalVotes}</p>
      <button onClick={handleAddVote}>Add New Vote</button>

      <div className="candidates">
        {candidates.map(candidate => (
          <div key={candidate} className="candidate">
            <h2>{candidate}</h2>
            <p>Total Votes: {votes[candidate].count}</p>
            <ul>
              {votes[candidate].voters.map((voter, index) => (
                <li key={index}>
                  {voter}
                  <button onClick={() => handleRemoveVote(candidate, index)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <VoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        candidates={candidates}
        onVote={handleVote}
      />
    </div>
  );
}

export default App;
