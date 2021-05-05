import React, {useState} from "react";
import UserMyPage from "../common/MyPage";
import axios from "axios";

import "./CreateProject.css";

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
        formData.user = usr;
        axios.post('/api/project', formData, {
            withCredentials: true,
        }).then(res => {
            console.log(res.data);
        });
        setLoading(false);
    };

    const [inputs, setInputs] = useState("");

    const handleChange = (e) => {
      const { value, name } = e.target;
      setInputs({
        ...inputs, value
      });
    };

    const [usr, setUsr] = useState([]);

    const handleAdd = (e) => {
      console.log(inputs);
      setUsr((usr) => [...usr, inputs.value]);
    };

    if (loading) return (<div>loading...</div>);
    return(
    <form>
        <div className="title">
            <h3>Title</h3>
                <input onChange={onChangeForm} name="title" value={title}/>
        </div>
        <div className="description">
            <h3>Description</h3>
                <input onChange={onChangeForm} name="description" value={description}/>
        </div>
        <div className="collaboration">
            <h3>Collaboration</h3>
                <p>search memebers</p>
                {
                  usr.map((elem,index) => <li key={index}>{elem}</li>)
                }
                <input
                    type="text"
                    name="id"
                    placeholder="Enter the ID"
                    onChange={handleChange}
                />
                <button type="button" onClick={handleAdd}>add</button>
        </div>
        <button type="button" onClick={onSubmitForm}>Send request</button>
    </form>
    )
}

export default CreateProject;
