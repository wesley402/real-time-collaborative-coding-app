import { Component, OnInit, Inject } from '@angular/core';
import { Problem } from "../../models/problem.model";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})

export class ProblemListComponent implements OnInit {
  constructor(@Inject("data") private data) { }

  problems: Problem[] = [];
  subscriptionProblems: Subscription;

  ngOnInit() {
    this.getProblems();
  }

  getProblems(): void {
    this.subscriptionProblems = this.data.getProblems()
      .subscribe(problems => this.problems = problems);
  }

}
