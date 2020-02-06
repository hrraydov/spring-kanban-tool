import React, {useState} from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Button,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Badge,
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import {createBoard} from '../services/board-service';
import AsyncSelect from 'react-select/async';

const BoardCreate = (props) => {
    const [name, setName] = useState('');
    const [owners, setOwners] = useState([]);
    const [members, setMembers] = useState([]);
    const [newMember, setNewMember] = useState('');
    const [phases, setPhases] = useState([]);
    const [newPhase, setNewPhase] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const data = {
            name: name,
            owners: owners,
            members: members,
            phases: phases,
        };

        if (/\S/.test(name)) {
            createBoard(data).then(res => {
                props.history.push("/boards");
            }).catch(err => {
                console.error(err);
            });
        }
    };

    const addOwnerEmail = (email) => {
        owners.push(email);
        setOwners(owners);
    };

    const removeOwnerEmail = (email) => {
        owners.splice(owners.indexOf(email), 1);
        setOwners(Object.assign([], owners));
    };

    const addMemberEmail = (email) => {
        members.push(email);
        setMembers(members);
        setNewMember('');
    };

    const removeMemberEmail = (email) => {
        members.splice(members.indexOf(email), 1);
        setMembers(Object.assign([], members));
    };

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

    const data = [
        { value: 0, label: 'user1@mail.bg' },
        { value: 1, label: 'user2@mail.bg' },
        { value: 2, label: 'user3@mail.bg' }
    ];

    const fetchOptions = (inputValue) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(data);
            }, 1000);
        });
    };

    return (
        <Container>
            <Row>
                <Col md="12">
                    <div className="mt-3 mb-3 font-weight-bold">Create new board</div>
                    <hr/>
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
                                    loadOptions={fetchOptions}
                                    onChange={(e) => {}}
                                />
                            </Col>
                        </FormGroup>
                        <Row>
                            <Col md={2}/>
                            <Col md={10}>
                                {members.map(member => {
                                    return (
                                        <Badge className="btn btn-sm bg-primary mr-2 mb-2" key={member}>{member}
                                            <span className="ml-2" onClick={() => {
                                                removeMemberEmail(member)
                                            }}><i className="fas fa-times"/>
                                            </span>
                                        </Badge>
                                    )
                                })}
                            </Col>
                        </Row>
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
                                    loadOptions={fetchOptions}
                                    onChange={(e) => {

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
                                        <InputGroupText onClick={() => {addPhase(newPhase)}}>
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
                                    {phases.map((phase, index) => {
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
                        <Button type="submit" color="primary">Create</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default BoardCreate;
