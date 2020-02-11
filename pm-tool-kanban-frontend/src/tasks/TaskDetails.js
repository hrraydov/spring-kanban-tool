import React, {useEffect, useState} from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardImg,
    CardBody,
    CardText,
    Input,
    Label,
    Table,
    CardDeck,
    CardColumns
} from 'reactstrap';
import {getBoard, getTask, getTaskHistory, getTaskStatistic} from '../services/board-service';
import ReactMarkdown from 'react-markdown';

const TaskDetails = (props) => {
    const [board, setBoard] = useState({});
    const [task, setTask] = useState({});
    const [shouldFetch, setShouldFetch] = useState(true);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [statistic, setStatistic] = useState({});
    const [type, setType] = useState('TIME_LOGGED');
    const {boardId} = props.match.params;
    const {taskId} = props.match.params;

    const fileImgUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAIVBMVEX09PS2trbMzMzo6OjPz8/b29vAwMDu7u7Dw8O4uLje3t6y659EAAABeUlEQVR4nO3c3U7CQBCAUYqI4Ps/sD8FExOdmNnZTjHnJNxu9utOS3rTwwEAAAAAAAAAAODLMuT6/ju/dDd8Gu247qVk7ESW/ZQUdOyj5NuGUiEf87WDktETueX0l9z2cco776NkvaLHgRVOyy6ma53zwZA9lJScyKq3pDCkt6QypLWkNKTzPikN6SypDWksqR2txpLi0eorKR6tvmfXhJCekhkhLSVTQjrukykhHSVzQhpK5oxWQ8mk0dq+ZNJofdi2ZDzk9bf3+OVctss/GA/5yXEdsOJVQzNDluJVQ0JCQvKEhI7rv2LxqiEnEhKSJyQkJE9ISEiekJCQPCEhIXlCQkLyhISE5AkJCckTEhKSJyQkJE9ISEiekJCQPCEhIXlCQkLyhISE5AkJCckTEhKSJyQkJE9ISEiekJCQPCEhIXlCQm0hl+dal2tTSLH7x7oePuRe8vghy/8JuXaFZL9BF+oIKbb9U+tppi1DAAAAAAAAAAAAtvMGsDkRBZH0SJMAAAAASUVORK5CYII=';

    useEffect(() => {
        const func = async () => {
            const board = await getBoard(+boardId);
            const task = await getTask(+boardId, +taskId);
            const history = await getTaskHistory(+boardId, +taskId, type);
            const statistic = await getTaskStatistic(+boardId, +taskId, type);

            setLoading(false);
            setBoard(board);
            setTask(task);
            setHistory(history);
            setStatistic(statistic === 0 ? {} : statistic);
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
        <Container fluid>
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
                    <div className="d-flex flex-row justify-content-around pl-2">
                        <Label check>
                            <Input type="radio" name="loggedTime" checked={type === 'TIME_LOGGED'} onChange={() => {
                                setType('TIME_LOGGED')
                                setShouldFetch(true);
                            }}/>{' '}
                            Logged time
                        </Label>
                        <Label check>
                            <Input type="radio" name="phaseChanged" checked={type === 'PHASE_CHANGED'} onChange={() => {
                                setType('PHASE_CHANGED')
                                setShouldFetch(true);
                            }}/>{' '}
                            Phase changed
                        </Label>
                        <Label check>
                            <Input type="radio" name="assignedToChange" checked={type === 'ASSIGNED_TO_CHANGED'}
                                   onChange={() => {
                                       setType('ASSIGNED_TO_CHANGED')
                                       setShouldFetch(true);
                                   }}/>{' '}
                            Assigned to changed
                        </Label>
                    </div>
                    <hr/>
                    <h5 className="bg-primary text-white p-1 rounded shadow-sm">Statistic</h5>
                    {Object.entries(statistic).length !== 0 ? (
                        <div className="overflow-auto">
                            <Table striped>
                                <thead>
                                <tr>
                                    {
                                        type === 'TIME_LOGGED' ? (<th>Time</th>) : type === 'PHASE_CHANGED' ? (
                                            <th>Phase</th>) : (<th>User</th>)
                                    }
                                    <th>Changes count</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    Object.entries(statistic).map(entry => (
                                        <tr key={entry}>
                                            {type === 'TIME_LOGGED' ? (<td>Time</td>) : type === 'PHASE_CHANGED' ? (
                                                <td>{JSON.parse(entry[0]).name}</td>) : (
                                                <td>{JSON.parse(entry[0]).email}</td>)}
                                            <td>{entry[1]}</td>
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
                    {history.length !== 0 ? (
                        <div className="h-50 overflow-auto">
                            <Table striped>
                                <thead>
                                <tr>
                                    {
                                        type === 'TIME_LOGGED' ? (<th>Time</th>) : type === 'PHASE_CHANGED' ? (
                                            <th>Phase</th>) : (<th>User</th>)
                                    }
                                    <th>Time</th>
                                </tr>
                                </thead>
                                <tbody>
                                {history?.map(item => (
                                    <tr key={item.date}>
                                        {type === 'TIME_LOGGED' ? (<td>Time</td>) : type === 'PHASE_CHANGED' ? (
                                            <td>{item.data.name}</td>) : (<td>{item.data.email}</td>)}
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
