import {useEffect, useState} from "react";
import {PostDetail} from "./PostDetail";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchPosts} from "./api.js";

const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage)
      });
    }
  }, [currentPage, queryClient]);

  // replace with useQuery
  // const data = []; // 초기값
  const {data, isError, error, isFetching} = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000, // 2 seconds
  });

  if (isFetching) {
    return <h3>Fetching in progress..</h3>;
  }
  if (isError) {
    return <>
      <h3>Oops, something went wrong!</h3>
      <p>{error.toString()}</p>
    </>
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} onClick={() => {
          setCurrentPage((previousValue) => previousValue - 1);
        }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage} onClick={() => {
          setCurrentPage((previousValue) => previousValue + 1);
        }}>
          Next page
        </button>
      </div>
      <hr/>
      {selectedPost && <PostDetail post={selectedPost}/>}
    </>
  );
}
