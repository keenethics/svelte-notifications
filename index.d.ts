import type { SvelteComponent } from 'svelte';

interface NotificationsProps {
  item?: SvelteComponent;
  withoutStyles?: boolean;
  zIndex?: string | number;
}

export default class Notifications extends SvelteComponent {
  $$prop_def: NotificationsProps;
}

export type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface DefaultNotificationOptions {
  id?: string;
  text?: string;
  position: Position;
  type?: string;
  removeAfter?: number;
}

type addNotification = (notification: DefaultNotificationOptions | Record<string, any>) => void;

type removeNotification = (notificationId: string) => void

type clearNotifications = () => void;

export function getNotificationsContext(): {
  subscribe: any;
  addNotification: addNotification;
  removeNotification: removeNotification;
  clearNotifications: clearNotifications;
};
