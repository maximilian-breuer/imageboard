import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string = "";
    loginworked = true;

    loggedIn: boolean = false;

    @Output() onLogin: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService
        ) {
          this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.loggedIn = this.authenticationService.loggedIn();
        this.onLogin.emit(this.loggedIn);
    }

    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value)
            .pipe(first())
            .subscribe(
                data => {
                    this.loading = false;
                    this.loginworked = true;
                    this.onLogin.emit(true);
                    this.loggedIn = true;
                },
                error => {
                    this.loading = false;
                    this.loginworked = false;
                });
    }

    logout() {
      this.authenticationService.logout();
      this.onLogin.emit(false);
      this.loggedIn = false;
    }

}
