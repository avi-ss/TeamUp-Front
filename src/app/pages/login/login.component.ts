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
  isLogged = false;
  loginFailed = false;

  playerLogin: PlayerLogin = { nickname: '', password: '' };
  loginForm: FormGroup = this.builder.group({ login: [] });

  roles: string[] = [];

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private builder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Si tenemos un token, significa que estamos logueados.
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.loginFailed = false;

      // Guardamos los roles del usuario que está logueado
      this.roles = this.tokenService.getAuthorities();
    }
  }

  onLogin(): void {
    const playerLoginForm: PlayerLogin = this.loginForm.value.login;
    this.playerLogin = playerLoginForm;

    this.authService.loginPlayer(this.playerLogin).subscribe(
      (data) => {
        // En este punto nos hemos logueado correctamente
        this.isLogged = true;
        this.loginFailed = false;

        // Almacenamos el token y demás datos
        this.tokenService.setToken(data.token);
        this.tokenService.setNickname(data.nickname);
        this.tokenService.setAuthorities(data.authorities);

        this.roles = data.authorities;

        console.log('Logueado correctamente');

        //this.router.navigateByUrl("main/player/" + )
      },
      (error) => {
        // Ha habido un problema durante el login
        this.isLogged = false;
        this.loginFailed = true;

        // TODO: Sacar un dialog por pantalla mostrando el error
        console.log(error);
      }
    );
  }
}
