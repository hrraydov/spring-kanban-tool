import React, {useEffect, useState} from 'react';
import {Container, Row, Col} from 'reactstrap';
import {getBoard, getTask} from '../services/board-service';
import ReactMarkdown from 'react-markdown';

const TaskDetails = (props) => {
    const [board, setBoard] = useState({});
    const [task, setTask] = useState({});
    const [shouldFetch, setShouldFetch] = useState(true);
    const [loading, setLoading] = useState(true);
    const {boardId} = props.match.params;
    const {taskId} = props.match.params;

    useEffect(() => {
        const func = async () => {
            const board = await getBoard(+boardId);
            const task = await getTask(+boardId, +taskId);

            setLoading(false);
            setBoard(board);
            setTask(task);
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

    return (
        <Container>
            <Row>
                <Col md="12">
                    <h3 className="mt-3 mb-3 font-weight-bold">
                        {task.name}
                    </h3>
                    <hr/>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <div className="d-flex flex-row mb-3">
                        <div className="mr-2 font-italic">Assigned to:</div>
                        <div>
                            <a href={`/users/${task.assignedTo?.id}`}>{task.assignedTo?.email}</a> {task.assignedTo?.firstName && task.assignedTo?.lastName ? `(${task.assignedTo?.firstName + ' ' + task.assignedTo?.lastName})` : ``}
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
                            <ReactMarkdown source={task.description}/>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="mb-2 font-italic">Attachments:</div>
                        <div>
                            
                        </div>
                    </div>
                </Col>
                <Col md="6">

                </Col>
            </Row>
        </Container>
    );
};

export default TaskDetails;
