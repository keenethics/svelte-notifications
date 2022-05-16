const positionButtonBottomCenter = '#bottom-center';
const positionButtonBottomRight = '#bottom-right';
const positionButtonBottomLeft = '#bottom-left';
const positionButtonTopCenter = '#top-center';
const positionButtonTopRight = '#top-right';
const positionButtonTopLeft = '#top-left';
const notificationBottomCenter = '.position-bottom-center .notification .notification-content';
const notificationBottomRight = '.position-bottom-right .notification .notification-content';
const notificationBottomLeft = '.position-bottom-left .notification .notification-content';
const notificationTopCenter = '.position-top-center .notification .notification-content';
const notificationTopRight = '.position-top-right .notification .notification-content';
const notificationTopLeft = '.position-top-left .notification .notification-content';
const notificationInput = '#notification-text';
const timerInput = '#notification-remove-after';
const deleteNotificationButton = 'button[aria-label="delete notification"]';
const fakeText = Math.random().toString(36).substring(2, 15);

const createNotification = (position) => {
  cy.get(position).click();
  cy.contains('button', 'Create').click();
};

const deleteNotification = () => {
  cy.get(deleteNotificationButton).click();
  cy.contains(notificationBottomCenter, `${fakeText} bottom center`).should('not.exist');
};

const visit = () => {
  cy.visit(Cypress.config().baseUrl);
};

