import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutpageComponent } from './aboutpage/aboutpage.component';
import { BlogpageComponent } from './blogpage/blogpage.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { Page404Component } from './page404/page404.component';
import { ProjectspageComponent } from './projectspage/projectspage.component';
import { ShoppageComponent } from './shoppage/shoppage.component';
import { StoreeditpageComponent } from './shoppage/storeeditpage/storeeditpage.component';

import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'sobre', component: AboutpageComponent },
  { path: 'projetos', component: BlogpageComponent },
  { path: 'blog', component: BlogpageComponent },
  { path: 'equipa', component: BlogpageComponent },
  { path: 'loja', component: ShoppageComponent},
  { path: 'abacalhar', component: LoginpageComponent},
  { path: 'editarloja', component: StoreeditpageComponent}, // , canActivate: [AuthGuard]

  {path: '404', component: Page404Component}, // handle 404 redirect
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
