import { useEffect, useState } from "react";
import TaskCard from "./components/TaskCard";
import CreateTaskModal from "./components/CreateTaskModal";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Row } from 'reactstrap';

interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  const [modal, setModal] = useState<boolean>(false);
  const [taskList, setTaskList] = useState<Task[]>([]);

  const toggle = () => {
    setModal(!modal);
  }

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/item");
      setTaskList(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteTask = async (id: number) => {
    try {
      const response = await axios.delete(`/api/item/${id}`);
      if (response) {
        setTaskList(response.data);
        toast.success("Task Deleted");
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error(error.message);
        }
      }
    }
  }

  const updateListArray = (updatedTask: Task) => {
    setTaskList(prevTaskList => prevTaskList.map(task => {
      if (task.id === updatedTask.id) {
        return { ...task, ...updatedTask };
      }
      return task;
    }));
  }

  return (
    <div className="container">
      <div className="header text-center">
        <h2>Todo List</h2>
        <button className="create-btn" onClick={toggle}>Create Task</button>
      </div>
      <Row className="custom-row">
        {taskList.length === 0 && <div className="text-center mt-5 text-white">Add Tasks Todo 🙌</div>}
        {taskList && taskList.slice()
          .sort((a, b) => (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? -1 : 1).map((task, index) => (
            <Col key={index} md={12} style={{ marginBottom: "30px" }}>
              <TaskCard
                taskObj={task}
                index={index}
                deleteTask={deleteTask}
                updateListArray={updateListArray}
              />
            </Col>
          ))}
      </Row>
      <CreateTaskModal toggle={toggle} modal={modal} setTaskList={setTaskList} />
      <ToastContainer />
    </div>
  )
}

export default App;
