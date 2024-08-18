import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function UpdateTweet(props) {
    const [show, setShow] = useState(false);
    const tweet = props.tweet;
    const [updatedTweet, setTweet] = useState();
    const user = props.user;


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        setTweet({
            ...tweet,
            content: e.target.value
        });
    }

    const submitHandler = (e) => {
        e.preventDefault();
        props.updateTweet(updatedTweet);
        handleClose();
    }

    if (user) {
        return (
            <>
                {
                    user.id === tweet.user ?
                        <div
                            className="modal show justify-center"
                            style={{ display: 'block', position: 'initial' }} >
                            <div>
                                <Button className="float-right" centered={true} variant="light" onClick={handleShow}>
                                    Edit
                                </Button>
                            </div>


                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Update tweet here</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form id="update-tweet" onSubmit={submitHandler}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Control type="text" placeholder="Add your tweet" defaultValue={tweet.content} onChange={handleChange} rows={3} />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={handleClose} variant="secondary">Close</Button>
                                    <Button type="submit" form="update-tweet" variant="primary">Edit</Button>
                                </Modal.Footer>
                            </Modal>
                        </div> : null
                }
            </>
        );
    }
}

export default UpdateTweet;