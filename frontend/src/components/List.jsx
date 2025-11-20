import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/list.css";

export default function List() {
  const [taskData, setTaskData] = useState();
  const [selectedTask, setSelectedTask] = useState([]);

  useEffect(() => {
    getListData();
  }, []);

  const selectAll = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      let items = taskData.map((item) => item._id);
      setSelectedTask(items);
    } else {
      setSelectedTask([]);
    }
  };

  const getListData = async () => {
    let list = await fetch("http://localhost:3200/tasks", {
      credentials: "include",
    });
    list = await list.json();
    if (list.success) {
      setTaskData(list.result);
    } else {
      alert("Try after sometime");
    }
  };

  const deleteTask = async (id) => {
    let item = await fetch("http://localhost:3200/delete/" + id, {
      method: "delete",
      credentials: "include",
    });
    item = await item.json();
    if (item.success) {
      getListData();
    } else {
      alert("Try after sometime");
    }
  };

  const selectSingleItem = (id) => {
    console.log(id);
    if (selectedTask.includes(id)) {
      let items = selectedTask.filter((item) => item != id);
      setSelectedTask([items]);
    } else {
      setSelectedTask([...selectedTask, id]);
    }
  };

  const deleteMultiple = async () => {
    console.log(selectedTask);
    let item = await fetch("http://localhost:3200/delete-multiple/", {
      method: "delete",
      credentials: "include",
      body: JSON.stringify(selectedTask),
      headers: {
        "Content-Type": "application/json",
      },
    });
    item = await item.json();
    if (item.success) {
      getListData();
    } else {
      alert("Try after sometime");
    }
  };

  return (
    <div className="list-container">
      <h1>to do list</h1>
      <button onClick={deleteMultiple} className="deleteBtn delete-multiple">
        Delete
      </button>
      <ul className="task-list">
        <li className="list-header">
          <input onChange={selectAll} type="checkbox" />
        </li>
        <li className="list-header">S.No</li>
        <li className="list-header">Title</li>
        <li className="list-header">Description</li>
        <li className="list-header">Action</li>

        {taskData &&
          taskData.map((item, index) => (
            <Fragment key={item._id}>
              <li className="list-item">
                <input
                  onChange={() => selectSingleItem(item._id)}
                  checked={selectedTask.includes(item._id)}
                  type="checkbox"
                />
              </li>
              <li className="list-item">{index + 1}</li>
              <li className="list-item">{item.title}</li>
              <li className="list-item">{item.description}</li>
              <li className="list-item">
                <button
                  onClick={() => deleteTask(item._id)}
                  className="deleteBtn"
                >
                  Delete
                </button>
                <Link to={"update/" + item._id} className="updateBtn">
                  Update
                </Link>
              </li>
            </Fragment>
          ))}
      </ul>
    </div>
  );
}
