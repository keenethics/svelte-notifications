import faker from 'faker';

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
const fakeText = faker.lorem.words(2);
const createNotification = (position) => {
  cy.get(position).click();
  cy.contains('button', 'Create').click();
};
const deleteNotification = () => {
  cy.get(deleteNotificationButton).click();
  cy.contains(notificationBottomCenter, fakeText + 'bottom center').should('not.exist');
};

describe('Notifications', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
  });

  it('N-1 Bottom center notification should appear', () => {
    cy.get(notificationInput).clear().type(fakeText + 'bottom center');
    createNotification(positionButtonBottomCenter);
    cy.contains(notificationBottomCenter, fakeText + 'bottom center').should('to.exist');
  });

  it('N-2 Bottom right notification should appear', () => {
    cy.get(notificationInput).clear().type(fakeText + 'bottom right');
    createNotification(positionButtonBottomRight);
    cy.contains(notificationBottomRight, fakeText + 'bottom right').should('to.exist');
  });

  it('N-3 Bottom left notification should appear', () => {
    cy.get(notificationInput).clear().type(fakeText + 'bottom left');
    createNotification(positionButtonBottomLeft);
    cy.contains(notificationBottomLeft, fakeText + 'bottom left').should('to.exist');
  });

  it('N-4 Top left notification should appear', () => {
    cy.get(notificationInput).clear().type(fakeText + 'top left');
    createNotification(positionButtonTopLeft);
    cy.contains(notificationTopLeft, fakeText + 'top left').should('to.exist');
  });

  it('N-5 Top right notification should appear', () => {
    cy.get(notificationInput).clear().type(fakeText + 'top right');
    createNotification(positionButtonTopRight);
    cy.contains(notificationTopRight, fakeText + 'top right').should('to.exist');
  });

  it('N-6 Top center notification should appear', () => {
    cy.get(notificationInput).clear().type(fakeText + 'top center');
    createNotification(positionButtonTopCenter);
    cy.contains(notificationTopCenter, fakeText + 'top center').should('to.exist');
  });

  it('N-7 \'Clear all\' button clears all notifications', () => {
    cy.get(notificationInput).clear().type(fakeText + 'clear all');
    cy.get(timerInput).clear().type('15000');
    createNotification(positionButtonBottomCenter);
    createNotification(positionButtonBottomLeft);
    createNotification(positionButtonBottomRight);
    createNotification(positionButtonTopCenter);
    createNotification(positionButtonTopLeft);
    createNotification(positionButtonTopRight);
    cy.contains('button', 'Clear all').click();
    cy.contains(notificationTopCenter, fakeText + 'clear all').should('not.exist');
    cy.contains(notificationTopLeft, fakeText + 'clear all').should('not.exist');
    cy.contains(notificationTopRight, fakeText + 'clear all').should('not.exist');
    cy.contains(notificationBottomCenter, fakeText + 'clear all').should('not.exist');
    cy.contains(notificationBottomLeft, fakeText + 'clear all').should('not.exist');
    cy.contains(notificationBottomRight, fakeText + 'clear all').should('not.exist');
  });

  it('N-8 Can close bottom center notification', () => {
    cy.get(notificationInput).clear().type(fakeText + 'bottom center');
    cy.get(timerInput).clear().type('15000');
    createNotification(positionButtonBottomCenter);
    cy.contains(notificationBottomCenter, fakeText + 'bottom center').should('to.exist');
    deleteNotification();
  });

  it('N-9 Can close bottom right notification', () => {
    cy.get(notificationInput).clear().type(fakeText + 'bottom right');
    cy.get(timerInput).clear().type('15000');
    createNotification(positionButtonBottomRight);
    cy.contains(notificationBottomRight, fakeText + 'bottom right').should('to.exist');
    deleteNotification();
  });

  it('N-10 Can close bottom left notification should appear', () => {
    cy.get(notificationInput).clear().type(fakeText + 'bottom left');
    cy.get(timerInput).clear().type('15000');
    createNotification(positionButtonBottomLeft);
    cy.contains(notificationBottomLeft, fakeText + 'bottom left').should('to.exist');
    deleteNotification();
  });

  it('N-11 Can close Top left notification', () => {
    cy.get(notificationInput).clear().type(fakeText + 'top left');
    cy.get(timerInput).clear().type('15000');
    createNotification(positionButtonTopLeft);
    cy.contains(notificationTopLeft, fakeText + 'top left').should('to.exist');
    deleteNotification();
  });

  it('N-12 Can close Top right notification', () => {
    cy.get(notificationInput).clear().type(fakeText + 'top right');
    cy.get(timerInput).clear().type('15000');
    createNotification(positionButtonTopRight);
    cy.contains(notificationTopRight, fakeText + 'top right').should('to.exist');
    deleteNotification();
  });

  it('N-13 Can close Top center notification', () => {
    cy.get(notificationInput).clear().type(fakeText + 'top center');
    cy.get(timerInput).clear().type('15000');
    createNotification(positionButtonTopCenter);
    cy.contains(notificationTopCenter, fakeText + 'top center').should('to.exist');
    deleteNotification();
  });
});
