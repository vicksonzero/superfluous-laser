import { AbstractComponent } from './AbstractComponent';


export class NaiveMovementComponent extends AbstractComponent {
    static type = 'NaiveMovementComponent' as 'NaiveMovementComponent';
    type = NaiveMovementComponent.type;

    speed = 1;
};