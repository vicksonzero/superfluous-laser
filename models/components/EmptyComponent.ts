import { AbstractComponent } from "./AbstractComponent";

export class EmptyComponent extends AbstractComponent {
    static type = 'EmptyComponent' as 'EmptyComponent';
    type = EmptyComponent.type;
}
