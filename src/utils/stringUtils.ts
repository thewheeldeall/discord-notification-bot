export class StringUtils {
  public static startsWith(content: string, gameCommand: string) : boolean {
    if (content.length < 0) return false;
    if (gameCommand.length < 0) return false;
    if (content.length < gameCommand.length) return false;

    let contentNeat = content.toLowerCase().trim();
    let commandNeat = gameCommand.toLowerCase().trim();
    let commandSize = commandNeat.length;
    let contentCommand = contentNeat.substring(0, commandSize);

    return (contentCommand === commandNeat);
  }

  public static csvStringToArray(csvString : string) : string[] {
    if(csvString === null) return [];
    if(csvString.length < 1) return [];
    return csvString.split(',').map(s => s.trim());
  }
  public static arrayToCsvString(array : string[]) : string {
    if(array === null) return '';
    if(array.length < 1) return '';
    return array.join(',');
  }
}