import { Injectable } from '@nestjs/common';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  private users: User[] = [];
  private idCounter = 1;

  create(user: Omit<User, 'id'>): User {
    const newUser = { id: this.idCounter++, ...user };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  delete(id: number): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}
