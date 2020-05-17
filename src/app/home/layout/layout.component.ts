import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { NbSidebarService, NbMenuService, NbDialogService } from '@nebular/theme';
import { SharedService } from 'src/shared/services/shared.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from 'src/shared/models/user.model';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { IServer } from 'src/shared/models/server.model';
import { ServersService } from '../servers/servers.service';
import { ContactUsComponent } from 'src/shared/ui/contact-us/contact-us.component';
import { ProfileComponent } from 'src/shared/ui/profile/profile.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  sideNavMode = 'side';
  screenWidth: number;
  screenHeight: number;
  user: IUser;
  user$: Observable<IUser>;
  servers$: Observable<IServer[]>;

  profileOptions: { title: ProfileMenuEnum }[] = [{ title: 'Profile' }, { title: 'Logout' }];

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private afAuth: AngularFireAuth,
    private ss: SharedService,
    private serversService: ServersService,
    private dialogService: NbDialogService,
    private sidebarService: NbSidebarService,
    private nbMenuService: NbMenuService
  ) {
    this.getScreenSize();
  }

  async ngOnInit() {
    this.user = await this.ss.getUser();
    this.user$ = this.ss.getUser$();
    this.servers$ = this.serversService.usersServers$;

    this.handleMenu();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private handleMenu() {
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'profile-menu'),
        map(({ item: { title } }) => title),
        takeUntil(this.destroyed$)
      )
      .subscribe((title: ProfileMenuEnum) => {
        if (title === 'Logout') {
          this.logoutClicked();
        } else if (title === 'Profile') {
          this.profileClicked();
        }
      });
  }

  // Add this function to get the screen size
  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

  logoutClicked() {
    this.afAuth.signOut();
  }

  contactUsClicked() {
    this.dialogService.open(ContactUsComponent);
  }

  profileClicked() {
    console.log(this.user);

    this.dialogService.open(ProfileComponent, { context: { user: this.user } });
  }
}

type ProfileMenuEnum = 'Profile' | 'Logout';
