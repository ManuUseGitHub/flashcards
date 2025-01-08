import { ProfileUSer } from '../DTOs/profileUser';
import { SyncUser } from '../DTOs/syncUser';

export function mapSyncUser(user: any): SyncUser {
  const { uid, displayName, photoURL: photoUrl, email } = user;
  return {
    uid,
    displayName,
    photoUrl,
    email,
  } as SyncUser;
}

export function mapProfileUser(user: any): ProfileUSer {
  const {
    uid,
    displayName,
    photoURL: photoUrl,
    email,
    dateJoin,
    dateOfBirth,
  } = user;
  return {
    uid,
    displayName,
    photoUrl,
    email,
    dateOfBirth,
    dateJoin
  }
}
