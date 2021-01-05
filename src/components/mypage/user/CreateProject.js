import React from "react";
import UserMyPage from "../common/MyPage"

function CreateProject(){
    return(
        <UserMyPage user="user" header="Create Project">
            <ProjectForm/>
        </UserMyPage>
    )
}

function ProjectForm(){
    return(
    <form>
        <div className="title">
            <h3>title</h3>
            <input />
        </div>
        <div className="description">
            <h3>description</h3>
            <input />
        </div>
        <div class="collaboration">
            <h3>collaboration</h3>
            <details>
            <summary>members</summary>
            <div className="details-menu">
                search memebers
            </div>
            </details>
        </div>
        <button type="submit">Send request</button>
    </form>                    
    )
}

export default CreateProject;