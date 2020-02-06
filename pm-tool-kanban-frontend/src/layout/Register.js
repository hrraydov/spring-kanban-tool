import React, {useState} from "react";
import {Container, Row, Col, Button, Form, FormGroup, Label, Input, Card, Alert} from 'reactstrap';
import {register} from "../services/board-service";

const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(password !== rePassword) {
            setAlertMessage('The passwords do not match!');
            setShowAlert(true);
        } else {
            const data = {
                email: email,
                password: password
            };

            register(data).then(res => {
                window.location.href = "/";
            }).catch(err => {
                setAlertMessage('Oops! Something went wrong while trying to register you!');
                setShowAlert(true);
            });
        }
    };

    const onDismiss = () => setShowAlert(false);

    return (
        <Container fluid className="px-5">
            <Row className="mt-5 text-center">
                <Col md="12">
                    <h2>Register</h2>
                </Col>
            </Row>
            {showAlert && (
                <Row className="mt-2 d-flex justify-content-center">
                    <Col md="8">
                        <Alert color="danger" isOpen={showAlert} toggle={onDismiss}>
                            {alertMessage}
                        </Alert>
                    </Col>
                </Row>
            )}
            <Row className={`d-flex justify-content-center text-center ${showAlert || 'mt-2'}`}>
                <Col md="8">
                    <Card body className="h-100">
                        <Form onSubmit={handleSubmit}>
                            <FormGroup row>
                                <Label for="email" md={2}>Email</Label>
                                <Col md={10}>
                                    <Input type="text" name="email" id="email" defaultValue={email} onChange={e => {
                                        setEmail(e.target.value)
                                    }}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="password" md={2}>Password</Label>
                                <Col md={10}>
                                    <Input type="password" name="password" id="password" defaultValue={password} onChange={e => {
                                        setPassword(e.target.value)
                                    }}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="rePassword" md={2}>Repeat password</Label>
                                <Col md={10}>
                                    <Input type="password" name="rePassword" id="rePassword" defaultValue={rePassword} onChange={e => {
                                        setRePassword(e.target.value)
                                    }}/>
                                </Col>
                            </FormGroup>
                            <Button type="submit" color="primary">Register</Button>
                            <hr className="my-2" />
                            <p>You have already had an account? Login <a href="/">now</a>.</p>
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

export default Register;
