import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Button, Card, TextField } from './ui';
import { colors, shadows } from '../theme';

// Premium Theme Colors
const themeColors = {
  primary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5'
  },
  secondary: {
    main: '#ec4899',
    light: '#f472b6',
    dark: '#db2777'
  },
  background: {
    default: '#0f0f23',
    paper: '#1a1a2e',
    glass: 'rgba(255, 255, 255, 0.1)'
  },
  text: {
    primary: '#ffffff',
    secondary: '#a1a1aa'
  }
};

const ContestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const attemptid = id;
  const [contestDetails, setContestDetails] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [attemptInProgress, setAttemptInProgress] = useState(false);
  const [submissionDone, setSubmissionDone] = useState(false); // Track if submission is done
  const [submitting, setSubmitting] = useState(false); // Track submission in progress
  const [redirectCountdown, setRedirectCountdown] = useState(5); // 5 second countdown

  const handleSubmit = useCallback(async () => {
    if (submitting || submissionDone) {
      console.log('⚠️ Submission already in progress or completed');
      return;
    }
    
    console.log('🚀 Starting submission process...');
    console.log('Contest ID:', attemptid);
    console.log('Answers:', answers);
    console.log('Contest Details:', contestDetails);
    
    setSubmitting(true);
    
    // Collect the answers in the desired format
    const submissionData = {
      contestID: attemptid,
      answers: contestDetails.questions.map((question, index) => ({
        question: question,
        answer: answers[index] || '', // Ensure empty string if no answer
      })),
    };
    
    console.log('📤 Submission data:', submissionData);

    try {
      console.log('📡 Sending request to backend...');
      const response = await axios.post("http://localhost:4444/createSubmission", submissionData);
      console.log('✅ Response received:', response);
      
      if (response.status === 201 || response.status === 200) {
        console.log('🎉 Submission successful!');
        alert("Submission successful!");
        localStorage.removeItem(`timer-${attemptid}`);
        localStorage.removeItem(`attemptInProgress-${attemptid}`);
        setSubmissionDone(true);
        setAttemptInProgress(false);
      } else {
        console.warn('⚠️ Unexpected response status:', response.status);
        alert(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error submitting answers:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(`Submission failed: ${error.response?.data?.msg || error.message}`);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, submissionDone, attemptid, answers, contestDetails, setSubmitting, setSubmissionDone, setAttemptInProgress]);

  useEffect(() => {
    axios
      .get(`http://localhost:4444/getContest?id=${attemptid}`)
      .then((response) => {
        const data = response.data.details;
        setContestDetails(data);
        setAnswers(new Array(data.numQuestions).fill(""));

        const savedTime = localStorage.getItem(`timer-${attemptid}`);
        const savedAttempt = localStorage.getItem(`attemptInProgress-${attemptid}`);

        if (savedAttempt) {
          setAttemptInProgress(true);
          setTimer(parseInt(savedTime, 10));
        } else {
          setAttemptInProgress(false);
          setTimer(data.time * 60); // Initialize timer in seconds
        }
      })
      .catch((error) => console.error("Error fetching contest details:", error));
  }, [attemptid]);

  useEffect(() => {
    if (!attemptInProgress || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        const newTime = prevTimer - 1;
        localStorage.setItem(`timer-${attemptid}`, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, [attemptInProgress, timer, attemptid]);

  // Countdown and redirect logic for thank you page
  useEffect(() => {
    if (submissionDone && redirectCountdown > 0) {
      const countdownInterval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            navigate('/mode/contest-mode');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [submissionDone, redirectCountdown, navigate]);

  useEffect(() => {
    if (timer <= 0 && attemptInProgress) {
      console.log('⏰ Timer expired! Auto-submitting...');
      setAttemptInProgress(false);
      localStorage.removeItem(`timer-${attemptid}`);
      localStorage.removeItem(`attemptInProgress-${attemptid}`);
      alert("Time's up! Submitting your answers automatically.");
      handleSubmit();
    }
  }, [timer, attemptInProgress, handleSubmit]);

  const startAttempt = () => {
    if (!attemptInProgress) {
      setAttemptInProgress(true);
      localStorage.setItem(`attemptInProgress-${attemptid}`, true);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleQuestionChange = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (!contestDetails) {
    return (
      <Container maxWidth="md" style={styles.notFoundContainer}>
        <Typography variant="h3" style={styles.notFoundText}>
          No contest found, <br />Please enter correct Contest ID and try again...
        </Typography>
      </Container>
    );
  }
  
  if (submissionDone) {
    return (
      <div style={styles.thankYouContainer}>
        {/* Animated Background Shapes */}
        <div style={styles.backgroundShapes}>
          <div style={styles.floatingShape1}></div>
          <div style={styles.floatingShape2}></div>
          <div style={styles.floatingShape3}></div>
        </div>
        
        {/* Thank You Content */}
        <div style={styles.thankYouContent}>
          <div style={styles.successIcon}>
            🎉
          </div>
          
          <Typography variant="h2" style={styles.thankYouText}>
            Thank You!
          </Typography>
          
          <Typography variant="body1" style={styles.thankYouSubtext}>
            Your submission has been recorded successfully.
          </Typography>
          
          <div style={styles.redirectInfo}>
            <Typography variant="body2" style={styles.redirectText}>
              Redirecting to Contest Mode in
            </Typography>
            <div style={styles.countdownTimer}>
              {redirectCountdown}
            </div>
            <Typography variant="body2" style={styles.redirectText}>
              seconds...
            </Typography>
          </div>
          
          <Button
            variant="contained"
            onClick={() => navigate('/mode/contest-mode')}
            style={styles.backToContestButton}
          >
            ← Back to Contest Mode Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Animated Background Shapes */}
      <div style={styles.backgroundShapes}>
        <div style={styles.floatingShape1}></div>
        <div style={styles.floatingShape2}></div>
        <div style={styles.floatingShape3}></div>
      </div>

      {/* Premium Header */}
      <div style={styles.header}>
        <Typography variant="h4" style={styles.headerText}>
          🏆 Contest Arena
        </Typography>
      </div>

      <div style={styles.contentContainer}>
        {/* Premium Side Panel - Timer and Controls */}
        <Card variant="outlined" style={styles.sidePanel}>
          {/* Timer Container */}
          <div style={styles.timerContainer}>
            <div style={styles.timerLabel}>
              Time Remaining
            </div>
            <div style={styles.timerText}>
              {formatTime(timer)}
            </div>
            {timer <= 70 && timer > 0 && (
              <div style={styles.hurryText}>
                ⚡ Hurry up!
              </div>
            )}
          </div>
          
          {!attemptInProgress ? (
            <Button
              variant="contained"
              color="primary"
              onClick={startAttempt}
              style={styles.actionButton}
            >
              Start Attempt
            </Button>
          ) : (
            <Button
              variant="contained"
              color={submissionDone ? "success" : "primary"}
              onClick={handleSubmit}
              disabled={submitting || submissionDone}
              style={{
                ...styles.actionButton,
                opacity: submitting || submissionDone ? 0.7 : 1,
                cursor: submitting || submissionDone ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? '⏳ Submitting...' : submissionDone ? '✅ Submitted' : 'Submit'}
            </Button>
          )}
        </Card>

        {/* Main Content - Questions and Answers */}
        <div style={styles.mainContent}>
          {/* Premium Question Navigation */}
          {attemptInProgress && (
            <div style={styles.questionNav}>
              {contestDetails.questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionChange(index)}
                  style={{
                    ...styles.questionButton,
                    ...(currentQuestionIndex === index ? styles.questionButtonActive : {})
                  }}
                >
                  📝 Q{index + 1}
                </button>
              ))}
            </div>
          )}

          {/* Main Question */}
          {attemptInProgress && (
            <Card variant="outlined" style={styles.questionCard}>
              <Typography variant="h5" style={styles.questionTitle}>
                Question {currentQuestionIndex + 1}
              </Typography>
              <Typography variant="body1" style={styles.questionText}>
                {contestDetails.questions[currentQuestionIndex]}
              </Typography>
            </Card>
          )}

          {/* Answer Section */}
          {attemptInProgress && (
            <Card variant="outlined" style={styles.answerCard}>
              <Typography variant="h5" style={styles.answerTitle}>
                Your Answer
              </Typography>
              <TextField
                multiline
                rows={8}
                value={answers[currentQuestionIndex]}
                onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                style={styles.answerInput}
                placeholder="Type your answer here... (please make sure to write the answer of which question you selected)"
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  // Premium Page Container
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${themeColors.background.default}, #16213e)`,
    position: 'relative',
    overflow: 'hidden',
  },

  // Animated Background Shapes
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },

  floatingShape1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '200px',
    height: '200px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}15, ${themeColors.secondary.main}10)`,
    borderRadius: '50%',
    filter: 'blur(40px)',
    animation: 'float 6s ease-in-out infinite',
  },

  floatingShape2: {
    position: 'absolute',
    top: '60%',
    right: '15%',
    width: '150px',
    height: '150px',
    background: `linear-gradient(135deg, ${themeColors.secondary.main}15, ${themeColors.primary.main}10)`,
    borderRadius: '50%',
    filter: 'blur(30px)',
    animation: 'float 8s ease-in-out infinite reverse',
  },

  floatingShape3: {
    position: 'absolute',
    bottom: '20%',
    left: '20%',
    width: '100px',
    height: '100px',
    background: `linear-gradient(135deg, ${themeColors.primary.light}20, ${themeColors.secondary.light}15)`,
    borderRadius: '50%',
    filter: 'blur(25px)',
    animation: 'float 10s ease-in-out infinite',
  },

  // Premium Header
  header: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: `1px solid ${themeColors.primary.main}20`,
    color: themeColors.text.primary,
    padding: '20px 32px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },

  headerText: {
    fontWeight: 800,
    fontSize: '24px',
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.secondary.light})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  // Content Container
  contentContainer: {
    display: 'flex',
    flex: 1,
    padding: '32px',
    gap: '32px',
    position: 'relative',
    zIndex: 5,
  },

  // Premium Side Panel
  sidePanel: {
    width: '320px',
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.primary.main}25`,
    borderRadius: '24px',
    padding: '32px',
    height: 'fit-content',
    position: 'sticky',
    top: '32px',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)',
  },

  // Timer Styling
  timerContainer: {
    textAlign: 'center',
    marginBottom: '32px',
    padding: '24px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}10, rgba(255, 255, 255, 0.02))`,
    borderRadius: '16px',
    border: `1px solid ${themeColors.primary.main}20`,
  },

  timerLabel: {
    color: themeColors.primary.light,
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  timerText: {
    color: themeColors.text.primary,
    fontSize: '32px',
    fontWeight: 800,
    fontFamily: 'monospace',
    textShadow: `0 0 20px ${themeColors.primary.main}30`,
  },

  hurryText: {
    color: themeColors.secondary.light,
    fontSize: '16px',
    fontWeight: 600,
    marginTop: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Premium Action Button
  actionButton: {
    width: '100%',
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    color: themeColors.text.primary,
    border: 'none',
    borderRadius: '16px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 8px 25px ${themeColors.primary.main}30`,
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: `0 12px 35px ${themeColors.primary.main}40`,
      background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.primary.main})`,
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },

  // Main Content Area
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  // Question Navigation
  questionNav: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },

  questionButton: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.03))`,
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '12px',
    padding: '12px 16px',
    color: themeColors.text.secondary,
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    '&:hover': {
      border: `1px solid ${themeColors.primary.main}40`,
      background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
      transform: 'translateY(-2px)',
    },
  },

  questionButtonActive: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    border: `1px solid ${themeColors.primary.main}`,
    color: themeColors.text.primary,
    boxShadow: `0 6px 20px ${themeColors.primary.main}30`,
  },

  // Premium Question Card
  questionCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.secondary.main}25`,
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
    position: 'relative',
    overflow: 'hidden',
  },

  questionTitle: {
    color: themeColors.secondary.light,
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  questionText: {
    color: themeColors.text.primary,
    fontSize: '18px',
    lineHeight: 1.7,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Premium Answer Card
  answerCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.primary.main}25`,
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
  },

  answerTitle: {
    color: themeColors.primary.light,
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  answerInput: {
    width: '100%',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '12px',
    padding: '16px 20px',
    color: themeColors.text.primary,
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    resize: 'vertical',
    minHeight: '200px',
    '&:focus': {
      outline: 'none',
      border: `1px solid ${themeColors.primary.main}60`,
      boxShadow: `0 0 0 3px ${themeColors.primary.main}15`,
    },
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },

  // Status Pages
  notFoundContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: `linear-gradient(135deg, ${themeColors.background.default}, #16213e)`,
  },

  notFoundText: {
    fontSize: '24px',
    fontWeight: 700,
    color: themeColors.primary.light,
    textAlign: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Premium Thank You Page
  thankYouContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    background: `linear-gradient(135deg, ${themeColors.background.default}, #16213e)`,
    position: 'relative',
    overflow: 'hidden',
  },

  thankYouContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: `1px solid ${themeColors.primary.main}25`,
    borderRadius: '32px',
    padding: '64px 48px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    zIndex: 10,
    maxWidth: '500px',
    width: '90%',
  },

  successIcon: {
    fontSize: '80px',
    marginBottom: '24px',
    animation: 'bounce 2s infinite',
  },

  thankYouText: {
    fontSize: '48px',
    fontWeight: 800,
    color: themeColors.text.primary,
    textAlign: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.secondary.light})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '16px',
  },

  thankYouSubtext: {
    fontSize: '18px',
    fontWeight: 500,
    color: themeColors.text.secondary,
    textAlign: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    marginBottom: '40px',
    lineHeight: 1.6,
  },

  redirectInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '32px',
    padding: '16px 24px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}10, rgba(255, 255, 255, 0.02))`,
    borderRadius: '16px',
    border: `1px solid ${themeColors.primary.main}20`,
  },

  redirectText: {
    fontSize: '16px',
    fontWeight: 600,
    color: themeColors.text.secondary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  countdownTimer: {
    fontSize: '24px',
    fontWeight: 800,
    color: themeColors.primary.light,
    fontFamily: 'monospace',
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: `0 0 20px ${themeColors.primary.main}30`,
    minWidth: '32px',
    textAlign: 'center',
  },

  backToContestButton: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    color: themeColors.text.primary,
    border: 'none',
    borderRadius: '16px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 8px 25px ${themeColors.primary.main}30`,
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: `0 12px 35px ${themeColors.primary.main}40`,
      background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.primary.main})`,
    },
  },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes float {
    0% {
      transform: translateY(0px) rotate(0deg);
    }
    33% {
      transform: translateY(-20px) rotate(120deg);
    }
    66% {
      transform: translateY(10px) rotate(240deg);
    }
    100% {
      transform: translateY(0px) rotate(360deg);
    }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
    }
  }
`;
document.head.appendChild(styleSheet);

export default ContestPage;
