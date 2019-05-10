export function BrFormatDateFromDate(date: Date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export function DateFromBrFormatDate(date: string): Date {
    
    const split = date.split('/');

    if (split.length < 3) {
        return new Date();
    }

    try {
        const year: number = parseInt(split[2], 10);
        const month: number = parseInt(split[1], 10);
        const day: number = parseInt(split[0], 10);

        return new Date(year, month - 1, day);
    } catch {
        return new Date();
    }
}

export function DateFromBrString(date: string): string {

     // YYYY-MM-DDTHH:MM:SS.SSSZ -> to -> DD-MM-YYYY

    if(date.length == 24){
        var dateTime = date.split("T");
        date = dateTime[0].replace(/[/\/\-\.]/g, '')
    }

    if(date.length == 8) {
        const year: string = date.substring(0, 4);
        const month: string = date.substring(4, 6);
        const day: string = date.substring(6, 8);

        return day + month + year;
    }else{
        return date;
    }
}

export function UTCTimeZoneString(date: Date): string {

    // YYYY-MM-DDTHH:MM:SS.SSSZ

    let setOneZeroDate = (element: any) => {
        return element.length == 1 ? element = '0' + element : element;
    }

    let setTwoZeroDate = (element: any) => {
        if(element.length == 1){ element = '00' + element; }
        if(element.length == 2){ element = '0' + element; }
        return element;
    }

    let year = date.getFullYear().toString();
    let month = setOneZeroDate((date.getMonth() + 1).toString());
    let day = setOneZeroDate(date.getDate().toString());

    let hours = setOneZeroDate(date.getHours().toString());
    let minutes = setOneZeroDate(date.getMinutes().toString());
    let seconds = setOneZeroDate(date.getSeconds().toString());
    let milliseconds = setTwoZeroDate(date.getMilliseconds().toString());

    return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds + 'Z';
}