import 'cypress-file-upload';

describe('Add Post', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/auth');
 
            cy.get('input#name').type('test');
            cy.get('input#password').type('test123');
            cy.get('[data-cy=login-button]').click();
            cy.contains('Success!').should('exist');
      
            cy.url().should('include', '/');
            
    
      });
      it('should show add post form', () =>{
        cy.get('[data-cy=add-post-textarea]').should('exist');
        cy.get('input[type="file"]').should('exist');
        cy.get('[data-cy=add-post-button]').should('exist')
      })
      it('should add post with text only', () => {
        cy.get('[data-cy=add-post-textarea]').type('test post');
        cy.get('[data-cy=add-post-button]').click()
        cy.get('[data-cy=feedback-modal]').should('exist')
      })
      it('should add a new post with media', () => {
        const postMessage = 'This is a test post with media';
 
        cy.get('[data-cy=add-post-textarea]').type(postMessage);
    
        cy.get('input[type="file"]').attachFile('test-image.png');
        cy.get('[data-cy=media-preview').should('exist')
    
        cy.get('[data-cy=add-post-button]').click();

        cy.get('[data-cy=feedback-modal]').should('exist')
        
      });
})