import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
const Mode = () => {
  const navigate = useNavigate();
  const {user}=useAuth0()
  return (
    <>
    <div
    style={{ position:'sticky', marginTop:'0px' ,marginLeft:'0px',textAlign: "center", padding: "1em", color: "#463E7D" }}
    >Hello, {user.name}</div>
      <h1 style={{ marginTop:'0em' ,textAlign: "center", padding: "1em", color: "#463E7D" }}>
        Mode Selection
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "60vh",
          padding: "1em",

          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Create/Attempt Contest Section */}
        <div
          style={{
            width: "40%",
            padding: "1.5em",
            backgroundColor: "#F9F9FF",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h4 style={{ textDecoration: "underline", marginBottom: "1em", color: "#463E7D" }}>
            Create/Attempt Contest
          </h4>
          <p style={{ marginBottom: "2em", fontSize: "14px", color: "#555" }}>
            Organize or attempt competitive contests effortlessly. From setting
            up rules to inviting participants and tracking results, everything
            is streamlined for a seamless experience. Perfect for coding
            challenges.
          </p>
          <button
            onClick={() => navigate("contest-mode")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#463E7D",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#6A5ACD")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#463E7D")}
          >
            Create/Attempt Contest
          </button>
        </div>

        {/* Peer Programming Section */}
        <div
          style={{
            width: "40%",
            padding: "1.5em",
            backgroundColor: "#F9F9FF",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h4 style={{ textDecoration: "underline", marginBottom: "1em", color: "#463E7D" }}>
            Peer Programming
          </h4>
          <p style={{ marginBottom: "2em", fontSize: "14px", color: "#555" }}>
            Collaborate with your peers in real-time to code together and debug
            effectively. This mode fosters teamwork and enhances productivity,
            making it ideal for pair programming sessions and real-time
            brainstorming.
          </p>
          <button
            onClick={() => navigate("peer-mode")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#463E7D",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#6A5ACD")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#463E7D")}
          >
            Peer Programming
          </button>
        </div>
      </div>
    </>
  );
};

export default Mode;
