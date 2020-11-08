import { Team } from './../Teams';
import { AbstractComponent } from "./AbstractComponent";

export class TankTeamComponent extends AbstractComponent {
    type: "TankTeamComponent";
    team: Team;
}