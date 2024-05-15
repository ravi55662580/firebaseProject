import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://react-3hr-pr-default-rtdb.firebaseio.com/votes.json');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if (data) {
        setVotes(data);
        const totalCount = Object.values(data).reduce((acc, cur) => acc + cur.count, 0);
        setTotalVotes(totalCount);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleAddVote = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleVote = async (studentName, selectedCandidate) => {
    const updatedVotes = { ...votes };
    if (!updatedVotes[selectedCandidate].voters) {
      updatedVotes[selectedCandidate].voters = [];
    }
    updatedVotes[selectedCandidate].count++;
    updatedVotes[selectedCandidate].voters.push(studentName);

    try {
      const response = await fetch(`https://react-3hr-pr-default-rtdb.firebaseio.com/votes/${selectedCandidate}.json`, {
        method: 'PUT',
        body: JSON.stringify(updatedVotes[selectedCandidate])
      });
      if (!response.ok) {
        throw new Error('Failed to update data');
      }
      const data = await response.json();
      setVotes({ ...votes, [selectedCandidate]: data });
      const totalCount = Object.values(updatedVotes).reduce((acc, cur) => acc + cur.count, 0);
      setTotalVotes(totalCount);
    } catch (error) {
      console.error("Error updating data: ", error);
    }
  };

  const handleRemoveVote = async (candidate, voterName) => {
    const updatedVotes = { ...votes };
    if (updatedVotes[candidate]) {
      const voterIndex = updatedVotes[candidate].voters.indexOf(voterName);
      if (voterIndex !== -1) {
        updatedVotes[candidate].voters.splice(voterIndex, 1);
        updatedVotes[candidate].count--;

        try {
          const response = await fetch(`https://react-3hr-pr-default-rtdb.firebaseio.com/votes/${candidate}.json`, {
            method: 'PUT',
            body: JSON.stringify(updatedVotes[candidate])
          });
          if (!response.ok) {
            throw new Error('Failed to remove vote');
          }
          const data = await response.json();
          setVotes({ ...votes, [candidate]: data });
          const totalCount = Object.values(updatedVotes).reduce((acc, cur) => acc + cur.count, 0);
          setTotalVotes(totalCount);
        } catch (error) {
          console.error("Error removing vote: ", error);
        }
      } else {
        console.error("Voter not found in candidate's voters array");
      }
    } else {
      console.error("Candidate not found");
    }
  };

  return (
    <div className="App">
      <h1>Class Monitor Vote</h1>
      <p>Total Votes: {isNaN(totalVotes) ? 0 : totalVotes}</p>
      <button onClick={handleAddVote}>Add New Vote</button>

      <div className="candidates">
        {Object.entries(votes).map(([candidate, vote]) => (
          <div key={candidate} className="candidate">
            <h2>{candidate}</h2>
            <p>Total Votes: {vote.count}</p>
            <ul>
              {vote.voters && vote.voters.map((voter, index) => (
                <li key={index}>
                  {voter}
                  <button onClick={() => handleRemoveVote(candidate, voter)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <VoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        candidates={Object.keys(votes)}
        onVote={handleVote}
      />
    </div>
  );
}

export default App;
