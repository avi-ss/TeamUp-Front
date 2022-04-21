import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PlayerLogin } from 'src/app/models/PlayerLogin';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  playerLogin: PlayerLogin = { nickname: '', password: '' };
  loginForm: FormGroup = this.builder.group({ login: [] });

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private builder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onLogin(): void {
    const playerLoginForm: PlayerLogin = this.loginForm.value.login;
    this.playerLogin = playerLoginForm;

    this.authService.loginPlayer(this.playerLogin).subscribe(
      (data) => {
        // En este punto nos hemos logueado correctamente
        this.tokenService.setToken(data.token);
        this.router.navigateByUrl('/profile');
      },
      (error) => {
        // Ha habido un problema durante el login
        // TODO: Sacar un dialog por pantalla mostrando el error
        this.snackBar.open('Incorrect credentials', 'Dismiss', {
          duration: 2000,
        });

        // Reset the form
        this.loginForm.patchValue({
          login: {
            nickname: '',
            password: '',
          },
        });
      }
    );
  }
}
