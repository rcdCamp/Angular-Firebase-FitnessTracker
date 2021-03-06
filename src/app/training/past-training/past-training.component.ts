import { Subscription } from "rxjs";
import { Exercise } from "./../exercise.model";
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { TrainingService } from "../training.service";
import { MatTableDataSource, MatSort, MatPaginator } from "@angular/material";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-past-training",
  templateUrl: "./past-training.component.html",
  styleUrls: ["./past-training.component.css"]
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ["date", "name", "duration", "calories", "state"];
  dataSource = new MatTableDataSource<Exercise>();
  private exChangedSubscription: Subscription;
  private currentUid: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) page: MatPaginator;
  constructor(
    private trainingService: TrainingService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.exChangedSubscription = this.trainingService.finishedExercisesChanged.subscribe(
      (exercises: Exercise[]) => {
        this.dataSource.data = exercises;
      }
    );
    this.auth.getUserId().subscribe(u => {
      if (u != null)
        this.trainingService.fetchCompletedOrCancelledExercises(u.uid);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.page;
  }

  ngOnDestroy() {
    if (this.exChangedSubscription) this.exChangedSubscription.unsubscribe();
  }

  doFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}
