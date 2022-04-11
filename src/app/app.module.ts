// General purpose modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HammerModule } from '@angular/platform-browser';

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

// Components
import { AppComponent } from './app.component';
import { GamesComponent } from './components/games/games.component';
import { ButtonComponent } from './components/button/button.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { CardComponent } from './components/card/card.component';
import { BasicFormComponent } from './components/basic-form/basic-form.component';
import { AccountFormComponent } from './components/account-form/account-form.component';
import { BasicFormDialogComponent } from './components/basic-form-dialog/basic-form-dialog.component';

// Pages
import { SplashComponent } from './pages/splash/splash.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainComponent } from './pages/main/main.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FooterComponent } from './components/footer/footer.component';
import { PreferencesFormComponent } from './components/preferences-form/preferences-form.component';
import { AccountFormDialogComponent } from './components/account-form-dialog/account-form-dialog.component';
import { PreferencesFormDialogComponent } from './components/preferences-form-dialog/preferences-form-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';

const appRoutes: Routes = [
  {
    path: '',
    component: SplashComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'main/player/:id',
    component: MainComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    GamesComponent,
    SplashComponent,
    ButtonComponent,
    LoginComponent,
    LoginFormComponent,
    RegisterComponent,
    CardComponent,
    MainComponent,
    ProfileComponent,
    FooterComponent,
    BasicFormComponent,
    AccountFormComponent,
    BasicFormDialogComponent,
    PreferencesFormComponent,
    AccountFormDialogComponent,
    PreferencesFormDialogComponent,
    DeleteDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' }),
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatExpansionModule,
    MatSelectModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatStepperModule,
    HammerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
