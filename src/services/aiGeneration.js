import axios from "axios";

const host="http://localhost:5000/v2/ai"

const fetchTextGeneration=async(text,url)=>{
    try {
        const response = await axios.post(`${host}/${url}`, {
            content:text,
          });
         
        return response.data;
    } catch (error) {
        return error;
    }
}

export {fetchTextGeneration}