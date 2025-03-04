import "./PostDetail.css";
import {useQuery} from "@tanstack/react-query";
import {fetchComments} from "./api.js";

export function PostDetail({post, deleteMutation, updateMutation}) {
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
      <div>
        <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
        {deleteMutation.isPending && (
          <p className="loading">Deleting the post</p>
        )}
        {deleteMutation.isError && (
          <p className="error">
            Error deleting the Post : {deleteMutation.error.toString()}
          </p>
        )}
        {deleteMutation.isSuccess && (
          <p className="success">
            Post was (not) deleted.
          </p>
        )}
      </div>
      <div>
        <button onClick={() => updateMutation.mutate(post.id)}>Update title</button>
        {updateMutation.isPending && (
          <p className="loading">Updating the post</p>
        )}
        {updateMutation.isError && (
          <p className="error">
            Error updating the post: {updateMutation.error.toString()}
          </p>
        )}
        {updateMutation.isSuccess && (
          <p className="success">Title was (not) updated</p>
        )}
      </div>
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
