import React, {useState} from 'react';
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
    Row,
    FormFeedback
} from 'reactstrap';
import AsyncSelect from 'react-select/async';
import * as Yup from 'yup';
import {Formik, FieldArray, ErrorMessage} from 'formik';

const validationSchema = (values) => {
    return Yup.object().shape({
        name: Yup.string()
            .min(1, `The name must contains at least on digit.`)
            .required('The name is required.'),
        members: Yup.array()
            .min(1, 'Pick at least one member.'),
        phases: Yup.array()
            .min(2, 'Create at least two phases.'),
    })
};

const Schema = Yup.object().shape({
    name: Yup.string()
        .min(1, `The name must contains at least on digit.`)
        .required('The name is required.'),
    members: Yup.array()
        .min(1, 'Pick at least one member.'),
    phases: Yup.array()
        .min(2, 'Create at least two phases.'),
})

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

const BoardForm = (props) => {

    const initialValues = {
        name: props.data.name ? props.data.name : '',
        owners: props.data.owners ? props.data.owners : [],
        members: props.data.members ? props.data.members : [],
        phases: props.data.phases ? props.data.phases : []
    };

    const [newPhase, setNewPhase] = useState('');

    const handleSubmit = (values) => {

        const data = {
            id: props.data.id,
            name: values.name,
            owners: values.owners,
            members: values.members,
            phases: values.phases
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
            validationSchema={Schema}
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
                            <Label htmlFor="name" md={2}>Board name *</Label>
                            <Col md={10}>
                                <Input type="text"
                                       name="name"
                                       id="name"
                                       value={values.name}
                                       onChange={handleChange}
                                       invalid={touched.name && !!errors.name}
                                />
                                <FormFeedback>{errors.name}</FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="owners" md={2}>Owners</Label>
                            <Col md={10}>
                                <AsyncSelect
                                    name="owners"
                                    id="owners"
                                    styles={normalStyle}
                                    defaultOptions={false}
                                    isMulti
                                    cacheOptions
                                    value={values.owners?.map(owner => ({value: owner.id, label: owner.email}))}
                                    loadOptions={props.loadOptions}
                                    onChange={selectedValue => {
                                        setFieldValue('owners', selectedValue?.map(item => ({
                                            id: item.value,
                                            email: item.label
                                        })));
                                    }}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="members" md={2}>Members *</Label>
                            <Col md={10}>
                                <AsyncSelect
                                    name="members"
                                    id="members"
                                    styles={errors.members && touched.members ? errorStyle : normalStyle}
                                    defaultOptions={false}
                                    isMulti
                                    cacheOptions
                                    value={values.members.map(member => ({value: member.id, label: member.email}))}
                                    loadOptions={props.loadOptions}
                                    onChange={selectedValue => {
                                        setFieldValue('members', selectedValue?.map(item => ({
                                            id: item.value,
                                            email: item.label
                                        })));
                                    }}
                                    onBlur={() => {
                                        setTouched({members: true})
                                    }}
                                />
                                <ErrorMessage name="members">{msg => <div
                                    className="invalid-feedback d-block">{msg}</div>}</ErrorMessage>
                            </Col>
                        </FormGroup>

                        <code>{JSON.stringify(values)}</code><br />
                        <code>{JSON.stringify(errors)}</code><br />
                        <code>{JSON.stringify(touched)}</code><br />
                        <FieldArray name="phases">
                            {
                                (arrayHelpers) => (
                                    <Row>
                                        <Col md="12">
                                            <FormGroup row>
                                                <Label htmlFor="phases" md={2}>Phases *</Label>
                                                <Col md={10}>
                                                    <InputGroup>
                                                        <Input type="text"
                                                               name="phases"
                                                               id="phases"
                                                               invalid={errors.phases}
                                                               value={newPhase}
                                                               onChange={e => {
                                                                   setNewPhase(e.target.value);
                                                               }}
                                                        />
                                                        <InputGroupAddon addonType="append">
                                                            <InputGroupText
                                                                style={errors.phases && touched.phases && {borderBottom : '1px solid #dc3545', borderRight : '1px solid #dc3545', borderTop: '1px solid #dc3545'}}
                                                                onClick={() => {
                                                                    const obj = {
                                                                        name: newPhase
                                                                    };
                                                                    arrayHelpers.push(obj);
                                                                    setNewPhase('');
                                                                }}
                                                            >
                                                                <i className="fas fa-plus text-success"/>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                    <ErrorMessage name="phases">{msg => <div
                                                        className="invalid-feedback d-block">{msg}</div>}</ErrorMessage>
                                                </Col>
                                            </FormGroup>
                                            <Row>
                                                <Col md={2}/>
                                                <Col md={10}>
                                                    <ListGroup className="d-flex flex-column align-items-center">
                                                        {values.phases?.map((phase, index) => {
                                                            return (
                                                                <React.Fragment key={phase.name}>
                                                                    <ListGroupItem className="mr-2 p-3 w-75 rounded"
                                                                                   tag="span"
                                                                                   draggable
                                                                                   onDragStart={(e) => {
                                                                                       e.dataTransfer.setData('phase', JSON.stringify({id: phase.id, name: phase.name, index: index}));
                                                                                   }}
                                                                                   onDragOver={(e) => {
                                                                                       e.preventDefault();
                                                                                   }}
                                                                                   onDrop={(e) => {
                                                                                       const phase = JSON.parse(e.dataTransfer.getData('phase'));
                                                                                       arrayHelpers.remove(phase.index);
                                                                                       arrayHelpers.insert(index, {id: phase.id, name: phase.name});
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
                                                                                    arrayHelpers.remove(index);
                                                                                }}><i className="fas fa-times"></i>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </ListGroupItem>
                                                                    {index !== values.phases.length - 1 && (
                                                                        <div
                                                                            className="w-75 my-3 d-flex flex-row justify-content-center">
                                                                            <i className="fas fa-arrow-down fa-2x"></i>
                                                                        </div>
                                                                    )}
                                                                </React.Fragment>
                                                            )
                                                        })}
                                                    </ListGroup>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                )
                            }
                        </FieldArray>
                        <Button type="submit" disabled={isSubmitting} onClick={() => {
                            validateForm(errors);
                        }} color="primary">Save</Button>
                    </Form>
                )}
        />
    );
};

export default BoardForm;
