import React, {useState} from "react";
import {Container, Row, Jumbotron, Col, Button, Form, FormGroup, Label, Input, Card, Alert} from 'reactstrap';
import {login} from "../services/board-service";

const Home = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const data = {
            email: email,
            password: password
        };

        login(data).then(res => {
            localStorage.setItem('token', JSON.stringify(res));
            window.location.href = "/";
        }).catch(err => {
            if(err.message === 'InputValidation') {
                setAlertMessage('Some of the fields are not valid!');
                setShowAlert(true);
            } else if (err.message === 'Unauthenticated') {
                setAlertMessage('Invalid username or password!');
                setShowAlert(true);
            }
        });
    };

    const onDismiss = () => setShowAlert(false);

    return (

        <Container fluid className="px-5">
            {showAlert && (
                <Row className="mt-5">
                    <Col md="12">
                        <Alert color="danger" isOpen={showAlert} toggle={onDismiss}>
                            {alertMessage}
                        </Alert>
                    </Col>
                </Row>
            )}
            <Row className={showAlert ? 'text-center' : 'mt-5 text-center'}>
                <Col md="9">
                    <Jumbotron className="h-100">
                        <h1 className="display-3">Project management tool</h1>
                        <p className="lead">The right choice for easier and faster project tasks and processes
                            management.</p>
                        <hr className="my-2 mt-5"/>
                        <p>You do not have an account? Make <a href="/register">one</a>.</p>
                    </Jumbotron>
                </Col>
                <Col md="3">
                    <Card body className="h-100">
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Col>
                                    <Input type="text" name="email" id="email" defaultValue={email} onChange={e => {
                                        setEmail(e.target.value)
                                    }}/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Col>
                                    <Input type="password" name="password" id="password" defaultValue={password} onChange={e => {
                                        setPassword(e.target.value)
                                    }}/>
                                </Col>
                            </FormGroup>
                            <Button type="submit" color="primary">Log in</Button>
                            <hr className="my-2" />
                            <p>Register <a href="/register">now</a>.</p>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <footer className="mt-auto py-3 fixed-bottom bg-light">
                <div className="container text-center">
                    Project management tool &copy;{(new Date().getFullYear())}
                </div>
            </footer>
        </Container>
    );
};

export default Home;
