import React, { useCallback, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import CreatedContests from "./CreatedContests";
import { Button, Card, Container, Typography, TextField, Grid } from './ui';
import CommonNavbar from './CommonNavbar';
import { colors, shadows } from '../theme';
import logoImage from '../assets/logo (2).jpeg';
import { buildApiUrl } from '../config/api.js';

const ContestMode = () => {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const [action, setAction] = useState("");
  const [id, setId] = useState(0);
  const [attemptid, setAttemptid] = useState("");
  const [singleSubmissionDetails, setSingleSubmissionDetails] = useState("");
  const [numQuestions, setNumQuestions] = useState(0);
  const [time, setTime] = useState("");
  const [questions, setQuestions] = useState([]);
  const [name, setName] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [focusedSubmissionId, setFocusedSubmissionId] = useState(null);
  const [persistedContestId, setPersistedContestId] = useState("");
  const [persistedSubmissions, setPersistedSubmissions] = useState([]);
  const [persistedSearchPerformed, setPersistedSearchPerformed] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const handleNumQuestionsChange = (e) => {
    let value = parseInt(e.target.value, 10) || 0;

    if (value < 1) {
      value = "";
      alert("Number of questions cannot be less than 1.");
    } else if (value > 10) {
      value = "";
      alert("You can add a maximum of 10 questions.");
    }

    setNumQuestions(value);
    setQuestions(new Array(value).fill(""));
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !time || !numQuestions || !questions) {
      alert("Any field cannot be blank");
    } else if (!(numQuestions >= 1 && numQuestions <= 10)) {
      alert("Number of questions can only be be 1-10");
    } else {
      console.log("axiioossssss");
      await axios
        .post(buildApiUrl('/createContest'), {
          name,
          time,
          numQuestions,
          questions,
          createdBy: user.sub,
        })
        .then((res) => {
          setAction("created");
          setId(res.data.id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // Submit feedback (only contest creators can submit feedback)
  const submitFeedback = async (subID, logic, efficiency, codingStyle, clarity, custom) => {
    if (!user?.email) {
      alert('User authentication required. Please log in again.');
      return;
    }

    const feedback = {
      logic,
      efficiency,
      codingStyle,
      clarity,
      custom,
    };
    
    try {
      const response = await fetch(buildApiUrl('/feedback'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subID, // The ID of the submission you are updating
          feedback: feedback,
          name: user.name, // The reviewer's name who is submitting the feedback
          userEmail: user.email, // User email for creator verification
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert("Feedback Submitted Successfully!");
        // Refresh submissions to show updated feedback
        fetchSubmissions();
      } else {
        if (response.status === 403) {
          alert('Access Denied: Only contest creators can submit feedback.');
        } else {
          alert(result.msg || 'Failed to submit feedback. Please try again.');
        }
      }
    } catch (error) {
      console.log('Error submitting feedback:', error);
      alert('Error submitting feedback. Please check your connection and try again.');
    }
  };

  // Copy contest ID to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      alert('Contest ID copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = id;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Contest ID copied to clipboard!');
    }
  };

  const contestCreated = () => {
    return (
      <Container maxWidth="sm" style={styles.container}>
        <Card variant="elevated" style={styles.successCard}>
          {/* Success Icon */}
          <div style={styles.successIcon}>
            🎉
          </div>
          
          <Typography variant="h3" style={styles.successTitle}>
            Contest Created Successfully!
          </Typography>
          
          <Typography variant="body1" style={styles.successSubtitle}>
            Your coding challenge is ready to share with participants
          </Typography>

          {/* Contest ID Display */}
          <div style={styles.idDisplayContainer}>
            <Typography variant="body1" style={styles.idLabel}>
              Contest ID
            </Typography>
            <div style={styles.idBox}>
              <Typography variant="h5" style={styles.idText}>
                {id}
              </Typography>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleCopy}
              style={styles.copyButton}
            >
              📋 Copy Contest ID
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={() => setAction("created-contests")}
              style={styles.viewContestsButton}
            >
              📊 View My Contests
            </Button>
          </div>

          {/* Instructions */}
          <div style={styles.instructionsContainer}>
            <Typography variant="body2" style={styles.instructionsTitle}>
              Next Steps:
            </Typography>
            <ul style={styles.instructionsList}>
              <li style={styles.instructionItem}>Share the Contest ID with participants</li>
              <li style={styles.instructionItem}>Participants can join using "Attempt Contest"</li>
              <li style={styles.instructionItem}>Monitor submissions in "View My Contests"</li>
            </ul>
          </div>
        </Card>
      </Container>
    );
  };

  const ContestSubmissions = () => {
    const [contestId, setContestId] = React.useState(persistedContestId);
    const [submissions, setSubmissions] = React.useState(persistedSubmissions);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [searchPerformed, setSearchPerformed] = React.useState(persistedSearchPerformed);

    const [logic, setLogic] = React.useState("0");
    const [efficiency, setEfficiecny] = React.useState("0");
    const [codingStyle, setCodingStyle] = React.useState("0");
    const [clarity, setClarity] = React.useState("0");
    const [custom, setCustom] = useState("");

    const handleContestIdChange = (e) => {
      setContestId(e.target.value);
      if (error) setError(""); // Clear error when user starts typing
    };

    const fetchSubmissions = async () => {
      if (!contestId.trim()) {
        setError("Please enter a contest ID.");
        return;
      }

      if (!user?.email) {
        setError("User authentication required. Please log in again.");
        return;
      }

      setLoading(true);
      setError("");
      setSearchPerformed(true);

      try {
        const response = await fetch(
          buildApiUrl(`/getSubmission?id=${contestId}&userEmail=${encodeURIComponent(user.email)}`)
        );
        const data = await response.json();
        
        if (response.ok) {
          // Check if user is not the creator
          if (data.isCreator === false) {
            setError("Not reviewed yet. Only contest creators can view submissions before review.");
            setSubmissions([]);
            setPersistedSubmissions([]);
            return;
          }
          
          // If creator, show submissions
          setSubmissions(data.data || []);
          setPersistedSubmissions(data.data || []);
          setPersistedContestId(contestId);
          setPersistedSearchPerformed(true);
          
          if (!data.data || data.data.length === 0) {
            setError("No submissions found for this contest ID.");
          }
        } else {
          setError(data.msg || data.message || "Contest not found or no submissions available.");
          setSubmissions([]);
          setPersistedSubmissions([]);
        }
      } catch (err) {
        setError("Failed to fetch submissions. Please check the contest ID and try again.");
        setSubmissions([]);
        setPersistedSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        fetchSubmissions();
      }
    };

    return (
      <Container maxWidth="lg" style={styles.container}>
        <Card variant="elevated" style={styles.submissionsCard}>
          {/* Premium Header Section */}
          <div style={styles.submissionsHeader}>
            <div style={styles.headerIcon}>📊</div>
            <div style={styles.headerContent}>
              <Typography variant="h3" style={styles.submissionsTitle}>
                Contest Submissions
              </Typography>
              <Typography variant="body1" style={styles.submissionsSubtitle}>
                Enter a contest ID to view and manage participant submissions
              </Typography>
            </div>
          </div>

          {/* Premium Search Section */}
          <div style={styles.searchSection}>
            <div style={styles.searchInputContainer}>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}>🔍</div>
                <TextField
                  type="text"
                  value={contestId}
                  onChange={handleContestIdChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Contest ID (e.g., 507f1f77bcf86cd799439011)"
                  style={styles.premiumSearchInput}
                  disabled={loading}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={fetchSubmissions}
                disabled={loading || !contestId.trim()}
                style={{
                  ...styles.premiumSearchButton,
                  opacity: loading || !contestId.trim() ? 0.6 : 1,
                  cursor: loading || !contestId.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <>
                    <div style={styles.loadingSpinner}></div>
                    Searching...
                  </>
                ) : (
                  <>
                    📋 View Submissions
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              ...styles.errorSection,
              ...(error.includes('Not reviewed yet') ? styles.accessRestrictedSection : {})
            }}>
              <div style={styles.errorIcon}>
                {error.includes('Not reviewed yet') ? '🔒' : '⚠️'}
              </div>
              <div style={styles.errorContent}>
                <Typography variant="h6" style={styles.errorTitle}>
                  {error.includes('Not reviewed yet') ? 'Access Restricted' : 'Unable to Load Submissions'}
                </Typography>
                <Typography variant="body2" style={styles.errorMessage}>
                  {error}
                </Typography>
                {error.includes('Not reviewed yet') && (
                  <Typography variant="body2" style={styles.accessHint}>
                    💡 Contest submissions are only visible to the contest creator until they have been reviewed.
                  </Typography>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && searchPerformed && submissions.length === 0 && !error && (
            <div style={styles.emptyStateSection}>
              <div style={styles.emptyStateTitleContainer}>
                <span style={styles.emptyStateInlineIcon}>📭</span>
                <Typography variant="h5" style={styles.emptyStateTitle}>
                  No Submissions Found
                </Typography>
              </div>
              <Typography variant="body1" style={styles.emptyStateMessage}>
                This contest doesn't have any submissions yet. Participants can submit their solutions to see them here.
              </Typography>
            </div>
          )}

          {/* Initial State */}
          {!searchPerformed && !loading && (
            <div style={styles.initialStateSection}>
              <div style={styles.initialStateTitleContainer}>
                <span style={styles.initialStateInlineIcon}>🎯</span>
                <Typography variant="h5" style={styles.initialStateTitle}>
                  Ready to View Submissions
                </Typography>
              </div>
              <Typography variant="body1" style={styles.initialStateMessage}>
                Enter a contest ID above to view all participant submissions, provide feedback, and track contest performance.
              </Typography>
              <div style={styles.featuresGrid}>
                <div style={styles.featureItem}>
                  <div style={styles.featureIcon}>👥</div>
                  <Typography variant="body2" style={styles.featureText}>
                    View all participant submissions
                  </Typography>
                </div>
                <div style={styles.featureItem}>
                  <div style={styles.featureIcon}>⭐</div>
                  <Typography variant="body2" style={styles.featureText}>
                    Provide detailed feedback
                  </Typography>
                </div>
                <div style={styles.featureItem}>
                  <div style={styles.featureIcon}>📈</div>
                  <Typography variant="body2" style={styles.featureText}>
                    Track contest analytics
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {submissions.length > 0 ? (
            <div style={styles.submissionsList}>
              {submissions.map((submission) => (
                <Card 
                  key={submission._id} 
                  id={`submission-${submission._id}`}
                  variant="outlined" 
                  style={{
                    ...styles.submissionCard,
                    ...(focusedSubmissionId === submission._id ? styles.focusedSubmissionCard : {})
                  }}
                >
                  {/* Submission Header */}
                  <div style={styles.submissionHeader}>
                    <div style={styles.submissionInfo}>
                      <div style={styles.submissionId}>
                        {submission._id}
                      </div>
                      <div style={styles.submissionDate}>
                        {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSingleSubmissionDetails(submission);
                        setFocusedSubmissionId(submission._id);
                        setAction("view-single-submission");
                      }}
                      style={styles.viewButton}
                    >
                      📋 View Details
                    </Button>
                  </div>

                  {/* Submission Content */}
                  <div style={styles.submissionContent}>

                  {'reviewedBy' in submission ? (
                    <div style={styles.feedbackContainer}>
                      <Typography variant="body1" style={styles.reviewedBy}>
                        Reviewed By: {submissions[0].reviewedBy}
                      </Typography>
                      <div style={styles.ratingContainer}>
                        <Typography variant="body2" style={styles.ratingItem}>
                          Logic: {submission.feedback.logic}
                        </Typography>
                        <Typography variant="body2" style={styles.ratingItem}>
                          Efficiency: {submission.feedback.efficiency}
                        </Typography>
                        <Typography variant="body2" style={styles.ratingItem}>
                          Coding Style: {submission.feedback.codingStyle}
                        </Typography>
                        <Typography variant="body2" style={styles.ratingItem}>
                          Clarity: {submission.feedback.clarity}
                        </Typography>
                      </div>
                      <Typography variant="body2" style={styles.additionalFeedback}>
                        Additional Feedback: {submission.feedback.custom}
                      </Typography>
                    </div>
                  ) : (
                    <div style={styles.feedbackFormContainer}>
                      <Typography variant="h6" style={styles.feedbackTitle}>
                        Provide Feedback
                      </Typography>
                      <form>
                        <Grid container spacing={2} style={styles.feedbackGrid}>
                          <Grid item xs={6}>
                            <div style={styles.selectContainer}>
                              <label htmlFor="logic" style={styles.selectLabel}>Logic</label>
                              <select
                                id="logic"
                                value={logic}
                                onChange={(e) => setLogic(e.target.value)}
                                style={styles.select}
                              >
                                {[0, 1, 2, 3, 4, 5].map((value) => (
                                  <option key={value} value={value.toString()}>{value}</option>
                                ))}
                              </select>
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div style={styles.selectContainer}>
                              <label htmlFor="efficiency" style={styles.selectLabel}>Efficiency</label>
                              <select
                                id="efficiency"
                                value={efficiency}
                                onChange={(e) => setEfficiecny(e.target.value)}
                                style={styles.select}
                              >
                                {[0, 1, 2, 3, 4, 5].map((value) => (
                                  <option key={value} value={value.toString()}>{value}</option>
                                ))}
                              </select>
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div style={styles.selectContainer}>
                              <label htmlFor="codingStyle" style={styles.selectLabel}>Coding Style</label>
                              <select
                                id="codingStyle"
                                value={codingStyle}
                                onChange={(e) => setCodingStyle(e.target.value)}
                                style={styles.select}
                              >
                                {[0, 1, 2, 3, 4, 5].map((value) => (
                                  <option key={value} value={value.toString()}>{value}</option>
                                ))}
                              </select>
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div style={styles.selectContainer}>
                              <label htmlFor="clarity" style={styles.selectLabel}>Clarity</label>
                              <select
                                id="clarity"
                                value={clarity}
                                onChange={(e) => setClarity(e.target.value)}
                                style={styles.select}
                              >
                                {[0, 1, 2, 3, 4, 5].map((value) => (
                                  <option key={value} value={value.toString()}>{value}</option>
                                ))}
                              </select>
                            </div>
                          </Grid>
                        </Grid>
                        
                        <TextField
                          type="text"
                          placeholder="Enter custom feedback here..."
                          onBlur={(e) => setCustom(e.target.value)}
                          style={styles.customFeedback}
                        />
                        
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={async (e) => {
                            let subID = submission._id;
                            e.preventDefault();
                            await submitFeedback(subID, logic, efficiency, codingStyle, clarity, custom);
                            fetchSubmissions();
                          }}
                          style={styles.submitFeedbackButton}
                        >
                          Submit Feedback
                        </Button>
                      </form>
                    </div>
                  )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Typography variant="body1" style={styles.noSubmissions}>
              No submissions available.
            </Typography>
          )}
        </Card>
      </Container>
    );
  };

  const viewSubmissionDetails = (submission) => {
    return (
      <Container maxWidth="lg" style={{...styles.container, padding: '0 20px'}}>
        <Card variant="elevated" style={{...styles.card, padding: '0', borderRadius: '24px'}}>
          {/* Premium Header */}
          <div style={styles.detailsHeader}>
            <div>
              <h1 style={styles.detailsTitle}>
                📋 Submission Details
              </h1>
              <p style={styles.detailsSubtitle}>
                Complete submission information and participant responses
              </p>
            </div>
          </div>
          
          {/* Content Section */}
          <div style={styles.detailsContent}>
            {/* Details Grid */}
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>
                  Submission ID
                </div>
                <div style={styles.detailValue}>
                  {submission._id}
                </div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>
                  Contest ID
                </div>
                <div style={styles.detailValue}>
                  {submission.contestID}
                </div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>
                  Submitted At
                </div>
                <div style={styles.detailValue}>
                  {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>
                  Total Questions
                </div>
                <div style={styles.detailValue}>
                  {submission.answers.length} Questions
                </div>
              </div>
            </div>
            
            {/* Answers Section */}
            <div style={styles.answersSection}>
              <h2 style={styles.answersSectionTitle}>
                📝 Participant Responses
              </h2>
              
              <div style={styles.answersGrid}>
                {submission.answers.map((answer, index) => (
                  <Card key={answer._id || index} variant="outlined" style={styles.answerCard}>
                    {/* Question Header */}
                    <div style={styles.answerCardHeader}>
                      <div style={styles.questionText}>
                        Question {index + 1}
                      </div>
                    </div>
                    
                    {/* Answer Content */}
                    <div style={styles.answerCardContent}>
                      <div style={{marginBottom: '16px'}}>
                        <div style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 600, marginBottom: '8px'}}>
                          QUESTION:
                        </div>
                        <div style={{color: '#ffffff', fontSize: '16px', lineHeight: 1.6, marginBottom: '20px'}}>
                          {answer.question}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: 600, marginBottom: '8px'}}>
                          PARTICIPANT ANSWER:
                        </div>
                        <div style={styles.answerText}>
                          {answer.answer || 'No answer provided'}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          {/* Back Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setAction("view-submissions");
              // Keep the focused submission ID for highlighting
              // It will be cleared after scroll animation
              setTimeout(() => {
                if (focusedSubmissionId) {
                  const element = document.getElementById(`submission-${focusedSubmissionId}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Clear focus after scroll animation completes
                    setTimeout(() => setFocusedSubmissionId(null), 2000);
                  }
                }
              }, 100);
            }}
            style={styles.detailsBackButton}
          >
            ← Back to Submissions
          </Button>
        </Card>
      </Container>
    );
  };

  function nameHandle(e) {
    setName(e.target.value);
  }

  const createContest = useCallback(() => (
    <Container maxWidth="md" style={styles.container}>
      <Card variant="elevated" style={styles.card}>
        <Typography variant="h4" style={styles.cardTitle}>
          Create Your Contest
        </Typography>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formField}>
            <Typography variant="body1" style={styles.fieldLabel}>
              Name of the Contest:
            </Typography>
            <TextField
              type="text"
              value={name}
              onChange={nameHandle}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formField}>
            <Typography variant="body1" style={styles.fieldLabel}>
              Number of Questions:
            </Typography>
            <TextField
              type="number"
              value={numQuestions}
              onChange={handleNumQuestionsChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formField}>
            <Typography variant="body1" style={styles.fieldLabel}>
              Time (in minutes):
            </Typography>
            <TextField
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={styles.input}
            />
          </div>
          
          {questions.map((_, index) => (
            <div key={index} style={styles.formField}>
              <Typography variant="body1" style={styles.fieldLabel}>
                Question {index + 1}:
              </Typography>
              <TextField
                type="text"
                value={questions[index]}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder={`Enter question ${index + 1}`}
                style={styles.input}
              />
            </div>
          ))}
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={styles.submitButton}
          >
            Submit
          </Button>
        </form>
      </Card>
    </Container>
  ), [name, numQuestions, time, questions]);

  const attemptContest = () => (
    <Container maxWidth="sm" style={styles.container}>
      <Card variant="elevated" style={styles.card}>
        <Typography variant="h4" style={styles.cardTitle}>
          Attempt a Contest
        </Typography>
        
        <div style={styles.formField}>
          <Typography variant="body1" style={styles.fieldLabel}>
            Contest ID:
          </Typography>
          <TextField
            type="text"
            value={attemptid}
            onChange={(e) => setAttemptid(e.target.value)}
            placeholder="Enter Contest ID here"
            style={styles.input}
          />
        </div>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/contest-mode/contest-page/${attemptid}`)}
          style={styles.submitButton}
        >
          Submit
        </Button>
      </Card>
    </Container>
  );

  if (action) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.backgroundShapes}>
          <div style={styles.floatingShape1}></div>
          <div style={styles.floatingShape2}></div>
          <div style={styles.floatingShape3}></div>
        </div>
        
        <div style={{...styles.contentWrapper, padding: '15px 20px 0'}}>
          <div style={styles.header}>
            <Button
              onClick={() => setAction('')}
              style={styles.backButton}
            >
              ← Back to Contest Mode
            </Button>
          </div>
          
          {action === "create-contest" && createContest()}
          {action === "attempt-contest" && attemptContest()}
          {action === "created" && contestCreated()}
          {action === "view-submissions" && <ContestSubmissions />}
          {action === "view-single-submission" && viewSubmissionDetails(singleSubmissionDetails)}
          {action === "created-contests" && <CreatedContests user={user} editContestId={id} />}
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
        <div style={styles.floatingShape4}></div>
      </div>

      {/* Main Content */}
      <div style={styles.contentWrapper}>
        {/* Common Navbar */}
        <CommonNavbar />

        {/* Hero Section */}
        <div style={styles.heroSection}>
          <Typography variant="h2" style={styles.heroTitle}>
            Your Coding Arena Awaits
          </Typography>
          <Typography variant="h4" style={styles.heroSubtitle}>
            Create challenges, compete with peers, and showcase your skills
          </Typography>
        </div>

        {/* Action Cards Grid */}
        <div style={styles.actionsSection}>
          <Grid container spacing={4} style={styles.actionGrid}>
            <Grid item xs={12} sm={6} lg={3}>
              <div 
                style={{
                  ...styles.actionCard,
                  ...(hoveredCard === 'create-contest' ? styles.actionCardHover : {})
                }}
                onClick={() => setAction('create-contest')}
                onMouseEnter={() => setHoveredCard('create-contest')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.actionCardIcon}>🏆</div>
                <Typography variant="h5" style={styles.actionCardTitle}>
                  Create Contest
                </Typography>
                <Typography variant="body1" style={styles.actionCardDesc}>
                  Design premium coding challenges with custom time limits, difficulty levels, and comprehensive test cases for competitive programming
                </Typography>
                <div style={styles.actionCardArrow}>→</div>
              </div>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <div 
                style={{
                  ...styles.actionCard,
                  ...(hoveredCard === 'attempt-contest' ? styles.actionCardHover : {})
                }}
                onClick={() => setAction('attempt-contest')}
                onMouseEnter={() => setHoveredCard('attempt-contest')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.actionCardIcon}>⚡</div>
                <Typography variant="h5" style={styles.actionCardTitle}>
                  Join Contest
                </Typography>
                <Typography variant="body1" style={styles.actionCardDesc}>
                  Enter contest codes to participate in live coding battles, compete with global developers, and climb the leaderboards
                </Typography>
                <div style={styles.actionCardArrow}>→</div>
              </div>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <div 
                style={{
                  ...styles.actionCard,
                  ...(hoveredCard === 'view-submissions' ? styles.actionCardHover : {})
                }}
                onClick={() => setAction('view-submissions')}
                onMouseEnter={() => setHoveredCard('view-submissions')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.actionCardIcon}>📊</div>
                <Typography variant="h5" style={styles.actionCardTitle}>
                  View Submissions
                </Typography>
                <Typography variant="body1" style={styles.actionCardDesc}>
                  Review and analyze your contest submissions, track performance metrics, and monitor your coding progress across all challenges
                </Typography>
                <div style={styles.actionCardArrow}>→</div>
              </div>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <div 
                style={{
                  ...styles.actionCard,
                  ...(hoveredCard === 'created-contests' ? styles.actionCardHover : {})
                }}
                onClick={() => setAction('created-contests')}
                onMouseEnter={() => setHoveredCard('created-contests')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.actionCardIcon}>📝</div>
                <Typography variant="h5" style={styles.actionCardTitle}>
                  Your Created Contests
                </Typography>
                <Typography variant="body1" style={styles.actionCardDesc}>
                  Manage and monitor your created contests, view participant statistics, analyze submission patterns, and track contest performance
                </Typography>
                <div style={styles.actionCardArrow}>→</div>
              </div>
            </Grid>
          </Grid>
        </div>

        {/* Quick Stats Section */}
        <div style={styles.statsSection}>
          <div style={styles.statsCard}>
            <Typography variant="h6" style={styles.statsTitle}>
              Your CodeClash Journey
            </Typography>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <Typography variant="h4" style={styles.statNumber}>12</Typography>
                <Typography variant="body2" style={styles.statLabel}>Contests Joined</Typography>
              </div>
              <div style={styles.statItem}>
                <Typography variant="h4" style={styles.statNumber}>5</Typography>
                <Typography variant="body2" style={styles.statLabel}>Contests Created</Typography>
              </div>
              <div style={styles.statItem}>
                <Typography variant="h4" style={styles.statNumber}>87%</Typography>
                <Typography variant="body2" style={styles.statLabel}>Success Rate</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Theme colors matching login page
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
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626'
  }
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${themeColors.background.default} 0%, #16213e 100%)`,
    position: 'relative',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  },
  
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  
  floatingShape1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '300px',
    height: '300px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}15, ${themeColors.secondary.main}25)`,
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 8s ease-in-out infinite',
    zIndex: 0,
  },
  
  floatingShape2: {
    position: 'absolute',
    top: '60%',
    right: '15%',
    width: '200px',
    height: '200px',
    background: `linear-gradient(45deg, ${themeColors.secondary.main}15, ${themeColors.primary.light}15)`,
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'float 8s ease-in-out infinite reverse',
  },
  
  floatingShape3: {
    position: 'absolute',
    bottom: '20%',
    left: '60%',
    width: '150px',
    height: '150px',
    background: `linear-gradient(45deg, ${themeColors.primary.dark}25, ${themeColors.secondary.light}25)`,
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 10s ease-in-out infinite',
  },
  
  floatingShape4: {
    position: 'absolute',
    top: '30%',
    right: '60%',
    width: '120px',
    height: '120px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}20, ${themeColors.secondary.dark}20)`,
    borderRadius: '50%',
    filter: 'blur(50px)',
    animation: 'float 12s ease-in-out infinite',
  },
  
  contentWrapper: {
    position: 'relative',
    zIndex: 1,
    padding: '0 20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  

  
  heroSection: {
    textAlign: 'center',
    marginTop: '90px',
    marginBottom: '1em',
    padding: '10px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  heroTitle: {
    fontSize: '48px',
    fontWeight: 800,
    color: '#ffffff',
    marginBottom: '10px',
    letterSpacing: '-0.02em', marginTop: '0px',
    lineHeight: 1.2,
    animation: 'fadeInUp 1s ease-out',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  },
  
  heroSubtitle: {
    fontSize: '20px',
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: 400,
    lineHeight: 1.6,
    maxWidth: '600px',
    margin: '0 auto',
    animation: 'fadeInUp 1s ease-out 0.2s both',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  
  actionsSection: {
    marginBottom: '40px',
  },
  
  actionGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  // Enhanced Action Cards with Premium Hover Effects
  actionCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.03))`,
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '24px',
    padding: '40px 32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '320px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: `linear-gradient(90deg, transparent, ${themeColors.primary.main}60, transparent)`,
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
      transition: 'left 0.6s ease',
      pointerEvents: 'none',
    },
  },

  actionCardHover: {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: `0 25px 50px ${themeColors.primary.main}20, 0 8px 32px rgba(0, 0, 0, 0.3)`,
    border: `1px solid ${themeColors.primary.main}60`,
    background: `linear-gradient(135deg, ${themeColors.primary.main}10, rgba(255, 255, 255, 0.08))`,
    '&::before': {
      opacity: 1,
    },
    '&::after': {
      left: '100%',
    },
  },

  // Enhanced Action Card Icon with Premium Effects
  actionCardIcon: {
    fontSize: '52px',
    marginBottom: '24px',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    zIndex: 2,
  },

  // Enhanced Action Card Title with Better Contrast
  actionCardTitle: {
    color: '#ffffff',
    fontWeight: 800,
    marginBottom: '20px',
    fontSize: '24px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    position: 'relative',
    zIndex: 2, 
  },

  // Enhanced Action Card Description with Better Readability
  actionCardDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '16px',
    lineHeight: 1.6,
    marginBottom: '28px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 400,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    zIndex: 2,
  },

  // Enhanced Action Card Arrow with Premium Animation
  actionCardArrow: {
    fontSize: '32px',
    color: themeColors.primary.main,
    opacity: 0.9,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
    fontWeight: 'bold',
    position: 'relative',
    zIndex: 2,
  },

  // Enhanced Stats Section with Better Spacing
  statsSection: {
    marginTop: '100px',
    marginBottom: '80px',
    padding: '0 20px',
  },

  statsCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: `1px solid ${themeColors.primary.main}30`,
    borderRadius: '28px',
    padding: '50px 40px',
    textAlign: 'center',
    maxWidth: '900px',
    margin: '0 auto',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: `linear-gradient(90deg, transparent, ${themeColors.primary.main}60, transparent)`,
    },
  },

  statsTitle: {
    color: '#ffffff',
    fontWeight: 800,
    marginBottom: '40px',
    fontSize: '28px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    letterSpacing: '-0.01em',
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '40px',
    textAlign: 'center',
  },

  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  statNumber: {
    color: themeColors.primary.main,
    fontWeight: 900,
    fontSize: '36px',
    marginBottom: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textShadow: `0 2px 8px ${themeColors.primary.main}30`,
    letterSpacing: '-0.02em',
  },

  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    letterSpacing: '0.01em',
  },

  // Enhanced Back Button - Consistent with Submit Button Theme
  backButton: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    border: 'none',
    borderRadius: '16px',
    padding: '14px 28px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    boxShadow: `0 8px 25px ${themeColors.primary.main}30`,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      transition: 'left 0.5s ease',
    },
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: `0 15px 40px ${themeColors.primary.main}40`,
      background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.primary.main})`,
    },
    '&:hover::before': {
      left: '100%',
    },
    '&:active': {
      transform: 'translateY(-1px)',
      boxShadow: `0 8px 25px ${themeColors.primary.main}35`,
    },
  },

  header: {
    marginBottom: '0px',
    padding: '0px',
  },

  container: {
    marginBottom: '50px',
    padding: '0 20px',
  },

  card: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.03))`,
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '24px',
    padding: '48px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: `linear-gradient(90deg, transparent, ${themeColors.primary.main}40, transparent)`,
    },
  },

  cardTitle: {
    textAlign: 'center',
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '40px',
    fontWeight: 800,
    fontSize: '28px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
  },

  form: {
    width: '100%',
  },

  formField: {
    marginBottom: '32px',
  },

  fieldLabel: {
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '12px',
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '0.01em',
  },

  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
  },

  textField: {
    padding: '18px 24px',
    borderRadius: '16px',
    border: `1px solid ${themeColors.primary.main}20`,
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.02))`,
    backdropFilter: 'blur(15px)',
    fontSize: '16px',
    color: '#ffffff',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    '&:focus': {
      outline: 'none',
      border: `1px solid ${themeColors.primary.main}60`,
      boxShadow: `0 0 0 4px ${themeColors.primary.main}15`,
      background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    },
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },

  textArea: {
    padding: '18px 24px',
    borderRadius: '16px',
    border: `1px solid ${themeColors.primary.main}20`,
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.02))`,
    backdropFilter: 'blur(15px)',
    fontSize: '16px',
    color: '#ffffff',
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:focus': {
      outline: 'none',
      border: `1px solid ${themeColors.primary.main}60`,
      boxShadow: `0 0 0 4px ${themeColors.primary.main}15`,
      background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    },
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },

  selectField: {
    padding: '18px 24px',
    borderRadius: '16px',
    border: `1px solid ${themeColors.primary.main}20`,
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.02))`,
    backdropFilter: 'blur(15px)',
    fontSize: '16px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    '&:focus': {
      outline: 'none',
      border: `1px solid ${themeColors.primary.main}60`,
      boxShadow: `0 0 0 4px ${themeColors.primary.main}15`,
    },
  },

  // Premium Submit Button Style
  submitButton: {
    width: '100%',
    padding: '18px 24px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    color: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '32px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '0.01em',
    boxShadow: `0 8px 25px ${themeColors.primary.main}30`,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      transition: 'left 0.5s ease',
    },
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: `0 15px 40px ${themeColors.primary.main}40`,
      background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.primary.main})`,
    },
    '&:hover::before': {
      left: '100%',
    },
    '&:active': {
      transform: 'translateY(-1px)',
    },
  },

  // Enhanced Input Field
  input: {
    width: '100%',
    padding: '18px 24px',
    borderRadius: '16px',
    border: `1px solid ${themeColors.primary.main}20`,
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.02))`,
    backdropFilter: 'blur(15px)',
    fontSize: '16px',
    color: '#ffffff',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    '&:focus': {
      outline: 'none',
      border: `1px solid ${themeColors.primary.main}60`,
      boxShadow: `0 0 0 4px ${themeColors.primary.main}15`,
      background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    },
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },

  // Premium Success Card Styles
  successCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: `1px solid ${themeColors.primary.main}30`,
    borderRadius: '28px',
    padding: '60px 48px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: `linear-gradient(90deg, ${themeColors.primary.main}, ${themeColors.secondary.main})`,
    },
  },

  successIcon: {
    fontSize: '80px',
    marginBottom: '24px',
    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
    animation: 'pulse 2s ease-in-out infinite',
  },

  successTitle: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 900,
    fontSize: '32px',
    marginBottom: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },

  successSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '18px',
    marginBottom: '40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: 1.5,
  },

  idDisplayContainer: {
    marginBottom: '40px',
  },

  idLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  idBox: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}15, ${themeColors.secondary.main}15)`,
    border: `1px solid ${themeColors.primary.main}40`,
    borderRadius: '16px',
    padding: '20px 24px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },

  idText: {
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '24px',
    fontFamily: 'Monaco, "Lucida Console", monospace',
    letterSpacing: '0.1em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },

  buttonGroup: {
    display: 'flex',
    gap: '16px',
    marginBottom: '40px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  copyButton: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    color: '#ffffff',
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
      boxShadow: `0 15px 40px ${themeColors.primary.main}40`,
      background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.primary.main})`,
    },
  },

  viewContestsButton: {
    background: 'transparent',
    color: '#ffffff',
    border: `2px solid ${themeColors.primary.main}60`,
    borderRadius: '16px',
    padding: '14px 30px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    '&:hover': {
      transform: 'translateY(-2px)',
      border: `2px solid ${themeColors.primary.main}`,
      background: `${themeColors.primary.main}15`,
      boxShadow: `0 8px 25px ${themeColors.primary.main}20`,
    },
  },

  instructionsContainer: {
    textAlign: 'left',
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.02))`,
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '16px',
    padding: '24px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },

  instructionsTitle: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  instructionsList: {
    margin: 0,
    paddingLeft: '20px',
    color: 'rgba(255, 255, 255, 0.8)',
  },

  instructionItem: {
    marginBottom: '8px',
    fontSize: '14px',
    lineHeight: 1.5,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Premium Submissions Interface Styles
  submissionsCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: `1px solid ${themeColors.primary.main}30`,
    borderRadius: '28px',
    padding: '0',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '600px',
  },

  submissionsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '40px 48px 32px',
    borderBottom: `1px solid ${themeColors.primary.main}20`,
    background: `linear-gradient(135deg, ${themeColors.primary.main}08, rgba(255, 255, 255, 0.02))`,
  },

  headerIcon: {
    fontSize: '48px',
    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
  },

  headerContent: {
    flex: 1,
  },

  submissionsTitle: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 900,
    fontSize: '32px',
    marginBottom: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },

  submissionsSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: 1.5,
    margin: 0,
  },

  searchSection: {
    padding: '32px 48px',
    borderBottom: `1px solid ${themeColors.primary.main}15`,
  },

  searchInputContainer: {
    display: 'flex',
    gap: '16px',
    alignItems: 'stretch',
  },

  inputWrapper: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },

  inputIcon: {
    position: 'absolute',
    left: '20px',
    fontSize: '20px',
    zIndex: 2,
    opacity: 0.7,
  },

  premiumSearchInput: {
    width: '100%',
    padding: '16px 24px 16px 56px',
    borderRadius: '16px',
    border: `1px solid ${themeColors.primary.main}30`,
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.03))`,
    backdropFilter: 'blur(15px)',
    fontSize: '16px',
    color: '#ffffff',
    boxSizing: 'border-box',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    '&:focus': {
      outline: 'none',
      border: `1px solid ${themeColors.primary.main}60`,
      boxShadow: `0 0 0 4px ${themeColors.primary.main}15`,
      background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.06))`,
    },
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },

  premiumSearchButton: {
    padding: '16px 20px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    color: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 8px 25px ${themeColors.primary.main}30`,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    minWidth: '140px',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 12px 35px ${themeColors.primary.main}40`,
      background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.primary.main})`,
    },
  },

  loadingSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  errorSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '32px 48px',
    background: `linear-gradient(135deg, ${themeColors.error.main}15, rgba(255, 255, 255, 0.02))`,
    border: `1px solid ${themeColors.error.main}30`,
    borderRadius: '16px',
    margin: '0 48px 32px',
  },

  errorIcon: {
    fontSize: '32px',
  },

  errorContent: {
    flex: 1,
  },

  errorTitle: {
    color: themeColors.error.light,
    fontWeight: 700,
    fontSize: '18px',
    marginBottom: '4px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  errorMessage: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: 1.5,
    margin: 0,
  },

  emptyStateSection: {
    textAlign: 'center',
    padding: '80px 48px',
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.02))`,
    margin: '0 48px 32px',
    borderRadius: '20px',
    border: `1px solid ${themeColors.primary.main}15`,
  },

  emptyStateTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  },

  emptyStateInlineIcon: {
    fontSize: '28px',
    opacity: 0.8,
    filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2))',
  },

  emptyStateTitle: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 800,
    fontSize: '28px',
    margin: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '-0.01em',
  },

  emptyStateMessage: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: 1.6,
    maxWidth: '450px',
    margin: '0 auto',
  },

  initialStateSection: {
    textAlign: 'center',
    padding: '60px 48px 80px',
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.02))`,
    margin: '0 48px 32px',
    borderRadius: '20px',
    border: `1px solid ${themeColors.primary.main}15`,
  },

  initialStateTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  },

  initialStateInlineIcon: {
    fontSize: '28px',
    opacity: 0.8,
    filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2))',
  },

  initialStateTitle: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 800,
    fontSize: '28px',
    margin: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '-0.01em',
  },

  initialStateMessage: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: 1.6,
    maxWidth: '500px',
    margin: '0 auto 48px',
  },

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    maxWidth: '700px',
    margin: '0 auto',
  },

  featureItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '32px 20px',
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    border: `1px solid ${themeColors.primary.main}25`,
    borderRadius: '18px',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 30px ${themeColors.primary.main}20`,
      border: `1px solid ${themeColors.primary.main}40`,
    },
  },

  featureIcon: {
    fontSize: '40px',
    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2))',
  },

  featureText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textAlign: 'center',
    lineHeight: 1.5,
    margin: 0,
    fontWeight: 500,
  },

  // Premium Submissions List Styles
  submissionsList: {
    padding: '32px 48px 48px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  submissionCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.primary.main}25`,
    borderRadius: '20px',
    padding: '0',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 16px 40px ${themeColors.primary.main}20`,
      border: `1px solid ${themeColors.primary.main}40`,
    },
  },

  submissionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 32px',
    borderBottom: `1px solid ${themeColors.primary.main}15`,
    background: `linear-gradient(135deg, ${themeColors.primary.main}08, rgba(255, 255, 255, 0.02))`,
  },

  submissionInfo: {
    flex: 1,
  },

  submissionId: {
    color: themeColors.primary.light,
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '4px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  submissionDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  submissionContent: {
    padding: '24px 32px 32px',
  },

  submissionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    marginBottom: '12px',
    lineHeight: 1.5,
  },

  submissionActions: {
    marginTop: '24px',
    marginBottom: '24px',
  },

  viewButton: {
    background: `linear-gradient(135deg, ${themeColors.secondary.main}, ${themeColors.secondary.dark})`,
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 4px 15px ${themeColors.secondary.main}30`,
    whiteSpace: 'nowrap',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 25px ${themeColors.secondary.main}40`,
      background: `linear-gradient(135deg, ${themeColors.secondary.light}, ${themeColors.secondary.main})`,
    },
  },

  feedbackContainer: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}10, rgba(255, 255, 255, 0.03))`,
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '16px',
    padding: '24px',
    marginTop: '20px',
  },

  reviewedBy: {
    color: themeColors.primary.light,
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  ratingContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },

  ratingItem: {
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
    border: `1px solid ${themeColors.primary.main}15`,
    borderRadius: '8px',
    padding: '8px 12px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontWeight: 500,
    textAlign: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  additionalFeedback: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    fontStyle: 'italic',
    lineHeight: 1.5,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  feedbackFormContainer: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.03))`,
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '16px',
    padding: '24px',
    marginTop: '20px',
  },

  feedbackTitle: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  feedbackGrid: {
    marginBottom: '24px',
    '& .MuiGrid-item': {
      paddingBottom: '16px',
    },
  },

  selectContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    position: 'relative',
    zIndex: 1,
    marginBottom: '16px',
  },

  selectLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  select: {
    padding: '12px 16px',
    background: '#1a1a2e',
    border: `2px solid ${themeColors.primary.main}40`,
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    position: 'relative',
    zIndex: 10,
    '&:focus': {
      outline: 'none',
      border: `2px solid ${themeColors.primary.main}`,
      boxShadow: `0 0 0 3px ${themeColors.primary.main}25`,
      zIndex: 20,
    },
  },

  customFeedback: {
    width: '100%',
    padding: '16px 20px',
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    border: `1px solid ${themeColors.primary.main}30`,
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    minHeight: '80px',
    resize: 'vertical',
    marginBottom: '20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:focus': {
      outline: 'none',
      border: `1px solid ${themeColors.primary.main}60`,
      boxShadow: `0 0 0 3px ${themeColors.primary.main}15`,
    },
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },

  submitFeedbackButton: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 28px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 6px 20px ${themeColors.primary.main}30`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 10px 30px ${themeColors.primary.main}40`,
      background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.primary.main})`,
    },
  },

  noSubmissions: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    fontStyle: 'italic',
    padding: '40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Premium Submission Details Styles
  submissionDetailsContainer: {
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },

  detailsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '32px 48px 24px',
    borderBottom: `1px solid ${themeColors.primary.main}20`,
    background: `linear-gradient(135deg, ${themeColors.primary.main}08, rgba(255, 255, 255, 0.02))`,
  },

  detailsTitle: {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: 800,
    margin: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.secondary.light})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  detailsSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    fontWeight: 500,
    margin: '8px 0 0 0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  detailsContent: {
    padding: '32px 48px 48px',
  },

  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },

  detailItem: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.03))`,
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '16px',
    padding: '24px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      border: `1px solid ${themeColors.primary.main}30`,
      background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    },
  },

  detailLabel: {
    color: themeColors.primary.light,
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  detailValue: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    wordBreak: 'break-all',
  },

  answersSection: {
    marginTop: '40px',
  },

  answersSectionTitle: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  answersGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  answerCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.03))`,
    border: `1px solid ${themeColors.secondary.main}20`,
    borderRadius: '16px',
    padding: '0',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 12px 30px ${themeColors.secondary.main}15`,
      border: `1px solid ${themeColors.secondary.main}30`,
    },
  },

  answerCardHeader: {
    background: `linear-gradient(135deg, ${themeColors.secondary.main}10, rgba(255, 255, 255, 0.02))`,
    padding: '20px 24px',
    borderBottom: `1px solid ${themeColors.secondary.main}15`,
  },

  answerCardContent: {
    padding: '24px',
  },

  questionText: {
    color: themeColors.secondary.light,
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  answerText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: 1.6,
    margin: '0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
    padding: '16px 20px',
    borderRadius: '12px',
    border: `1px solid rgba(255, 255, 255, 0.1)`,
  },

  detailsBackButton: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    color: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 8px 25px ${themeColors.primary.main}30`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '32px 48px 0',
    width: 'fit-content',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: `0 12px 35px ${themeColors.primary.main}40`,
      background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.primary.main})`,
    },
  },

  // Focused Submission Card Styling
  focusedSubmissionCard: {
    border: `2px solid ${themeColors.primary.main}`,
    boxShadow: `0 0 0 4px ${themeColors.primary.main}20, 0 16px 40px ${themeColors.primary.main}25`,
    transform: 'translateY(-2px)',
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.08))`,
    animation: 'focusPulse 2s ease-in-out',
  },

  // Error Section Styles
  errorSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '32px 48px',
    background: `linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))`,
    border: `1px solid rgba(239, 68, 68, 0.2)`,
    borderRadius: '20px',
    margin: '32px 48px',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
  },

  errorIcon: {
    fontSize: '48px',
    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2))',
  },

  errorContent: {
    flex: 1,
  },

  errorTitle: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  errorMessage: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '16px',
    lineHeight: 1.5,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Access Restricted Section (Special styling for non-creators)
  accessRestrictedSection: {
    background: `linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05))`,
    border: `1px solid rgba(99, 102, 241, 0.3)`,
  },

  accessHint: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    lineHeight: 1.5,
    marginTop: '12px',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },




};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    33% {
      transform: translateY(-20px) rotate(1deg);
    }
    66% {
      transform: translateY(10px) rotate(-1deg);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  /* Dropdown Options Styling */
  select option {
    background-color: #1a1a2e !important;
    color: #ffffff !important;
    padding: 10px 12px !important;
    font-size: 14px !important;
    border: none !important;
  }
  
  select option:hover {
    background-color: #6366f1 !important;
    color: #ffffff !important;
  }
  
  select option:checked {
    background-color: #6366f1 !important;
    color: #ffffff !important;
  }
  
  /* Focus Pulse Animation */
  @keyframes focusPulse {
    0% {
      box-shadow: 0 0 0 4px ${themeColors.primary.main}20, 0 16px 40px ${themeColors.primary.main}25;
    }
    50% {
      box-shadow: 0 0 0 8px ${themeColors.primary.main}30, 0 20px 50px ${themeColors.primary.main}35;
    }
    100% {
      box-shadow: 0 0 0 4px ${themeColors.primary.main}20, 0 16px 40px ${themeColors.primary.main}25;
    }
  }
`;
document.head.appendChild(styleSheet);

export default ContestMode;


