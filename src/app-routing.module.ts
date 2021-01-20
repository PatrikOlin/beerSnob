import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsCheckinsComponent } from './app/components/friend-checkins/friends-checkins.component';
import { HomeComponent } from './app/components/home/home.component';
import { LoginComponent } from './app/components/login/login.component';
import { SimilarBeersListComponent } from './app/components/similar-beers-list/similar-beers-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'similarBeers', component: SimilarBeersListComponent },
  { path: 'friendsCheckins', component: FriendsCheckinsComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
