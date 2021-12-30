import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { EditPost } from './EditPost'
import { NewPost } from './NewPost'
import { PostIndex } from './PostIndex'
import { ReviewPosts } from './ReviewPosts'
import { PostsConfirmation } from './PostsConfirmation.js'

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
    // No error handling in this demo app
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
