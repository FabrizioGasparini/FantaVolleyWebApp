import axios from 'axios';

const removeBackground = async (imageUrl) => {
    try {
        console.log(imageUrl)
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', {
            image_url: imageUrl,
            size: 'regular',
        },{
            headers: {
                'X-Api-Key': 'Y9TvAuxppx2gHUnPGVdzTWt1', // Replace with your actual API key
                'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
        });
        
        const base64 = btoa(
            new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
            ),
        );
        return(`data:image/png;base64,${base64}`);
    } catch (error) {
        return error
    }
};

export default removeBackground;
