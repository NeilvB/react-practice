import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'

export const PostIndex = ({ posts, deletePost, resetAllPosts }) => {
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
