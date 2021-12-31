describe('posts', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts', [
      { id: 1, body: 'body1', title: 'title1' },
      { id: 2, body: 'body2', title: 'title2' },
      { id: 3, body: 'body3', title: 'title3' },
    ]).as('postsResponse')

    cy.visit('http://localhost:3000/posts')

    cy.wait('@postsResponse')
  })

  it('shows all posts from the API on first page load', () => {
    cy.get('[data-testid="posts-list"]').within(() => {
      cy.contains('li:nth-child(1)', 'title1')
      cy.contains('li:nth-child(2)', 'title2')
      cy.contains('li:nth-child(3)', 'title3')
    })
  })

  it('allows additions, updates, deletions, reviews and confirmations of posts', () => {
    cy.contains('a', 'New Post').click()

    cy.get('form').within(() => {
      cy.get('[name="title"]').type('New post title')
      cy.get('[name="body"]').type('New post body')

      cy.contains('Create Post').click()
    })

    cy.get('[data-testid="posts-list"]').within(() => {
      cy.contains('li:nth-child(4)', 'New post title').contains('Edit').click()
    })

    cy.get('form').within(() => {
      cy.get('[name="title"]').should('have.value', 'New post title')
      cy.get('[name="title"]').clear().type('New post title - edited')

      cy.get('[name="body"]').should('have.value', 'New post body')
      cy.get('[name="body"]').clear().type('New post body - edited')

      cy.contains('Update Post').click()
    })

    cy.get('[data-testid="posts-list"]').within(() => {
      cy.contains('li:nth-child(4)', 'New post title - edited')
    })

    cy.get('[data-testid="posts-list"]').within(() => {
      cy.contains('li:nth-child(2)', 'title2').within(() => {
        cy.get('input').should('have.value', 'Delete').click()
      })
    })

    // We are left with the first and third original posts, and the new one
    cy.get('[data-testid="posts-list"]').within(() => {
      cy.contains('li:nth-child(1)', 'title1')
      cy.contains('li:nth-child(2)', 'title3')
      cy.contains('li:nth-child(3)', 'New post title - edited')
    })

    cy.contains('a', 'Next').click()

    cy.contains('h1', 'Posts')

    cy.get('ol').within(() => {
      cy.contains('li:nth-child(1)', 'title1')
      cy.contains('li:nth-child(2)', 'title3')
      cy.contains('li:nth-child(3)', 'New post title - edited')
    })

    cy.intercept('POST', 'https://jsonplaceholder.typicode.com/posts').as(
      'postPOSTRequest'
    )

    cy.get('form').contains('Confirm').click()

    cy.wait('@postPOSTRequest')
      .its('request.body')
      .should('deep.equal', [
        { id: 1, body: 'body1', title: 'title1' },
        { id: 3, body: 'body3', title: 'title3' },
        {
          id: 4,
          body: 'New post body - edited',
          title: 'New post title - edited',
        },
      ])

    // Return to the posts page
    // No assertion on content because by now we have trusted the server
    // to have updated the posts. Adding a stubbed response here
    // does nothing to test our frontend.
    cy.url().should('contain', '/posts')
  })

  it('caches edited posts locally to use for subsequent loads', () => {
    cy.get('[data-testid="posts-list"]').within(() => {
      cy.contains('li:nth-child(3)', 'title3').within(() => {
        cy.get('input').should('have.value', 'Delete').click()
      })

      cy.contains('li:nth-child(2)', 'title2').within(() => {
        cy.get('input').should('have.value', 'Delete').click()
      })

      cy.contains('li:nth-child(1)', 'title1').contains('Edit').click()
    })

    cy.get('form').within(() => {
      cy.get('[name="title"]').clear().type('New post title - edited')

      cy.contains('Update Post').click()
    })

    cy.reload()

    cy.get('[data-testid="posts-list"]').within(() => {
      cy.contains('li:nth-child(1)', 'New post title - edited')
    })
  })
})
