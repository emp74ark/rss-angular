export interface UserDTO {
  login: string
  password: string
}

export interface User extends UserDTO {
  _id: string
  role: string
  createdAt: Date
  modifiedAt: Date
}
