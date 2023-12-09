
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//--
import { HomeRoutedComponent } from './components/shared/home-routed/home-routed.component';
//--
import { AdminUserViewRoutedComponent } from './components/user/admin-user-view-routed/admin-user-view-routed.component';
import { AdminUserPlistRoutedComponent } from './components/user/admin-user-plist-routed/admin-user-plist-routed.component';
import { AdminUserEditRoutedComponent } from './components/user/admin-user-edit-routed/admin-user-edit-routed.component';
import { AdminUserNewRoutedComponent } from './components/user/admin-user-new-routed/admin-user-new-routed.component';
import { AdminThreadNewRoutedComponent } from './components/thread/admin-thread-new-routed/admin-thread-new-routed.component';
import { AdminReplyPlistRoutedComponent } from './components/reply/admin-reply-plist-routed/admin-reply-plist-routed.component';
import { AdminThreadPlistRoutedComponent } from './components/thread/admin-thread-plist-routed/admin-thread-plist-routed.component';
import { AdminReplyNewRoutedComponent } from './components/reply/admin-reply-new-routed/admin-reply-new-routed.component';
//--
import { AdminReplyEditRoutedComponent } from './components/reply/admin-reply-edit-routed/admin-reply-edit-routed.component';
import { AdminThreadEditRoutedComponent } from './components/thread/admin-thread-edit-routed/admin-thread-edit-routed.component';
import { AdminThreadViewRoutedComponent } from './components/thread/admin-thread-view-routed/admin-thread-view-routed.component';
import { AdminReplyViewRoutedComponent } from './components/reply/admin-reply-view-routed/admin-reply-view-routed.component';
import { LoginRoutedComponent } from './components/shared/login-routed/login-routed.component';
import { LogoutRoutedComponent } from './components/shared/logout-routed/logout-routed.component';
import { AdminRatingPlistRoutedComponent } from './components/rating/admin-rating-plist-routed/admin-rating-plist-routed.component';
import { AdminRatingViewRoutedComponent } from './components/rating/admin-rating-view-routed/admin-rating-view-routed.component';
import { AdminRatingNewRoutedComponent } from './components/rating/admin-rating-new-routed/admin-rating-new-routed.component';


const routes: Routes = [
  { path: '', component: HomeRoutedComponent },
  { path: 'home', component: HomeRoutedComponent },
  { path: 'login', component: LoginRoutedComponent },
  { path: 'logout', component: LogoutRoutedComponent },
  //--
  { path: 'admin/user/plist', component: AdminUserPlistRoutedComponent },
  { path: 'admin/user/view/:id', component: AdminUserViewRoutedComponent },
  { path: 'admin/user/new', component: AdminUserNewRoutedComponent },
  { path: 'admin/user/edit/:id', component: AdminUserEditRoutedComponent },
  //--  
  { path: 'admin/thread/plist', component: AdminThreadPlistRoutedComponent },
  { path: 'admin/thread/plist/byuser/:id', component: AdminThreadPlistRoutedComponent },
  { path: 'admin/thread/view/:id', component: AdminThreadViewRoutedComponent },
  { path: 'admin/thread/new', component: AdminThreadNewRoutedComponent },
  { path: 'admin/thread/edit/:id', component: AdminThreadEditRoutedComponent },
  //--
  { path: 'admin/reply/plist', component: AdminReplyPlistRoutedComponent },
  { path: 'admin/reply/plist/byuser/:iduser', component: AdminReplyPlistRoutedComponent },
  { path: 'admin/reply/plist/bythread/:idthread', component: AdminReplyPlistRoutedComponent },
  { path: 'admin/reply/view/:id', component: AdminReplyViewRoutedComponent },
  { path: 'admin/reply/new', component: AdminReplyNewRoutedComponent },
  { path: 'admin/reply/edit/:id', component: AdminReplyEditRoutedComponent },
  //--
  { path: 'admin/rating/plist', component: AdminRatingPlistRoutedComponent },
  { path: 'admin/rating/view/:id', component: AdminRatingViewRoutedComponent },
  { path: 'admin/rating/new', component: AdminRatingNewRoutedComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
