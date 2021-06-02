import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { countries } from "../common/country";
import Slider from "@material-ui/core/Slider";
import "./Collaboration.scss";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import { MenuItem } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";

function Height({ find, history, location }) {
    const [value, setValue] = React.useState([140, 190]);

    const handleChange = (event, newValue) => {
        event.preventDefault();
        setValue(newValue);
    };

    const handleChangeCommitted = e => {
        e.preventDefault();
        find.set("heightMin", value[0]);
        find.set("heightMax", value[1]);
        history.push(`/collaboration/project/1/L?${find}`);
    };

    return (
        <>
            <h3>Height</h3>
            <Slider
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                step={5}
                marks
                min={140}
                max={190}
                onChangeCommitted={handleChangeCommitted}
            />
        </>
    );
}

// side_nav make query and move to that pgae
function SideNav() {
    let history = useHistory();
    let location = useLocation();
    const [model, setModel] = useState(false);
    const [photographer, setPhotographer] = useState(false);
    const find = new URLSearchParams(location.search);

    const filterSelection = e => {
        e.preventDefault();
        const type = e.target.value;
        //select category
        if (type === "M") {
            find.set("category", "M");
            setModel(true);
            setPhotographer(false);
        } else if (type === "P") {
            find.set("category", "P");
            setModel(false);
            setPhotographer(true);
        } else {
            find.set("category", "");
            setModel(false);
            setPhotographer(false);
        }
        history.push(`/collaboration/project/1/L?${find}`);
    };

    const handleChange = e => {
        e.preventDefault();
        find.set(e.target.name, e.target.value);
        history.push(`/collaboration/project/1/L?${find}`);
    };

    const useStyles = makeStyles(() => ({
        item: {
            width: "100%"
        }
    }));

    const classes = useStyles();

    return (
        <div className="side_nav">
            <div className="side_nav_item">
                <h3>Job Type</h3>
                <FormControl variant="filled" className={classes.item}>
                    <InputLabel id="category">Job Type</InputLabel>
                    <Select labelId="category" onChange={filterSelection} name="category" value={find.get("category")}>
                        <MenuItem value="A">All</MenuItem>
                        <MenuItem value="M">Model</MenuItem>
                        <MenuItem value="P">Photographer</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="side_nav_item">
                <h3>Country</h3>
                <FormControl variant="filled" className={classes.item}>
                    <InputLabel id="country">Country</InputLabel>
                    <Select labelId="country" onChange={handleChange} name="country" value={find.get("country")}>
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {countries.map((elem, index) => (
                            <MenuItem value={elem.name} key={index}>
                                {elem.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className={model ? "model_filter active" : "model_filter"}>
                <div className="side_nav_item">
                    <h3>Gender</h3>
                    <FormControl variant="filled" className={classes.item}>
                        <InputLabel htmlFor="gender">Gender</InputLabel>
                        <Select labelId="gender" onChange={handleChange} name="gender" value={find.get("gender")}>
                            <MenuItem value="">Gender</MenuItem>
                            <MenuItem value="F">Female</MenuItem>
                            <MenuItem value="M">Male</MenuItem>
                            <MenuItem value="N">Not on the list</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="side_nav_item">
                    <Height find={find} history={history} location={location} />
                </div>
            </div>
            <div className={photographer ? "photographer_filter active" : "photographer_filter"}></div>
        </div>
    );
}

export default SideNav;
