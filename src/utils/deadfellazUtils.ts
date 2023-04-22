import axios from 'axios'

export class DeadfellazUtils {

    private static TOTAL_PROJECTS_IN_COLLECTION : number = 2;
    private static IPFS_URL : string = "https://ipfs.io/ipfs";
    private static DEADFELLAZ_METADATA_URL : string = `${this.IPFS_URL}/bafybeiaad7jp7bsk2fubp4wmks56yxevoz7ywst5fd4gqdschuqonpd2ee`;
    private static DEADFELLAZ_MIN : number = 1;
    private static DEADFELLAZ_MAX : number = 10000;
    private static FRENZ_METADATA_URL : string = "https://frenz.deadfellaz.io/api/collectible";
    private static FRENZ_MIN : number = 1;
    private static FRENZ_MAX : number = 13000;

    public static async getDeadfellazImageURL(tokenId : number) : Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.get(`${this.DEADFELLAZ_METADATA_URL}/${tokenId}`);
                let imageURL = (response.data.image) ? response.data.image : "";
                let imageURLRewrite = await this.rewrtePinataURL(imageURL);
                resolve(imageURLRewrite);
            } catch(error) {
                reject(error);
            }
        })
    }

    public static async getFrenzImageURL(tokenId : number) : Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.get(`${this.FRENZ_METADATA_URL}/${tokenId}`);
                let imageURL = (response.data.image) ? response.data.image : "";
                let imageURLRewrite = await this.rewriteIPFSURL(imageURL);
                resolve(imageURLRewrite);
            } catch(error) {
                reject(error);
            }
        })
    }

    public static async rewriteIPFSURL(url : string) : Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                let newURL = url.replace("ipfs:/", this.IPFS_URL);
                resolve(newURL);
            } catch(error) {
                reject(error);
            }
        })
    }

    public static async rewrtePinataURL(url : string) : Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                if(url.startsWith("ipfs://")) resolve(url);
                let newURL = url.replace("https://gateway.pinata.cloud/ipfs", this.IPFS_URL);
                resolve(newURL);
            } catch(error) {
                reject(error);
            }
        })
    }

    public static async getRandomProject() {
        let randCollection = Math.floor(Math.random() * (this.TOTAL_PROJECTS_IN_COLLECTION - 1 + 1) + 1);
        console.log(`Random collection: ${randCollection}`);
        // return randCollection;
        // for now
        return 1;
    }

    public static async getRandomTokenId(project : number) : Promise<number> {
        let randTokenId = 0;
        switch(project) {
            case 1:
                randTokenId = Math.floor(Math.random() * (this.DEADFELLAZ_MAX - this.DEADFELLAZ_MIN + 1) + this.DEADFELLAZ_MIN);
                break;
            case 2:
                randTokenId = Math.floor(Math.random() * (this.FRENZ_MAX - this.FRENZ_MIN + 1) + this.FRENZ_MIN);
                break;
        }
        return randTokenId;
    }

    public static async getImageURLFromProjectIdAndTokenId(project : number, tokenId : number) : Promise<string> {
        return new Promise(async (resolve, reject) => { 
            try {
                let imageURL = "";
                switch(project) {
                    case 1:
                        imageURL = await this.getDeadfellazImageURL(tokenId);
                        break;
                    case 2:
                        imageURL = await this.getFrenzImageURL(tokenId);
                        break;
                }
                console.log(`Image URL: ${imageURL}`)
                resolve(imageURL);
            } catch(error) {
                console.log(error);
                reject(error);
            }
        });
    }
}