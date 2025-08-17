import React, { useState, useEffect } from "react";

// Premium Theme Colors matching ContestMode.jsx
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
        setContests((prev) => prev.filter((contest) => contest._id !== id));
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

  // Add CSS animations to document head
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(1deg); }
        66% { transform: translateY(5px) rotate(-1deg); }
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
      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  return (
    <div style={styles.pageContainer}>
      {/* Animated Background Shapes */}
      <div style={styles.backgroundShapes}>
        <div style={styles.floatingShape1}></div>
        <div style={styles.floatingShape2}></div>
        <div style={styles.floatingShape3}></div>
      </div>

      <div style={styles.container}>
        {/* Premium Header Section */}
        <div style={styles.headerSection}>
          <h1 style={styles.pageTitle}>
            Your Created Contests
          </h1>
          <p style={styles.pageSubtitle}>
            Manage and monitor your coding challenges
          </p>
        </div>

        {/* Error Message with Premium Styling */}
        {error && (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Premium Contest Cards Grid */}
        <div style={styles.contestsGrid}>
          {contests.map((contest) =>
            editId === contest._id ? (
              // Edit Mode Card with Premium Styling
              <div key={contest._id} style={styles.editCard}>
                <div style={styles.editCardHeader}>
                  <h3 style={styles.editCardTitle}>
                    ✏️ Editing Contest
                  </h3>
                  <p style={styles.editCardSubtitle}>
                    Make your changes below
                  </p>
                </div>

                <div style={styles.editForm}>
                  <div style={styles.formField}>
                    <label style={styles.fieldLabel}>
                      Contest Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      placeholder="Enter contest name"
                      style={styles.premiumInput}
                      onFocus={(e) => {
                        e.target.style.border = `1px solid ${themeColors.primary.main}60`;
                        e.target.style.boxShadow = `0 0 0 4px ${themeColors.primary.main}15`;
                        e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${themeColors.primary.main}30`;
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))';
                      }}
                    />
                  </div>
                  
                  <div style={styles.formField}>
                    <label style={styles.fieldLabel}>
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={editForm.time}
                      onChange={(e) => handleEditChange("time", e.target.value)}
                      placeholder="Contest duration"
                      style={styles.premiumInput}
                      onFocus={(e) => {
                        e.target.style.border = `1px solid ${themeColors.primary.main}60`;
                        e.target.style.boxShadow = `0 0 0 4px ${themeColors.primary.main}15`;
                        e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${themeColors.primary.main}30`;
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))';
                      }}
                    />
                  </div>
                  
                  <div style={styles.questionsEditSection}>
                    <label style={styles.questionsEditTitle}>
                      Contest Questions
                    </label>
                    {editForm.questions.map((question, index) => (
                      <div key={index} style={styles.questionEditField}>
                        <label style={styles.questionLabel}>
                          Question {index + 1}
                        </label>
                        <textarea
                          value={question}
                          onChange={(e) => handleEditChange("questions", e.target.value, index)}
                          placeholder={`Enter question ${index + 1}`}
                          style={styles.premiumTextArea}
                          onFocus={(e) => {
                            e.target.style.border = `1px solid ${themeColors.primary.main}60`;
                            e.target.style.boxShadow = `0 0 0 4px ${themeColors.primary.main}15`;
                            e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))';
                          }}
                          onBlur={(e) => {
                            e.target.style.border = `1px solid ${themeColors.primary.main}30`;
                            e.target.style.boxShadow = 'none';
                            e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div style={styles.editButtonContainer}>
                    <button
                      onClick={() => {
                        if (!editForm.name || !editForm.time) {
                          return alert("Name and Time cannot be empty.");
                        }
                        submitEdit(contest._id);
                      }}
                      style={styles.saveButton}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 10px 30px ${themeColors.primary.main}60`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = `0 6px 20px ${themeColors.primary.main}40`;
                      }}
                    >
                      💾 Save Changes
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      style={styles.cancelButton}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))';
                        e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
                        e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Display Mode Card with Premium Styling
              <div 
                key={contest._id} 
                style={styles.contestCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.25)';
                  e.currentTarget.style.border = `1px solid ${themeColors.primary.main}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.border = `1px solid ${themeColors.primary.main}20`;
                }}
              >
                <div style={styles.contestCardHeader}>
                  <div style={styles.contestIcon}>🏆</div>
                  <div style={styles.contestHeaderContent}>
                    <h3 style={styles.contestTitle}>
                      {contest.name}
                    </h3>
                    <p style={styles.contestId}>
                      ID: {contest._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <div style={styles.contestStats}>
                  <div style={styles.statItem}>
                    <div style={styles.statIcon}>⏱️</div>
                    <div style={styles.statContent}>
                      <p style={styles.statLabel}>Duration</p>
                      <h4 style={styles.statValue}>{contest.time} min</h4>
                    </div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statIcon}>❓</div>
                    <div style={styles.statContent}>
                      <p style={styles.statLabel}>Questions</p>
                      <h4 style={styles.statValue}>{contest.numQuestions}</h4>
                    </div>
                  </div>
                </div>
                
                <div style={styles.questionsPreview}>
                  <p style={styles.questionsPreviewTitle}>
                    📝 Contest Questions
                  </p>
                  <div style={styles.questionsList}>
                    {contest.questions.map((q, i) => (
                      <div key={i} style={styles.questionPreviewItem}>
                        <span style={styles.questionNumber}>{i + 1}</span>
                        <p style={styles.questionText}>
                          {q.length > 80 ? `${q.substring(0, 80)}...` : q}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={styles.actionButtonContainer}>
                  <button
                    onClick={() => handleEdit(contest)}
                    style={styles.editButton}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 8px 25px ${themeColors.primary.main}50`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = `0 4px 15px ${themeColors.primary.main}30`;
                    }}
                  >
                    ✏️ Edit Contest
                  </button>
                  <button
                    onClick={() => deleteContest(contest._id)}
                    style={styles.deleteButton}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 8px 25px ${themeColors.error.main}50`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = `0 4px 15px ${themeColors.error.main}30`;
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Empty State */}
        {contests.length === 0 && !error && (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>📝</div>
            <h3 style={styles.emptyStateTitle}>
              No Contests Created Yet
            </h3>
            <p style={styles.emptyStateDesc}>
              Start creating your first coding contest to see it here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Premium Styles Object
const styles = {
  // Premium Page Container with Glassmorphism Background
  pageContainer: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${themeColors.background.default} 0%, #16213e 100%)`,
    position: 'relative',
    overflow: 'hidden',
    paddingTop: '40px',
    paddingBottom: '80px',
  },

  // Animated Background Shapes
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
    animation: 'float 8s ease-in-out infinite',
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
    animation: 'float 10s ease-in-out infinite reverse',
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
    animation: 'float 12s ease-in-out infinite',
  },

  // Premium Container
  container: {
    position: 'relative',
    zIndex: 1,
    padding: '0 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  // Enhanced Header Section
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

  // Premium Error Container
  errorContainer: {
    background: `linear-gradient(135deg, ${themeColors.error.main}15, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.error.main}30`,
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '40px',
    textAlign: 'center',
  },

  errorText: {
    color: themeColors.error.light,
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
  },

  // Premium Contests Grid
  contestsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '32px',
    marginBottom: '60px',
  },

  // Premium Contest Card
  contestCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '20px',
    padding: '32px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    animation: 'fadeInUp 0.6s ease-out',
  },

  // Contest Card Header
  contestCardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '16px',
  },

  contestIcon: {
    fontSize: '32px',
    padding: '12px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}20, ${themeColors.secondary.main}20)`,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contestHeaderContent: {
    flex: 1,
  },

  contestTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: themeColors.text.primary,
    margin: '0 0 8px 0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  contestId: {
    fontSize: '12px',
    color: themeColors.text.secondary,
    fontWeight: 500,
    margin: 0,
    letterSpacing: '0.5px',
  },

  // Contest Stats Section
  contestStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px',
  },

  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
    borderRadius: '12px',
    border: `1px solid ${themeColors.primary.main}10`,
  },

  statIcon: {
    fontSize: '20px',
  },

  statContent: {
    flex: 1,
  },

  statLabel: {
    fontSize: '12px',
    color: themeColors.text.secondary,
    margin: '0 0 4px 0',
    fontWeight: 500,
  },

  statValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: themeColors.text.primary,
    margin: 0,
  },

  // Questions Preview Section
  questionsPreview: {
    marginBottom: '24px',
  },

  questionsPreviewTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: themeColors.text.primary,
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },

  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  questionPreviewItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))`,
    borderRadius: '8px',
    border: `1px solid ${themeColors.primary.main}08`,
  },

  questionNumber: {
    fontSize: '12px',
    fontWeight: 700,
    color: themeColors.primary.light,
    background: `${themeColors.primary.main}20`,
    padding: '4px 8px',
    borderRadius: '6px',
    minWidth: '20px',
    textAlign: 'center',
  },

  questionText: {
    fontSize: '14px',
    color: themeColors.text.secondary,
    lineHeight: 1.4,
    margin: 0,
    flex: 1,
  },

  // Action Buttons Container
  actionButtonContainer: {
    display: 'flex',
    gap: '12px',
  },

  editButton: {
    flex: 1,
    padding: '14px 20px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 4px 15px ${themeColors.primary.main}30`,
  },

  deleteButton: {
    flex: 1,
    padding: '14px 20px',
    background: `linear-gradient(135deg, ${themeColors.error.main}, ${themeColors.error.dark})`,
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 4px 15px ${themeColors.error.main}30`,
  },

  // Edit Card Styles
  editCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.08))`,
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: `1px solid ${themeColors.primary.main}30`,
    borderRadius: '20px',
    padding: '32px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },

  editCardHeader: {
    textAlign: 'center',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: `1px solid ${themeColors.primary.main}20`,
  },

  editCardTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: themeColors.text.primary,
    marginBottom: '8px',
    margin: '0 0 8px 0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  editCardSubtitle: {
    fontSize: '16px',
    color: themeColors.text.secondary,
    margin: 0,
  },

  // Edit Form Styles
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  fieldLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  premiumInput: {
    padding: '16px 20px',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))`,
    border: `1px solid ${themeColors.primary.main}30`,
    borderRadius: '12px',
    color: themeColors.text.primary,
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    outline: 'none',
  },

  questionsEditSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  questionsEditTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  questionEditField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  questionLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: themeColors.text.secondary,
  },

  premiumTextArea: {
    padding: '16px 20px',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))`,
    border: `1px solid ${themeColors.primary.main}30`,
    borderRadius: '12px',
    color: themeColors.text.primary,
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    minHeight: '80px',
    resize: 'vertical',
    outline: 'none',
  },

  // Edit Button Container
  editButtonContainer: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  },

  saveButton: {
    flex: 1,
    padding: '16px 24px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 6px 20px ${themeColors.primary.main}40`,
    position: 'relative',
    overflow: 'hidden',
  },

  cancelButton: {
    flex: 1,
    padding: '16px 24px',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
    border: `1px solid ${themeColors.text.secondary}30`,
    borderRadius: '12px',
    color: themeColors.text.secondary,
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.03))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.primary.main}15`,
    borderRadius: '20px',
  },

  emptyStateIcon: {
    fontSize: '64px',
    marginBottom: '24px',
  },

  emptyStateTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: themeColors.text.primary,
    marginBottom: '12px',
    margin: '0 0 12px 0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  emptyStateDesc: {
    fontSize: '16px',
    color: themeColors.text.secondary,
    maxWidth: '400px',
    margin: '0 auto',
    lineHeight: 1.5,
  },
};

export default CreatedContests;