describe('Notifications', () => {
  describe('Default notifications are displayed correctly', () => {
    beforeEach(visit);

    it('Bottom center notification should appear', () => {
      cy.get(notificationInput).clear().type(`${fakeText} bottom center`);
      createNotification(positionButtonBottomCenter);
      cy.contains(notificationBottomCenter, `${fakeText} bottom center`).should('to.exist');
    });

    it('Bottom right notification should appear', () => {
      cy.get(notificationInput).clear().type(`${fakeText} bottom right`);
      createNotification(positionButtonBottomRight);
      cy.contains(notificationBottomRight, `${fakeText} bottom right`).should('to.exist');
    });

    it('Bottom left notification should appear', () => {
      cy.get(notificationInput).clear().type(`${fakeText} bottom left`);
      createNotification(positionButtonBottomLeft);
      cy.contains(notificationBottomLeft, `${fakeText} bottom left`).should('to.exist');
    });

    it('Top left notification should appear', () => {
      cy.get(notificationInput).clear().type(`${fakeText} top left`);
      createNotification(positionButtonTopLeft);
      cy.contains(notificationTopLeft, `${fakeText} top left`).should('to.exist');
    });

    it('Top right notification should appear', () => {
      cy.get(notificationInput).clear().type(`${fakeText} top right`);
      createNotification(positionButtonTopRight);
      cy.contains(notificationTopRight, `${fakeText} top right`).should('to.exist');
    });

    it('Top center notification should appear', () => {
      cy.get(notificationInput).clear().type(`${fakeText} top center`);
      createNotification(positionButtonTopCenter);
      cy.contains(notificationTopCenter, `${fakeText} top center`).should('to.exist');
    });
  });

  describe('Default notifications can be closed', () => {
    beforeEach(() => {
      visit();
      cy.get(timerInput).clear().type('15000');
    });

    it('\'Clear all\' button clears all notifications', () => {
      cy.get(notificationInput).clear().type(`${fakeText} clear all`);
      cy.get(timerInput).clear().type('15000');
      createNotification(positionButtonBottomCenter);
      createNotification(positionButtonBottomLeft);
      createNotification(positionButtonBottomRight);
      createNotification(positionButtonTopCenter);
      createNotification(positionButtonTopLeft);
      createNotification(positionButtonTopRight);
      cy.contains('button', 'Clear all').click();
      cy.contains(notificationTopCenter, `${fakeText} clear all`).should('not.exist');
      cy.contains(notificationTopLeft, `${fakeText} clear all`).should('not.exist');
      cy.contains(notificationTopRight, `${fakeText} clear all`).should('not.exist');
      cy.contains(notificationBottomCenter, `${fakeText} clear all`).should('not.exist');
      cy.contains(notificationBottomLeft, `${fakeText} clear all`).should('not.exist');
      cy.contains(notificationBottomRight, `${fakeText} clear all`).should('not.exist');
    });

    it('Can close bottom center notification', () => {
      cy.get(notificationInput).clear().type(`${fakeText} bottom center`);
      createNotification(positionButtonBottomCenter);
      cy.contains(notificationBottomCenter, `${fakeText} bottom center`).should('to.exist');
      deleteNotification();
    });

    it('Can close bottom right notification', () => {
      cy.get(notificationInput).clear().type(`${fakeText} bottom right`);
      createNotification(positionButtonBottomRight);
      cy.contains(notificationBottomRight, `${fakeText} bottom right`).should('to.exist');
      deleteNotification();
    });

    it('Can close bottom left notification should appear', () => {
      cy.get(notificationInput).clear().type(`${fakeText} bottom left`);
      createNotification(positionButtonBottomLeft);
      cy.contains(notificationBottomLeft, `${fakeText} bottom left`).should('to.exist');
      deleteNotification();
    });

    it('Can close top left notification', () => {
      cy.get(notificationInput).clear().type(`${fakeText} top left`);
      createNotification(positionButtonTopLeft);
      cy.contains(notificationTopLeft, `${fakeText} top left`).should('to.exist');
      deleteNotification();
    });

    it('Can close top right notification', () => {
      cy.get(notificationInput).clear().type(`${fakeText} top right`);
      createNotification(positionButtonTopRight);
      cy.contains(notificationTopRight, `${fakeText} top right`).should('to.exist');
      deleteNotification();
    });

    it('Can close top center notification', () => {
      cy.get(notificationInput).clear().type(`${fakeText} top center`);
      createNotification(positionButtonTopCenter);
      cy.contains(notificationTopCenter, `${fakeText} top center`).should('to.exist');
      deleteNotification();
    });
  });

  describe('Default notifications are fading away after timeout', () => {
    // time during which component will remove after fade.
    // Svelte's default fade duration is ~400, adding 150ms to avoid inconsistencies
    const timeout = 50 + 400 + 150;

    beforeEach(() => {
      visit();
      cy.get(timerInput).clear().type('50');
    });

    it('Bottom center notification fades away', () => {
      cy.get(notificationInput).clear().type(`${fakeText} bottom center`);
      createNotification(positionButtonBottomCenter);
      cy.contains(notificationBottomCenter, `${fakeText} bottom center`, { timeout }).should('not.exist');
    });

    it('Bottom right notification fades away', () => {
      cy.get(notificationInput).clear().type(`${fakeText} bottom right`);
      createNotification(positionButtonBottomRight);
      cy.contains(notificationBottomRight, `${fakeText} bottom right`, { timeout }).should('not.exist');
    });

    it('Bottom left notification fades away', () => {
      cy.get(notificationInput).clear().type(`${fakeText} bottom left`);
      createNotification(positionButtonBottomLeft);
      cy.contains(notificationBottomLeft, `${fakeText} bottom left`, { timeout }).should('not.exist');
    });

    it('Top left notification fades away', () => {
      cy.get(notificationInput).clear().type(`${fakeText} top left`);
      createNotification(positionButtonTopLeft);
      cy.contains(notificationTopLeft, `${fakeText} top left`, { timeout }).should('not.exist');
    });

    it('Top right notification fades away', () => {
      cy.get(notificationInput).clear().type(`${fakeText} top right`);
      createNotification(positionButtonTopRight);
      cy.contains(notificationTopRight, `${fakeText} top right`, { timeout }).should('not.exist');
    });

    it('Top center notification fades away', () => {
      cy.get(notificationInput).clear().type(`${fakeText} top center`);
      createNotification(positionButtonTopCenter);
      cy.contains(notificationTopCenter, `${fakeText} top center`, { timeout }).should('not.exist');
    });
  });

  describe('Custom notifications are displayed correctly', () => {
    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl);
      cy.get('.toggle-custom').click();
    });

    it('Bottom center custom notification should appear', () => {
      cy.get(notificationInput).clear().type(`${fakeText} custom bottom center`);
      createNotification(positionButtonBottomCenter);
      cy.contains(notificationBottomCenter, `${fakeText} custom bottom center`).should('to.exist');
      cy.contains(`${notificationBottomCenter} p`, 'Custom description').should('to.exist');
    });
  });

  describe('Custom notifications can be closed', () => {
    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl);
      cy.get('.toggle-custom').click();
    });

    it('Bottom center custom notification can be closed', () => {
      cy.get(notificationInput).clear().type(`${fakeText} custom bottom center`);
      cy.get(timerInput).clear().type('500');
      createNotification(positionButtonBottomCenter);
      cy.get(`${notificationBottomCenter} + .notification-buttons button`).last().click();
      cy.contains(notificationBottomCenter, `${fakeText} custom bottom center`, { timeout: 1000 }).should('not.exist');
    });
  });
});
