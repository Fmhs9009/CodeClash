import React, { useState, useEffect } from "react";
import { Button, Card, Container, Typography, TextField, Grid } from './ui';
import { colors, shadows } from '../theme';

const CreatedContests = ({ user }) => {
  const [contests, setContests] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (contests.length === 0) {
      setError("No Contests to show");
    }
  });
  
  // Fetch contests created by the user
  const fetchContests = async () => {
    try {
      const response = await fetch("http://localhost:4444/viewContests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sub: user.sub }),
      });
      const data = await response.json();
      if (response.ok) {
         setContests(data.data);
         setError("");
      } else {
        setError(data.msg || "Failed to fetch contests.");
      }
    } catch (err) {
      setError("Error fetching contests.");
    }
  };

  // Handle edit button click
  const handleEdit = (contest) => {
    setEditId(contest._id);
    setEditForm({
      name: contest.name,
      time: contest.time,
      questions: [...contest.questions],
    });
  };

  // Handle edit form changes
  const handleEditChange = (field, value, index = null) => {
    if (field === "questions" && index !== null) {
      const updatedQuestions = [...editForm.questions];
      updatedQuestions[index] = value;
      setEditForm((prev) => ({ ...prev, questions: updatedQuestions }));
    } else {
      setEditForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Submit the edit form
  const submitEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:4444/editContest`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ editForm, id }),
      });

      if (response.ok) {
        fetchContests(); // Refresh contests after edit
        setEditId(null);
      } else {
        setError("Failed to update the contest.");
      }
    } catch (err) {
      setError("Error updating contest.");
    }
  };

  // Delete a contest with confirmation
  const deleteContest = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this contest?");
    if (!isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:4444/deleteContest/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setContests((prev) => prev.filter((contest) => contest._id !== id)); // Remove from UI
      } else {
        setError("Failed to delete the contest.");
      }
    } catch (err) {
      setError("Error deleting contest.");
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  return (
    <div style={styles.pageContainer}>
      {/* Animated Background Shapes */}
      <div style={styles.backgroundShapes}>
        <div style={styles.floatingShape1}></div>
        <div style={styles.floatingShape2}></div>
        <div style={styles.floatingShape3}></div>
      </div>

      <Container maxWidth="lg" style={styles.container}>
        {/* Premium Header Section */}
        <div style={styles.headerSection}>
          <Typography variant="h3" style={styles.pageTitle}>
            Your Created Contests
          </Typography>
          <Typography variant="h6" style={styles.pageSubtitle}>
            Manage and monitor your coding challenges
          </Typography>
        </div>

        {/* Error Message with Premium Styling */}
        {error && (
          <div style={styles.errorContainer}>
            <Typography variant="body1" style={styles.errorText}>
              ⚠️ {error}
            </Typography>
          </div>
        )}
      
      {contests.map((contest) =>
        editId === contest._id ? (
          <Card key={contest._id} variant="outlined" style={styles.contestCard}>
            <div style={styles.formField}>
              <Typography variant="body1" style={styles.fieldLabel}>
                Name
              </Typography>
              <TextField
                type="text"
                value={editForm.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                placeholder="Contest Name"
                style={styles.input}
              />
            </div>
            
            <div style={styles.formField}>
              <Typography variant="body1" style={styles.fieldLabel}>
                Time (minutes)
              </Typography>
              <TextField
                type="number"
                value={editForm.time}
                onChange={(e) => handleEditChange("time", e.target.value)}
                placeholder="Contest Duration"
                style={styles.input}
              />
            </div>
            
            {editForm.questions.map((question, index) => (
              <div key={index} style={styles.formField}>
                <Typography variant="body1" style={styles.fieldLabel}>
                  Question {index + 1}
                </Typography>
                <TextField
                  type="text"
                  value={question}
                  onChange={(e) => handleEditChange("questions", e.target.value, index)}
                  placeholder={`Question ${index + 1}`}
                  style={styles.input}
                />
              </div>
            ))}
            
            <div style={styles.buttonContainer}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (!editForm.name || !editForm.time) {
                    return alert("Name and Time cannot be empty.");
                  }
                  submitEdit(contest._id);
                }}
                style={styles.saveButton}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setEditId(null)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </div>
          </Card>
        ) : (
          <Card key={contest._id} variant="outlined" style={styles.contestCard}>
            <Typography variant="h5" style={styles.contestTitle}>
              {contest.name}
            </Typography>
            
            <div style={styles.contestDetails}>
              <Typography variant="body1" style={styles.detailItem}>
                <strong>Contest ID:</strong> {contest._id}
              </Typography>
              <Typography variant="body1" style={styles.detailItem}>
                <strong>Time:</strong> {contest.time} minutes
              </Typography>
              <Typography variant="body1" style={styles.detailItem}>
                <strong>Number of Questions:</strong> {contest.numQuestions}
              </Typography>
            </div>
            
            <div style={styles.questionsSection}>
              <Typography variant="body1" style={styles.questionsSectionTitle}>
                <strong>List of Questions:</strong>
              </Typography>
              <ul style={styles.questionsList}>
                {contest.questions.map((q, i) => (
                  <li key={i} style={styles.questionItem}>
                    <Typography variant="body2">
                      {q}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={styles.buttonContainer}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEdit(contest)}
                style={styles.editButton}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => deleteContest(contest._id)}
                style={styles.deleteButton}
              >
                Delete
  );
};

const themeColors = {
  primary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
  },
  secondary: {
    main: '#ec4899',
    light: '#f472b6',
    dark: '#db2777',
  },
  background: {
    default: '#0f0f23',
    paper: '#1a1a2e',
    glass: 'rgba(255, 255, 255, 0.1)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#a1a1aa',
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
  },
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${themeColors.background.default} 0%, #16213e 100%)`,
    position: 'relative',
    overflow: 'hidden',
    paddingTop: '40px',
    paddingBottom: '80px',
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
    top: '15%',
    left: '10%',
    width: '200px',
    height: '200px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}15, ${themeColors.secondary.main}20)`,
    borderRadius: '50%',
    filter: 'blur(60px)',
  },

  floatingShape2: {
    position: 'absolute',
    top: '60%',
    right: '15%',
    width: '150px',
    height: '150px',
    background: `linear-gradient(45deg, ${themeColors.secondary.main}15, ${themeColors.primary.light}15)`,
    borderRadius: '50%',
    filter: 'blur(50px)',
  },

  floatingShape3: {
    position: 'absolute',
    bottom: '20%',
    left: '60%',
    width: '120px',
    height: '120px',
    background: `linear-gradient(45deg, ${themeColors.primary.dark}20, ${themeColors.secondary.light}20)`,
    borderRadius: '50%',
    filter: 'blur(40px)',
  },

  container: {
    position: 'relative',
    zIndex: 1,
    padding: '0 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  headerSection: {
    textAlign: 'center',
    marginBottom: '60px',
    padding: '40px 20px',
  },

  pageTitle: {
    fontSize: '42px',
    fontWeight: 800,
    color: '#ffffff',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  pageSubtitle: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 400,
    lineHeight: 1.6,
    maxWidth: '500px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  errorContainer: {
    background: `linear-gradient(135deg, ${themeColors.error.main}15, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.error.main}30`,
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '40px',
    textAlign: 'center',
    color: colors.primary.main,
    marginBottom: '30px',
    fontWeight: 700,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  contestCard: {
    marginBottom: '20px',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: shadows.small,
    backgroundColor: colors.background.paper,
  },
  contestTitle: {
    color: colors.primary.main,
    fontWeight: 600,
    marginBottom: '16px',
  },
  contestDetails: {
    marginBottom: '16px',
  },
  detailItem: {
    marginBottom: '8px',
    color: colors.text.secondary,
  },
  questionsSection: {
    marginBottom: '20px',
  },
  questionsSectionTitle: {
    marginBottom: '8px',
    color: colors.text.secondary,
  },
  questionsList: {
    paddingLeft: '24px',
    marginTop: '8px',
  },
  questionItem: {
    marginBottom: '8px',
  },
  formField: {
    marginBottom: '16px',
  },
  fieldLabel: {
    fontWeight: 600,
    color: colors.text.secondary,
    marginBottom: '8px',
  },
  input: {
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  editButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.error.main,
    '&:hover': {
      backgroundColor: colors.error.dark,
    },
  },
};

export default CreatedContests;
