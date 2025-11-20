import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/addtask.css";

function AddTask() {
  const [taskData, setTaskData] = useState();
  const navigate = useNavigate();
  const handleAddTask = async () => {
    console.log(taskData);
    let result = await fetch("http://localhost:3200/add-task", {
      method: "Post",
      body: JSON.stringify(taskData),
      credentials: "include",
      headers: {
        "Content-Type": "Application/Json",
      },
    });
    result = await result.json();
    if (result.success) {
      navigate("/");
      console.log("new task added");
    } else {
      alert("try after sometime");
    }
  };
  return (
    <div className="container">
      <h1>add new Task</h1>

      <label htmlFor="">Title</label>
      <input
        onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
        type="text"
        name="title"
        placeholder="Enter task title"
      />
      <label htmlFor="">Description</label>
      <textarea
        onChange={(e) =>
          setTaskData({ ...taskData, description: e.target.value })
        }
        rows={4}
        name="description"
        placeholder="Enter Task description"
      ></textarea>
      <button onClick={handleAddTask} className="submit">
        Add New Task
      </button>
    </div>
  );
}

export default AddTask;
