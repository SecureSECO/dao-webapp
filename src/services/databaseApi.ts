import axios from 'axios';

const API_URL = 'http://api.placeholder.com';

function createRequestString(identifier: string, data: string): string {
    const dataLength = data.length;
    return `${identifier}${dataLength}${data}`
}

export async function getAuthor(authorId: string): Promise<string> {
    try{
        const requestData = createRequestString('idau', authorId);

        const response = await axios.post(API_URL, requestData);

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function uploadProject(projectData: string): Promise<string>{
    try{
        const requestData = createRequestString('upld', projectData);

        const response = await axios.post(API_URL, requestData);

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
