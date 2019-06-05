
export function isNullUndefined(objeto: any): boolean {
    return objeto == null || objeto == undefined ? true : false;
}

export function inListObject(list: {value: any, viewValue: any}[], stringValue: any): boolean {
    for(let item of list){
        if(item.value == stringValue){
            return true;
        }
    }
    return false;
}