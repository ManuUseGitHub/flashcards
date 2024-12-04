import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fa-cards',
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 30.437281 22.689817"
      stroke-width="0"
      stroke="currentColor"
      style="fill:currentColor"
      [class]="class + ' inline'"
    >
      <path
        d="M 20.570312,0 C 19.642486,0.11193443 19.282728,1.1212378 18.685498,1.7184291 15.414659,5.787501 12.129255,9.8453707 8.867513,13.92144 c -0.5914581,0.771378 0.2033389,1.444498 0.8031468,1.856943 2.7888162,2.245096 5.5776332,4.490193 8.3664492,6.735289 0.89601,0.591689 1.505355,-0.477055 1.994023,-1.067647 3.397966,-4.227496 6.81037,-8.443881 10.199317,-12.6783174 C 30.824809,7.9970468 30.028607,7.3234807 29.428875,6.9111629 26.640083,4.6666867 23.851292,2.4222106 21.0625,0.17773438 L 20.814728,0.04032225 Z M 4.0253906,0.02148438 C 3.0506653,0.31454765 3.2087967,1.4887898 2.9764687,2.2800059 1.9887706,7.4841672 0.98366346,12.685393 0.00684069,17.891388 c -0.16252858,0.959907 0.86070516,1.17893 1.58350491,1.261516 3.5161088,0.669735 7.0322176,1.33947 10.5483264,2.009205 0.730677,0.205479 1.570157,-1.147718 0.856423,-1.552264 -0.307981,-0.119962 -0.913379,-1.04661 -0.944253,-0.41497 0.07869,0.706921 -0.438909,0.537768 -0.927934,0.410589 C 7.8788137,18.987627 4.6347193,18.36979 1.390625,17.751953 2.4277344,12.309896 3.4648437,6.8678385 4.5019531,1.4257812 8.0195314,2.0963541 11.53711,2.7669271 15.054688,3.4375 14.942058,4.0286458 14.829427,4.6197917 14.716797,5.2109375 15.289063,4.5 15.861328,3.7890625 16.433594,3.078125 16.390457,2.0508686 15.210692,2.1603346 14.484029,1.9653055 11.092217,1.3186672 7.7004056,0.67202892 4.3085938,0.02539063 Z M 20.414062,6.5371094 c 2.192592,-0.089827 4.489742,2.1751261 3.788198,4.4128286 -0.452691,1.500827 -2.16803,1.737926 -3.511121,1.667771 -1.122402,-0.301515 -2.883926,1.833921 -3.172743,-0.15956 0.514533,-1.520577 2.340137,-1.510231 3.667312,-1.497018 1.936313,0.145371 1.686977,-2.648472 0.03016,-2.793842 -0.977915,0.1224721 -3.04463,1.4957672 -2.902877,-0.4915413 0.349216,-0.7660668 1.317483,-1.0935175 2.101066,-1.1386383 z m -3.689453,6.9238286 c 1.765131,-0.144036 1.121873,2.801669 -0.410109,1.924503 -0.908313,-0.456447 -0.594852,-1.874629 0.410109,-1.924503 z"
      />
    </svg>
  `,
  standalone: false,
})
export class CardsComponent {
  @Input() class = '';
}