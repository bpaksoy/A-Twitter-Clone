import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { baseUrl } from "../../shared";



export default function Profile() {
    const { id } = useParams();
    const [user, setUser] = useState();
    const [tweets, setTweets] = useState();
    const [notFound, setNotFound] = useState();
    const [followList, setFollowList] = useState();
    const location = useLocation();
    const { profile } = location.state;


    useEffect(() => {

        fetch(`${baseUrl}tweets/users/${id}`)
            .then((response) => {
                if (response.status === 404) {
                    setNotFound(true)
                }
                return response.json()
            })
            .then((data) => {
                setUser(data.user)
                setTweets(data.tweets)
            });


        fetch(`http://127.0.0.1:8000/user/${id}/follows`)
            .then((response) => {
                if (response.status === 404) {
                    setNotFound(true)
                }
                return response.json()
            })
            .then((data) => {
                // console.log("follow list data", data.follow_list)
                setFollowList(data.follow_list)
            });


    }, [id])

    const followUser = (e) => {
        e.preventDefault();
        console.log("Follow button clicked!");
        fetch(`http://127.0.0.1:8000/follow/${id}`)
            .then((response) => {
                if (response.status === 404) {
                    setNotFound(true)
                }
                return response.json()
            })
            .then((data) => {
                console.log("follow list data", data)
                setFollowList(data.follow_list)
            });

    }


    const unfollowUser = (e) => {
        e.preventDefault();
        console.log("Unfollow button clicked!");
        fetch(`http://127.0.0.1:8000/unfollow/${id}`)
            .then((response) => {
                if (response.status === 404) {
                    setNotFound(true)
                }
                return response.json()
            })
            .then((data) => {
                console.log("unfollow list data", data)
                setFollowList(data.follow_list)
            });

    }


    const followButton = () => {
        if (followList) {
            const followedUser = followList[0].follows.filter(profile => profile.includes(user.username));
            console.log("User followed?", followedUser.length);
            if (followedUser.length) {
                return <button onClick={unfollowUser} type="submit" className="btn btn-primary">Unfollow</button>;
            } else {
                return <button onClick={followUser} type="submit" className="btn btn-primary">Follow</button>;
            }
        } else {
            return null;
        }

    }


    return (
        <>
            {notFound ? <p>The user with id {id} was not found </p> : null}
            {user ? (
                <div className="container">
                    <div className="row">
                        {user ? <div className="col-sm">
                            <br />
                            <div className="card mb-3 sticky-top" style={{ width: "18rem" }}>
                                <div className="card-body">
                                    <h5 className="card-title">@{user.username}</h5>
                                    <p className="card-text">Following: {followList ? followList[0].follows.length : 0}</p>
                                    <p className="card-text">Followed by: {followList ? followList[0].followed_by.length : 0}</p>
                                    {profile.id !== user.id ? followButton() : null}
                                </div>
                            </div>
                        </div>
                            : null}
                        <div className="col-sm">
                            {tweets.length ?
                                <div className="mx-5 pt-2">
                                    <p>@{user.username} wrote: </p>
                                    {tweets.map((tweet, index) => {
                                        return (
                                            <Card style={{ width: '18rem' }}>
                                                <Card.Body key={index}>
                                                    <Card.Text>{tweet.content}</Card.Text>
                                                    <Card.Text>On {tweet.created_at.substring(0, 10)} at {tweet.created_at.substring(11, 16)}</Card.Text>
                                                </Card.Body>
                                            </Card>)
                                    })}
                                    <br />
                                </div> :
                                <div className="mx-2 pt-2">
                                    <Card style={{ width: '32rem' }}>
                                        <Card.Body>
                                            <Card.Text>@{user.username} has no tweets yet...</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                            }
                        </div>
                        <div className="col-sm"></div>
                        <div className="col-sm"></div>
                    </div>
                </div>

            ) : null}

        </>
    );

}