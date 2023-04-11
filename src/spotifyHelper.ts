import { Axios } from "axios";
import axios from 'axios';
import _ from 'lodash';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const axiosClient: Axios = axios.create();

interface authToken {
    access_token: string,
    token_type: string,
    expires_in: number
}

async function getAccessToken(): Promise<authToken> {
    const authBase64: string = new Buffer(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    console.log('aut64 string: ' + authBase64);
    const response: authToken = await axiosClient.post(
        "https://accounts.spotify.com/api/token",
        { grant_type: 'client_credentials' },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authBase64}`
            }
        }
    )
    .then(response => { return response.data })
    .catch(error => {
            console.log("post wont work")
            console.log(error)
    });

    console.log('Before returining ' + JSON.stringify(response));
    
    return response;
}



export const getTrackIdFromUrl = (trackUrl: string) => {
    return trackUrl.slice(trackUrl.lastIndexOf('/') + 1, trackUrl.indexOf('?'));
}

export async function getTrackUrlRequest(trackId: string): Promise<string> {
    const requestUrl = `https://api.spotify.com/v1/tracks/${trackId}`;
    const accessToken = await getAccessToken();

    const response = await axiosClient.get(requestUrl, {
        headers: {
            Authorization: `${accessToken.token_type} ${accessToken.access_token}`
        }
    });
    return response.data.external_urls.spotify;
}







