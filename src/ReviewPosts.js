import { PropTypes } from 'prop-types'
import { useNavigate } from 'react-router'

export const ReviewPosts = ({ posts, confirmPosts }) => {
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

            // Block on confirming posts and then navigate
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
