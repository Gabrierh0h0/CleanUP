/**
 * CAPA DE INFRAESTRUCTURA — Firebase Service
 * Inicializa Firebase Admin SDK y expone auth + firestore.
 * Solo esta capa conoce Firebase; el dominio y la aplicación
 * trabajan contra interfaces/repositorios abstraídos.
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      this.app = admin.initializeApp({
        credential: admin.credential.cert(
          process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? './firebase-service-account.json',
        ),
      });
    } else {
      this.app = admin.app();
    }
  }

  onModuleInit() {
    console.log('✅ [Infraestructura] Firebase Admin inicializado');
  }

  get auth(): admin.auth.Auth {
    return this.app.auth();
  }

  get db(): admin.firestore.Firestore {
    return this.app.firestore();
  }
}
