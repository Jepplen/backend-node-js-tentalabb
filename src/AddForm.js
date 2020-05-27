import React, {useReducer} from "react";
import axios from "axios";
import "./App.css";
const URL = "/api";

export default function AddForm(props){
  const [userInput, updateUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      title: "",
      description: ""
    }
  );

  function onClick(e){
    e.stopPropagation();
  }

  function onChange(e){
    const name = e.target.name;
    const value = e.target.value;
    updateUserInput({[name]: value});
  }

  function onSubmit(e){
    e.preventDefault();
    let item =
      {
        title: userInput.title,
        description: userInput.description,
        date_created: Date.now(),
        current_list: "unassigned"
      };
    let itemJSON = JSON.stringify(item);
    axios.post(URL + "/items", itemJSON, {
      headers: {
        "Content-Type": "application/json"
      }})
      .then(function() {
        props.getAll();
        props.updateShouldAdd(false);
    })
    .catch(err => {
      console.error(err);
    });
  }

  return(
    <div className="mask" onClick={() => props.updateShouldAdd(false)}>
      <div className="addForm" onClick={onClick}>
        <p className="addForm__title">Add new item</p>
        <form onSubmit={onSubmit}>
          <div className="AddForm__element">Title
            <input className="addForm__input__title" type="text" name="title" onChange={onChange} value={userInput.title} required/>
          </div>
          <div className="AddForm__element">Description
            <textarea className="addForm__input__description" name="description" onChange={onChange} value={userInput.description} />
          </div>
          <button className="popup__button" type="submit">Ok</button>
          <button className="popup__button" onClick={() => props.updateShouldAdd(false)}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
