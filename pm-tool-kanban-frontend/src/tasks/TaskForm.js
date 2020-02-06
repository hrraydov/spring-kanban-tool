import React, {useState, useMemo, useEffect} from 'react';
import {Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import {useDropzone} from 'react-dropzone';
import Select from "react-select";

const TaskForm = (props) => {
    const [name, setName] = useState(props.data.name ? props.data.name : '');
    const [description, setDescription] = useState(props.data.description ? props.data.description : '');
    const [assignedTo, setAssignedTo] = useState(props.data.assignedTo ? props.data.assignedTo : {});
    const [attachments, setAttachments] = useState(props.data.attachments ? props.data.attachments : []);
    const [phase, setPhase] = useState(props.data.phase ? props.data.phase : {});

    const formatOptionLabel = ({value, label, type}) => (
        <div className="d-flex">
            <div className="mr-auto">
                {label}
            </div>
            <div className="ml-auto">
                {type ? `(${type})` : ``}
            </div>
        </div>
    );

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out'
    };

    const activeStyle = {
        borderColor: '#2196f3'
    };

    const acceptStyle = {
        borderColor: '#00e676'
    };

    const rejectStyle = {
        borderColor: '#ff1744'
    };

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone();

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject
    ]);

    useEffect(() => {
        attachments.push(...acceptedFiles);
        setAttachments(Object.assign([], attachments));
    }, [acceptedFiles]);

    // const files = acceptedFiles.map(file => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //         const obj = {
    //             file: file,
    //             url: reader.result
    //         };
    //         console.log(reader.readyState);
    //         //attachments.push(obj);
    //         //setAttachments(attachments);
    //     };
    //     reader.onerror = (error) => {
    //         console.error(error);
    //     };
    //     return (
    //         <li key={file.path}>
    //             <a href={"#"} target="_blank">{file.path}</a>
    //             <span className="mx-1">({file.size} bytes)</span>
    //             <span onClick={() => {
    //                 files.splice(files.indexOf(file), 1);
    //             }}><i className="fas fa-times"/>
    //             </span>
    //         </li>
    //     );
    // });

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const data = {
            id: props.type === 'edit' ? props.data.id : '',
            assignedTo: assignedTo,
            name: name,
            description: description,
            phase: props.type === 'edit' ? phase :{
                id: props.board.phases[0].id
            },
            attachments: attachments
        };

        props.onSubmit(data);
    };

    return (
        <React.Fragment>
            <Form onSubmit={handleSubmit}>
                <FormGroup row>
                    <Label for="taskName" md={2}>Task name</Label>
                    <Col md={10}>
                        <Input type="text" name="taskName" id="taskName" value={name} onChange={e => {
                            setName(e.target.value)
                        }}/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="assign" md={2}>Assign to</Label>
                    <Col md={10}>
                        <Select
                            styles={{
                                control: (provided, state) => ({
                                    ...provided,
                                    borderRadius: '30px',
                                    borderColor: state.isFocused ? '#f96332 !important' : provided.borderColor,
                                    boxShadow: 'none'
                                })
                            }}
                            value={{value: assignedTo.id, label: assignedTo.email}}
                            formatOptionLabel={formatOptionLabel}
                            options={(props.board.owners && props.board.members) ? [...props.board.owners, ...props.board.members].map(item => ({
                                value: item.id,
                                label: item.email,
                                type: item.type
                            })) : []}
                            onChange={selectedValue => {
                                const obj = {
                                    id: selectedValue.value,
                                    email: selectedValue.label
                                };
                                setAssignedTo(obj);
                            }}
                        />
                    </Col>
                </FormGroup>
                {props.type === 'edit' && (
                    <FormGroup row>
                        <Label for="assign" md={2}>Phase</Label>
                        <Col md={10}>
                            <Select
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        borderRadius: '30px',
                                        borderColor: state.isFocused ? '#f96332 !important' : provided.borderColor,
                                        boxShadow: 'none'
                                    })
                                }}
                                value={{value: phase.id, label: phase.name}}
                                options={props.board.phases.map(phase => ({
                                    value: phase.id,
                                    label: phase.name,
                                }))}
                                onChange={selectedValue => {
                                    const obj = {
                                        id: selectedValue.value,
                                        name: selectedValue.label
                                    };
                                    setPhase(obj);
                                }}
                            />
                        </Col>
                    </FormGroup>
                )}
                <FormGroup row>
                    <Col md={2}>
                        Attachments
                    </Col>
                    <Col md={10}>
                        <div className="container">
                            <div {...getRootProps({style})}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            </div>
                            {attachments.length !== 0 && (
                                <div className="mt-2">
                                    <h6>Attachments</h6>
                                    <ul>
                                        {attachments.map(attachment => (
                                            <li key={attachment.name}>
                                                <a href={URL.createObjectURL(attachment)} target="_blank">{attachment.name}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="description" md={2}>Description</Label>
                    <Col md={10}>
                        <Input type="textarea" name="description" id="description" value={description}
                               onChange={e => {
                                   setDescription(e.target.value)
                               }}/>
                    </Col>
                </FormGroup>
                <Button type="submit" color="primary">Save</Button>
            </Form>
        </React.Fragment>
    );
};

export default TaskForm;
