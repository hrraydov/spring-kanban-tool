import React, { useState } from 'react';
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
import { Formik, ErrorMessage, Field } from 'formik';

const Schema = Yup.object().shape({
    name: Yup.string()
        .min(1, `The name must contains at least on digit.`)
        .required('The name is required.'),
    phases: Yup.array()
        .min(2, 'Create at least two phases.'),
});

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
                    setFieldTouched,
                    validateForm,
                    validateField,
                    setTouched,
                    ...other
                }) => (
                        <Form onSubmit={handleSubmit} noValidate>
                            <Field name="name">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                        <FormGroup row>
                                            <Label htmlFor="name" md={2}>Board name *</Label>
                                            <Col md={10}>
                                                <Input type="text"
                                                    id="name"
                                                    {...field}
                                                    invalid={meta.touched && !!meta.error}
                                                />
                                                <ErrorMessage name="name">{msg => (<FormFeedback>{msg}</FormFeedback>)}</ErrorMessage>
                                            </Col>
                                        </FormGroup>
                                    )
                                }
                            </Field>
                            <Field name="owners">
                                {({ field, form: { errors, touched }, meta }) => (
                                    <FormGroup row>
                                        <Label htmlFor={field.name} md={2}>Owners</Label>
                                        <Col md={10}>
                                            <AsyncSelect
                                                id={field.name}
                                                name={field.name}
                                                styles={normalStyle}
                                                defaultOptions={false}
                                                isMulti
                                                cacheOptions
                                                value={field.value.map(owner => ({ value: owner.id, label: owner.email }))}
                                                loadOptions={props.loadOptions}
                                                onChange={selectedValue => {
                                                    setFieldValue(field.name, selectedValue?.map(item => ({
                                                        id: item.value,
                                                        email: item.label
                                                    })));
                                                }}
                                                onBlur={() => {
                                                    values[field.name].forEach((value, index) => {
                                                        setFieldTouched(`${field.name}[${index}].id`);
                                                        setFieldTouched(`${field.name}[${index}].email`);
                                                    });
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                )}
                            </Field>
                            <Field name="members">
                                {({ field, form: { errors, touched }, meta }) => (
                                    <FormGroup row>
                                        <Label htmlFor={field.name} md={2}>Members</Label>
                                        <Col md={10}>
                                            <AsyncSelect
                                                id={field.name}
                                                name={field.name}
                                                styles={normalStyle}
                                                defaultOptions={false}
                                                isMulti
                                                cacheOptions
                                                value={field.value.map(member => ({ value: member.id, label: member.email }))}
                                                loadOptions={props.loadOptions}
                                                onChange={selectedValue => {
                                                    setFieldValue(field.name, selectedValue?.map(item => ({
                                                        id: item.value,
                                                        email: item.label
                                                    })));
                                                }}
                                                onBlur={() => {
                                                    values[field.name].forEach((value, index) => {
                                                        setFieldTouched(`${field.name}[${index}].id`);
                                                        setFieldTouched(`${field.name}[${index}].email`);
                                                    });
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                )}
                            </Field>
                            <Field name="phases">
                                {
                                    ({ field }) => (
                                        <Row>
                                            <Col md="12">
                                                <FormGroup row>
                                                    <Label htmlFor="phases" md={2}>Phases *</Label>
                                                    <Col md={10}>
                                                        <InputGroup>
                                                            <Input type="text"
                                                                name="phases"
                                                                id="phases"
                                                                value={newPhase}
                                                                onChange={e => {
                                                                    setNewPhase(e.target.value);
                                                                }}
                                                            />
                                                            <InputGroupAddon addonType="append">
                                                                <InputGroupText
                                                                    //style={errors.phases && touched.phases && { borderBottom: '1px solid #dc3545', borderRight: '1px solid #dc3545', borderTop: '1px solid #dc3545' }}
                                                                    onClick={() => {
                                                                        const obj = {
                                                                            name: newPhase
                                                                        };
                                                                        setNewPhase('');
                                                                        const newValue = Object.assign([], [...values[field.name], obj]);
                                                                        setFieldValue(field.name, newValue);
                                                                        newValue.forEach((value, index) => {
                                                                            setFieldTouched(`${field.name}[${index}].id`);
                                                                            setFieldTouched(`${field.name}[${index}].name`);
                                                                        });
                                                                        validateForm({
                                                                            ...values,
                                                                            phases: newValue
                                                                        });
                                                                    }}
                                                                >
                                                                    <i className="fas fa-plus text-success" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                        <ErrorMessage name="phases">{msg => (<FormFeedback className="d-block">{msg}</FormFeedback>)}</ErrorMessage>
                                                    </Col>
                                                </FormGroup>
                                                <Row>
                                                    <Col md={2} />
                                                    <Col md={10}>
                                                        <ListGroup className="d-flex flex-column align-items-center">
                                                            {values.phases?.map((phase, index) => {
                                                                return (
                                                                    <React.Fragment key={phase.id + phase.name}>
                                                                        <ListGroupItem className="mr-2 p-3 w-75 rounded"
                                                                            tag="span"
                                                                            draggable
                                                                            onDragStart={(e) => {
                                                                                e.dataTransfer.setData('phase', JSON.stringify({ id: phase.id, name: phase.name, index: index }));
                                                                            }}
                                                                            onDragOver={(e) => {
                                                                                e.preventDefault();
                                                                            }}
                                                                            onDrop={(e) => {
                                                                                const phase = JSON.parse(e.dataTransfer.getData('phase'));
                                                                                const oldValues = Object.assign([], values.phases);
                                                                                oldValues.splice(phase.index, 1);
                                                                                oldValues.splice(index, 0, phase);
                                                                                setFieldValue(field.name, oldValues);
                                                                                oldValues.forEach((value, index) => {
                                                                                    setFieldTouched(`${field.name}[${index}].id`);
                                                                                    setFieldTouched(`${field.name}[${index}].name`);
                                                                                });
                                                                                validateForm({
                                                                                    ...values,
                                                                                    phases: oldValues
                                                                                });
                                                                            }}
                                                                        >
                                                                            <div className="d-flex justify-content-between">
                                                                                <Badge pill className="mr-1 d-flex align-items-center">{index + 1}</Badge>
                                                                                <span className="text-wrap">{phase.name}</span>
                                                                                <div className="d-flex flex-row justify-content-between ml-1">
                                                                                    <span onClick={() => {
                                                                                        const oldValues = Object.assign([], values.phases);
                                                                                        oldValues.splice(index, 1);;
                                                                                        setFieldValue(field.name, oldValues);
                                                                                        oldValues.forEach((value, index) => {
                                                                                            setFieldTouched(`${field.name}[${index}].id`);
                                                                                            setFieldTouched(`${field.name}[${index}].name`);
                                                                                        });
                                                                                        validateForm({
                                                                                            ...values,
                                                                                            phases: oldValues
                                                                                        });
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
                            </Field>

                            <Button type="submit" disabled={isSubmitting} color="primary">Save</Button>
                        </Form>
                    )}
        />
    );
};

export default BoardForm;
