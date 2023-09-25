describe('rock-the-steps Home Screen', () => {
    beforeEach(() => cy.visit('/'));

    it('should Main screen', () => {
        cy.contains('Stage Select');
    });
    it('Stage select button should have class of red buttons', () => {
        cy.get('#stage-select').should('have.class', 'rts-button');
    });
    // it('sdsd', () => {
    //     cy.get('#stage-select  .button-native').should('have.css', 'background', '#bd1e2c')
    // })
    it('After click "Stage Select" Should navigate to the stage selection', () => {
        cy.contains('Stage Select');
        cy.get('#stage-select').click();
        cy.url('eq', 'http://localhost:4200/stage-select');
    });
    it('should display leaderboards button', () => {
        cy.get('#leaderboards-icon');
    });
    it('should After clicking leaderboards button should open the leaderboards', () => {
        cy.get('#leaderboards-icon').click();
    });
    it('Leaderboards should have leaderboards and achievements', () => {
        cy.get('#leaderboards-icon').click();
        cy.contains('Leaderboard');
        cy.contains('Achievements');
    });
    it('Leaderboards should have copyright, privacy policy and license agreement', () => {
        cy.get('#leaderboards-icon').click();
        cy.contains('Privacy Policy');
        cy.contains('Licence Agreement');
        cy.contains('Copyright');
    });
    it('Leaderboards should have button to close and should close the leaderboards', () => {
        cy.get('#leaderboards-icon').click();
        cy.get('#close-leaderboards-button').click();
        cy.contains('Stage Select');
    });
});
