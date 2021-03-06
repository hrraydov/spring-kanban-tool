import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { getBoards, deleteBoard, editBoard, createBoard, getBoard, getUser } from '../services/board-service';
import useUser from '../hooks/useUser';
import BoardForm from "./BoardForm";

const Boards = (props) => {
    const [boards, setBoards] = useState([]);
    const [board, setBoard] = useState({});
    const [loading, setLoading] = useState(true);
    const [shouldLoad, setShouldLoad] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const userDetails = useUser();

    useEffect(() => {
        const func = async () => {
            const boards = await getBoards();
            setLoading(false);
            setBoards(boards);
        };
        console.log(shouldLoad);
        if (shouldLoad) {
            func();
            setShouldLoad(false);
        }
        return () => {
            setLoading(false);
        }
    }, [shouldLoad]);

    const handleDelete = (boardId) => {
        deleteBoard(boardId)
            .then(() => {
                setShouldLoad(true);
            }).catch(err => {
                console.error(err);
            });
    };

    const handleSubmitBoard = (data, meta) => {
        modalEditOpen ?
            editBoard(board.id, data)
                .then(res => {
                    setOpenModal(false);
                    setShouldLoad(true);
                    setBoard({});
                }).catch(err => {
                    console.error(err);
                })
            :
            createBoard(data)
                .then(res => {
                    setOpenModal(false);
                    setShouldLoad(true);
                }).catch(err => {
                    console.error(err);
                });
    };

    const handleAddBoard = () => {
        setModalEditOpen(false);
        setOpenModal(true);
    };

    const handleEdit = (boardId) => {
        setModalEditOpen(true);
        getBoard(boardId)
            .then(res => {
                setBoard(res);
                setOpenModal(true);
            }).catch(err => {
                console.error(err);
            });
    };

    const fetchUsers = (selectInput) => {
        return new Promise(resolve => {
            if (selectInput.length >= 3) {
                getUser(selectInput)
                    .then(res => {
                        resolve(res.map(user => ({ value: user.id, label: user.email })));
                    })
                    .catch(err => {
                        console.error(err);
                    });
            } else {
                setTimeout(() => { resolve([]); }, 10);
            }
        });

    };

    const handleDetails = (boardId) => {
        props.history.push(`/boards/${boardId}/details`);
    };

    const isOwner = (boardId) => {
        return boards.find(board => board.id === boardId).owners.map(owner => owner.id).includes(userDetails.id);
    };

    const renderBoardModal = () => {
        return (
            <Modal isOpen={openModal} toggle={() => {
                setOpenModal(!openModal);
                setBoard({});
            }} className="modal-lg">
                <ModalHeader toggle={() => {
                    setOpenModal(!openModal);
                    setBoard({});
                }}>{modalEditOpen ? 'Edit board' : 'Add board'}</ModalHeader>
                <ModalBody>
                    <BoardForm data={board} loadOptions={fetchUsers} type={modalEditOpen ? 'edit' : 'create'}
                        onSubmit={(data) => {
                            handleSubmitBoard(data)
                        }} />
                </ModalBody>
            </Modal>
        );
    };

    return (
        <Container>
            <Row>
                {openModal && renderBoardModal()}
                <Col md="12">
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Your role</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                boards ? boards.map(item => (
                                    <tr key={item.id}>
                                        <th scope="row" onClick={() => {
                                            handleDetails(item.id);
                                        }}>{item.id}</th>
                                        <td onClick={() => {
                                            handleDetails(item.id);
                                        }}>{item.name}</td>
                                        <td onClick={() => {
                                            handleDetails(item.id);
                                        }}>{isOwner(item.id) ? 'Owner' : 'Member'}</td>
                                        <td className="text-center">
                                            {
                                                isOwner(item.id) && (
                                                    <React.Fragment>
                                                        <a href="javascript:;" onClick={() => {
                                                            handleEdit(item.id)
                                                        }}>
                                                            <i className="far fa-edit mr-2 text-info" />
                                                        </a>
                                                        <a href="javascript:;" onClick={() => {
                                                            handleDelete(item.id)
                                                        }}>
                                                            <i className="far fa-trash-alt text-danger" />
                                                        </a>
                                                    </React.Fragment>
                                                )
                                            }
                                        </td>
                                    </tr>
                                )) :
                                    (
                                        <tr>
                                            <td colSpan="4">No data found!</td>
                                        </tr>
                                    )
                            }
                        </tbody>
                    </Table>
                    {
                        loading &&
                        <div className="d-flex justify-content-center">
                            <i className="text-primary fas fa-spinner fa-spin fa-2x"></i>
                        </div>
                    }
                    <Button color="primary" onClick={() => {
                        handleAddBoard()
                    }}><i className="fas fa-plus-circle mr-1"></i>Add new board</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Boards;
