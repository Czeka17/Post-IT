describe('Auth Form', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/auth');
    });
  
    it('should load the login form', () => {
      cy.contains('Welcome to PostIT').should('exist');
      cy.get('[data-cy=login-button]').should('exist');
    });
  
    it('should switch to sign up mode', () => {
      cy.contains('Create new account').click();
      cy.contains('Sign up').should('exist');
      cy.contains('Email').should('exist');
    });
  
    it('should log in with valid credentials', () => {
      cy.get('input#name').type('test');
      cy.get('input#password').type('test123');
      cy.get('[data-cy=login-button]').click();
      cy.contains('Success!').should('exist');

      cy.url().should('include', '/');
      
    });
  
    it('should show error on invalid login', () => {
      cy.get('input#name').type('invalidUser');
      cy.get('input#password').type('invalidPassword');
      cy.get('[data-cy=login-button]').click();
  
  
      cy.contains('Invalid inputs!').should('exist');
    });

    // change credentials to let test pass
  
    it('should sign up with valid credentials', () => {
      cy.contains('Create new account').click();
      cy.get('input#name').type('newUser1');
      cy.get('input#email').type('newuser1@example.com');
      cy.get('input#password').type('newpassword123');
      cy.get('[data-cy=login-button]').click();
  
  
      cy.url().should('include', '/');
      cy.contains('logged in successfully').should('exist');
    });
  
    it('should show error on invalid sign up', () => {
      cy.contains('Create new account').click();
      cy.get('input#name').type('newUser');
      cy.get('input#email').type('invalidEmail');
      cy.get('input#password').type('newpassword123');
      cy.get('[data-cy=login-button]').click();
  

      cy.contains('Invalid inputs!').should('exist');
    });
  });
  