import React, { useCallback, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";



const ContestMode = () => {
  const navigate=useNavigate()
  const [action, setAction] = useState("");
  const [numQuestions, setNumQuestions] = useState(0);
  const [time, setTime] = useState("");
  const [questions, setQuestions] = useState([]);
  const [id,setId]= useState(0)
  const [attemptid,setAttemptid]=useState("")
  const [singleSubmissionDetails,setSingleSubmissionDetails]=useState("")

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


  const contestCreated=()=>{

   return <div
    style={{
      width: "90%",
      maxWidth: "400px",
      margin: "2em auto",
      padding: "1.5em",
      backgroundColor: "#F9F9FF",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      fontFamily: "Arial, sans-serif",
    }}
  >

    <h2
      style={{
        textAlign: "center",
        marginBottom: "1em",
        color: "#463E7D",
        fontWeight: "bold",
      }}
    >
      New Contest Created
    </h2>

    <div style={{ marginBottom: "1em" }}>
      <label style={{ fontWeight: "bold", color: "#555" }}>Contest ID:</label>
      <span style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          marginTop: "5px",
          outline: "none",
        }} >
          {id}
      </span>

        <button 
          type="submit"
          style={{
            width: "100%",
            marginTop:'1em',
            padding: "10px 15px",
            backgroundColor: "#463E7D",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        onClick={handleCopy}>Copy</button>
    </div >
  </div >
}


  const handleCopy=()=>{
    navigator.clipboard.writeText(id)
    alert("Contest ID copied to clipboard")
  }




  const handleSubmit =async (e) => {
    e.preventDefault();
    // alert(`Time: ${time} mins, Questions: ${questions.join(", ")}`);

    if(!time || !numQuestions || !questions){
      alert("Any field cannot be blank")
    }
    else if(!(numQuestions>=1 && numQuestions<=10)){
      alert("Number of questions can only be be 1-10")
    }
    else{
        console.log("axiioossssss");
        await axios.post("http://localhost:4444/createContest",{
          time,
          numQuestions,
          questions
        })      
        // .then((res)=>res.json())
        .then((res)=>{
            setAction("created")
            // console.log(res);
            setId(res.data.id)
        })
        .catch((err)=>{
          console.log(err);
        })

    }
  };







  const ContestSubmissions = () => {
    const [contestId, setContestId] = React.useState("");
    const [submissions, setSubmissions] = React.useState([]);
    const [error, setError] = React.useState("");
  
    const handleContestIdChange = (e) => {
      setContestId(e.target.value);
    };
  
    const fetchSubmissions = async () => {
      if (!contestId) {
        setError("Please enter a contest ID.");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:4444/getSubmission?id=${contestId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch submissions.");
        }
        const data = await response.json();
        setSubmissions(data.data);
        setError(""); 
      } catch (err) {
        setError("Error fetching submissions.");
      }
    };
  
    return (
      <div style={{ padding: '30px', backgroundColor: '#f5f5f5', borderRadius: '12px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        {error && <p style={{ color: '#ff4d4f', fontWeight: 'bold', textAlign: 'center' }}>{error}</p>}
  
        <h3 style={{ color: '#463e7d', textAlign: 'center', marginBottom: '20px' }}>Enter Contest ID to View Submissions</h3>
  
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <input
            type="text"
            value={contestId}
            onChange={handleContestIdChange}
            placeholder="Enter Contest ID"
            style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              border: '1px solid #ccc', 
              width: '250px', 
              fontSize: '14px' 
            }}
          />
          <button
            onClick={fetchSubmissions}
            style={{
              backgroundColor: '#463e7d',
              color: '#fff',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginLeft: '10px',
              fontSize: '14px',
            }}
          >
            View Submissions
          </button>
        </div>
  
        {submissions.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: '0', marginTop: '20px' }}>
            {submissions.map(submission => (
              <li
                key={submission._id}
                style={{
                  backgroundColor: '#fff',
                  padding: '15px',
                  marginBottom: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <p style={{ marginBottom: '8px', fontSize: '14px', color: '#333' }}>
                  <strong>Submission ID:</strong> {submission._id}
                </p>
                <p style={{ marginBottom: '8px', fontSize: '14px', color: '#333' }}>
                  <strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}
                </p>
                <button
                  style={{
                    backgroundColor: '#463e7d',
                    color: '#fff',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  onClick={() =>{
                    setSingleSubmissionDetails(submission)
                    setAction("view-single-submission")
                  }}
                >
                  View Submission
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: '16px', color: '#333', textAlign: 'center' }}>No submissions available.</p>
        )}
      </div>
    );
  };
  




  const viewSubmissionDetails = (submission) => {
    return (
      <div
        style={{
          width: "90%",
          maxWidth: "600px",
          margin: "2em auto",
          padding: "1.5em",
          backgroundColor: "#F9F9FF",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            marginBottom: "1em",
            color: "#463E7D",
            fontWeight: "bolder",
          }}
        >
          Submission Details
        </h3>
        <div
          style={{
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "1.5em",
          }}
        >
          <h4 style={{ color: "#463E7D", fontWeight: "bold" }}>Submission ID:</h4>
          <p>{submission._id}</p>
  
          <h4 style={{ color: "#463E7D", fontWeight: "bold" }}>Contest ID:</h4>
          <p>{submission.contestID}</p>
  
          <h4 style={{ color: "#463E7D", fontWeight: "bold" }}>Submitted At:</h4>
          <p>{new Date(submission.submittedAt).toLocaleString()}</p>
  
          <h4 style={{ color: "#463E7D", fontWeight: "bold" }}>Answers:</h4>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            {submission.answers.map((answer, index) => (
              <li
                key={answer._id}
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <p style={{ margin: "5px 0", color: "#555" }}>
                  <strong>Question {index + 1}:</strong> {answer.question}
                </p>
                <p style={{ margin: "5px 0", color: "#555" }}>
                  <strong>Your Answer:</strong> {answer.answer}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => setAction("view-submissions")}
          style={{
            width: "100%",
            padding: "10px 15px",
            backgroundColor: "#463E7D",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Back to Submissions
        </button>
      </div>
    );
  };
  




  const createContest = useCallback(() => (
    <div
      style={{
        width: "90%",
        maxWidth: "600px",
        margin: "2em auto",
        padding: "1.5em",
        backgroundColor: "#F9F9FF",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h4
        style={{
          textAlign: "center",
          marginBottom: "1em",
          color: "#463E7D",
          fontWeight: "bolder",
        }}
      >
        Create Your Contest
      </h4>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1em" }}>
          <label style={{ fontWeight: "bold", color: "#555" }}>
            Number of Questions:
          </label>
          <input
            type="number"
            value={numQuestions}
            onChange={handleNumQuestionsChange}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              marginTop: "5px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "1em" }}>
          <label style={{ fontWeight: "bold", color: "#555" }}>
            Time (in minutes):
          </label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              marginTop: "5px",
              outline: "none",
            }}
          />
        </div>

        {questions.map((_, index) => (
          <div key={index} style={{ marginBottom: "1em" }}>
            <label style={{ fontWeight: "bold", color: "#555" }}>
              Question {index + 1}:
            </label>
            <input
              type="text"
              value={questions[index]}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              placeholder={`Enter question ${index + 1}`}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                marginTop: "5px",
                outline: "none",
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px 15px",
            backgroundColor: "#463E7D",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#6A5ACD")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#463E7D")}
        >
          Submit
        </button>
      </form>
    </div>
  ));
        


  const attemptContest = () => (
    <div
      style={{
        width: "90%",
        maxWidth: "400px",
        margin: "2em auto",
        padding: "1.5em",
        backgroundColor: "#F9F9FF",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1em",
          color: "#463E7D",
          fontWeight: "bold",
        }}
      >
        Attempt a Contest
      </h2>
      <div style={{ marginBottom: "1em" }}>
        <label style={{ fontWeight: "bold", color: "#555" }}>Contest ID:</label>
        <input
          type="text"
          value={attemptid}
          onChange={(e)=>setAttemptid(e.target.value)}
          placeholder="Enter Contest ID here"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginTop: "5px",
            outline: "none",
          }}
        />
      </div>
      <button
        style={{
          width: "100%",
          padding: "10px 15px",
          backgroundColor: "#463E7D",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#6A5ACD")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#463E7D")}
        onClick={() => navigate(`/contest-mode/contest-page/${attemptid}`)}
        >
        Submit
      </button>
    </div>
  );
  return (
    <>
      <h1 style={{ textAlign: "center", padding: "1em", color: "#463E7D" }}>
        Create/Attempt Contest
      </h1>

      <div style={{ textAlign: "center", marginBottom: "1em" }}>
        <h3 style={{textDecoration:"underline", color: "#555", fontWeight: "bold" }}>
          Please select your action :-
        </h3>
        <select
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            outline: "none",
            cursor: "pointer",
          }}
          value={action}
          onChange={handleActionChange}
        >
          <option value="">---Select an option---</option>
          <option value="create-contest">Create a new contest</option>
          <option value="attempt-contest">Attempt a contest</option>
          <option value="view-submissions">View submissions</option>
        </select>
      </div>

      {action === "create-contest" && createContest()}
      {action === "attempt-contest" && attemptContest()}
      {action === "created" && contestCreated()}
      {action === "view-submissions" && <ContestSubmissions/>}
      {action === "view-single-submission" && viewSubmissionDetails(singleSubmissionDetails)}
    </>
  );
};

export default ContestMode;



