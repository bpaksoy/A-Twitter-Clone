import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import UserProfile from "./UserProfile";
import Card from "react-bootstrap/Card";

export default function Following(props) {
    const { id } = useParams();
    const [notFound, setNotFound] = useState();
    const [profile, setProfile] = useState();
    const location = useLocation();
    const { user } = location.state;
    const [tweetsByFollowedUsers, setTweetsByFollowedUsers] = useState([])

    useEffect(() => {
        fetch(`/user/${id}/followed_users`)
            .then((response) => {
                if (response.status === 404) {
                    setNotFound(true);
                }
                return response.json();
            })
            .then((data) => {
                // console.log("data in following", data)
                setTweetsByFollowedUsers([...data.data]);
            });

        fetchData();

    }, [id])

    const fetchData = async () => {
        const url = "/api/profile";
        const response = await axios.get(url,
            { 'withCredentials': true });
        const profile = response.data;
        setProfile(profile);
        return user;
    }



    return (<>
        {notFound ? <p>The user cannot be found.</p> : null}
        {tweetsByFollowedUsers.length ? (
            <div className="container">
                <div className="row">
                    <div className="col-sm">{<Sidebar user={user} />}</div>
                    <div className="col-sm">
                        <div className="mx-2 pt-2">
                            {tweetsByFollowedUsers.map((tweet, index) => {
                                return (
                                    <Card style={{ width: '32rem' }}>
                                        <Card.Body key={index}>
                                            <Card.Text><Link to={`/user/${tweet.user}/following`} state={{ profile: profile }} component={UserProfile}>@{tweet.username} </Link> wrote:</Card.Text>
                                            <Card.Text>{tweet.content}</Card.Text>
                                            <Card.Text>On {tweet.created_at.substring(0, 10)} at {tweet.created_at.substring(11, 16)}</Card.Text>
                                        </Card.Body>
                                    </Card>)
                            })}
                            <br />
                        </div>
                    </div>
                    <div className="col-sm"></div>
                    <div className="col-sm"></div>
                </div>
            </div>

        ) : <div className="container">
            <div className="row">
                <div className="col-sm">{<Sidebar user={user} />}</div>
                <div className="col-sm">
                    <div className="mx-2 pt-2">
                        <Card style={{ width: '32rem' }}>
                            <Card.Body>
                                <Card.Text>You are not following anyone yet</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
                <div className="col-sm"></div>
                <div className="col-sm"></div>
            </div>
        </div>
        }
    </>
    )


}


