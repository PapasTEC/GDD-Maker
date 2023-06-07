interface event {
  name: string;
  description: string;
}

interface mission {
  name: string;
  events: event[];
}

export interface TimelineEntry {
  name: string;
  missions: mission[];
}
