
export default function PaginationItem(props) {

    const listTweets = props.listTweets;
    // console.log("listtweets.next:", listTweets.next);
    const nextPage = listTweets.next ? listTweets.next.match(/\d+/g)[5] : null;
    const previousPage = listTweets.previous ? listTweets.previous.match(/\d+/g)[5] : null;
    const numPages = Math.ceil(listTweets.count / 10);
    const currentPage = nextPage && nextPage <= numPages ? nextPage - 1 : numPages;
    // console.log("next page:", nextPage);
    // console.log("previous page", previousPage);
    // console.log("current page", currentPage);
    // console.log("list tweets count", listTweets.count, "length:", listTweets.results.length)

    // console.log("numPages", numPages)
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
        // console.log("i is", i)
        pages.push(i);
    }



    return (
        <div>
            <br />
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    {listTweets.previous ?
                        <li className="page-item"><a class="page-link" href="?page=1">First</a></li> : null

                    }

                    {previousPage ? <li className="page-item"><a className="page-link" onClick={(e) => {
                        e.preventDefault();
                        return props.updatePage(previousPage);
                    }
                    } href={`?page=${previousPage}`}>Previous</a></li> : null}
                    <li className="page-item disabled"><a href="#" className="page-link">Page {currentPage} of {numPages}</a></li>


                    {pages.map((page) => {
                        return <li class="page-item" onClick={(e) => {
                            e.preventDefault();
                            return props.updatePage(page);
                        }}><a className="page-link" href={`?page=${page}`}>{page}</a></li>
                    })}


                    {nextPage ?
                        <div>
                            <li className="page-item"><a className="page-link" onClick={(e) => {
                                e.preventDefault();
                                return props.updatePage(nextPage);
                            }
                            } href={`?page=${nextPage}`}>Next</a></li>
                        </div> : null
                    }

                </ul>
            </nav>
            <br />
        </div>
    );

}

