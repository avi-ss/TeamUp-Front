import { NgModule } from '@angular/core';
import { LoginGuard } from './guards/login.guard';
import { RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './pages/splash/splash.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { GuardService } from './guards/guard.service';
import { ProfileComponent } from './pages/profile/profile.component';
import { FeedComponent } from './pages/feed/feed.component';
import { TournamentsComponent } from './pages/tournaments/tournaments.component';
import { MessagesComponent } from './pages/messages/messages.component';

const routes: Routes = [
  {
    path: '',
    component: SplashComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [GuardService],
    data: { expectedRol: ['admin', 'user'] },
  },
  {
    path: 'feed',
    component: FeedComponent,
    canActivate: [GuardService],
    data: { expectedRol: ['admin', 'user'] },
  },
  {
    path: 'tournaments',
    component: TournamentsComponent,
    canActivate: [GuardService],
    data: { expectedRol: ['admin', 'user'] },
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [GuardService],
    data: { expectedRol: ['admin', 'user'] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class RoutingModule {}
