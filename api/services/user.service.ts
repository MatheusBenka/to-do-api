import { createHash } from "https://deno.land/std/hash/mod.ts";  
import { MongoClient } from "https://deno.land/x/mongo@v0.9.1/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { IProfile } from '../models/profile.ts';
import { IUser } from "../models/user.ts";

interface UserSchema {
    _id: { $oid: string };
    username: string;
    password: string;
}

interface ProfileSchema{
    _id:{$oid:string};
    userId:string,
    name:string,
    email:string
}

    const findUserProfile = async (userId:string):Promise<IProfile | null> => {        
        const client = new MongoClient();
        client.connectWithUri(config().CONNECTION_STRING);   
        const db = client.database("todo");
        const users = db.collection<ProfileSchema>("profile"); 
                
        var profileDB:ProfileSchema | null = await users.findOne({userId:userId});
        
        var response:IProfile | null = null;

        if(profileDB){
            response  =  
            {
                id:profileDB['_id'].$oid,
                userId:profileDB['userId'],
                name:profileDB['name'],
                email:profileDB['email']
            } as IProfile;
        }

        return response;
    }

    const login = async (username:string,password:string):Promise<IProfile | null> => { 
        const client = new MongoClient();
        client.connectWithUri(config().CONNECTION_STRING);   
        const db = client.database("todo");
        const users = db.collection<UserSchema>("user"); 
        
        var userDB:UserSchema | null  = await users.findOne({username:username});

        if(userDB){
            
            const hash = createHash('md5');
            hash.update(password);        
            let check = hash.toString() ==  userDB.password;

            const profile:IProfile | null = await findUserProfile(userDB._id.$oid);

            if(check && profile){                
                const user = {
                    id:userDB._id.$oid,
                    username:userDB.username,
                    password:null
                }  as IUser;

                profile.user = user;
                return profile;                
            }
            else 
                return null;
        }else{
            return null;
        }
    }

    const signup = async (newProfile:IProfile):Promise<IProfile | null> => {
        const hash = createHash('md5');
        const password:string = newProfile.user.password ?? '12345';
        hash.update(password);  
        newProfile.user.password = hash.toString();

        const client = new MongoClient();
        client.connectWithUri(config().CONNECTION_STRING);   
        const db = client.database("todo");
        const users = db.collection<UserSchema>('user');
        const profiles = db.collection<ProfileSchema>("profile");

        const createdUser = await users.insertOne({
            password:newProfile.user.password,
            username:newProfile.user.username
        } as UserSchema);

        console.log(`created userid ${createdUser.$oid}`);

        newProfile.userId = createdUser.$oid;

        const createdProfile = await profiles.insertOne({
            email:newProfile.email,
            name:newProfile.name,
            userId:newProfile.userId
        } as ProfileSchema);

        console.log(`created profileid ${createdProfile.$oid}`);
        
        return await login(newProfile.user.username,password);
    }

export { login, signup };