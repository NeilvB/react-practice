import { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom'
import './App.css'
import { PropTypes } from 'prop-types'

const PostIndex = ({ posts, deletePost, resetAllPosts }) => {
  return (
    <>
      <ol>
        {posts.map((post, index) => (
          <li key={index}>
            {post.title} <Link to={`/posts/${post.id}/edit`}>Edit</Link>{' '}
            <input
              type="button"
              value="Delete"
              onClick={() => {
                deletePost(post.id)
              }}
            />
          </li>
        ))}
      </ol>

      <Link to="/posts/new">New Post</Link>
      <Link to="/posts/review">Next</Link>
      <input
        type="button"
        value="Reset all posts"
        onClick={() => {
          resetAllPosts()
        }}
      />
    </>
  )
}

PostIndex.propTypes = {
  posts: PropTypes.array,
  deletePost: PropTypes.func,
  resetAllPosts: PropTypes.func,
}

const EditPost = ({ posts, updatePost }) => {
  const { postId } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState({})

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    const post = posts.find((post) => post.id === parseInt(postId, 10))

    setPost(post)
    setTitle(post.title)
    setBody(post.body)
  }, [posts, postId])

  return (
    <form>
      <div>
        <label htmlFor="postTitle">Title</label>
        <input
          type="text"
          name="title"
          id="postTitle"
          defaultValue={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="postBody">Body</label>]
        <textarea
          name="postBody"
          id="postBody"
          cols="30"
          rows="10"
          defaultValue={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
      </div>

      <input
        type="submit"
        value="Update Post"
        onClick={(e) => {
          e.preventDefault()

          const updatedPost = {
            ...post,
            body,
            title,
          }

          updatePost(post.id, updatedPost)
          navigate('/posts')
        }}
      />
    </form>
  )
}

EditPost.propTypes = {
  posts: PropTypes.array,
  updatePost: PropTypes.func,
}

const NewPost = ({ createPost }) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const navigate = useNavigate()

  return (
    <div>
      <form>
        <label htmlFor="title"></label>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />

        <label htmlFor="body"></label>
        <input
          type="text"
          name="body"
          id="body"
          defaultValue={body}
          onChange={(e) => {
            setBody(e.target.value)
          }}
        />

        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault()

            createPost({ title, body })
            navigate('/posts')
          }}
        >
          Create Post
        </button>
      </form>
    </div>
  )
}

NewPost.propTypes = {
  createPost: PropTypes.func,
}

const ReviewPosts = ({ posts, confirmPosts }) => {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Posts</h1>

      <ol>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ol>

      <form>
        <input
          type="submit"
          value="Confirm"
          onClick={async (e) => {
            e.preventDefault()

            await confirmPosts()

            navigate('/posts')
          }}
        />
      </form>
    </div>
  )
}

ReviewPosts.propTypes = {
  posts: PropTypes.array,
  confirmPosts: PropTypes.func,
}

const PostsConfirmation = ({ posts }) => {
  return (
    <>
      <h1>{posts.length} posts created</h1>

      <Link to="/posts"></Link>
    </>
  )
}

PostsConfirmation.propTypes = {
  posts: PropTypes.array,
}

const App = () => {
  const [posts, setPosts] = useState([])

  const readPostsFromCache = () => {
    const storedPosts = window.localStorage.getItem('posts')

    if (!storedPosts) {
      return false
    }

    setPosts(JSON.parse(storedPosts))
    return true
  }

  const clearAndRefreshPosts = async () => {
    window.localStorage.removeItem('posts')
    await getPosts()
  }

  // Write posts to local storage whenever posts changes
  // Means the user can leave / refresh the app without losing progress
  useEffect(() => {
    const storePostsInCache = () => {
      window.localStorage.setItem('posts', JSON.stringify(posts))
    }

    if (posts.length > 0) {
      storePostsInCache()
    }
  }, [posts])

  const getPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    const json = await response.json()

    const posts = json.slice(0, 3)

    setPosts(posts)
  }

  useEffect(() => {
    // Only fetch posts from the API if there are none cached
    if (!readPostsFromCache()) {
      getPosts()
    }
  }, [])

  const updatePost = (postId, updatedPost) => {
    const postToUpdateIndex = posts.findIndex((post) => post.id === postId)

    setPosts((posts) => {
      return [
        ...posts.slice(0, postToUpdateIndex),
        updatedPost,
        ...posts.slice(postToUpdateIndex + 1),
      ]
    })
  }

  const createPost = (post) => {
    const { title, body } = post

    setPosts((posts) => {
      return posts.concat({ id: posts[posts.length - 1].id + 1, title, body })
    })
  }

  const deletePost = (postId) => {
    const indexOfPostToDelete = posts.findIndex((post) => post.id === postId)

    setPosts((posts) => [
      ...posts.slice(0, indexOfPostToDelete),
      ...posts.slice(indexOfPostToDelete + 1),
    ])
  }

  const confirmPosts = async () => {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(posts),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    await clearAndRefreshPosts()
  }

  return (
    <Router>
      <div className="App">
        {
          <Routes>
            <Route
              exact
              path="/posts"
              element={
                <PostIndex
                  posts={posts}
                  deletePost={deletePost}
                  resetAllPosts={() => {
                    clearAndRefreshPosts()
                  }}
                />
              }
            />

            <Route
              path="/posts/:postId/edit"
              element={<EditPost posts={posts} updatePost={updatePost} />}
            />

            <Route
              path="/posts/new"
              element={<NewPost createPost={createPost} />}
            />

            <Route
              path="/posts/review"
              element={
                <ReviewPosts posts={posts} confirmPosts={confirmPosts} />
              }
            />

            <Route
              path="/posts/confirmation"
              element={<PostsConfirmation posts={posts} />}
            />
          </Routes>
        }
      </div>
    </Router>
  )
}

export default App
