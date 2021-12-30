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

const PostIndex = ({ posts, deletePost }) => {
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

      <Link to="/posts/confirm">Next</Link>
    </>
  )
}

PostIndex.propTypes = {
  posts: PropTypes.array,
  deletePost: PropTypes.func,
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

const ConfirmPosts = ({ posts, confirmPosts }) => {
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
          onClick={(e) => {
            e.preventDefault()
            confirmPosts()
          }}
        />
      </form>
    </div>
  )
}

ConfirmPosts.propTypes = {
  posts: PropTypes.array,
  confirmPosts: PropTypes.func,
}

const App = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const getPosts = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts')
      const json = await response.json()

      const posts = json.slice(0, 3)

      setPosts(posts)
    }

    getPosts()
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
      return posts.concat({ id: posts.length + 1, title, body })
    })
  }

  const deletePost = (postId) => {
    const indexOfPostToDelete = posts.findIndex((post) => post.id === postId)

    setPosts((posts) => [
      ...posts.slice(0, indexOfPostToDelete),
      ...posts.slice(indexOfPostToDelete + 1),
    ])
  }

  const confirmPosts = () => {
    console.log('Confirming posts')

    console.table(posts)
  }

  return (
    <Router>
      <div className="App">
        {
          <Routes>
            <Route
              exact
              path="/posts"
              element={<PostIndex posts={posts} deletePost={deletePost} />}
            ></Route>
            <Route
              path="/posts/:postId/edit"
              element={<EditPost posts={posts} updatePost={updatePost} />}
            ></Route>
            <Route
              path="/posts/new"
              element={<NewPost createPost={createPost} />}
            ></Route>
            <Route
              path="/posts/confirm"
              element={
                <ConfirmPosts posts={posts} confirmPosts={confirmPosts} />
              }
            ></Route>
          </Routes>
        }
      </div>
    </Router>
  )
}

export default App
