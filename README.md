## Practice project - "posts"

### Running

`yarn`

`yarn start`

### Tests

In one terminal

`yarn start`

In another terminal

`yarn run cypress open`

### Goal

Create a multi-page React app which allows creation, edits, and deletions of a set of resources. The initial set of resources is fetched from an API. A final review and confirm step results in a POST of all data to the server. Write integration tests in Cypress.

### Rationale

This journey of making resource updates in dedicated pages followed by a confirmation step is roughly analagous that for operatives in Repairs Hub managing tasks. We know we will be implementing more multi-page journeys for this application, so this should be good practice. The main way that this differs is that all of the individual updates are stored in state (and local storage) until the final step when everything is POST-ed to the server.

### Implementation

Uses create-react-app. Uses react-router to manage page transitions. API calls are made to jsonplaceholder.com using the fetch API. State is mirrored to local storage because otherwise a page refresh will lose the user's edits.

### Components, state, props and local storage

A top-level App contains the most important state - 'posts' which is an array of post objects.

On initially loading the posts page, this state is populated from an API response, from a useEffect hook. There is another useEffect hook which runs whenever 'posts' changes, which immediately mirrors that array's state in local storage. Subsequent page loads do NOT make an API call. The local storage is used instead.

The new and delete actions are straightforward and make calls to functions made in the App.js component to append or remove elements from the 'posts' array.

The EditPosts componen receives the 'postId' parameter via the useParams hook from react-router and then uses that to search through all of the posts which are supplied to it as a prop. Perhaps a cleaner way to do this would be to supply a 'searchPostsById' function or similar from the parent App component. Either way, this approach means we do not ever need to make a GET request to the /posts endpoint after the first page load of the app.

The ReviewPost page lists the posts and lets the user confirm all of the updates made up to this point. There is no error check on the API request. The user is redirected back to the list of posts after this confirmation and the local storage is cleared. Normally we would of course expect the changes to be made on the server and the homepage at this point to show all updates made to the posts but as we're using a placeholder that's not possible.

### Extensions / Limitations / Questions

No error handling for the fetch requests.
Consider using IndexedDB instead of LocalStorage?
Styling is intentionally left
No validation on inputs e.g. empty titles are allowed but probably shouldn't be
How does the use of react-router translate to Next JS? Does that framework support another way? Could this app be implemented using Next JS routes?
Could be extended in many ways for practice

- add an extra confirmation (are you sure?) step
- Add a Duplicate post button
- Styling
- Introduce multiple users who see their own posts (note the placeholder response includes userIds)
