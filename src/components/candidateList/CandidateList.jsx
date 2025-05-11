import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import './CandidateList.css';
import { getCandidateFunc,resetCandidates } from '../../redux/getCandidateSlice';
import Loading from '../loading/Loading';
import { userVoting } from '../../redux/voteSlice';

const CandidateList = () => {
  const {id } = useParams()
  const [candidates, setCandidates] = useState([])
  // Sample candidate data

  // State for modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState(null)


  const { loading, candidate, error: getCandidateError } = useSelector(state=>state.getCandidate)
  const { error: votingError} =useSelector(state=>state.voteSlice)
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(resetCandidates())
    dispatch(getCandidateFunc(id))

  },[dispatch])

  useEffect(()=>{
    setCandidates([])
    if(candidate?.length){
      console.log(candidate)
      const mapped = candidate.map(item=>({
        ...item,
        categoryName: item.position.name
      }))
      setCandidates(mapped)
    }
  },[candidate])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    }
  };

  // Handle voting
  const handleVoteClick = (candidate) => {
    setSelectedCandidate([candidate]);
    setShowModal(true);
  };



  const confirmVote = async() => {
    setIsSubmitting(true);
    try {
      const voteData = {candidateId: selectedCandidate[0]._id,categoryId: candidate[0].position._id}

      const results = await dispatch(userVoting(voteData))
      if(userVoting.fulfilled.match(results)){
        setHasVoted(true)
        setShowModal(false)
        setTimeout(() => setHasVoted(false), 3000);

      }else{
        console.log(votingError)
        console.error("Vote failed:", results.payload);
        setError(results.payload)

      }

      
    } catch (error) {
      console.error("Unexpected error:", error);

      
    }finally{
      setIsSubmitting(false);
      setTimeout(() => setError(null), 2000);


    }
    
  };

  return (
    <div className="candidate-voting-app">
      {/* Main Candidate Grid */}
      {
        loading ? <Loading/> :
        <motion.div 
        className="candidate-container"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Cast Your Vote
        </motion.h2>

        <div className="candidate-grid">
          {candidates.length === 0 ? <p>No candidate to display</p> :candidates.map((candidate) => (
            <motion.div
              key={candidate._id}
              className="candidate-card"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="avatar-container">
                <motion.div
                  className="avatar-ring"
                  style={{ background: `linear-gradient(135deg, #3498db 0%, #2c3e50 100%)` }}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  <img 
                    src={candidate.image} 
                    alt={candidate.name}
                    className="circular-avatar"
                  />
                </motion.div>
                <span 
                  className="party-badge"
                  style={{ backgroundColor: "#3498db" }}
                >
                  {candidate.categoryName}
                </span>
              </div>

              <div className="candidate-info">
                <h3>{candidate.name}</h3>
                <p className="position">{candidate.categoryName}</p>
                
                <motion.button
                  className="vote-button"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: `0 5px 15px ${hexToRgba("#3498db", 0.2)}`
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{ backgroundColor: "#3498db" }}
                  onClick={() => handleVoteClick(candidate)}
                >
                  Vote Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      }
     

      {/* Voting Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSubmitting && setShowModal(false)}
          >
            <motion.div
              className="confirmation-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-avatar-container">
                <motion.div
                  className="modal-avatar-ring"
                  style={{ background: `linear-gradient(135deg, #3498db 0%, #2c3e50 100%)` }}
                >
                  <img
                    src={selectedCandidate[0].image}
                    alt={selectedCandidate[0].name}
                    className="modal-avatar"
                  />
                </motion.div>
                <div 
                  className="modal-party-badge"
                  style={{ backgroundColor: "#3498db" }}
                >
                  {selectedCandidate[0].categoryName}
                </div>
              </div>

              <h3>Confirm Your Vote</h3>
              <p>
                You are voting for <strong>{selectedCandidate[0].name}</strong> as {selectedCandidate[0].categoryName}.
              </p>
              <p className="warning-text">This action cannot be undone.</p>

              <div className="modal-actions">
                {!isSubmitting && (
                  <motion.button
                    className="cancel-button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </motion.button>
                )}
                <motion.button
                  className="confirm-button"
                  style={{ backgroundColor: "#3498db" }}
                  onClick={confirmVote}
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.03 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <span className="spinner"></span>
                  ) : (
                    "Confirm Vote"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voting Success Notification */}
      <AnimatePresence>
        {hasVoted && (
          <motion.div
            className="success-notification"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="success-content">
              <span className="success-icon">✓</span>
              <p>Your vote for {selectedCandidate[0].name} has been recorded!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-notification"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="success-content">
              <span className="success-icon">⚠️</span>
              <p>{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function for RGBA conversion
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default CandidateList;