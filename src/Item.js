import React, {useState, useEffect} from "react";
import axios from "axios";
import ForwardIcon from "@material-ui/icons/Forward";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import "./App.css";
const URL = "/api/api";


export default function Item(props) {
  const [up, updateUp] = useState("");
  const [down, updateDown] = useState("");

  useEffect(() => {
    if (props.currentList === "unassigned"){
      updateUp("in_progress");
    } else if (props.currentList === "in_progress") {
      updateUp("done");
      updateDown("unassigned");
    } else if(props.currentList === "done"){
      updateDown("in_progress");
    }

  }, [props.currentList] );

  function convertTitleIntoPreview(str){
    let title = props.title;
    if (title.length > 18) {
      title = title.substring(0, 17) + "...";
    }
    return title;
  }

  function convertDescriptionIntoPreview(str){
    let description = props.description;
    if (!description) {
      description = "no description."
    }

    if (description.length > 20) {
      description = description.substring(0, 19) + "...";
    }
    return description;
  }

  function convertTimestampToReadable(num) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = new Date(num);

    let year = date.getFullYear().toString();
    let month = months[date.getMonth()];
    let day = days[date.getDay()];
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    let seconds = date.getSeconds().toString();

    if (hours.length < 2){ hours = "0" + hours; }
    if (minutes.length < 2){ minutes = "0" + minutes; }
    if (seconds.length < 2){ seconds = "0" + seconds; }

    const readableDate = year + " " + month + " " + day + " " + hours  + ":" + minutes  + ":" + seconds;
    return readableDate;
  }

  function moveUp(){
    axios.patch(URL + "/item/" + props.id, {current_list: up})
      .then(function (response) {
        props.getAll();
    })
    .catch(err => {
      console.error(err);
    });
  }

  function moveDown(){
    axios.patch(URL + "/item/" + props.id, {current_list: down})
      .then(function (response) {
        props.getAll();
    })
    .catch(err => {
      console.error(err);
    });
  }

  function deleteItem(id){
    axios.delete(URL + "/item/" + id)
      .then(function(response) {
        props.getAll();
    })
    .catch(err => {
      console.error(err);
    });
  }

  function onClick(){
    props.updateShouldEdit(true);
    const item = {
      id: props.id,
      title: props.title,
      description: props.description
    };
    props.updateLocalItem(item);
  }

  const title = convertTitleIntoPreview(props.title)
  const description = convertDescriptionIntoPreview(props.description);
  const date = convertTimestampToReadable(props.dateCreated);

  return(
    <div className="item">
      <div className="item__header">
        <p className="item__title_text">{title}</p>
      </div>
      <div className="item__body">
        <p className="item__body_description">{description}</p>
        <button className="item__body__buttonMore" onClick={() => props.itemDetails(props.title, props.description)}>
          <MenuBookIcon style={{ fontSize: 20 }} className="MenuBookIcon"/>
        </button>
        <button className="item__body__buttonMore" onClick={onClick}>
          <EditIcon style={{ fontSize: 20 }} className="EditIcon"/>
        </button>
        <button className="item__body__buttonMore" onClick={() => deleteItem(props.id)}>
          <DeleteIcon style={{ fontSize: 20 }} className="TrashcanIcon"/>
        </button>
        <p className="item__body__date">{date}</p>
      </div>
      {up && <button className="item__button__up" onClick={moveUp}><ForwardIcon style={{ fontSize: 35 }} className="forwardIcon"/></button>}
      {down && <button className="item__button__down" onClick={moveDown}><ForwardIcon style={{ fontSize: 35 }} className="backIcon"/></button>}
    </div>
  );
}
