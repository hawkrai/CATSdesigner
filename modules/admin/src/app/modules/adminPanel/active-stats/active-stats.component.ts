import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/service/userService";
import { TranslatePipe } from "educats-translate";

@Component({
  selector: "app-active-stats",
  templateUrl: "./active-stats.component.html",
  styleUrls: ["./active-stats.component.css"],
})
export class ActiveStatsComponent implements OnInit {
  userActivity: any;
  isLoadActive = false;

  usersSeries = [];
  usersLabels = [];

  timesSeries = [];
  timesLabels = [];

  chartOptions = {
    chart: {
      animations: {
        enabled: false,
      },
      width: 600,
      height: 400,
      type: "pie",
    },
    legend: {
      floating: true,
      position: "left",
    },
  };

  constructor(private userService: UserService, private translatePipe: TranslatePipe) {}

  t(value, defaultValue = value) {
    return this.translatePipe.transform(value, defaultValue);
  }

  ngOnInit() {
    this.loadActivity();
  }

  loadActivity() {
    this.userService.getUserActivity().subscribe((result) => {
      this.usersSeries = [
        result.TotalStudentsCount,
        result.TotalLecturersCount,
        result.ServiceAccountsCount,
      ];
      this.usersLabels = [
        this.t("text.adminPanel.activeStats.userActivity.usersLabels.students"),
        this.t("text.adminPanel.activeStats.userActivity.usersLabels.lecturers"),
        this.t("text.adminPanel.activeStats.userActivity.usersLabels.service")
      ];
      this.userActivity = result;
      const obj = JSON.parse(result.UserActivityJson);
      this.timesSeries = Object.values(obj);
      this.timesLabels = [
        this.t("text.adminPanel.activeStats.userActivity.timesLabels.day"),
        this.t("text.adminPanel.activeStats.userActivity.timesLabels.week"),
        this.t("text.adminPanel.activeStats.userActivity.timesLabels.month"),
        this.t("text.adminPanel.activeStats.userActivity.timesLabels.earlier"),
      ];
      this.isLoadActive = true;
    });
  }

  convertJsonToArray(keys: Array<any>, values: Array<any>) {
    const ob = [];
    for (let i = 0; i < keys.length; i++) {
      ob.push([keys[i], values[i]]);
    }
    return ob;
  }
}
