import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {
  image = '../assets/login/islena.png';
  truck = '../assets/login/track.svg';
  constructor(private route: Router, private login: LoginService) { }

  ngOnInit() {
  }

  loginMethod(){
    this.login.verified = true;
    this.route.navigate(['/home']);
  }

}