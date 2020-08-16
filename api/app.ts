import {Application, isHttpError, Status, Context } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import router from "./routes/routes.ts";
import { validateTokenMiddleware } from './middleware/jwt.middleware.ts';
const app = new Application();

app.use(
    oakCors({
        origin:'http://localhost:4200',        
        exposedHeaders: '*',
        methods:['GET','HEAD','PUT','PATCH','POST','OPTIONS','DELETE'],
        preflightContinue:false
    }),
)
app.use(validateTokenMiddleware);

app.use(async (context:Context,next:Function)=>{
    try{        
        await next();
    }catch(err){
        console.log(err);
        if(isHttpError(err)){
            switch(err.status){
                case Status.NotFound:
                    context.response.status = Status.NotFound;
                    break;
                default:
                    context.response.status = Status.BadRequest;        
                    break;
            }
        }else{            
            context.response.status = Status.InternalServerError;            
        }
    }
})

const allowedMethods = router.allowedMethods();
app.use(router.routes());
app.use(allowedMethods);
app.listen(`${config().HOST}:${config().PORT}`);

console.log(`Server running on ${config().HOST}:${config().PORT}`);