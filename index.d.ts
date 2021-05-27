import type { SvelteComponent } from 'svelte';

interface NotificationsProps {
    item?: SvelteComponent;
    withoutStyles?: boolean;
}

declare class Notifications extends SvelteComponent {
    $$prop_def: NotificationsProps;
}

interface DefaultNotificationOptions {
    id?: string;
    text: string;
    position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    type?: 'success' | 'warning' | 'danger';
    removeAfter?: number;
}

type addNotification = (notification: DefaultNotificationOptions | Record<string, any>) => void;

type removeNotification = (notificationId: string) => void

type clearNotifications = () => void;

declare function getNotificationsContext(): {
    subscribe: any;
    addNotification(): addNotification;
    removeNotification(): removeNotification;
    clearNotifications(): clearNotifications;
};

export { NotificationsProps, Notifications, getNotificationsContext }