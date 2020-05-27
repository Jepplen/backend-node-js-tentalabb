import React, {useReducer} from "react";
import axios from "axios";
import "./App.css";
const URL = "/api";

export default function EditForm(props){
  const [userInput, updateUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      id: props.localItem.id,
      title: props.localItem.title,
      description: props.localItem.description
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
        description: userInput.description
      };

    let itemJSON = JSON.stringify(item);

    axios.patch(URL + "/item/" + userInput.id, itemJSON, {
      headers: {
        "Content-Type": "application/json"
      }})
      .then(function() {
        props.getAll();
        props.updateShouldEdit(false);
      })
      .catch(err => {
        console.error(err);
    });
  }

  return(
    <div className="mask" onClick={() => props.updateShouldEdit(false)}>
      <div className="editForm" onClick={onClick}>
        <p className="editForm__title">Edit item</p>
        <form onSubmit={onSubmit}>
          <div className="editForm__element">Title
            <input className="editForm__input__title" type="text" name="title" onChange={onChange} value={userInput.title} required/>
          </div>
          <div className="editForm__labels">Description
            <textarea className="editForm__input__description" name="description" onChange={onChange} value={userInput.description} />
          </div>
          <button className="popup__button" type="submit">Ok</button>
          <button className="popup__button" onClick={() => props.updateShouldEdit(false)}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
