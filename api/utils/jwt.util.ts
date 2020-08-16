import { validateJwt, parseAndDecode } from "https://deno.land/x/djwt/validate.ts";
import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt/create.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const KEY = config().JWT_KEY ?? 'cleber123';
const EXPIRE_MINUTES:number = parseInt(config().EXPIRE_MINUTES) ?? 60;


const payloadFixed: Payload = {    
    exp: setExpiration(EXPIRE_MINUTES * 60)
};

const header: Jose = {
    alg: "HS256",
    typ: "JWT",
};
  

const makeToken = async (payload:any) =>{
    return await makeJwt({header,payload:{...payloadFixed, ...payload}, key:KEY})
}
const validateToken = async (token:string) => {
    if(!token) return false;
    
    const validate = await validateJwt({jwt:token,key:KEY,algorithm:header.alg});    
    return validate.isValid;
}

const decode = async (token:string) =>{
    if(!token) throw new Error('token invalido');

    const obj = parseAndDecode(token);    

    return obj;
}

export {makeToken, validateToken,decode}
