export enum onCLickEventType {
	ButtonClick = 'buttonClick',
	NavigationClick = 'navigationClick',
}

export interface onCLickEvent {
	eventType: onCLickEventType;
	eventSource: string;
	userId: string;
}
