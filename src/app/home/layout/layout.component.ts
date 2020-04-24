import { Component, OnInit, HostListener } from '@angular/core';
import { NbSidebarService, NbMenuService } from '@nebular/theme';
import { SharedService } from 'src/shared/services/shared.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from 'src/shared/models/user.model';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  sideNavMode = 'side';
  screenWidth: number;
  screenHeight: number;
  user: IUser;

  profileOptions: { title: ProfileMenuEnum }[] = [{ title: 'Profile' }, { title: 'Logout' }];

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private ss: SharedService,
    private sidebarService: NbSidebarService,
    private nbMenuService: NbMenuService
  ) {
    this.getScreenSize();
  }

  async ngOnInit() {
    const user = await this.ss.getUser();
    this.afs
      .doc(`users/${user.uid}`)
      .valueChanges()
      .subscribe((snap: IUser) => (this.user = snap));

    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'profile-menu'),
        map(({ item: { title } }) => title)
      )
      .subscribe((title: ProfileMenuEnum) => {
        if (title === 'Logout') {
          this.logoutClicked();
        }
      });
  }

  // Add this function to get the screen size
  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

  // onConvertClicked() {
  //   this.router.navigateByUrl('/home/dummy', { skipLocationChange: true });
  //   setTimeout(() => this.router.navigate(['home/convert']));
  // }

  logoutClicked() {
    this.afAuth.signOut();
  }
}

type ProfileMenuEnum = 'Profile' | 'Logout';
