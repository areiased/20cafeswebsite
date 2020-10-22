import { Injectable, NgZone } from '@angular/core';
import { User } from './shared/services/user';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Location } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    userData: any; // Save logged in user data

    constructor(
        public afs: AngularFirestore, // Inject Firestore service
        public afAuth: AngularFireAuth, // Inject Firebase auth service
        public router: Router,
        public ngZone: NgZone, // NgZone service to remove outside scope warning
        public location: Location,
    ) {
        /* Saving user data in localstorage when
    logged in and setting up null when logged out */
        this.afAuth.authState.subscribe((user) => {
            if (user) {
                this.userData = user;
                localStorage.setItem('user', JSON.stringify(this.userData));
                JSON.parse(localStorage.getItem('user'));
            } else {
                localStorage.setItem('user', null);
                JSON.parse(localStorage.getItem('user'));
            }
        });
    }

    // Sign in with email/password
    SignIn(email, password) {
        return this.afAuth
            .signInWithEmailAndPassword(email, password)
            .then((result) => {
                this.ngZone.run(() => {
                    this.router.navigate(['']);
                });
                this.SetUserData(result.user);
            })
            .catch((error) => {
                window.alert(error.message);
            });
    }

    // Sign up with email/password
    SignUp(email, password) {
        return this.afAuth
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
                /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
                // this.SendVerificationMail();
                this.SetUserData(result.user);
            })
            .catch((error) => {
                window.alert(error.message);
            });
    }

    // Sign in with Google
    GoogleAuth() {
        return this.AuthLogin(new auth.GoogleAuthProvider());
    }

    // Auth logic to run auth providers
    AuthLogin(provider) {
        return this.afAuth
            .signInWithPopup(provider)
            .then((result) => {
                this.ngZone.run(() => {
                    this.router.navigate(['']);
                    setTimeout(() => {
                      window.location.reload();
                    }, 200);
                });
                this.SetUserData(result.user);
            })
            .catch((error) => {
                window.alert(error);
            });
    }

    /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
    SetUserData(user) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(
            `users/${user.uid}`
        );
        const userData: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
        };
        return userRef.set(userData, {
            merge: true,
        });
    }

    // Sign out and redirect and refresh page (so it refreshes the navbar)
    SignOut() {
        return this.afAuth.signOut().then(() => {
            localStorage.removeItem('user');
            this.location.replaceState('/'); // clears browser history so they can't navigate with back button
            this.router.navigate(['/']);

            setTimeout(() => {
              window.location.reload();
            }, 200);
        });
    }
}
