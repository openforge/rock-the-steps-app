describe('rock-the-steps Home Screen', () => {
    beforeEach(() => cy.visit('/stage-select'));

    it('should Main screen', () => {
        cy.contains('Stage Select');
        cy.contains('Current Points');
    });
    it('Stage select screen should have 6 stages', () => {
        cy.get('.stage').should('have.length', 6);
    });
    it('Stage select levels 2,3,4,5,6 should have lock img (Because they are locked)', () => {
        cy.get('.stage').eq(1).should('have.descendants', 'img');
        cy.get('.stage').eq(2).should('have.descendants', 'img');
        cy.get('.stage').eq(3).should('have.descendants', 'img');
        cy.get('.stage').eq(4).should('have.descendants', 'img');
        cy.get('.stage').eq(5).should('have.descendants', 'img');
    });
    it('Stage select screen should have back button that redirects to home screen', () => {
        cy.visit('/');
        cy.get('#stage-select').click();
        cy.contains('Back');
    });
    it('Stage Select levels 2,3,4,5,6 Should have the unlock label mentioning required points', () => {
        cy.get('.stage').eq(1).should('contain', 'Unlock').find('h6');
        cy.get('.stage').eq(2).should('contain', 'Unlock').find('h6');
        cy.get('.stage').eq(3).should('contain', 'Unlock').find('h6');
        cy.get('.stage').eq(4).should('contain', 'Unlock').find('h6');
        cy.get('.stage').eq(5).should('contain', 'Unlock').find('h6');
    });
    it('After clicking first level should open modal of difficulty and the difficulties', () => {
        cy.get('.stage').eq(0).click();
        cy.contains('SELECT DIFFICULTY');
        cy.contains('EASY');
        cy.contains('MEDIUM');
        cy.contains('HARD');
    });
    it('After click difficulty it should open the new game', () => {
        cy.get('.stage').eq(0).click();
        cy.get('#difficulty-medium').click();
        cy.url('eq', 'http://localhost:4200/play-stage');
    });
});
