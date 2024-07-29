import 'cypress-file-upload';

describe('Post actions', () => {
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
      it('should edit post content', () => {
        cy.get('[data-cy=post]').first().within(() => {
        cy.get('[data-cy=kebab-menu]').click()
        cy.get('[data-cy=edit-post]').click()
        cy.get('[data-cy=modal-textarea]').clear().type('edited post!')
        cy.get('[data-cy=modal-submit-button]').click()
        })
        cy.get('[data-cy=feedback-modal]').within(() => {
          cy.contains('Success!').should('exist');
        });
        cy.get('[data-cy=feedback-modal-backdrop]').click({ force: true })
        cy.get('[data-cy=post]').first().within(() => {
          cy.contains('edited post!').should('exist');
        });
      })
      it('should delete post', () => {
            cy.get('[data-cy=post]').first().within(() => {
            cy.get('[data-cy=kebab-menu]').click()
            cy.get('[data-cy=delete-post]').click()
          })
            cy.get('[data-cy=feedback-modal]').within(() => {
              cy.contains('Success!').should('exist');
            });
            cy.get('[data-cy=feedback-modal-backdrop]').click({ force: true });
          
            cy.get('[data-cy=post]').should('not.contain', 'edited post!');
            
          })
        })
