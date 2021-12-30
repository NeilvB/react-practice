import { PropTypes } from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router'

export const NewPost = ({ createPost }) => {
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
