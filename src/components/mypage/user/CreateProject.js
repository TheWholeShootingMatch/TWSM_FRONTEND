import React, {useState} from "react";
import UserMyPage from "../common/MyPage";
import axios from "axios";

function CreateProject({ isLogin }) {
    console.log(isLogin);
    return(
        <UserMyPage user="user" header="Create Project" isLogin={isLogin}>
            <ProjectForm/>
        </UserMyPage>
    )
}

function ProjectForm() {

    const [formData, setForm] = useState({
        title: "",
        description: ""
    })

    const [loading, setLoading] = useState(false);

    const { title, description } = formData;

    const onChangeForm = (e) => {
        const { name, value } = e.target;
        setForm({
            ...formData,
            [name]: value
        });
    }
    
    const onSubmitForm = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post('/api/tct', formData, {
            withCredentials: true,
        }).then(res => {
            console.log(res.data);
        });
        setLoading(false);
    };

    if (loading) return (<div>loading...</div>);
    return(
    <form>
        <div className="title">
            <h3>title</h3>
                <input onChange={onChangeForm} name="title" value={title}/>
        </div>
        <div className="description">
            <h3>description</h3>
                <input onChange={onChangeForm} name="description" value={description}/>
        </div>
        <div className="collaboration">
            <h3>collaboration</h3>
            <details>
            <summary>members</summary>
            <div className="details-menu">
                search memebers
            </div>
            </details>
        </div>
        <button type="button" onClick={onSubmitForm}>Send request</button>
    </form>                    
    )
}

export default CreateProject;
