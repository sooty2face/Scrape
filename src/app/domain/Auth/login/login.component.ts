import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { ToDosRepository } from 'src/app/shared/rxdb/repositories';
import { ToDoService } from '../../todos/services/todos.service';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { ConnectivityStateService } from 'src/app/shared/network/services';

@Component({ templateUrl: 'login.component.html' })
@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    hide = true;

    public formValidationMessages = { username: [], password: [] };
    public showPassword: boolean = false;
    public toggleEye: string = 'eye-off';

    private authServiceSubscription: Subscription;
    public isOffline$ = this.connectivityStateService.connectivity$.pipe(map((status) => status.isConnected !== true));

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private toDosRepo: ToDosRepository,
        private toDoService: ToDoService,
        private loadingController: LoadingController,
        private connectivityStateService:ConnectivityStateService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue && this.authenticationService.isAuthenticated()) {
            console.log("trying to redirect")
            this.router.navigate(['/folder/Inbox']);
        }
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        this.formValidationMessages = {
            username: [
                { type: 'required', message: 'Username required' }
            ],
            password: [{ type: 'required', message: 'Password required' }],
        };
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.f.invalid) {
            return;
        }

        const loader = await this.loadingController.create();
        await loader.present();
        this.authServiceSubscription = this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.refreshRxDB();
                    this.router.navigate(['/folder/Inbox']);
                },
                error => {
                    this.error = error;
                    loader.dismiss();
                },
                async () => {
                    loader.dismiss();
                });
    }

    async refreshRxDB() {
        this.toDoService.getToDos().subscribe(async res => {
            await this.toDosRepo.bulkUpsert(res)
        });
    }

    public togglePassword() {
        this.showPassword = !this.showPassword;
        this.toggleEye = this.showPassword ? 'eye' : 'eye-off';
    }

    public ngOnDestroy() {
        this.authServiceSubscription.unsubscribe();
    }
}
