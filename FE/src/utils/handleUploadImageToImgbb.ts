import axios from "axios";

export default async function handleUpdateImageToImgbb(formdata: FormData) {
    try {
        const apiEndPoint = import.meta.env.VITE_IMGBB_END_POINT;
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        const response = await axios.post(
            `${apiEndPoint}?key=${apiKey}`,
            formdata,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.data.url;
    } catch (error) {
        console.log(error);
    }
}
