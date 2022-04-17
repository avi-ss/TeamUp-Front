import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  FormGroup,
  Validators,
  NG_VALIDATORS,
  FormControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models/Game';
import { Preferences } from 'src/app/models/Preferences';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-preferences-form',
  templateUrl: './preferences-form.component.html',
  styleUrls: ['./preferences-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PreferencesFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PreferencesFormComponent),
      multi: true,
    },
  ],
})
export class PreferencesFormComponent
  implements ControlValueAccessor, OnDestroy, OnInit
{
  @Input() data: Preferences = {
    game: '',
    role: '',
    rank: '',
    feminine: false,
    wantedUser: 'user',
  };
  form: FormGroup = this.builder.group({});
  games: Game[] = [];
  subscriptions: Subscription[] = [];

  get value(): Preferences {
    const preferences: Preferences = {
      game: this.form.value.game,
      role: this.form.value.role,
      rank: this.form.value.rank,
      feminine: false,
      wantedUser: this.form.value.wantedUser,
    };

    return preferences;
  }

  set value(value: Preferences) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  select(g: any) {
    console.log(g);
  }

  constructor(private builder: FormBuilder, private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getGames().subscribe((games) => {
      this.games = games;
      console.log(games);
    });

    this.form = this.builder.group({
      game: [this.data.game, [Validators.required]],
      role: [this.data.role, [Validators.required]],
      rank: [this.data.rank, [Validators.required]],
    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.form.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  get game() {
    return this.form.value.game;
  }

  get role() {
    return this.form.value.role;
  }

  get roles() {
    let gameIndex = 0;

    this.games.forEach((game, index) => {
      if (game.name == this.game) {
        gameIndex = index;
      }
    });

    return this.games[gameIndex].roles;
  }

  get rank() {
    return this.form.value.rank;
  }

  get ranks() {
    let gameIndex = 0;

    this.games.forEach((game, index) => {
      if (game.name == this.game) {
        gameIndex = index;
      }
    });

    return this.games[gameIndex].ranks;
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.form.reset();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.form.valid ? null : { profile: { valid: false } };
  }
}
