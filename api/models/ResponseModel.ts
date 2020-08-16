class ResponseModel{
    public message:string = "";
    public success:boolean = false;
    
    constructor(messsage:string,success:boolean){
        this.message = messsage;
        this.success = success;
    }
}

class ResponseModelWithData extends ResponseModel{
    public data:any = null;
    constructor(messsage:string,success:boolean,data:any){
        super(messsage,success);
        this.data = data;
    }
}

export {ResponseModel,ResponseModelWithData};