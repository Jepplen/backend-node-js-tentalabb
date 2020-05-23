import React, {useState, useEffect} from "react";
import './App.css';


export default function Hickup(props){
  const [source, updateSource] = useState("");

  function delay(seconds, count) {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve(count);
      }, seconds * 1000);
    })
  }

  useEffect(() => {
    delay(0.5, 1)
      .then(function(count) {
        count = count - count + 1;
        updateSource("/background_cursor_on.png");
        count++;
        return delay(0.5, count)
      })
      .then(function(count) {
        updateSource("/background.png");
        count++;
        return delay(0.5, count);
      })
      .then(function(count) {
        updateSource("/background.png");
        count++;
        return delay(0.5, count);
      })
      .then(function(count) {
        updateSource("/background_cursor_on.png");
        count++;
        return delay(0.2, count);
      })
      .then(function(count) {
        updateSource("/background_text_1.png");
        count++;
        return delay(0.4, count);
      })
      .then(function(count) {
        updateSource("/background_text_2.png");
        count++;
        return delay(0.3, count);
      })
      .then(function(count) {
        return delay(1, count);
      })
      .then(function(count) {
        props.closePre(false);
        setTimeout(function() {
        props.startProgressBar(true);
        }, 1000);
      })
      .catch(function(err) {
        console.error(err);
    });
  }, [] );

  return(
    <div className="hickup">
      {source && <img src={source} alt="terminal" />}
    </div>
  );
}
