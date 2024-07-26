import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
interface Like {
    likedBy: string;
}

interface Comment {
    _id: string;
    userId: string;
    message: string;
    userImg: string;
    userName: string;
    createdAt: string;
    likes: Like[];
}

interface Post {
    _id: string;
    message: string;
    image: {
        url: string | undefined;
        type: 'image' | 'video' | 'gif' | undefined;
    };
    name: string;
    userImage: string;
    createdAt: string;
    commentList: Comment[];
    likes: Like[];
}

interface PostsState {
    posts: Post[];
    isLoading: boolean;
    hasMore: boolean;
    currentPage: number;
    hasFetched: boolean;
    closeFeedbackModal:() => void;
    initializePosts: () => Promise<void>;
    fetchMoreData: () => Promise<void>;
    addPost: (postData: any) => Promise<void>;
    updatePost: (postId: string, newTitle: string, newImage: { url: string | undefined; type: 'image' | 'video' | 'gif' | undefined }) => Promise<void>;
    deletePost: (postId: string) => Promise<void>;
    addComment: (comment: { message: string; username: string; postId: string }) => Promise<void>;
    deleteComment: (postId: string, commentId: string, username: string | undefined | null) => Promise<void>;
    likePost: (postId: string, username: string | undefined) => Promise<void>;
    likeComment: (postId: string, commentId: string, username?: string | undefined | null) => Promise<void>;
    showFeedbackModal:{show:boolean,title:string, message:string};
}

