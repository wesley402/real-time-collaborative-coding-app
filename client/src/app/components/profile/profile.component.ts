import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  email: string = '';
  username: string = '';
  profile: any;
  constructor(@Inject('auth') private auth) { }

  ngOnInit() {
    console.log('qqqqqq');

    if (this.auth.userProfile) {
      this.profile = this.auth.userProfile;
      console.log(this.profile);
    } else {
      this.auth.getProfile((err, profile) => {
        this.profile = profile;
        console.log(profile);
      });
    }
  }

  resetPassword(): void {
    this.auth.resetPassword();
  }

}
