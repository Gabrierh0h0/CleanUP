/**
 * CAPA DE INFRAESTRUCTURA — MisionRepository + LogroRepository (Firebase)
 */
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import {
  IMisionRepository,
  ILogroRepository,
} from '../../../usecases/output/repositories.output';
import { MisionModel } from '../../../entities/mision.model';
import { LogroModel } from '../../../entities/logro.model';

@Injectable()
export class MisionRepository implements IMisionRepository {
  constructor(private readonly firebase: FirebaseService) {}

  async findAll(): Promise<MisionModel[]> {
    const snapshot = await this.firebase.db.collection('mision').get();
    return snapshot.docs.map(
      (doc) => new MisionModel({ id: doc.id, ...doc.data() as any }),
    );
  }

  async findById(id: string): Promise<MisionModel | null> {
    const doc = await this.firebase.db.collection('mision').doc(id).get();
    if (!doc.exists) return null;
    return new MisionModel({ id: doc.id, ...doc.data() as any });
  }
}

@Injectable()
export class LogroRepository implements ILogroRepository {
  constructor(private readonly firebase: FirebaseService) {}

  async findAll(): Promise<LogroModel[]> {
    const snapshot = await this.firebase.db.collection('logros').get();
    return snapshot.docs.map(
      (doc) => new LogroModel({ id: doc.id, ...doc.data() as any }),
    );
  }

  async findById(id: string): Promise<LogroModel | null> {
    const doc = await this.firebase.db.collection('logros').doc(id).get();
    if (!doc.exists) return null;
    return new LogroModel({ id: doc.id, ...doc.data() as any });
  }
}
