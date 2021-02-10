import chromep from "chrome-promise";
import _ from "lodash";
import { Location } from "../../lib/interfaces";
import { queryElement } from "../../lib/utils";
import Interface from "../Interface";

class Mapping extends Interface {
  constructor() {
    const signatures = {
      orderInfo: {
        signature: () => queryElement(["embed"]) != null,
        handler: () => this.extractCoordinates()
      }
    }

    super(signatures);
    this.startTimeout(500);

    chrome.storage.onChanged.addListener((changes) => {
      if(changes.order != null) this.start();
    });
    console.log(`[${this.name}] Interface ready`);
  }

  
  async extractCoordinates() {

    return;
  }

}

new Mapping();