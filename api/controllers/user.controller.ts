import { Status } from "https://deno.land/x/oak/mod.ts";
import { ResponseModelWithData } from "../models/ResponseModel.ts";
import { login as loginService,signup as signupService } from "../services/user.service.ts";
import { makeToken } from '../utils/jwt.util.ts';
import { IProfile } from "../models/profile.ts";
import { IUser } from "../models/user.ts";


const login = async ({params, request, response}:{params:{username:string,password:string};request:any;response:any})=>{        
    const body = await request.body();

    const bodyValue = await body.value;
    
    const userProfile: IProfile | null = await loginService(bodyValue.username,bodyValue.password);
    
    if(userProfile){
        await createResponseToken(response,userProfile);
    }else{
        response.status = Status.NotFound;        
    }
}

const signup = async ({request,response}:{request:any, response:any}) =>{
    const body = await request.body();
    const bodyValue = await body.value;

    const newProfile = {    
        email:bodyValue.email,
        name:bodyValue.name,
        user:{
            username:bodyValue.username,
            password:bodyValue.password        
        } as IUser

    } as IProfile;

    console.log(newProfile);
    
    const profileCreated = await signupService(newProfile);

    if(profileCreated){
        await createResponseToken(response,profileCreated);
    }else{
        response.status = Status.InternalServerError;        
    }
};

const createResponseToken = async (response:any, profile:IProfile) => {
    const token = await makeToken({user:profile});
    const responseBody = new ResponseModelWithData("ok",true,{user:profile}); 
    response.body  = responseBody;
    response.status = Status.OK;
    response.headers.set('x-token',token); 
}

export {login,signup};