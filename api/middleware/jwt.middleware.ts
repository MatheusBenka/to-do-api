import { Status, Context } from "https://deno.land/x/oak/mod.ts";
import { validateToken, decode  } from '../utils/jwt.util.ts';

const validateTokenMiddleware = async (context:any,next:Function)=>{
    try{
        
        const url:string = context.request.url.pathname;
        const method = context.request.method;
                
        if(url.includes('login') 
        || url.includes('logout')
        || url.includes('signup')
        || "OPTIONS" == method){            
            await next();
        }else{          
                        
            const jwkToken:string = context.request.headers.get("Authorization") ?? '';     
            const isTokenValid = await validateToken(jwkToken);

            if(!isTokenValid){
                console.log(`eh o token`);                
                context.response.body = { msg:'Unauthorized'} ;
                context.response.status = Status.Unauthorized;
                return;
            }          
            const obj = await decode(jwkToken);
            context.request.sessionmodel = obj.payload; 
            await next();
        }        
    }catch(error){
        console.log(error);
        context.response.status = Status.InternalServerError;        
    }
}

export { validateTokenMiddleware };