import React, {useState, useEffect} from 'react';
import {Container, Row, Col, ListGroup, ListGroupItem} from 'reactstrap';
import {getBoards, getTasksAssignedToUser} from '../services/board-service';
import useUser from '../hooks/useUser';
import {Link} from 'react-router-dom';

const Dashboard = (props) => {
    const [boards, setBoards] = useState([]);
    const [tasks, setTasks] = useState([]);
    const user = useUser();

    useEffect(() => {
        if (!!user.id) {
            getBoards().then(data => {
                setBoards(data);
            });
            getTasksAssignedToUser(user.id).then(data => {
                setTasks(data);
                console.log(data);
            });
        }
    }, [user]);

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <h3 className="text-center">Boards</h3>
                    <hr/>
                    <ListGroup>
                        {boards.length !== 0 ? boards.map(board => (
                            <Link to={`/boards/${board.id}/details`} className="list-group-item">{board.name}</Link>
                        )) : <p className="text-center">You have no boards.</p>}
                    </ListGroup>
                </Col>
                <Col md={6}>
                    <h3 className="text-center">Tasks assigned to me</h3>
                    <hr/>
                    <ListGroup>
                        {tasks.length !== 0 ? tasks.map(task => (
                            <Link to={`/boards/${task.boardId}/tasks/${task.id}/details`}
                                  className="list-group-item d-flex"><span className="mr-auto">{task.name}</span><span
                                className="ml-auto">{task.phase.name}</span></Link>
                        )) : <p className="text-center">You have no assigned tasks to you.</p>}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
