import React, { useCallback, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import CreatedContests from "./CreatedContests";
import { Button, Card, Container, Typography, TextField, Select, Grid } from './ui';
import CommonNavbar from './CommonNavbar';
import { colors, shadows } from '../theme';
import logoImage from '../assets/logo (2).jpeg';

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

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    alert("Contest ID copied to clipboard");
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
        .post("http://localhost:4444/createContest", {
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

  // Assuming this function is used to send feedback
  const submitFeedback = async (subID, logic, efficiency, codingStyle, clarity, custom) => {
    const feedback = {
      logic,
      efficiency,
      codingStyle,
      clarity,
      custom,
    };
    try {
      await fetch('http://localhost:4444/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subID, // The ID of the submission you are updating
          feedback: feedback,
          name: user.name, // The reviewer's name who is submitting the feedback
        }),
      });
      alert("Feedback Submitted");
    } catch (error) {
      console.log(error);
    }
  };

  const contestCreated = () => {
    return (
      <Container maxWidth="sm" style={styles.container}>
        <Card variant="elevated" style={styles.card}>
          <Typography variant="h4" style={styles.cardTitle}>
            New Contest Created
          </Typography>
          
          <div style={styles.fieldContainer}>
            <Typography variant="body1" style={styles.fieldLabel}>
              Contest ID:
            </Typography>
            <div style={styles.idContainer}>
              <Typography variant="body1" style={styles.idValue}>
                {id}
              </Typography>
            </div>
          </div>

          <Button 
            variant="contained" 
            color="primary"
            onClick={handleCopy}
            style={styles.button}
          >
            Copy ID
          </Button>
        </Card>
      </Container>
    );
  };

  const ContestSubmissions = () => {
    const [contestId, setContestId] = React.useState("");
    const [submissions, setSubmissions] = React.useState([]);
    const [error, setError] = React.useState("");

    const [logic, setLogic] = React.useState("0");
    const [efficiency, setEfficiecny] = React.useState("0");
    const [codingStyle, setCodingStyle] = React.useState("0");
    const [clarity, setClarity] = React.useState("0");
    const [custom, setCustom] = useState("");

    const handleContestIdChange = (e) => {
      setContestId(e.target.value);
    };

    const fetchSubmissions = async () => {
      if (!contestId) {
        setError("Please enter a contest ID.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:4444/getSubmission?id=${contestId}`
        );
        const data = await response.json();
        setSubmissions(data.data);
        setError("");
      } catch (err) {
        setError("Error fetching submissions.");
      }
    };

    return (
      <Container maxWidth="md" style={styles.container}>
        <Card variant="elevated" style={styles.card}>
          {error && (
            <Typography variant="body1" color="error" style={styles.errorText}>
              {error}
            </Typography>
          )}

          <Typography variant="h4" style={styles.cardTitle}>
            Enter Contest ID to View Submissions
          </Typography>

          <div style={styles.searchContainer}>
            <TextField
              type="text"
              value={contestId}
              onChange={handleContestIdChange}
              placeholder="Enter Contest ID"
              style={styles.input}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={fetchSubmissions}
              style={styles.searchButton}
            >
              View Submissions
            </Button>
          </div>

          {submissions.length > 0 ? (
            <div style={styles.submissionsList}>
              {submissions.map((submission) => (
                <Card key={submission._id} variant="outlined" style={styles.submissionCard}>
                  <Typography variant="body1" style={styles.submissionText}>
                    <strong>Submission ID:</strong> {submission._id}
                  </Typography>
                  <Typography variant="body1" style={styles.submissionText}>
                    <strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}
                  </Typography>
                  
                  <div style={styles.submissionActions}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSingleSubmissionDetails(submission);
                        setAction("view-single-submission");
                      }}
                      style={styles.viewButton}
                    >
                      View Submission
                    </Button>
                  </div>

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
                              <Select
                                id="logic"
                                value={logic}
                                onChange={(e) => setLogic(e.target.value)}
                                style={styles.select}
                              >
                                {[0, 1, 2, 3, 4, 5].map((value) => (
                                  <option key={value} value={value.toString()}>{value}</option>
                                ))}
                              </Select>
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div style={styles.selectContainer}>
                              <label htmlFor="efficiency" style={styles.selectLabel}>Efficiency</label>
                              <Select
                                id="efficiency"
                                value={efficiency}
                                onChange={(e) => setEfficiecny(e.target.value)}
                                style={styles.select}
                              >
                                {[0, 1, 2, 3, 4, 5].map((value) => (
                                  <option key={value} value={value.toString()}>{value}</option>
                                ))}
                              </Select>
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div style={styles.selectContainer}>
                              <label htmlFor="codingStyle" style={styles.selectLabel}>Coding Style</label>
                              <Select
                                id="codingStyle"
                                value={codingStyle}
                                onChange={(e) => setCodingStyle(e.target.value)}
                                style={styles.select}
                              >
                                {[0, 1, 2, 3, 4, 5].map((value) => (
                                  <option key={value} value={value.toString()}>{value}</option>
                                ))}
                              </Select>
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div style={styles.selectContainer}>
                              <label htmlFor="clarity" style={styles.selectLabel}>Clarity</label>
                              <Select
                                id="clarity"
                                value={clarity}
                                onChange={(e) => setClarity(e.target.value)}
                                style={styles.select}
                              >
                                {[0, 1, 2, 3, 4, 5].map((value) => (
                                  <option key={value} value={value.toString()}>{value}</option>
                                ))}
                              </Select>
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
      <Container maxWidth="md" style={styles.container}>
        <Card variant="elevated" style={styles.card}>
          <Typography variant="h4" style={styles.cardTitle}>
            Submission Details
          </Typography>
          
          <div style={styles.submissionDetailsContainer}>
            <div style={styles.detailItem}>
              <Typography variant="h6" style={styles.detailLabel}>
                Submission ID:
              </Typography>
              <Typography variant="body1" style={styles.detailValue}>
                {submission._id}
              </Typography>
            </div>
            
            <div style={styles.detailItem}>
              <Typography variant="h6" style={styles.detailLabel}>
                Contest ID:
              </Typography>
              <Typography variant="body1" style={styles.detailValue}>
                {submission.contestID}
              </Typography>
            </div>
            
            <div style={styles.detailItem}>
              <Typography variant="h6" style={styles.detailLabel}>
                Submitted At:
              </Typography>
              <Typography variant="body1" style={styles.detailValue}>
                {new Date(submission.submittedAt).toLocaleString()}
              </Typography>
            </div>
            
            <div style={styles.answersContainer}>
              <Typography variant="h6" style={styles.detailLabel}>
                Answers:
              </Typography>
              
              {submission.answers.map((answer, index) => (
                <Card key={answer._id || index} variant="outlined" style={styles.answerCard}>
                  <Typography variant="body1" style={styles.questionText}>
                    <strong>Question {index + 1}:</strong> {answer.question}
                  </Typography>
                  <Typography variant="body1" style={styles.answerText}>
                    <strong>Your Answer:</strong> {answer.answer}
                  </Typography>
                </Card>
              ))}
            </div>
          </div>
          
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAction("view-submissions")}
            style={styles.backButton}
          >
            Back to Submissions
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
        
        <div style={styles.contentWrapper}>
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
          {action === "created-contests" && <CreatedContests user={user} />}
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
  }
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${themeColors.background.default} 0%, #16213e 100%)`,
    position: 'relative',
    overflow: 'hidden',
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
    marginBottom: '80px',
    padding: '60px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  heroTitle: {
    fontSize: '48px',
    fontWeight: 800,
    color: '#ffffff',
    marginBottom: '20px',
    letterSpacing: '-0.02em',
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
    marginBottom: '80px',
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
    marginBottom: '32px',
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

  // Enhanced Header Section
  header: {
    marginBottom: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 20px',
  },

  // Enhanced Content Wrapper
  contentWrapper: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 0',
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
`;
document.head.appendChild(styleSheet);

export default ContestMode;


