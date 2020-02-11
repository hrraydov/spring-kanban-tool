import React, {useEffect, useState} from 'react';
import {Container, Row, Col, Card, CardImg, CardBody, Modal, ModalHeader, ModalBody} from 'reactstrap';
import {userInfo, editUser} from "../services/board-service";
import UserDetailsForm from "./UserDetailsForm";
import useUser from "../hooks/useUser";

const UserDetails = (props) => {

    const [user, setUser] = useState({});
    const [shouldFetch, setShouldFetch] = useState(true);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const {userId} = props.match.params;

    const userDetails = useUser();

    useEffect(() => {
        const func = async () => {
            const user = await userInfo(+userId);

            setLoading(false);
            setUser(user);
        };
        if (shouldFetch) {
            func();
            setShouldFetch(false);
        }
        return () => {
            setShouldFetch(false);
            setLoading(false);
        }
    }, [props.match.params, user, shouldFetch]);

    const handleSubmit = (data) => {

        editUser(data)
            .then(res => {
                setOpenModal(false);
                setShouldFetch(true);
            }).catch(err => {
            console.error(err);
        });
    };

    const renderModal = () => {
        return (
            <Modal isOpen={openModal} toggle={() => {
                setOpenModal(!openModal);
            }} className="modal-lg">
                <ModalHeader toggle={() => {
                    setOpenModal(!openModal);
                }}>{'Edit user profile'}</ModalHeader>
                <ModalBody>
                    <UserDetailsForm data={user} onSubmit={(data) => {
                        handleSubmit(data)
                    }}/>
                </ModalBody>
            </Modal>
        );
    };

    return (
        <Container>
            {openModal && renderModal()}
            <Row>
                <Col md="12">
                    <div><h2> User profile</h2></div>
                    <Card className="d-flex flex-row">
                        <CardImg className="w-25 h-25 m-2"
                                 src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/user-male-icon.png"
                                 alt="Card image cap"/>
                        <CardBody>
                            <Row>
                                <Col md="2" className="font-weight-bold d-flex flex-column">
                                    <span> Email </span>
                                    <span className="my-1"> First name </span>
                                    <span> Last name </span>
                                </Col>
                                <Col md="8" className="d-flex flex-column">
                                    <span>{user.email}</span>
                                    <span className="my-1">{user.firstName ? user.firstName : ' - '}</span>
                                    <span>{user.lastName ? user.lastName : ' - '}</span>
                                </Col>
                                <Col md="2" className="d-flex justify-content-end">
                                    {user.id === userDetails.id ?
                                        <span onClick={() => {
                                            setOpenModal(true);
                                        }}>
                                            <i className="fas fa-edit fa-2x"/>
                                        </span> : ''
                                    }
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserDetails;
