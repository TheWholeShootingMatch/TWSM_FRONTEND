import React, {useEffect} from "react";
import axios from "axios";

function MainPage(){

    useEffect(() => {
        const response = async() => {
            const result = await axios({
                method: 'get',
                withCredentials : true,
                url : '/api/index'
            });
            console.log(result.data);
        }; 
        response();
    },[]);

    return(
        <div>
            hello world!
        </div>
    )
}

export default MainPage;