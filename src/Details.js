import React, {useState, useEffect} from "react";
import "./App.css";

function onClick(e){
  e.stopPropagation();
}

export default function Details(props) {
 const [description, updateDescription] = useState(props.moreDetails.description);

  useEffect(() => {
    if (!props.moreDetails.description){
      updateDescription("This item has no description.");
    }
  }, [props.moreDetails.description] );

  return(
    <div className="mask" onClick={() => props.closeDetails("")}>
      <div className="details" onClick={onClick}>
        <p className="details__title">{props.moreDetails.title}</p>
        <p className="details__description">{description}</p>
        <button className="popup__button" onClick={() => props.closeDetails("")}>Ok</button>
      </div>
    </div>
  );
}
