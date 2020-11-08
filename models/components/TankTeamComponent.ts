import { Team } from './../Teams';
import { AbstractComponent } from "./AbstractComponent";

export class TankTeamComponent extends AbstractComponent {
    static type = 'TankTeamComponent' as 'TankTeamComponent';
    type = TankTeamComponent.type;
    team: Team;
}