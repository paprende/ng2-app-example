import { trigger, state, style, transition, animate, keyframes } from '@angular/core';

export const routeAnimation = {
  host: {
    '[@routeAnimation]': 'true',
    'style': 'display: block; margin: 0 auto; height: 100%;',
  },
  animations: [
    trigger('routeAnimation', [
      state('*', style({transform: 'translate3d(0, 0, 0)', opacity: 1})),
      transition('void => *', [
        animate('.3s ease-in-out', keyframes([
          style({opacity: 0, transform: 'translate3d(-20px, 0, 0)', offset: 0}),
          style({opacity: 1, transform: 'translate3d(0, 0, 0)',  offset: 1}),
        ]))
      ])
    ])
  ]
};
