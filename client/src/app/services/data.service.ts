import { Injectable } from '@angular/core';
import { Problem } from "../models/problem.model";
import { HttpClient, HttpHeaders , HttpResponse} from '@angular/common/http'
import { Http, Response, Headers } from '@angular/http';

import {BehaviorSubject} from 'rxjs';
import { Observable } from 'rxjs';


@Injectable()
export class DataService {

  private problemsSource = new BehaviorSubject<Problem[]>([]);

  constructor(private http: Http) { }

  getProblems(): Observable<Problem[]> {
    this.http.get("api/v1/problems")
      .toPromise()
      .then((res: Response) => {
        this.problemsSource.next(res.json());
      })
      .catch(this.handleError);

    return this.problemsSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    return this.http.get(`api/v1/problems/${id}`)
      .toPromise()
      .then((res: Response) => res.json())
      .catch(this.handleError);
  }

  addProblem(problem: Problem): Promise<Problem> {
    const requestOptions = {
      headers: new Headers({ 'Content-Type': 'application/json' })
    };
    return this.http.post('/api/v1/problems', problem, requestOptions)
      .toPromise()
      .then((res: Response) => {
        this.getProblems();
        return res.json();
      })
      .catch(this.handleError);
  }

  buildAndRun(data): Promise<Object> {
    const requestOptions = {
      headers: new Headers({ 'Content-Type': 'application/json' })
    };
       return this.http.post('api/v1/build_and_run', data, requestOptions)
      .toPromise()
      .then((res: Response) => {
        console.log(res);
        return res.json();
      })
      .catch(this.handleError);
  }


  // error hanlder
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.body || error);
  }


}
