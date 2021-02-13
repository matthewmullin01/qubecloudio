import { style, transition, trigger, animate } from '@angular/animations';

export const slideInDown = trigger('slideInDown', [
  transition(':enter', [
    style({ transform: 'translateY(-60%)', opacity: '0' }),
    animate('150ms ease-in', style({ transform: 'translateY(0%)', opacity: '1' }))
  ]),
  transition(':leave', [animate('150ms ease-in', style({ transform: 'translateY(-60%)', opacity: '0' }))])
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [style({ opacity: '0' }), animate('100ms ease-in', style({ opacity: '1' }))]),
  transition(':leave', [animate('100ms ease-in', style({ opacity: '0' }))])
]);

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    // :enter is alias to 'void => *'
    style({ opacity: 0 }),
    animate('120ms 500ms', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    // :leave is alias to '* => void'
    animate(120, style({ opacity: 0 }))
  ])
]);
