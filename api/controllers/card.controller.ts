
import { Status } from "https://deno.land/x/oak/mod.ts";
import { getColumns, insertColumn as InserColumnService, getColumn as getColumnService } from '../services/cars.service.ts';
import { Column } from '../models/column.ts';

const getColumnsByUser = async ({request, response}:{request:any;response:any}) =>{        
    let responseModel = await getColumns(request.sessionmodel.user.id);
    response.status = Status.OK;
    response.body = [...responseModel];            
}
const getCardInfo = async ({params,request, response}:{params:{cardid:string}, request:any;response:any})=>{
    console.log(`sessionmodel`);
    console.log(request.sessionmodel);
    response.status = Status.OK;
    response.body = {msg:"OK"};
}

const getColumn = async({params,request,response}:{params:{columnid:string},request:any,response:any}) =>{
    const column = await getColumnService(params.columnid);
    response.status = Status.OK;
    response.body = column
}

const insertColumn = async({request, response}:{request:any;response:any}) =>{
    const body = await request.body();
    const bodyValue = await body.value;
    const { column }: {column:Column} = bodyValue;    
    column.owner = request.sessionmodel.user.id;
    const result = await InserColumnService(column);
    response.status = Status.Created;
    response.body = {columnId:result};
}


export {getColumnsByUser, insertColumn, getColumn};