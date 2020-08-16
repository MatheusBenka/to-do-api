import { IUser } from "./user.ts";

export interface IProfile{
    id:string,
    userId:string,
    name:string,
    email:string,
    user:IUser
}