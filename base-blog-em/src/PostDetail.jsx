import "./PostDetail.css";
import {useQuery} from "@tanstack/react-query";
import {fetchComments} from "./api.js";

export function PostDetail({post, deleteMutation}) {
  // replace with useQuery
  // const data = []; // 초기값
  const {data, isError, error, isLoading} = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
    staleTime: 2000, // 2s
  });

  if (isLoading) {
    return <h4>Loading..</h4>;
  }
  if (isError) {
    return (
      <>
        <h4>Something went wrong!</h4>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <h3 style={{color: "blue"}}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
