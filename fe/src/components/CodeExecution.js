import axios from 'axios';
const KEY = process.env.judge0ApiKey;
const  createSubmission = async(id,code,stdinput)=>{
  console.log(id,code,stdinput)

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
          base64_encoded: 'true',
          wait: 'false',
          fields: '*'
        },
        headers: {
          'x-rapidapi-key': KEY,
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          language_id: id,
          source_code: btoa(code),
          stdin: btoa(stdinput),
        }
      };
      
      try {
          const response = await axios.request(options);
          // console.log(response.data);
          const token = response.data.token;
          if (token) {
            console.log("Fetching submission result for token:", token);
            let statusId=1;
            while(statusId===1 || statusId===2){
              let result = await getSubmission(token);
              // console.log(result);
              statusId = result.status_id;
              // console.log(result.status);
              if (result.status.description === 'Accepted') {
                let output = result.stdout ? atob(result.stdout) : "No output";
                return { output };
              }
              
            }
            
          } else {
            console.error("Error: No token received from Judge0 API.");
          }
      } catch (error) {
          console.error(error);
      }
}

const getSubmission = async(tokendId)=>{

  const options = {
    method: 'GET',
    url: `https://judge0-ce.p.rapidapi.com/submissions/${tokendId}`,
    params: {
      base64_encoded: 'true',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': KEY,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }

}

export default createSubmission;