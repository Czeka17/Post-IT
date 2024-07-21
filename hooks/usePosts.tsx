import { useState, useEffect } from "react";

interface Comment {
  _id: string;
  userId: string;
  message: string;
  userImg:string;
  userName:string;
  createdAt: string;
  likes: Like[];
}

interface Like {
  likedBy: string;
}

interface Post {
  _id: string;
  message: string;
  image: {
    url: string | undefined;
    type: "image" | "video" | "gif" | undefined;
  };
  name: string;
  userImage: string;
  createdAt: string;
  commentList: Comment[];
  likes: Like[];
}

const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPosts, setShowPosts] = useState(true);

	function ShowFriendList() {
		setShowPosts(false);
	}
	function ShowPostsList() {
		setShowPosts(true);
	}

  useEffect(() => {
    const fetchPosts = async () => {
      fetch(`/api/posts/addPost`)
        .then((response) => response.json())
        .then((data) => {
          setPosts(data.posts);
          setIsLoading(false);
        });
    }
    fetchPosts()
  }, []);
  

  const fetchMoreData = async () => {
    try {
      const response = await fetch(`/api/posts/addPost?page=${currentPage + 1}`);
      const data = await response.json();
      if (data.posts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        setCurrentPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addPost = async (postData: any) => {
    try {
      const response = await fetch("/api/posts/addPost", {
        method: "POST",
        body: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong!");
      }
      const newPost = await response.json();
      setPosts((prevPosts) => [newPost.post, ...prevPosts]);
    } catch (error) {
      console.error(error);
    }
  };

  const updatePost = async (
    postId: string,
    newTitle: string,
    newImage: {
      url: string | undefined;
      type: "image" | "video" | "gif" | undefined;
    }
  ) => {
    setPosts((prevPosts) => {
      const postIndex = prevPosts.findIndex((post) => post._id === postId);
      if (postIndex === -1) {
        return prevPosts;
      }

      const updatedPosts = [...prevPosts];
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        message: newTitle,
        image: newImage,
      };

      return updatedPosts;
    });
  };

  const deletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/deletePost/${postId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addComment = async (comment: { message: string; username: string; postId: string }) => {
    const { postId, ...commentData } = comment;
    try {
      const response = await fetch("/api/posts/addComment", {
        method: "POST",
        body: JSON.stringify({ postId, ...commentData }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }
      const data = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                commentList: [...post.commentList, data.comment],
              }
            : post
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
  
  

  const deleteComment = async (postId: string, commentId: string, username: string | undefined | null) => {
    try {
      const response = await fetch("/api/posts/deleteComment", {
        method: "DELETE",
        body: JSON.stringify({ postId, commentId, username }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setPosts((prevPosts) => {
          const postIndex = prevPosts.findIndex((post) => post._id === postId);
          if (postIndex === -1) {
            return prevPosts;
          }

          const updatedPosts = [...prevPosts];
          updatedPosts[postIndex].commentList = updatedPosts[postIndex].commentList.filter(
            (comment) => comment._id !== commentId
          );

          return updatedPosts;
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const likePost = async (postId: string, username: string | undefined) => {
    try {
      const response = await fetch("/api/posts/postLikes", {
        method: "POST",
        body: JSON.stringify({ postId, username }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts((prevPosts) => {
          const postIndex = prevPosts.findIndex((post) => post._id === postId);
          if (postIndex === -1) {
            return prevPosts;
          }

          const updatedPosts = [...prevPosts];
          const post = updatedPosts[postIndex];

          if (data.isLiked) {
            post.likes.push({ likedBy: username! });
          } else {
            post.likes = post.likes.filter((like) => like.likedBy !== username);
          }

          return updatedPosts;
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const likeComment = async (postId: string, commentId: string, username?: string | undefined | null) => {
    try {
      const response = await fetch("/api/posts/commentLikes", {
        method: "POST",
        body: JSON.stringify({ postId, commentId, username }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts((prevPosts) => {
          const postIndex = prevPosts.findIndex((post) => post._id === postId);
          if (postIndex === -1) {
            return prevPosts;
          }

          const updatedPosts = [...prevPosts];
          const post = updatedPosts[postIndex];
          const commentIndex = post.commentList.findIndex((comment) => comment._id === commentId);

          if (commentIndex === -1) {
            return updatedPosts;
          }

          const updatedCommentList = [...post.commentList];
          const comment = updatedCommentList[commentIndex];

          if (data.isLiked) {
            comment.likes.push({ likedBy: username! });
          } else {
            comment.likes = comment.likes.filter((like) => like.likedBy !== username);
          }

          updatedCommentList[commentIndex] = comment;
          updatedPosts[postIndex].commentList = updatedCommentList;

          return updatedPosts;
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    posts,
    isLoading,
    hasMore,
    fetchMoreData,
    addPost,
    updatePost,
    deletePost,
    addComment,
    deleteComment,
    likePost,
    showPosts,
    ShowFriendList,
    ShowPostsList,
    likeComment
  };
};

export default usePosts;
