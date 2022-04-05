import { keyframes, style } from '@angular/animations';

export const backOutLeft = [
  style({ transform: 'scale(1)', opacity: '1', offset: 0 }),
  style({
    transform: 'translateX(0px) scale(0.7)',
    opacity: '0.7',
    offset: 0.2,
  }),
  style({
    transform: 'translateX(-2000px) scale(0.7)',
    opacity: '0.7',
    offset: 1,
  }),
];

export const backOutRight = [
  style({ transform: 'scale(1)', opacity: '1', offset: 0 }),
  style({
    transform: 'translateX(0px) scale(0.7)',
    opacity: '0.7',
    offset: 0.2,
  }),
  style({
    transform: 'translateX(2000px) scale(0.7)',
    opacity: '0.7',
    offset: 1,
  }),
];
