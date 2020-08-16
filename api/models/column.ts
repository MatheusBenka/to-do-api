interface Column {
    id: string;
    title:string;
    color:string;
    description:string|null;
    owner:string;
    cards:Array<Card>
}

interface Card{
    id:  string ;
    title:string;
    description:string;
    checklist:Array<CheckListItem>
}

interface CheckListItem{
    id:string;
    name:string;
    done:boolean;
    start:Date;
    end:Date;
}

export {Column,Card,CheckListItem}