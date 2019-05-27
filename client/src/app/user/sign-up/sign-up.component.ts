import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";

import { UserService } from '../../shared/user.service'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  showSucessMessage: boolean;
  serverErrorMessages: string;

  constructor(private userService: UserService,private router : Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.userService.postUser(form.value).subscribe(
      res => {
        this.showSucessMessage = true;
        setTimeout(() =>{
          this.resetForm(form);
          this.userService.setToken(res['token']);
          this.router.navigateByUrl('/userprofile');
        }, 3000);
      },
      err => {
        if (err.status === 422)
          this.serverErrorMessages = err.error.errors.data.msg;
        else if (err.status === 421)
          this.serverErrorMessages = err.error.errors;
        else
          this.serverErrorMessages = 'Something went wrong with server side .';
        this.resetForm(form);
      }
    );
  }

  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      fullName: '',
      email: '',
      password: ''
    };
    form.resetForm();
    setTimeout(() => this.serverErrorMessages = '', 4000);
  }

}
