import React, {useState, useEffect} from 'react';
import {
    Badge, Button,
    Col,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    ListGroup, ListGroupItem,
    Row
} from 'reactstrap';
import AsyncSelect from 'react-select/async';

const BoardForm = (props) => {
    const [name, setName] = useState(props.data.name ? props.data.name : '');
    const [owners, setOwners] = useState(props.data.owners ? props.data.owners : []);
    const [members, setMembers] = useState(props.data.members ? props.data.members : []);
    const [phases, setPhases] = useState(props.data.phases ? props.data.phases : []);
    const [newPhase, setNewPhase] = useState('');

    const addPhase = (phase) => {
        const obj = {
            name: phase
        };
        phases.push(obj);
        setPhases(phases);
        setNewPhase('');
    };

    const removePhase = (phase) => {
        phases.splice(phases.map(phase => phase.name).indexOf(phase), 1);
        setPhases(Object.assign([], phases));
    };

    const onDragStart = (ev, phase) => {
        ev.dataTransfer.setData('phase', JSON.stringify({name: phase}));
    };

    const onDragOver = (ev) => {
        ev.preventDefault();
    };

    const onDrop = (ev, index) => {
        const phase = JSON.parse(ev.dataTransfer.getData('phase')).name;
        phases.splice(phases.map(phase => phase.name).indexOf(phase), 1);
        phases.splice(index, 0, {name: phase});
        setPhases(Object.assign([], phases));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const data = {

        };

        props.onSubmit(data);
    };

    return (
        <React.Fragment>
            <Form onSubmit={handleSubmit}>
                <FormGroup row>
                    <Label for="boardName" md={2}>Board name</Label>
                    <Col md={10}>
                        <Input type="text" name="boardName" id="boardName" value={name} onChange={e => {
                            setName(e.target.value)
                        }}/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="owners" md={2}>Owners</Label>
                    <Col md={10}>
                        <AsyncSelect
                            styles={{
                                control: (provided, state) => ({
                                    ...provided,
                                    borderRadius: '30px',
                                    borderColor: state.isFocused ? '#f96332 !important' : provided.borderColor,
                                    boxShadow: 'none'
                                })
                            }}
                            defaultOptions={false}
                            isMulti
                            cacheOptions
                            value={owners.map(owner => ({value: owner.id, label: owner.email}))}
                            loadOptions={props.fetchUsers?.map(user => ({value: user.id, label: user.email}))}
                            onChange={selectedValue => {
                                const obj = {
                                    id: selectedValue.value,
                                    email: selectedValue.label
                                };
                                owners.push(obj);
                                setOwners(Object.assign([], owners));
                            }}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="members" md={2}>Members</Label>
                    <Col md={10}>
                        <AsyncSelect
                            styles={{
                                control: (provided, state) => ({
                                    ...provided,
                                    borderRadius: '30px',
                                    borderColor: state.isFocused ? '#f96332 !important' : provided.borderColor,
                                    boxShadow: 'none'
                                })
                            }}
                            defaultOptions={false}
                            isMulti
                            cacheOptions
                            value={members.map(member => ({value: member.id, label: member.email}))}
                            loadOptions={props.fetchUsers?.map(user => ({value: user.id, label: user.email}))}
                            onChange={selectedValue => {
                                const obj = {
                                    id: selectedValue.value,
                                    email: selectedValue.label
                                };
                                members.push(obj);
                                setMembers(Object.assign([], members));
                            }}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="phases" md={2}>Phases</Label>
                    <Col md={10}>
                        <InputGroup>
                            <Input type="text" name="phases" id="phases" value={newPhase} onChange={e => {
                                setNewPhase(e.target.value)
                            }}/>
                            <InputGroupAddon addonType="append">
                                <InputGroupText onClick={() => {
                                    addPhase(newPhase)
                                }}>
                                    <i className="fas fa-plus text-success"/>
                                </InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                </FormGroup>
                <Row>
                    <Col md={2}/>
                    <Col md={10}>
                        <ListGroup className="d-flex flex-column align-items-center" >
                            {phases?.map((phase, index) => {
                                return (
                                    <React.Fragment key={phase.name}>
                                        <ListGroupItem className="mr-2 p-3 w-75 rounded"
                                                       tag="span"
                                                       draggable
                                                       onDragStart={(e) => {
                                                           onDragStart(e, phase.name);
                                                       }}
                                                       onDragOver={(e) => {
                                                           onDragOver(e);
                                                       }}
                                                       onDrop={(e) => {
                                                           onDrop(e, index);
                                                       }}
                                        >
                                            <div className="d-flex justify-content-between">
                                                <Badge pill className="mr-1 d-flex align-items-center">{index + 1}</Badge>
                                                <span className="text-wrap">{phase.name}</span>
                                                <div className="d-flex flex-row justify-content-between ml-1">
                                                            <span className="mr-1" onClick={() => {
                                                                /*editPhase(phase)*/
                                                            }}><i className="fas fa-edit"></i>
                                                            </span>
                                                    <span onClick={() => {
                                                        removePhase(phase.name)
                                                    }}><i className="fas fa-times"></i>
                                                            </span>
                                                </div>
                                            </div>
                                        </ListGroupItem>
                                        {index !== phases.length - 1 && (
                                            <div className="w-75 my-3 d-flex flex-row justify-content-center">
                                                <i className="fas fa-arrow-down fa-2x"></i>
                                            </div>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </ListGroup>
                    </Col>
                </Row>
                <Button type="submit" color="primary">Save</Button>
            </Form>
        </React.Fragment>
    );
};

export default BoardForm;
