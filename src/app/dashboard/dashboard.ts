export class Dashboard {
  name: string;
  jenkinsUrl: string;
  views: Array<View>;
}

export class View {
  name: string;
  jenkinsUrl: string;
  jobs: Array<Job>;
}

export class Job {
  name: string;
  jenkinsUrl: string;
  runs: Array<Run>;
}

export class Run {
  id: string;
  name: string;
  jenkinsUrl: string;
  status: string;
  startTimeMillis: number;
  endTimeMillis: number;
  durationMillis: number;
  stages: Array<Stage>;
}

export class Stage {
  id: string;
  name: string;
  status: string;
  startTimeMillis: number;
  durationMillis: number;
}
