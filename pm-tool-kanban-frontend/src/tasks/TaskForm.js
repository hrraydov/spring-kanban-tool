import React, {useState, useMemo, useEffect} from 'react';
import {Col, Form, FormGroup, Label, Input, Button, FormFeedback} from 'reactstrap';
import {useDropzone} from 'react-dropzone';
import Select from "react-select";
import * as Yup from 'yup';
import {Formik, ErrorMessage} from 'formik';

const validationSchema = (values) => {
    return Yup.object().shape({
        name: Yup.string()
            .required('The name field is required.'),
        assignedTo: Yup.object().shape({
            email: Yup.string()
                .required('The assigned to field is required.'),
        })
    })
};

const validate = (getValidationSchema) => {
    return (values) => {
        const validationSchema = getValidationSchema(values);
        try {
            validationSchema.validateSync(values, {abortEarly: false});
            return {}
        } catch (error) {
            return getErrorsFromValidationError(error)
        }
    }
};

const getErrorsFromValidationError = (validationError) => {
    const FIRST_ERROR = 0;
    return validationError.inner.reduce((errors, error) => {
        return {
            ...errors,
            [error.path]: error.errors[FIRST_ERROR],
        }
    }, {})
};

const TaskForm = (props) => {
    const initialValues = {
        name: props.data.name ? props.data.name : '',
        description: props.data.description ? props.data.description : '',
        assignedTo: props.data.assignedTo ? props.data.assignedTo : {},
        phase: props.data.phase ? props.data.phase : {},
    };
    // const [name, setName] = useState(props.data.name ? props.data.name : '');
    // const [description, setDescription] = useState(props.data.description ? props.data.description : '');
    // const [assignedTo, setAssignedTo] = useState(props.data.assignedTo ? props.data.assignedTo : {});
    const [attachments, setAttachments] = useState(props.data.attachments ? props.data.attachments : []);
    // const [phase, setPhase] = useState(props.data.phase ? props.data.phase : {});*/

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
        attachments.push(...acceptedFiles.map(file => ({
            name: file.name,
            contentType: file.contentType,
            blob: file
        })));
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

    const handleSubmit = (values) => {
        //e.preventDefault();
        //e.stopPropagation();

        const data = {
            id: props.type === 'edit' ? props.data.id : '',
            assignedTo: values.assignedTo,
            name: values.name,
            description: values.description,
            phase: props.type === 'edit' ? values.phase : {
                id: props.board.phases[0].id
            },
            attachments: attachments
        };

        props.onSubmit(data);
    };

    const errorStyle = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '30px',
            boxShadow: state.isFocused ? '#dc3545' : 0,
            borderColor: '#dc3545',
            '&:hover': {
                borderColor: '#dc3545',
            }
        }),
    };

    const normalStyle = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '30px',
            borderColor: state.isFocused ? '#f96332 !important' : provided.borderColor,
            boxShadow: 'none'
        })
    };

    return (
        <Formik
            initialValues={initialValues}
            validate={validate(validationSchema)}
            onSubmit={handleSubmit}
            render={
                ({
                     values,
                     errors,
                     touched,
                     handleChange,
                     handleSubmit,
                     isSubmitting,
                     setFieldValue,
                     validateForm,
                     setTouched
                 }) => (
                    <Form onSubmit={handleSubmit} noValidate>
                        <FormGroup row>
                            <Label htmlFor="name" md={2}>Task name *</Label>
                            <Col md={10}>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    invalid={touched.name && !!errors.name}/>
                                <FormFeedback>{errors?.name}</FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="assignedTo" md={2}>Assign to *</Label>
                            <Col md={10}>
                                <Select
                                    name="assignedTo"
                                    id="assignedTo"
                                    styles={errors['assignedTo.email'] && touched.assignedTo ? errorStyle : normalStyle}
                                    value={{value: values.assignedTo.id, label: values.assignedTo.email}}
                                    formatOptionLabel={formatOptionLabel}
                                    options={(props.board.owners && props.board.members) ? [...props.board.owners, ...props.board.members].map(item => ({
                                        value: item.id,
                                        label: item.email,
                                        type: item.type
                                    })) : []}
                                    onBlur={() => {
                                        setTouched({assignedTo: true})
                                    }}
                                    onChange={selectedValue => {
                                        const obj = {
                                            id: selectedValue.value,
                                            email: selectedValue.label
                                        };
                                        setFieldValue('assignedTo', obj);
                                        setTouched({assignedTo: true})
                                    }}
                                />
                                <FormFeedback className="d-block">{errors['assignedTo.email']}</FormFeedback>
                            </Col>
                        </FormGroup>
                        {props.type === 'edit' && (
                            <FormGroup row>
                                <Label htmlFor="phase" md={2}>Phase</Label>
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
                                        value={{value: values.phase.id, label: values.phase.name}}
                                        options={props.board.phases.map(phase => ({
                                            value: phase.id,
                                            label: phase.name,
                                        }))}
                                        onChange={selectedValue => {
                                            const obj = {
                                                id: selectedValue.value,
                                                name: selectedValue.label
                                            };
                                            setFieldValue('phase', obj);
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
                                                        <a href={URL.createObjectURL(attachment.blob)}
                                                           target="_blank">{attachment.name}</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="description" md={2}>Description</Label>
                            <Col md={10}>
                                <Input type="textarea" name="description" id="description" value={values.description}
                                       onChange={handleChange}/>
                            </Col>
                        </FormGroup>
                        <Button type="submit" disabled={isSubmitting} onClick={() => {
                            validateForm(errors);
                        }} color="primary">Save</Button>
                    </Form>
                )}
        />
    );
};

export default TaskForm;
