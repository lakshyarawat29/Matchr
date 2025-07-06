const axios = require('axios');
exports.parseResume = async(file) => {
  const formData = new FormData();
  formData.append('file',file.buffer,file.originalname);

  const response = await axios.post('http://localhost:8001/parse-resume',formData,{
    headers: formData.getHeaders(),
  });

  return response.data;
}