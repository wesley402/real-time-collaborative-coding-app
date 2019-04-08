import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { DataService } from './services/data.service';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { HttpClientModule } from '@angular/common/http';

import {AppRoutingModule} from './app.routes';
import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from "./services/auth.service";
import { NavbarComponent } from './navbar/navbar.component';
import {HttpModule} from "@angular/http";
import { ProfileComponent } from './components/profile/profile.component';
import { EditorComponent } from './components/editor/editor.component';
import { CollaborationService } from "./services/collaboration.service";

@NgModule({
  declarations: [
    AppComponent,
    ProblemListComponent,
    ProblemDetailComponent,
    NewProblemComponent,
    NavbarComponent,
    ProfileComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule

  ],
  providers: [
    {
      provide: 'data',
      useClass: DataService
    },
    {
      provide: 'auth',
      useClass: AuthService
    },
    {
      provide: 'collaboration',
      useClass: CollaborationService
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
