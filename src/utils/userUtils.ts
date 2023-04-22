import axios from 'axios'

export class UserUtils {

    private GET_USER_BY_DISCORD = "/user/getByDiscord";
    private API_KEY_DEFINITION = "apikey";
    private API_URL;
    private API_KEY;

    constructor(apiurl : string, apikey : string|undefined) {
        this.API_URL = apiurl;
        if(apikey) this.API_KEY = apikey;
    }

    public async getUserWalletByDiscordId(userId : string) : Promise<string|undefined> {
        let response = await axios.get(`${this.API_URL}${this.GET_USER_BY_DISCORD}/${userId}${this.API_KEY ? `?${this.API_KEY_DEFINITION}=${this.API_KEY}` : ''}`);
        if(JSON.stringify(response.data).length > 0) {
            if(response.data.data) {
                if(response.data.data.walletAddress) {
                    if(response.data.data.walletAddress.length > 0) {
                        return response.data.data.walletAddress;
                    }
                }
            }
        }
        return undefined;
    }
  }