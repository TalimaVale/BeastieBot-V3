import tmi from "tmi.js";
import broadcasterOptions from "./broadcasterOptions";

const broadcaster = new tmi.Client(broadcasterOptions);

export default broadcaster;
