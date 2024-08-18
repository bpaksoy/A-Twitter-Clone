import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function AddTweet(props) {
    const [show, setShow] = useState(false);
    const [state, setState] = useState({
        tweet: ""
    });


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        setState({
            ...state,
            tweet: e.target.value
        });
    }

    const submitHandler = (e) => {
        e.preventDefault();
        props.saveTweet(state.tweet);
        setState({
            ...state,
            tweet: ""
        })
        handleClose()
    }

    return (
        <div
            className="modal show justify-center"
            style={{ display: 'block', position: 'initial' }} >
            <Button centered={true} variant="light" onClick={handleShow}>
                + Add Tweet here
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add tweet here</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="add-tweet" onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Add your tweet" onChange={handleChange} rows={3} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} variant="secondary">Close</Button>
                    <Button type="submit" form="add-tweet" variant="primary">Publish</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AddTweet;