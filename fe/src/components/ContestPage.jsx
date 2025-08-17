import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Button, Card, TextField } from './ui';
import { colors, shadows } from '../theme';

const ContestPage = () => {
  const { id } = useParams();
  const attemptid = id;
  const [contestDetails, setContestDetails] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [attemptInProgress, setAttemptInProgress] = useState(false);
  const [submissionDone, setSubmissionDone] = useState(false); // Track if submission is done
  const [submitting, setSubmitting] = useState(false); // Track submission in progress

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
      <Container maxWidth="md" style={styles.thankYouContainer}>
        <Typography variant="h2" style={styles.thankYouText}>
          Thank You
        </Typography>
      </Container>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <Typography variant="h4" style={styles.headerText}>
          Contest
        </Typography>
      </div>

      <div style={styles.contentContainer}>
        {/* Left Side - Timer and Submit */}
        <Card variant="outlined" style={styles.sidePanel}>
          <Typography variant="h4" style={styles.timerText}>
            {formatTime(timer)}
          </Typography>
          
          {timer <= 70 && timer > 0 && (
            <Typography variant="body1" color="error" style={styles.hurryText}>
              Hurry up!
            </Typography>
          )}
          
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
          {/* Question Navigation */}
          {attemptInProgress && (
            <div style={styles.questionNav}>
              {contestDetails.questions.map((question, index) => (
                <Button
                  key={index}
                  variant={currentQuestionIndex === index ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => handleQuestionChange(index)}
                  style={styles.questionButton}
                >
                  Question {index + 1}
                </Button>
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
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: colors.background.default,
  },
  header: {
    backgroundColor: colors.primary.main,
    color: colors.background.paper,
    padding: "16px 24px",
    textAlign: "center",
  },
  headerText: {
    fontWeight: 700,
    color: colors.background.paper,
  },
  contentContainer: {
    display: "flex",
    flex: 1,
    padding: "24px",
  },
  sidePanel: {
    width: "250px",
    padding: "24px",
    boxShadow: shadows.medium,
    borderRadius: "12px",
    marginRight: "24px",
    height: "fit-content",
  },
  timerText: {
    textAlign: "center",
    color: colors.primary.main,
    fontWeight: 700,
    marginBottom: "16px",
  },
  hurryText: {
    textAlign: "center",
    fontWeight: 700,
    marginBottom: "16px",
  },
  actionButton: {
    width: "100%",
    marginTop: "16px",
    padding: "12px",
    fontWeight: 600,
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  questionNav: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "24px",
  },
  questionButton: {
    flex: "1 0 20%",
    padding: "12px",
  },
  questionCard: {
    padding: "24px",
    marginBottom: "24px",
    boxShadow: shadows.small,
    borderRadius: "12px",
  },
  questionTitle: {
    color: colors.primary.main,
    fontWeight: 600,
    marginBottom: "16px",
  },
  questionText: {
    color: colors.text.primary,
    fontSize: "16px",
    lineHeight: 1.6,
  },
  answerCard: {
    padding: "24px",
    boxShadow: shadows.small,
    borderRadius: "12px",
  },
  answerTitle: {
    color: colors.primary.main,
    fontWeight: 600,
    marginBottom: "16px",
  },
  answerInput: {
    width: "100%",
  },
  notFoundContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  notFoundText: {
    fontWeight: 700,
    color: colors.primary.main,
    textAlign: "center",
  },
  thankYouContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  thankYouText: {
    fontWeight: 700,
    color: colors.primary.main,
    textAlign: "center",
  },
};

export default ContestPage;
