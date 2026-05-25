import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            {
                path: 'login',
                component: LoginComponent
            }
        ]
    }
];
