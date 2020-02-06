import React, {useState} from 'react';
import {Button, Col, Form, FormGroup, Input, Label} from 'reactstrap';

const UserDetailsForm = (props) => {

    const [email, setEmail] = useState(props.data.email);
    const [firstName, setFirstName] = useState(props.data.firstName ? props.data.firstName : '');
    const [lastName, setLastName] = useState(props.data.lastName ? props.data.lastName : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const data = {
            id: props.data.id,
            email: email,
            firstName: firstName,
            lastName: lastName
        };

        props.onSubmit(data);
    };

    return (
        <React.Fragment>
            <Form onSubmit={handleSubmit}>
                <FormGroup row>
                    <Label for="email" md={2}>Email</Label>
                    <Col md={10}>
                        <Input type="text" name="email" id="email" value={email} disabled/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="firstName" md={2}>First name</Label>
                    <Col md={10}>
                        <Input type="text" name="firstName" id="firstName" value={firstName} onChange={(e) => {
                            setFirstName(e.target.value)
                        }}/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="lastName" md={2}>Last name</Label>
                    <Col md={10}>
                        <Input type="text" name="lastName" id="lastName" value={lastName} onChange={(e) => {
                            setLastName(e.target.value)
                        }} />
                    </Col>
                </FormGroup>
                <Button type="submit" color="primary">Save</Button>
            </Form>
        </React.Fragment>
    );
};

export default UserDetailsForm;
