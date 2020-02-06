import React, {useState, useEffect} from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Button,
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';
import {
    getBoard,
    getTasks,
    editTask,
    deleteTask, getTask, createTask,
} from "../services/board-service";
import useUser from "../hooks/useUser";
import TaskForm from "../tasks/TaskForm";

const BoardDetails = (props) => {
    const [board, setBoard] = useState({});
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({});
    const [shouldFetch, setShouldFetch] = useState(true);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const {boardId} = props.match.params;
    const userDetails = useUser();

    useEffect(() => {
        const func = async () => {
            const board = await getBoard(+boardId);
            const tasks = await getTasks(+boardId);

            setLoading(false);
            setBoard(board);
            setTasks(tasks);
        };
        if (shouldFetch) {
            func();
            setShouldFetch(false);
        }
        return () => {
            setShouldFetch(false);
            setLoading(false);
        }
    }, [props.match.params, board, shouldFetch]);

    const getTasksByPhase = () => {
        const tasksByPhase = {};
        board.phases.forEach(phase => {
            tasksByPhase[phase.id] = tasks.filter(task => task.phase.id === phase.id);
        });
        return tasksByPhase;
    };

    const onDragStart = (ev, task) => {
        ev.dataTransfer.setData('task', JSON.stringify(task));
    };

    const onDragOver = ev => {
        ev.preventDefault();
    };

    const onDrop = (ev, phase) => {
        const task = JSON.parse(ev.dataTransfer.getData('task'));
        task.phase.id = phase;
        editTask(board.id, task.id, task).then(res => {
            setShouldFetch(true);
        }).catch(err => {
            console.error(err);
        })
    };

    const handleAddTask = (data) => {
        setModalEditOpen(false);
        setOpenModal(true);
    };

    const handleSubmitTask = (data) => {
        modalEditOpen ?
            editTask(board.id, task.id, data)
                .then(res => {
                    setOpenModal(false);
                    setShouldFetch(true);
                    setTask({});
                }).catch(err => {
                    console.error(err);
                })
            :
            createTask(board.id, data)
                .then(res => {
                    setOpenModal(false);
                    setShouldFetch(true);
                }).catch(err => {
                console.error(err);
            })
    };

    const handleEditTask = (taskId) => {
        setModalEditOpen(true);
        getTask(board.id, taskId)
            .then(res => {
                setTask(res);
                setOpenModal(true);
            }).catch(err => {
                console.error(err);
            });
    };

    const handleDeleteTask = (taskId) => {
        deleteTask(board.id, taskId)
            .then(res => {
                setShouldFetch(true);
            }).catch(err => {
                console.error(err);
            });
    };

    const renderTaskModal = () => {
        return (
            <Modal isOpen={openModal} toggle={() => {
                setOpenModal(!openModal);
                setTask({});
            }} className="modal-lg">
                <ModalHeader toggle={() => {
                    setOpenModal(!openModal);
                    setTask({});
                }}>{modalEditOpen ? 'Edit task' : 'Add task'}</ModalHeader>
                <ModalBody>
                    <TaskForm data={task} board={board} type={modalEditOpen ? 'edit' : 'create'} onSubmit={(data) => {handleSubmitTask(data)}}/>
                </ModalBody>
            </Modal>
        );
    };

    return (
        <Container>
            <Row>
                {openModal && renderTaskModal()}
                <Col md={12}>
                    <h3 className="mt-3 mb-3 font-weight-bold">
                        {board.name}
                    </h3>
                    <hr/>
                    <Card>
                        <CardBody>
                            <Row>
                                {
                                    board.phases?.map(phase => (
                                        <Col key={phase.id} /*md={Math.floor(12 / board.phases.length)}*/ >
                                            <span className="text-uppercase">{phase.name}</span>
                                        </Col>
                                    ))
                                }
                            </Row>
                            <Row>
                                {
                                    board.phases?.map(phase => (
                                        <Col className="p-2"
                                             key={phase.id}
                                             /*md={Math.floor(12 / board.phases.length)}*/
                                             onDragOver={(e) => {
                                                 onDragOver(e);
                                             }}
                                             onDrop={(e) => {
                                                 onDrop(e, phase.id);
                                             }}
                                        >
                                            <div className="bg-light h-100 p-2">
                                                {
                                                    loading &&
                                                    <div className="d-flex justify-content-center">
                                                        <i className="text-primary fas fa-spinner fa-spin fa-2x"></i>
                                                    </div>
                                                }
                                                {
                                                    getTasksByPhase()[phase.id]?.length === 0 && (
                                                        <div>
                                                            <span>No tasks</span>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    getTasksByPhase()[phase.id]?.map(task => (
                                                        <div
                                                            onClick={() => {
                                                            }}
                                                            key={task.id}
                                                            draggable
                                                            onDragStart={(e) => {
                                                                onDragStart(e, task);
                                                            }}
                                                        >
                                                            <Card className="shadow-none" key={task.id}>
                                                                <Row>
                                                                    <Col md={9}>
                                                                    <span
                                                                        className="font-weight-bold ml-1 mt-1">{task.name}</span>
                                                                    </Col>
                                                                    <Col className="d-flex justify-content-end" md={3}>
                                                                        <span onClick={() => {
                                                                            handleEditTask(task.id)
                                                                        }}>
                                                                            <i className="far fa-edit mr-1 mt-1 text-info"/>
                                                                        </span>
                                                                        <span onClick={() => {
                                                                            handleDeleteTask(task.id)
                                                                        }}>
                                                                            <i className="text-danger far fa-trash-alt mr-1 mt-1"/>
                                                                        </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={12}>
                                                                        <small className="ml-1">
                                                                            <span className="mr-1">Assigned to:</span>
                                                                            <i>{task.assignedTo.email}</i>
                                                                        </small>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={12} className="ml-1 mb-1">
                                                                        <small>
                                                                            <span className="mr-1">
                                                                                Description:
                                                                            </span>
                                                                            <span className="text-wrap">
                                                                                {task.description === '' ? 'No description' : task.description}
                                                                            </span>
                                                                        </small>
                                                                    </Col>
                                                                </Row>
                                                            </Card>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </Col>
                                    ))
                                }
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex justify-content-end" md={12}>
                    <Button color="primary" onClick={() => {
                        handleAddTask()
                    }}><i className="fas fa-plus mr-1"></i>Add new task</Button>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <h6 className="mt-3 mb-3 font-weight-bold">
                        Owners
                    </h6>
                    <hr/>
                    <Card>
                        <CardBody>
                            <div className="bg-light h-100 p-2">
                                {
                                    loading &&
                                    <div className="d-flex justify-content-center">
                                        <i className="text-primary fas fa-spinner fa-spin fa-2x"></i>
                                    </div>
                                }
                                {
                                    board.owners?.length === 0 && (
                                        <div>
                                            <span>No owners</span>
                                        </div>
                                    )
                                }
                                {
                                    board.owners?.map((owner, index) => (
                                        <div
                                            onClick={() => {
                                            }}
                                            key={owner.id}
                                        >
                                            <Card
                                                className={`shadow-none ${board.owners.length === 1 || index === board.owners.length - 1 ? 'mb-0' : 'mb-2'}`}>
                                                <CardBody className="p-1">
                                                    <Row>
                                                        <Col md={9}>
                                                            <span className="ml-1 mt-1">{`${owner.email} ${owner.email === userDetails.email ? '(Me)' : ''}`}</span>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    ))
                                }
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6}>
                    <h6 className="mt-3 mb-3 font-weight-bold">
                        Members
                    </h6>
                    <hr/>
                    <Card>
                        <CardBody>
                            <div className="bg-light h-100 p-2">
                                {
                                    loading &&
                                    <div className="d-flex justify-content-center">
                                        <i className="text-primary fas fa-spinner fa-spin fa-2x"></i>
                                    </div>
                                }
                                {
                                    board.members?.length === 0 && (
                                        <div>
                                            <span>No members</span>
                                        </div>
                                    )
                                }
                                {
                                    board.members?.map((member, index) => (
                                        <div
                                            onClick={() => {
                                            }}
                                            key={member.id}
                                        >
                                            <Card
                                                className={`shadow-none ${board.members.length === 1 || index === board.members.length - 1 ? 'mb-0' : 'mb-2'}`}>
                                                <CardBody className="p-1">
                                                    <Row>
                                                        <Col md={9}>
                                                            <span className="ml-1 mt-1">{`${member.email} ${member.email === userDetails.email ? '(Me)' : ''}`}</span>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    ))
                                }
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BoardDetails;

