import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { UserService } from "src/app/services/user.service";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    registerworked = false;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService) {
          this.registerForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit() {
      this.registerForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', [Validators.required]]
    });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        const user = {
          username: this.registerForm.get('username')?.value,
          password: this.registerForm.get('password')?.value
        }

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(user.username, user.password)
            .pipe(first())
            .subscribe(
                data => {
                   this.loading = false;
                   this.registerworked = true;
                },
                error => {
                  this.loading = false;
                  this.registerworked = false;
                });
    }
}
