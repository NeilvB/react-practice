import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export const PostsConfirmation = ({ posts }) => {
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
