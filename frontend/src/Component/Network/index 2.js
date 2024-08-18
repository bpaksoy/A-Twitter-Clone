import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import axios from "axios";
import AddTweet from "./AddTweet";
import { baseUrl } from "../../shared";
import UserProfile from "./UserProfile";
import LikeTweet from "./LikeTweet";
import UpdateTweet from "./UpdateTweet";
import PaginationItem from "./Pagination";
import Sidebar from "./Sidebar";


axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'x-csrftoken'

export default function Network() {

    const [tweets, setTweets] = useState([]);
    const [likedTweet, setLike] = useState();
    const [user, setUser] = useState();
    const [profile, setProfile] = useState();
    const [page, setPage] = useState(1);
    const [listTweets, setListTweets] = useState();
    // console.log("list tweets", listTweets)


    useEffect(() => {
        loadTweets();
        setCSRF();
        listTweetView(page);
        fetchData();
    }, []);

    const setCSRF = async () => {
        let csrfURL = "http://127.0.0.1:8000/api/setcsrf";
        const response = await axios.get(csrfURL);
    }

    const updatePage = (pageNum) => {
        // console.log("update page clicked", page);
        listTweetView(pageNum);
        setPage(pageNum);

    }

    const listTweetView = async (page) => {
        // console.log("Page in listTweetView", page);
        let apiListTweetURL = `http://127.0.0.1:8000/api/list?page=${page}`;
        const response = await axios.get(apiListTweetURL);
        setListTweets(response.data);
    }


    async function loadTweets() {
        const promise = await axios.get(`${baseUrl}tweets`).catch(e => console.log("error is ", e));
        const status = promise.status;
        if (status === 200) {
            const data = promise.data.data;
            setTweets(data);
        }
    }


    const fetchData = async () => {
        const url = "http://127.0.0.1:8000/api/profile";
        const response = await axios.get(url,
            { 'withCredentials': true });
        const user = response.data;
        setUser(user);
        setProfile(user);
        return user;
    }


    const saveTweet = (tweet) => {
        const data = {
            "content": tweet,
            "user": profile.id
        }

        const url = baseUrl + "tweets";
        fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }
            return response.json();

        }).then((data) => {
            setTweets([data.data, ...tweets,]);
            loadTweets();
            listTweetView(page);
        }).catch((e) => {
            console.log(e);
        })
    }

    const updateTweet = (tweet) => {

        const url = baseUrl + "tweets/" + tweet.id;
        // console.log("URL", url)
        fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(tweet)
        }).then((response) => {
            // console.log("response", response)
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }
            return response.json();

        }).then((data) => {
            loadTweets();
            listTweetView(page);
        }).catch((e) => {
            console.log(e);
        })
    }

    const likeTweet = async (tweet_id) => {
        const url = "http://127.0.0.1:8000/likes";
        await axios.post(url, {
            tweet_id: tweet_id
        })
            .then((response) => {
                setLike(response.data.tweet);
                loadTweets();
                listTweetView(page);
            })
    }


    return (
        <div className="container">
            <div className="row">
                <div className="col-sm">
                    <Sidebar user={user} />
                </div>
                <div className="col-sm">
                    <div className="mx-2 pt-2 grid-cols-6">
                        {user ? <AddTweet saveTweet={saveTweet} /> : null}
                        <br />
                        <div className="grid-cols-4">
                            {listTweets ? listTweets.results.map((tweet, index) => {
                                return <div><Card style={{ width: '32rem' }}>
                                    <Card.Body key={index}>
                                        <div className="grid-cols-2"></div><div className="grid-cols-2"><UpdateTweet tweet={tweet} user={user} updateTweet={updateTweet} page={page} listTweetView={listTweetView} loadTweets={loadTweets} /></div>
                                        <Card.Text><Link to={`/user/${tweet.user}/following`} state={{ profile: profile }} component={UserProfile}>{tweet.username}</Link> wrote on {tweet.created_at.substring(0, 10)} at {tweet.created_at.substring(11, 16)}:</Card.Text>
                                        <Card.Text>{tweet.content}</Card.Text>
                                        <hr />
                                        <div className="input-group-prepend">
                                            {user ? <LikeTweet tweet={tweet} user={user} likeTweet={likeTweet} page={page} /> : <LikeTweet tweet={tweet} likeTweet={likeTweet} page={page} />}
                                        </div>
                                    </Card.Body>

                                </Card>

                                </div>
                            }) : null}

                        </div>
                        {listTweets ? <PaginationItem listTweets={listTweets} updatePage={updatePage} /> : null}
                        <div className="grid-cols-2"></div>

                    </div>
                </div>
                <div className="col-sm"></div>
                <div className="col-sm"></div>
            </div>
        </div>
    );
}