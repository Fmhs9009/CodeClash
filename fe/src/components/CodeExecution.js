import axios from 'axios';

// Fetch API key from environment variables only
const KEY = import.meta.env.VITE_JUDGE0_API_KEY;

if (!KEY) {
  console.error('❌ VITE_JUDGE0_API_KEY environment variable is required');
  throw new Error('Judge0 API key not found in environment variables');
}

const createSubmission = async (id, code, stdinput) => {
  console.log('📝 Creating submission:', { id, code, stdinput });

  // Validate required parameters
  if (!id || !code) {
    throw new Error('Language ID and source code are required');
  }

  // Prepare stdin - handle null/undefined/empty values
  const processedStdin = stdinput && stdinput.trim() !== '' ? stdinput.trim() : '';
  
  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: {
      base64_encoded: 'true',
      wait: 'false',
      fields: '*',
    },
    headers: {
      'x-rapidapi-key': KEY,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      language_id: parseInt(id),
      source_code: btoa(code),
      stdin: btoa(processedStdin), // Always encode a string, even if empty
    },
  };

  try {
    console.log('🚀 Sending request to Judge0...');
    const response = await axios.request(options);
    console.log('✅ Response received:', response.data);
    
    const token = response.data.token;
    
    if (token) {
      console.log("🔍 Fetching submission result for token:", token);
      let statusId = 1;
      let attempts = 0;
      const maxAttempts = 10;
      
      while ((statusId === 1 || statusId === 2) && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        let result = await getSubmission(token);
        statusId = result.status_id;
        attempts++;
        
        console.log(`🔄 Attempt ${attempts}: Status = ${result.status.description}`);

        if (statusId === 3) { // Accepted
          let output = result.stdout ? atob(result.stdout) : "No output";
          console.log('✅ Code executed successfully!');
          return { output };
        } else if (statusId > 3) { // Error states
          let errorOutput = result.stderr ? atob(result.stderr) : result.status.description;
          console.log('❌ Execution error:', errorOutput);
          return { output: `Error: ${errorOutput}` };
        }
      }
      
      if (attempts >= maxAttempts) {
        return { output: "Execution timeout - please try again" };
      }
    } else {
      console.error("❌ Error: No token received from Judge0 API.");
      return { output: "Failed to submit code for execution" };
    }
  } catch (error) {
    console.error('❌ Judge0 API Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      return { output: `API Error (${error.response.status}): ${JSON.stringify(error.response.data)}` };
    }
    return { output: `Network Error: ${error.message}` };
  }
};

const getSubmission = async (tokenId) => {
  const options = {
    method: 'GET',
    url: `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}`,
    params: {
      base64_encoded: 'true',
      fields: '*',
    },
    headers: {
      'x-rapidapi-key': KEY,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default createSubmission;
