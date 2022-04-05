import { Component, OnInit } from '@angular/core';
import { trigger, keyframes, animate, transition } from '@angular/animations';
import * as kf from './keyframes';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  animations: [
    trigger('cardAnimator', [
      transition('* => backOutLeft', animate(1000, keyframes(kf.backOutLeft))),
      transition(
        '* => backOutRight',
        animate(1000, keyframes(kf.backOutRight))
      ),
    ]),
  ],
})
export class CardComponent implements OnInit {
  animationState: string = '';

  constructor() {}

  ngOnInit(): void {}

  startAnimation(state: string) {
    console.log(state);
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimation() {
    this.animationState = '';
  }
}
