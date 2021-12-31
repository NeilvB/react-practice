import { PropTypes } from 'prop-types'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

export const EditPost = ({ posts, updatePost }) => {
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
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="body">Body</label>]
        <textarea
          name="body"
          id="body"
          cols="30"
          rows="10"
          value={body}
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
