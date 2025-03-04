import {useEffect, useState} from "react";
import {PostDetail} from "./PostDetail";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deletePost, fetchPosts} from "./api.js";

const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  // deleteMutation이 실제로는, 'deleteMutation.mutate' 라는 mutate함수라는 것!
  // 누군가 삭제버튼을 클릭할 때, 우리가 실행하고 싶은 함수로의 접근을 하게 하고 postDetail 컴포넌트 내에서 실행될 것이다!
  // 비록 Posts.jsx에서 실행되는 게 아니지만 이 deleteMutation을 PostDetail 컴포넌트로 전달한다
  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });

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
  const {data, isError, error, isLoading} = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000, // 2 seconds
  });

  if (isLoading) {
    return <h3>Loading..</h3>;
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
            onClick={() => {
              deleteMutation.reset(); // Mutation 리셋
              setSelectedPost(post)
            }}
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
      {selectedPost && <PostDetail post={selectedPost} deleteMutation={deleteMutation}/>}
    </>
  );
}
