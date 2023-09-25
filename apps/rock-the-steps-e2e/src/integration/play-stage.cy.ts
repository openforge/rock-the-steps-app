describe('rock-the-steps Home Screen', () => {
    beforeEach(() => {
        cy.visit('/stage-select');
        cy.get('.stage').eq(0).click();
        cy.get('#difficulty-medium').click();
    });

    it('After not jumpint at all should I lose and go to result screen', () => {
        cy.wait(10000);
        cy.url('eq', 'http://localhost:4200/finish');
    });
});
