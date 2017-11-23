import {Component, OnInit} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Dashboard, Job, Run, Stage, View} from './dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private dashboardName = 'Mistral';
  private user = 'thomaslelievre';
  private token = '548b96c833aa3e1521cd29d9a8db644d';
  private urlApiSuffixe = 'api/json';
  private urlApiPipelineSuffixe = '/wfapi';
  private baseUrl = 'http://51.254.113.139:8080/';
  dashboard: Dashboard;

  constructor(private http: Http) {
    this.dashboard = new Dashboard();
    this.dashboard.name = this.dashboardName;
    this.dashboard.jenkinsUrl = this.baseUrl;
    this.dashboard.views = Array<View>();
  }

  ngOnInit(): void {
    this.http.get(this.dashboard.jenkinsUrl + this.urlApiSuffixe, {headers: this.getHttpHeaders()}).subscribe(
      data => {
        this.setJenkinsData(data.json());
      });
  }

  getHttpHeaders(): Headers {
    const aHeaders = new Headers();
    aHeaders.set('Authorization', 'Basic ' + btoa(this.user + ':' + this.token));
    return aHeaders;
  }

  setJenkinsData(jenkinsData) {
    console.log(jenkinsData);
    for (const viewJson of jenkinsData.views) {
      if (viewJson._class === 'hudson.model.ListView') {
        const view: View = new View();
        view.name = viewJson.name;
        view.jenkinsUrl = viewJson.url;
        view.jobs = Array<Job>();
        this.dashboard.views.push(view);
        this.http.get(view.jenkinsUrl + this.urlApiSuffixe, {headers: this.getHttpHeaders()}).subscribe(
          data => {
            this.setViewData(view, data.json());
          }
        );
      }
    }
  }

  setViewData(view: View, viewData) {
    console.log(viewData);
    for (const jobJson of viewData.jobs) {
      const job: Job = new Job();
      view.jobs.push(job);
      job.name = jobJson.name;
      job.jenkinsUrl = jobJson.url;
      job.runs = Array<Run>();
      this.http.get(job.jenkinsUrl + this.urlApiPipelineSuffixe + '/runs', {headers: this.getHttpHeaders()}).subscribe(
        data => {
          this.setRunsData(job, data.json());
        }
      );
    }
  }

  setRunsData(job: Job, runsData) {
    console.log(runsData);
    for (const runJson of runsData) {
      const run: Run = new Run();
      run.id = runJson.id;
      run.name = runJson.name;
      run.status = runJson.status;
      run.startTimeMillis = runJson.startTimeMillis;
      run.endTimeMillis = runJson.endTimeMillis;
      run.durationMillis = runJson.durationMillis;
      job.runs.push(run);
      run.stages = Array<Stage>();
      for (const stageJson of runJson.stages) {
        const stage: Stage = new Stage();
        stage.id = stageJson.id;
        stage.name = stageJson.name;
        stage.status = stageJson.status;
        stage.startTimeMillis = stageJson.startTimeMillis;
        stage.durationMillis = stageJson.durationMillis;
        run.stages.push(stage);
      }
    }
  }
}
