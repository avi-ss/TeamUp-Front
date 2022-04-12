import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    private builder: FormBuilder
  ) {}

  ngOnInit(): void {}

  onLogin(): void {
    const playerLoginForm: PlayerLogin = this.loginForm.value.login;
    this.playerLogin = playerLoginForm;

    this.authService.loginPlayer(this.playerLogin).subscribe(
      (data) => {
        // En este punto nos hemos logueado correctamente
        this.tokenService.setToken(data.token);

        console.log('Logueado correctamente');
        //this.router.navigateByUrl("main/player/" + )
      },
      (error) => {
        // Ha habido un problema durante el login
        // TODO: Sacar un dialog por pantalla mostrando el error
        console.log(error);
      }
    );
  }
}
