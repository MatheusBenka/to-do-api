import { MongoClient, ObjectId } from "https://deno.land/x/mongo@v0.9.1/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Column, Card, CheckListItem} from '../models/column.ts';

interface ColumnSchema {
    _id: { $oid: string };
    title:string;
    color:string;
    description:string|null;
    owner:string;
    cards:CardSchema[];
}

interface CardSchema{
    _id: { $oid: string };
    title:string;
    description:string;
    checklist:CheckListItemSchema[];
}

interface CheckListItemSchema{
    _id: { $oid: string };
    name:string;
    done:boolean;
    start:Date;
    end:Date;
}
//#endregion

const columnsCollection = "columns";

const getColumns = async(owner:string):Promise<Array<Column>> =>{
    const client = new MongoClient();
    client.connectWithUri(config().CONNECTION_STRING);   
    const db = client.database("todo");
    const columns = db.collection<ColumnSchema>(columnsCollection); 
    const columnsList = await columns.find({owner:owner});

    return columnsList?.map((column)=>{
        return {
            id:column._id.$oid,
            color:column.color,
            title:column.title,
            description:column.description,
            cards:column.cards?.map((card)=>{
                return {
                    id:card._id.$oid,
                    title:card.title,
                    description:card.description,
                    checklist:[]
                } as Card
            }),
        }as Column;
    });
}

const insertColumn = async(column:Column) => {
    const client = new MongoClient();
    client.connectWithUri(config().CONNECTION_STRING);   
    const db = client.database("todo");
    const columns = db.collection<ColumnSchema>(columnsCollection); 
    return await columns.insertOne({
        color:column.color,
        title:column.title,
        description:column.description,
        owner:column.owner,
        cards:column.cards?.map((card)=>{
            return {
                title:card.title,
                description:card.description          
            } as CardSchema
         }),
    } as ColumnSchema);
}

const inserCard = async(columdId:string, card:Card) =>{
    const client = new MongoClient();
    client.connectWithUri(config().CONNECTION_STRING);   
    const db = client.database("todo");
    const columns = db.collection<ColumnSchema>(columnsCollection); 
    const column = await columns.findOne({_id:{$oid:columdId}});
    column?.cards.push({
        title:card.title,
        description:card.description,
        checklist:card.checklist.map((item)=>{
            return {
                    name:item.name,
                    start:item.start,
                    done:item.done,
                    end:item.end,
            } as CheckListItemSchema
        })
    } as CardSchema);
    await columns.updateOne(
        {_id:{$oid:columdId}},
        {
            $set:{'cards': column?.cards}
        }
    )
}

const getColumn = async(columnId:string) =>{
    console.log(`columnId : ${columnId}`);
    
    const client = new MongoClient();
    client.connectWithUri(config().CONNECTION_STRING);   
    const db = client.database("todo");
    const columns = db.collection<ColumnSchema>(columnsCollection); 
    return columns.findOne({_id:{$oid:columnId}});  
}

export {getColumns,insertColumn, inserCard, getColumn}