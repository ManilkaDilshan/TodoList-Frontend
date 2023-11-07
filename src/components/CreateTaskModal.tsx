import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup } from 'reactstrap';
import axios from "axios";
import { toast } from 'react-toastify';

const CreateTaskModal = ({ modal, toggle, setTaskList }: any) => {
    const [taskTitle, setTaskTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('#ff0084');
    const [taskTitleError, setTaskTitleError] = useState<string>('');
    const [descriptionError, setDescriptionError] = useState<string>('');

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setTaskTitleError('');
        setDescriptionError('');

        const newTask = {
            title: taskTitle,
            description: description,
            color: selectedColor
        };

        const headers = {
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post("/api/item", newTask, { headers });
            if (response.data) {
                setTaskList(response.data);
                setTaskTitle('');
                setDescription('');
                toggle();
                toast.success("Task Added!");
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
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.target.value);
        setTaskTitleError('');
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        setDescriptionError('');
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedColor(e.target.value);
    };

    return (
        <>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Create Task</ModalHeader>
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
                    <FormGroup className="mt-3">
                        <label>Color</label>
                        <input
                            type="radio"
                            name="color"
                            value="#ff0084"
                            className='red-input color-input'
                            checked={selectedColor === '#ff0084'}
                            onChange={handleColorChange}
                        />
                        <input
                            type="radio"
                            name="color"
                            value="#33ffe0"
                            className='blue-input color-input'
                            checked={selectedColor === '#33ffe0'}
                            onChange={handleColorChange}
                        />
                        <input
                            type="radio"
                            name="color"
                            value="#4fff7e"
                            className='green-input color-input'
                            checked={selectedColor === '#4fff7e'}
                            onChange={handleColorChange}
                        />
                        <input
                            type="radio"
                            name="color"
                            value="#aa3bff"
                            className='purple-input color-input'
                            checked={selectedColor === '#aa3bff'}
                            onChange={handleColorChange}
                        />
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSave}>
                        Create
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default CreateTaskModal;