export const usePostsStore = create<PostsState>()(
    devtools((set, get) => ({
      posts: [],
      isLoading: true,
      hasMore: true,
      currentPage: 1,
      hasFetched: false,
      showFeedbackModal:{show:false,title:'',message:''},

      closeFeedbackModal: () =>{
        set({showFeedbackModal:{show:false,title:'',message:''}})
      },


      initializePosts: async () => {
  
        set({ isLoading: true });
        try {
          const response = await fetch("/api/posts/addPost");
          const data = await response.json();
          set({ posts: data.posts, isLoading:false });
        } catch (error) {
          console.error("Failed to fetch initial posts", error);
        } finally {
          set({ isLoading: false });
        }
      },
    fetchMoreData: async () => {
        try {
            const state = get();
            const response = await fetch(`/api/posts/addPost?page=${state.currentPage + 1}`);
            const data = await response.json();
            set((state) => ({
                posts: [...state.posts, ...data.posts],
                isLoading: false,
                currentPage:state.currentPage + 1,
            }));
        } catch (error) {
            console.error(error);
        }
    },

    addPost: async (postData: any) => {
        try {
            
            set((state) => ({
                showFeedbackModal:{show:true, title:'Please wait', message:'Publishing your post!'}
            }))
            const response = await fetch('/api/posts/addPost', {
                method: 'POST',
                body: JSON.stringify(postData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const data = await response.json();
                set((state) => ({
                    showFeedbackModal:{show:true, title:'Opps!', message:'Something went wrong, please try again later'}
                }))
                throw new Error(data.message || 'Something went wrong!');
            }
            const newPost = await response.json();
            set((state) => ({
                showFeedbackModal:{show:true, title:'Success!', message:'Your post has been published!'},
                posts: [newPost.post, ...state.posts]
            }));
        } catch (error) {
            console.error(error);
        }
    },

    updatePost: async (postId: string, newTitle: string, newImage: { url: string | undefined; type: 'image' | 'video' | 'gif' | undefined }) => {
        try {
            set((state) => ({
                showFeedbackModal:{show:true, title:'Please wait', message:'Updating your post!'}
            }))
            const response = await fetch('/api/posts/addPost', {
                method: 'PATCH',
                body: JSON.stringify({ postId, message: newTitle, image: newImage }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            set((state) => ({
                showFeedbackModal:{show:true, title:'Success!', message:'Your post has been updated!'},
            }))
            set((state) => {
                
                const updatedPosts = state.posts.map((post) =>
                    post._id === postId
                        ? { ...post, message: newTitle, image: newImage }
                        : post
                );
                
                return { posts: updatedPosts };
            });
        } catch (error) {
            set((state) => ({
                showFeedbackModal:{show:true, title:'Opps!', message:'Something went wrong, please try again later'}
            }))
            console.error(error);
        }
    },

    deletePost: async (postId: string) => {
        try {
            set((state) => ({
                showFeedbackModal:{show:true, title:'Please wait', message:'Deleting your post'}
            }))
            const response = await fetch(`/api/posts/addPost`, {
                method: 'DELETE',
                body: JSON.stringify({postId:postId}),
				headers: {
					"Content-Type": "application/json",
				},
            });
            if (response.ok) {
                set((state) => ({
                    showFeedbackModal:{show:true, title:'Success!', message:'Deleted your post!'},
                    posts: state.posts.filter((post) => post._id !== postId)
                }));
            } else {
                set((state) => ({
                    showFeedbackModal:{show:true, title:'Opps!', message:'Something went wrong, please try again later'}
                }))
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong!');
            }
        } catch (error) {
            console.error(error);
        }
    },

    addComment: async (comment: { message: string; username: string; postId: string }) => {
        try {
            set((state) => ({
                showFeedbackModal:{show:true, title:'Please wait', message:'Adding your comment!'}
            }))
            const response = await fetch('/api/posts/addComment', {
                method: 'POST',
                body: JSON.stringify(comment),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                set((state) => ({
                    showFeedbackModal:{show:true, title:'Opps!', message:'Something went wrong, please try again later'}
                }))
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong!');
            }
            const data = await response.json();
            set((state) => ({
                showFeedbackModal:{show:true, title:'Success!', message:'Added your comment!'},
                posts: state.posts.map((post) =>
                    post._id === comment.postId
                        ? { ...post, commentList: [...post.commentList || [], data.comment] }
                        : post
                )
            }));
        } catch (error) {
            console.error(error);
        }
    },

    deleteComment: async (postId: string, commentId: string, username: string | undefined | null) => {
        try {
            set((state) => ({
                showFeedbackModal:{show:true, title:'Please wait', message:'Deleting your comment!'}
            }))
            const response = await fetch('/api/posts/deleteComment', {
                method: 'DELETE',
                body: JSON.stringify({ postId, commentId, username }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                set((state) => ({
                    showFeedbackModal:{show:true, title:'Success!', message:'Deleted your comment!'},
                    posts: state.posts.map((post) =>
                        post._id === postId
                            ? { ...post, commentList: post.commentList.filter((comment) => comment._id !== commentId) }
                            : post
                    )
                }));
            } else {
                set((state) => ({
                    showFeedbackModal:{show:true, title:'Opps!', message:'Something went wrong, please try again later'}
                }))
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong!');
            }
        } catch (error) {
            console.error(error);
        }
    },

    likePost: async (postId: string, username: string | undefined) => {
        try {
            
            const response = await fetch('/api/posts/postLikes', {
                method: 'POST',
                body: JSON.stringify({ postId, username }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                set((state) => {
                    const updatedPosts = state.posts.map((post) =>
                        post._id === postId
                            ? {
                                ...post,
                                likes: data.isLiked
                                    ? [...post.likes, { likedBy: username! }]
                                    : post.likes.filter((like) => like.likedBy !== username)
                            }
                            : post
                    );
                    return { posts: updatedPosts };
                });
            }
        } catch (error) {

            console.error(error);
        }
    },

    likeComment: async (postId: string, commentId: string, username?: string | undefined | null) => {
        try {
            const response = await fetch('/api/posts/commentLikes', {
                method: 'POST',
                body: JSON.stringify({ postId, commentId, username }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                set((state) => {
                    const updatedPosts = state.posts.map((post) => {
                        if (post._id !== postId) return post;
                        const updatedCommentList = post.commentList.map((comment) =>
                            comment._id === commentId
                                ? {
                                    ...comment,
                                    likes: data.isLiked
                                        ? [...comment.likes, { likedBy: username! }]
                                        : comment.likes.filter((like) => like.likedBy !== username)
                                }
                                : comment
                        );
                        return { ...post, commentList: updatedCommentList };
                    });
                    return { posts: updatedPosts };
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
})));
