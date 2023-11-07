import { useState } from 'react';
import EditTaskModal from './EditTaskModal';
import { FaTrash, FaEdit, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { Card } from 'reactstrap';
import axios from "axios";
import { toast } from 'react-toastify';


const TaskCard = ({ taskObj, deleteTask, updateListArray }: any) => {
    const [modal, setModal] = useState<boolean>(false);


    const disabledColor = {
        primaryColor: "rgb(140, 140, 140)",
        secondaryColor: "rgb(140, 140, 140, 0.1)",
    }

    const toggle = () => {
        setModal(!modal);
    };

    const updateTask = (obj: any) => {
        updateListArray(obj);
    };

    const handleDelete = () => {
        deleteTask(taskObj.id);
    };

    const handleStatus = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const updatedTask = {
            title: taskObj.title,
            description: taskObj.description,
            isCompleted: !taskObj.isCompleted,
            color: taskObj.color
        };

        const headers = {
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.put(`/api/item/${taskObj.id}`, updatedTask, { headers });
            if (response.data) {
                updateListArray(response.data);
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

    return (
        <Card className="card-wrapper" style={{
            borderTop: `5px solid ${taskObj.isCompleted ? disabledColor.primaryColor : taskObj.color}`,
            backgroundColor: taskObj.isCompleted ? disabledColor.secondaryColor : `${taskObj.color}1a`,
        }}>
            <div className="task-holder">
                <div className="card-header d-flex justify-content-between">
                    <h5 style={{ color: taskObj.isCompleted ? disabledColor.primaryColor : taskObj.color }}>
                        {taskObj.title}
                    </h5>
                    {taskObj && taskObj.isCompleted === false ?
                        <FaToggleOn
                            style={{ color: taskObj.color, fontSize: "25px", cursor: "pointer" }}
                            onClick={handleStatus}
                        />
                        : <FaToggleOff
                            style={{ color: disabledColor.primaryColor, fontSize: "25px", cursor: "pointer" }}
                            onClick={handleStatus}
                        />
                    }
                </div>
                <p className="mt-3">{taskObj.description}</p>

                <div style={{ position: "absolute", right: "20px", bottom: "20px" }}>
                    {!taskObj.isCompleted &&
                        <FaEdit
                            style={{ color: taskObj.color, cursor: "pointer", marginRight: "12px" }}
                            onClick={() => setModal(true)}
                        />
                    }
                    <FaTrash
                        style={{ color: taskObj.isCompleted ? disabledColor.primaryColor : taskObj.color, cursor: "pointer" }}
                        onClick={handleDelete}
                    />
                </div>
            </div>
            <EditTaskModal modal={modal} toggle={toggle} updateTask={updateTask} taskObj={taskObj} />
        </Card>
    );
};

export default TaskCard;
