import { Role } from './user.enums'

export interface UserDTO {
  login: string
  password: string
}

export interface User extends UserDTO {
  _id: string
  role: Role
  createdAt: Date
  modifiedAt: Date
  lastLogin?: Date
}
