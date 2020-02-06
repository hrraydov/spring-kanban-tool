import React, {useState, useEffect} from "react";
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import {editBoard, getBoards} from '../services/board-service';

const BoardEdit = (props) => {
    const [board, setBoard] = useState({});
    const [shouldFetch, setShouldFetch] = useState(true);
    const {board_id} = props.match.params;

    useEffect(() => {
        const func = async () => {
            const boards = await getBoards();
            const board = boards.find(b => b.id === +board_id);
            setBoard(board);
        };
        if(shouldFetch) {
            func();
            setShouldFetch(false);
        }
    }, [props.match.params, board]);

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const body = {
            name: board.name
        };

        if (/\S/.test(board.name)) {
            editBoard(board.id, body).then(res => {
                props.history.push("/boards");
            }).catch(err => {
                console.error(err);
            });
        }
    };

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <div className="mt-3 mb-3 font-weight-bold">Edit board</div>
                    <hr/>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup row>
                            <Label for="boardName" md={2}>Board name</Label>
                            <Col md={10}>
                                <Input type="text" name="boardName" id="boardName" value={board.name} onChange={e => {
                                    board.name = e.target.value;
                                    setBoard(Object.assign({}, board));
                                }}/>
                            </Col>
                        </FormGroup>
                        <Button type="submit" color="primary">Save</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default BoardEdit;
