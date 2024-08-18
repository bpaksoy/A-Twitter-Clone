import { Link } from "react-router-dom";
import Profile from "./Profile";
import Following from "./Following";


export default function Sidebar(props) {
    const user = props.user;


    return (
        <>
            {user ? <div className="d-flex flex-column flex-shrink-0 p-3 bg-light m-1 sticky-top" style={{ width: 280 }}>
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                    <span className="fs-2">Tweets</span>
                </a>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li>
                        {user ? <Link className="nav-link link-dark link-opacity-50-hover" to={`/tweets/users/${user.id}`} state={{ profile: user }} component={Profile} aria-current="page">
                            My Profile
                        </Link> : null}
                    </li>
                    <li className="nav-item hover:bg-dark">
                        {user ?
                            <Link to={`/user/${user.id}/followed_users`} state={{ user: user }} className="nav-link link-dark link-opacity-50-hover" component={Following}>
                                Following
                            </Link> : null
                        }
                    </li>
                </ul>
                <hr />
            </div> : null}
        </>
    );

}

