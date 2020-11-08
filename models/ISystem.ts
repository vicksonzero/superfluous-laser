import { Model } from "./Model";

export type ISystem = (frameID: number, model: Model) => void;