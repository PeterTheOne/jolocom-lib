import { TEMP_EVENT } from "./icp"

export class KEL {
  private events: TEMP_EVENT[] = []

  public keyState = {
    keys: [],
    threshold: 0,
  }

  constructor(events: TEMP_EVENT[] = []) {
    events.forEach(this.update.bind(this))
  }

  update(ev: TEMP_EVENT) {
    if (this.validate(ev)) {
      this.apply(ev)
    }
  }

  private apply(ev: TEMP_EVENT) {
    this.keyState = {
      keys: ev.keys,
      threshold: ev.sith
    }

    this.events.push(ev)
  }

  private validate(ev: TEMP_EVENT) {
    return ev.ilk === 'icp'
  }
}


