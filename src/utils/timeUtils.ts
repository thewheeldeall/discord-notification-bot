export class TimeUtils {

    public static diff(a : Date, b : Date) : number {
        let calc = Math.floor(a.getTime()/1000) - Math.floor(b.getTime()/1000);
        return calc;
    }
  }