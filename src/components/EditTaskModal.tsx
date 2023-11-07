import { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from "axios";
import { toast } from 'react-toastify';

const EditTaskModal = ({ modal, toggle, updateTask, taskObj }: any) => {
    const [taskTitle, setTaskTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [taskTitleError, setTaskTitleError] = useState<string>('');
    const [descriptionError, setDescriptionError] = useState<string>('');

    useEffect(() => {
        setTaskTitle(taskObj.title);
        setDescription(taskObj.description);
    }, [taskObj]);

    const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setTaskTitleError('');
        setDescriptionError('');

        const updatedTask = {
            title: taskTitle,
            description: description,
            color: taskObj.color,
            isCompleted: taskObj.isCompleted,
        };

        const headers = {
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.put(`/api/item/${taskObj.id}`, updatedTask, { headers });
            if (response.data) {
                updateTask(response.data);
                toggle();
                toast.success("Task Updated!");
            }
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data.errors) {
                    if (error.response.data.errors.Title) {
                        setTaskTitleError(error.response.data.errors.Title);
                    }
                    if (error.response.data.errors.Description) {
                        setDescriptionError(error.response.data.errors.Description);
                    }
                } else {
                    toast.error(error.message);
                }
            }
        }

    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.target.value);
        setTaskTitleError('');
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        setDescriptionError('');
    };

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Update Task</ModalHeader>
            <ModalBody>
                <div className="form-group">
                    <label>Task Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={taskTitle}
                        onChange={handleTitleChange}
                        name="title" />
                    {taskTitleError && <div className="text-danger">{taskTitleError}</div>}
                </div>
                <div className="form-group mt-3">
                    <label>Description</label>
                    <textarea
                        rows={5}
                        className="form-control"
                        value={description}
                        onChange={handleDescriptionChange}
                        name="description">
                    </textarea>
                    {descriptionError && <div className="text-danger">{descriptionError}</div>}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleUpdate}>Update</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};

export default EditTaskModal;
