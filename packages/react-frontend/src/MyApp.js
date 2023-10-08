// src/MyApp.js
import React, {useState, useEffect} from "react";
import Table from "./Table";
import Form from './Form';


function MyApp() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  function removeOneCharacter (index) {
    const id = characters[index].id;
    removeUser(id).then((response) => {
      if(response.status === 204){
        const updated = characters.filter((character, i) => {
          return i !== index
        });
        setCharacters(updated);
      }
      else if(response.status === 404){
        console.log("Resource not found");
      }
    })
    .catch((error) => { console.log(error); });
  }

  function removeUser(id){
    const total_string = "http://localhost:8000/users/" + id;
    const promise = fetch(total_string, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return promise;
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function updateList(person) { 
    postUser(person)
      .then((response) => {
        if(response.status === 201){
          response.json().then((updated) => {
            setCharacters([...characters, updated]);
          })
        }      
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <div className="container">
      <Table characterData={characters} 
        removeCharacter={removeOneCharacter} />
      <Form handleSubmit = {updateList}/>
    </div>
  )
}

export default MyApp;