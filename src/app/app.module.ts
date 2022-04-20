// General purpose modules
import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SwipeCardLibModule } from 'ng-swipe-card';

// Material modules
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Components
import { AppComponent } from './app.component';
import { RoutingModule } from './routing.module';
import { ButtonComponent } from './components/button/button.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { BasicFormComponent } from './components/basic-form/basic-form.component';
import { AccountFormComponent } from './components/account-form/account-form.component';
import { interceptorProvider } from './services/interceptor.service';
import { SimpleDialogComponent } from './components/simple-dialog/simple-dialog.component';

// Pages
import { SplashComponent } from './pages/splash/splash.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PreferencesFormComponent } from './components/preferences-form/preferences-form.component';
import { FeedComponent } from './pages/feed/feed.component';
import { TournamentsComponent } from './pages/tournaments/tournaments.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { CreateTeamDialogComponent } from './components/create-team-dialog/create-team-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    ButtonComponent,
    LoginComponent,
    LoginFormComponent,
    RegisterComponent,
    ProfileComponent,
    BasicFormComponent,
    AccountFormComponent,
    PreferencesFormComponent,
    FeedComponent,
    TournamentsComponent,
    MessagesComponent,
    SimpleDialogComponent,
    CreateTeamDialogComponent,
  ],
  imports: [
    SwipeCardLibModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatListModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatExpansionModule,
    MatSelectModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatSidenavModule,
    MatStepperModule,
    MatToolbarModule,
    MatDividerModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    HammerModule,
  ],
  providers: [interceptorProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
