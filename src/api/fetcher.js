import apiConfig from "./apiConfig";

const baseUrl = apiConfig.baseUrl;

export default {
    fetch : async (url, method, data) => {
        let headers = new Headers({
            'content-type': 'application/json',
        })
        let fetchData = {
            method: method,
            headers,
            credentials: 'include' 
        }
        if(data){
            fetchData.body = data;
        }
        return await fetch(`${baseUrl}${url}`, fetchData);
    }
}