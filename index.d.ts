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

type NotificationsContext = {
    // TODO: type subscribe
    subscribe: any;
    addNotification: (notification: DefaultNotificationOptions | Record<string, any>) => void;
    removeNotification: (notificationId: string) => void;
    clearNotifications: () => void;
}

declare function getNotificationsContext(): NotificationsContext;

export { NotificationsProps, Notifications, getNotificationsContext }
