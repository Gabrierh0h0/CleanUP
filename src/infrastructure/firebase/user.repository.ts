/**
 * CAPA DE INFRAESTRUCTURA — UserRepository (Firebase)
 * Implementa IUserRepository del dominio usando Firestore.
 */
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { IUserRepository } from '../../domain/interfaces/repositories.interface';
import { UserModel } from '../../domain/models/user.model';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly firebase: FirebaseService) {}

  async findById(uid: string): Promise<UserModel | null> {
    const doc = await this.firebase.db.collection('users').doc(uid).get();
    if (!doc.exists) return null;
    return new UserModel({ uid: doc.id, ...doc.data() as any });
  }

  async save(user: UserModel): Promise<void> {
    await this.firebase.db.collection('users').doc(user.uid).set({
      uid: user.uid,
      firstName: user.firstName,
      middleName: user.middleName ?? '',
      lastName: user.lastName,
      email: user.email,
      career: user.career,
      role: user.role,
      totalPoints: user.totalPoints,
      completedMissions: user.completedMissions,
      unlockedLogros: user.unlockedLogros,
      createdAt: user.createdAt ?? new Date(),
    });
  }

  async update(uid: string, data: Partial<UserModel>): Promise<void> {
    await this.firebase.db.collection('users').doc(uid).update(data as any);
  }

  async getRanking(limit = 50): Promise<UserModel[]> {
    const snapshot = await this.firebase.db
      .collection('users')
      .orderBy('totalPoints', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(
      (doc) => new UserModel({ uid: doc.id, ...doc.data() as any }),
    );
  }
}
