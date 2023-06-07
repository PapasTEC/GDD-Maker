import { Routes } from "@angular/router";
import { UserProfileComponent } from "src/app/pages/user-profile/user-profile.component";

import { LoginComponent } from "../../pages/login/login.component";
import { RegisterComponent } from "../../pages/register/register.component";
import { UserGuardGuard } from "src/app/guard/user-guard.guard";

export const AuthLayoutRoutes: Routes = [
  { path: "login", component: LoginComponent, canActivate: [UserGuardGuard] },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [UserGuardGuard],
  },
];
