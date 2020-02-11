import React, {useEffect, useState} from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardImg,
    CardBody,
    CardText,
    Table,
    Nav,
    NavItem,
    NavLink,
    Button, Modal, ModalHeader, ModalBody, Form, Label, Input, FormGroup, FormText
} from 'reactstrap';
import {editTask, getBoard, getTask, getTaskHistory, getTaskStatistic, logTaskTime} from '../services/board-service';
import ReactMarkdown from 'react-markdown';
import TaskForm from "./TaskForm";

const TaskDetails = (props) => {
    const [board, setBoard] = useState({});
    const [task, setTask] = useState({});
    const [shouldFetch, setShouldFetch] = useState(true);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [statistic, setStatistic] = useState({});
    const [type, setType] = useState('TIME_LOGGED');
    const [openModal, setOpenModal] = useState(false);
    const [openLoggingModal, setOpenLoggingModal] = useState(false);
    const [loggedTime, setLoggedTime] = useState(0);
    const {boardId} = props.match.params;
    const {taskId} = props.match.params;

    const fileImgUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAIVBMVEX09PS2trbMzMzo6OjPz8/b29vAwMDu7u7Dw8O4uLje3t6y659EAAABeUlEQVR4nO3c3U7CQBCAUYqI4Ps/sD8FExOdmNnZTjHnJNxu9utOS3rTwwEAAAAAAAAAAODLMuT6/ju/dDd8Gu247qVk7ESW/ZQUdOyj5NuGUiEf87WDktETueX0l9z2cco776NkvaLHgRVOyy6ma53zwZA9lJScyKq3pDCkt6QypLWkNKTzPikN6SypDWksqR2txpLi0eorKR6tvmfXhJCekhkhLSVTQjrukykhHSVzQhpK5oxWQ8mk0dq+ZNJofdi2ZDzk9bf3+OVctss/GA/5yXEdsOJVQzNDluJVQ0JCQvKEhI7rv2LxqiEnEhKSJyQkJE9ISEiekJCQPCEhIXlCQkLyhISE5AkJCckTEhKSJyQkJE9ISEiekJCQPCEhIXlCQkLyhISE5AkJCckTEhKSJyQkJE9ISEiekJCQPCEhIXlCQm0hl+dal2tTSLH7x7oePuRe8vghy/8JuXaFZL9BF+oIKbb9U+tppi1DAAAAAAAAAAAAtvMGsDkRBZH0SJMAAAAASUVORK5CYII=';

    useEffect(() => {
        const func = async () => {
            const board = await getBoard(+boardId);
            const task = await getTask(+boardId, +taskId);
            const history = await getTaskHistory(+boardId, +taskId, type);
            const stat = await getTaskStatistic(+boardId, +taskId, type);

            setLoading(false);
            setBoard(board);
            setTask(task);
            setHistory(history);
            setStatistic(stat);
        };
        if (shouldFetch) {
            func();
            setShouldFetch(false);
        }
        return () => {
            setShouldFetch(false);
            setLoading(false);
        }
    }, [props.match.params, task, shouldFetch]);

    const handleSubmitTask = (data) => {
        editTask(board.id, task.id, data)
            .then(res => {
                setOpenModal(false);
                setShouldFetch(true);
            }).catch(err => {
            console.error(err);
        })
    };

    const handleLogTime = (e) => {
        e.preventDefault();
        e.stopPropagation();

        logTaskTime(+boardId, +taskId, loggedTime)
            .then(res => {
                setOpenLoggingModal(false);
                setShouldFetch(true);
            })
            .catch(err => {
                console.error(err);
            })
    };

    const renderTaskModal = () => {
        return (
            <Modal isOpen={openModal} toggle={() => {
                setOpenModal(!openModal);
            }} className="modal-lg">
                <ModalHeader toggle={() => {
                    setOpenModal(!openModal);
                }}>{'Edit task'}</ModalHeader>
                <ModalBody>
                    <TaskForm data={task} board={board} type={'edit'} onSubmit={(data) => {
                        handleSubmitTask(data)
                    }}/>
                </ModalBody>
            </Modal>
        );
    };

    const renderTimeLoggingModal = () => {
        return (
            <Modal isOpen={openLoggingModal} toggle={() => {
                setOpenLoggingModal(!openLoggingModal);
            }} className="modal-lg">
                <ModalHeader toggle={() => {
                    setOpenLoggingModal(!openLoggingModal);
                }}>{'Log time'}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleLogTime}>
                        <FormGroup row>
                            <Label htmlFor="loggedTime" md={2}>Log time</Label>
                            <Col md={10}>
                                <Input
                                    type="number"
                                    name="loggedTime"
                                    id="loggedTime"
                                    onChange={(e) => {
                                        setLoggedTime(e.target.value)
                                    }}
                                />
                                <FormText color="muted">
                                    The logging time is in hours.
                                </FormText>
                            </Col>
                        </FormGroup>
                        <Button type="submit" color="primary">Log time</Button>
                    </Form>
                </ModalBody>
            </Modal>
        );
    };

    return (
        <Container fluid>
            {openModal && renderTaskModal()}
            {openLoggingModal && renderTimeLoggingModal()}
            <Row>
                <Col xs="2">
                    <Button color="primary" size="sm"
                            className="rounded-pill d-flex justify-content-center align-items-center" onClick={() => {
                        props.history.push(`/boards/${+boardId}/details`);
                    }}><i className="fas fa-arrow-circle-left mr-2"></i>Back to board</Button>
                </Col>
                <Col xs="9"></Col>
                <Col xs="1" className="d-flex flex-row justify-content-end">
                    <Button color="primary" size="sm"
                            className="btn-icon rounded-pill d-flex justify-content-center align-items-center mr-2"
                            onClick={() => {
                                setOpenLoggingModal(true);
                            }}><i className="fas fa-stopwatch mr-2"></i></Button>
                    <Button color="primary" size="sm"
                            className="btn-icon rounded-pill d-flex justify-content-center align-items-center"
                            onClick={() => {
                                setOpenModal(true);
                            }}><i className="far fa-edit mr-2"></i></Button>
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    <h3 className="mt-3 mb-3 font-weight-bold">
                        {task.name}
                    </h3>
                    <hr/>
                </Col>
            </Row>
            <Row>
                <Col md="8">
                    <div className="d-flex flex-row mb-3">
                        <div className="mr-2 font-italic">Assigned to:</div>
                        <div>
                            {task.assignedTo?.email} {task.assignedTo?.firstName && task.assignedTo?.lastName ? `(${task.assignedTo?.firstName + ' ' + task.assignedTo?.lastName})` : ``}
                        </div>
                    </div>
                    <div className="d-flex flex-row mb-3">
                        <div className="mr-2 font-italic">Phase:</div>
                        <div>
                            {task.phase?.name}
                        </div>
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <div className="mb-2 font-italic">Description:</div>
                        <div className="pl-1">
                            {
                                task.description === '' ?
                                    'No description' :
                                    <ReactMarkdown source={task.description}/>
                            }
                        </div>
                    </div>
                    <div className="">
                        <div className="mb-2 font-italic">Attachments:</div>
                        <div className="p-1 d-flex flex-row align-items-center justify-content-start">
                            {task.attachments?.length !== 0 ? task.attachments?.map(attachment => (
                                    <Card key={attachment.id} className="m-2" style={{maxWidth: '150px'}}>
                                        <a href={URL.createObjectURL(attachment.blob)} target="_blank">
                                            <CardImg
                                                top
                                                style={{width: '150px', height: '150px'}}
                                                width="150px"
                                                height="150px"
                                                src={attachment.contentType.includes('image') ? URL.createObjectURL(attachment.blob) : fileImgUrl}
                                                alt=""
                                            />
                                        </a>
                                        <CardBody>
                                            <CardText className="d-flex align-items-center">
                                                {
                                                    attachment.contentType.includes('image') ?
                                                        <React.Fragment>
                                                            <i className="far fa-file-image fa-2x mr-2"/>
                                                            <span>{attachment.name.substring(0, 10)}{attachment.name.length > 10 ? `...${attachment.name.substring(attachment.name.length - 4, attachment.name.length)}` : ''}</span>
                                                        </React.Fragment>
                                                        :
                                                        <React.Fragment>
                                                            <i className="far fa-file-alt fa-2x mr-2"/>
                                                            <a href={URL.createObjectURL(attachment.blob)}
                                                               target="_blank"><span>{attachment.name.substring(0, 10)}{attachment.name.length > 10 ? `...${attachment.name.substring(attachment.name.length - 4, attachment.name.length)}` : ''}</span></a>
                                                        </React.Fragment>
                                                }
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                )) :
                                'No attachments'
                            }
                        </div>
                    </div>
                </Col>
                <Col md="4">
                    <Nav tabs>
                        <NavItem>
                            <NavLink href="javascript:;" active={type === 'TIME_LOGGED'} onClick={() => {
                                setType('TIME_LOGGED');
                                setStatistic({});
                                setHistory([]);
                                setShouldFetch(true);
                            }}>Logged time</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="javascript:;" active={type === 'PHASE_CHANGED'} onClick={() => {
                                setType('PHASE_CHANGED');
                                setStatistic({});
                                setHistory([]);
                                setShouldFetch(true);
                            }}>Phase changed</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="javascript:;" active={type === 'ASSIGNED_TO_CHANGED'} onClick={() => {
                                setType('ASSIGNED_TO_CHANGED');
                                setStatistic({});
                                setHistory([]);
                                setShouldFetch(true);
                            }}>Assigned to changed</NavLink>
                        </NavItem>
                    </Nav>
                    <h5 className="bg-primary text-white p-1 rounded shadow-sm mt-3">Statistic</h5>
                    {
                        loading &&
                        <div className="d-flex justify-content-center">
                            <i className="text-primary fas fa-spinner fa-spin fa-2x"></i>
                        </div>
                    }
                    {Object.entries(statistic).length !== 0 ? (
                        <div className="overflow-auto">
                            <Table striped>
                                <thead>
                                <tr>
                                    {
                                        type === 'TIME_LOGGED' ?
                                            (<th>Total logged time (hours)</th>) : type === 'PHASE_CHANGED' ?
                                            (<th>Phase</th>) :
                                            (<th>User</th>)
                                    }
                                    {
                                        type !== 'TIME_LOGGED' &&
                                            <th>Changes count</th>
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    Object.entries(statistic)?.map(entry => (
                                        <tr key={entry}>
                                            {
                                                type === 'TIME_LOGGED' ?
                                                    <td>{entry[1]}</td> :
                                                    type === 'PHASE_CHANGED' ?
                                                        <td>{JSON.parse(entry[0]).name}</td> :
                                                        <td>{JSON.parse(entry[0]).email}</td>
                                            }
                                            {
                                                type !== 'TIME_LOGGED' &&
                                                    <td>{entry[1]}</td>
                                            }
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center">There is no statistic found for that type.</div>
                    )}
                    <hr/>
                    <h5 className="bg-primary text-white p-1 rounded shadow-sm">History</h5>
                    {
                        loading &&
                        <div className="d-flex justify-content-center">
                            <i className="text-primary fas fa-spinner fa-spin fa-2x"></i>
                        </div>
                    }
                    {history.length !== 0 ? (
                        <div className="h-50 overflow-auto">
                            <Table striped>
                                <thead>
                                <tr>
                                    {
                                        type === 'TIME_LOGGED' ? (<th>Logged hours</th>) : type === 'PHASE_CHANGED' ? (
                                            <th>Phase</th>) : (<th>User</th>)
                                    }
                                    <th>Time</th>
                                </tr>
                                </thead>
                                <tbody>
                                {history.map(item => (
                                    <tr key={item.date}>
                                        {
                                            type === 'TIME_LOGGED' ?
                                            (<td>{item.data}</td>) :
                                                type === 'PHASE_CHANGED' ?
                                            (<td>{item.data.name}</td>) :
                                                (<td>{item.data.email}</td>)
                                        }
                                        <td>{new Date(item.date).toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center">There is no history found for that type.</div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default TaskDetails;
