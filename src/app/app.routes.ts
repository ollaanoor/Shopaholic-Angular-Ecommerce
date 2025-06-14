import { Routes } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
import { AdminGuard } from '../services/admin.guard';
import { HomeComponent } from '../pages/home/home.component';
import { ProductDetailsComponent } from '../pages/product-details/product-details.component';
import { CartComponent } from '../pages/cart/cart.component';
import { CheckoutComponent } from '../pages/checkout/checkout.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { AboutComponent } from '../pages/about/about.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { WishlistComponent } from '../pages/wishlist/wishlist.component';
import { CategoryComponent } from '../pages/category/category.component';
import { AdminProductsComponent } from '../pages/admin-products/admin-products.component';
import { AdminOrdersComponent } from '../pages/admin-orders/admin-orders.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'category/:slug',
    component: CategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'admin/products',
    component: AdminProductsComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/orders',
    component: AdminOrdersComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  //   { path: '**', component: ErrorComponent },
];
