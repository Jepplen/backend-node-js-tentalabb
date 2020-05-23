import React, {useState, useEffect} from "react";
import axios from "axios";
import Item from "./Item";
import Details from "./Details";
import AddForm from "./AddForm";
import EditForm from "./EditForm";
import Hickup from "./Hickup";
import Progress from "./Progress";
import './App.css';
const URL = "/api/api";

export default function App() {
  const [items, updateItems] = useState([]);
  const [admin, updateAdmin] = useState("");
  const [details, updateDetails] = useState("");
  const [shouldAdd, updateShouldAdd] = useState(false);
  const [shouldEdit, updateShouldEdit] = useState(false);
  const [shouldDeleteAllPre, updateShouldDeleteAllPre] = useState(false);
  const [shouldDeleteAll, updateShouldDeleteAll] = useState(false);
  const [localItem, updateLocalItem] = useState({});

  useEffect(() => {
    getAll();
  }, [] );

  function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  function getAll(){
    axios.get(URL + "/all")
      .then(function (response) {
        let data = response.data;
        if (isJSON(data)){
          data = JSON.parse(data);
        }
        updateItems(data);
    })
    .catch(err => {
      console.error(err);
    });
  }

  function deleteAll(){
    axios.delete(URL + "/delete/all")
      .then(function (response) {
        let data = response.data;
        if (isJSON(data)){
          data = JSON.parse(data);
        }
        updateAdmin(data);
    })
    .catch(err => {
      console.error(err);
    });
  }

  function deleteAllRun(){
    axios.delete(URL + "/delete/all/" + admin)
      .then(function (response) {
        updateAdmin("");
        getAll();
    })
    .catch(err => {
      console.error(err);
    });
  }

  function setDetails(title, description){
    updateDetails({title: title, description: description});
  }

  return (
    <div className="App">
    <h1 style={{ textAlign: "center", marginTop: "50px", marginBottom: "50px"}}>Salmon List</h1>
      <div className="listWrapper">
        <div className="list unassigned">
          <div className="list__title">
            <p>Unassigned</p>
          </div>
          <div className="list__itemWrapper">
            {items.filter(item => item.current_list === "unassigned").map((item) => {
              return (
                <Item
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  description={item.description}
                  dateCreated={item.date_created}
                  currentList={item.current_list}
                  itemDetails={setDetails}
                  updateShouldEdit={updateShouldEdit}
                  updateLocalItem={updateLocalItem}
                  getAll={getAll}
                />
              );
            })}
          </div>
          <button className="list__addButton" onClick={() => updateShouldAdd(true)}>
            <div className="list__addButton__span">+</div>
          </button>
        </div>
        <div className="list in_progress">
          <div className="list__title">
            <p>In Progress</p>
          </div>
          <div className="list__itemWrapper">
            {items.filter(item => item.current_list === "in_progress").map((item) => {
              return (
                <Item
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  description={item.description}
                  dateCreated={item.date_created}
                  currentList={item.current_list}
                  itemDetails={setDetails}
                  updateShouldEdit={updateShouldEdit}
                  updateLocalItem={updateLocalItem}
                  getAll={getAll}
                />
              );
            })}
          </div>
        </div>
        <div className="list done">
          <div className="list__title">
            <p>Done</p>
          </div>
          <div className="list__itemWrapper">
            {items.filter(item => item.current_list === "done").map((item) => {
              return (
                <Item
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  description={item.description}
                  dateCreated={item.date_created}
                  currentList={item.current_list}
                  itemDetails={setDetails}
                  updateShouldEdit={updateShouldEdit}
                  updateLocalItem={updateLocalItem}
                  getAll={getAll}
                />
              );
            })}
          </div>
        </div>
      </div>
      {!admin && <button className="buttonMain buttonDel" onClick={deleteAll}>Delete all items</button>}
      {admin && <button className="buttonMain buttonDelConf" onClick={() => {updateShouldDeleteAllPre(true)}}>CONFIRM DELETION</button>}
      {admin && <button className="buttonMain buttonDelCancel" onClick={() => updateAdmin("")}>CANCEL</button>}
      {details && <Details closeDetails={updateDetails} moreDetails={details} />}
      {shouldAdd && <AddForm getAll={getAll} updateShouldAdd={updateShouldAdd} />}
      {shouldEdit && <EditForm getAll={getAll} updateShouldEdit={updateShouldEdit} localItem={localItem}/>}
      {shouldDeleteAllPre && <Hickup startProgressBar={updateShouldDeleteAll} closePre={updateShouldDeleteAllPre} />}
      {shouldDeleteAll && <Progress deleteAllRun={deleteAllRun} close={updateShouldDeleteAll}  />}
    </div>
  );
}
